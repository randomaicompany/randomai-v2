// src/lib/shopify.js
import { PUBLIC_SHOPIFY_DOMAIN, PUBLIC_SHOPIFY_STOREFRONT_TOKEN } from '$env/static/public';
import {
	CREATE_CART_MUTATION,
	ADD_TO_CART_MUTATION,
	UPDATE_CART_MUTATION,
	REMOVE_FROM_CART_MUTATION,
	GET_CART_QUERY
} from './graphqa';

// Modern Shopify Storefront API client
class ShopifyStorefront {
	constructor(domain, storefrontAccessToken) {
		this.domain = domain;
		this.storefrontAccessToken = storefrontAccessToken;
		this.apiVersion = '2024-07'; // Latest API version
		this.endpoint = `https://${domain}/api/${this.apiVersion}/graphql.json`;
	}

	async query(query, variables = {}) {
		try {
			const response = await fetch(this.endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken
				},
				body: JSON.stringify({
					query,
					variables
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.errors) {
				console.error('GraphQL errors:', data.errors);
				throw new Error(data.errors[0].message);
			}

			return data.data;
		} catch (error) {
			console.error('Shopify API error:', error);
			throw error;
		}
	}
}

// Initialize the client
const shopify = new ShopifyStorefront(PUBLIC_SHOPIFY_DOMAIN, PUBLIC_SHOPIFY_STOREFRONT_TOKEN);

// Helper function to transform cart data
function transformCartData(cartData) {
	if (!cartData) return null;

	return {
		id: cartData.id,
		checkoutUrl: cartData.checkoutUrl,
		totalPrice: cartData.estimatedCost?.totalAmount?.amount || '0.00',
		subtotalPrice: cartData.estimatedCost?.subtotalAmount?.amount || '0.00',
		totalTax: cartData.estimatedCost?.totalTaxAmount?.amount || '0.00',
		currencyCode: cartData.estimatedCost?.totalAmount?.currencyCode || 'USD',
		lineItems:
			cartData.lines?.edges?.map((edge) => ({
				id: edge.node.id,
				quantity: edge.node.quantity,
				variant: {
					id: edge.node.merchandise.id,
					title: edge.node.merchandise.title,
					price: edge.node.merchandise.price.amount,
					product: {
						id: edge.node.merchandise.product.id,
						title: edge.node.merchandise.product.title,
						handle: edge.node.merchandise.product.handle
					}
				},
				totalPrice: edge.node.estimatedCost?.totalAmount?.amount || '0.00',
				customAttributes: edge.node.attributes || []
			})) || []
	};
}

// Create a new cart
export const createCheckout = async () => {
	try {
		const data = await shopify.query(CREATE_CART_MUTATION, {
			input: {
				lines: []
			}
		});

		if (data.cartCreate.userErrors.length > 0) {
			throw new Error(data.cartCreate.userErrors[0].message);
		}

		const cart = transformCartData(data.cartCreate.cart);

		return cart;
	} catch (error) {
		console.error('Error creating cart:', error);
		throw error;
	}
};

// Add line items to cart
export const addLineItems = async (cartId = '', lineItemsToAdd = []) => {
	try {
		if (!cartId || cartId.trim() === '') {
			console.error('Cart ID is missing or empty:', cartId);
			throw new Error('Cart ID is required and cannot be empty');
		}

		if (!lineItemsToAdd || lineItemsToAdd.length === 0) {
			console.error('Line items array is missing or empty:', lineItemsToAdd);
			throw new Error('Line items to add are required');
		}

		// Transform line items to the correct format
		const lines = lineItemsToAdd.map((item) => ({
			merchandiseId: item.variantId,
			quantity: parseInt(item.quantity, 10),
			attributes: item.customAttributes || []
		}));

		const data = await shopify.query(ADD_TO_CART_MUTATION, {
			cartId,
			lines
		});

		if (data.cartLinesAdd.userErrors.length > 0) {
			throw new Error(data.cartLinesAdd.userErrors[0].message);
		}

		const cart = transformCartData(data.cartLinesAdd.cart);

		return cart;
	} catch (error) {
		console.error('Error in addLineItems:', error);
		throw error;
	}
};

// Update line items in cart
export const updateLineItems = async (cartId = '', lineItemsToUpdate = []) => {
	try {
		if (!cartId) {
			throw new Error('Cart ID is required');
		}

		const lines = lineItemsToUpdate.map((item) => ({
			id: item.id,
			quantity: parseInt(item.quantity, 10)
		}));

		const data = await shopify.query(UPDATE_CART_MUTATION, {
			cartId,
			lines
		});

		if (data.cartLinesUpdate.userErrors.length > 0) {
			throw new Error(data.cartLinesUpdate.userErrors[0].message);
		}

		const cart = transformCartData(data.cartLinesUpdate.cart);

		return cart;
	} catch (error) {
		console.error('Error updating line items:', error);
		throw error;
	}
};

// Remove line items from cart
export const removeLineItems = async (cartId = '', lineItemIdsToRemove = []) => {
	try {
		if (!cartId) {
			throw new Error('Cart ID is required');
		}

		const data = await shopify.query(REMOVE_FROM_CART_MUTATION, {
			cartId,
			lineIds: lineItemIdsToRemove
		});

		if (data.cartLinesRemove.userErrors.length > 0) {
			throw new Error(data.cartLinesRemove.userErrors[0].message);
		}

		const cart = transformCartData(data.cartLinesRemove.cart);

		return cart;
	} catch (error) {
		console.error('Error removing line items:', error);
		throw error;
	}
};

// Fetch cart by ID
export const fetchCheckout = async (cartId = '') => {
	try {
		if (!cartId) {
			throw new Error('Cart ID is required');
		}

		const data = await shopify.query(GET_CART_QUERY, {
			cartId
		});

		if (!data.cart) {
			throw new Error('Cart not found');
		}

		const cart = transformCartData(data.cart);

		return cart;
	} catch (error) {
		console.error('Error fetching cart:', error);
		throw error;
	}
};

// Fetch all products
export const fetchAllProducts = async () => {
	try {
		const PRODUCTS_QUERY = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
        }
      }
    `;

		const data = await shopify.query(PRODUCTS_QUERY, {
			first: 100
		});

		return data.products.edges.map((edge) => edge.node);
	} catch (error) {
		console.error('Error fetching products:', error);
		throw error;
	}
};

// Fetch product by handle
export const fetchProductByHandle = async (handle) => {
	try {
		const PRODUCT_QUERY = `
      query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    `;

		const data = await shopify.query(PRODUCT_QUERY, {
			handle
		});

		return data.productByHandle;
	} catch (error) {
		console.error('Error fetching product by handle:', error);
		throw error;
	}
};

export default shopify;
