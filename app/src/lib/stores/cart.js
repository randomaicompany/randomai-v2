// src/stores/cart.js
import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import {
  addLineItems,
  fetchCheckout,
  createCheckout,
  updateLineItems,
  removeLineItems
} from "root/src/lib/shopify";

let initialCart = {
  lineItems: [],
  id: null,
  totalPrice: "0.00",
  subtotalPrice: "0.00",
  totalTax: "0.00",
  currencyCode: "USD",
  checkoutUrl: null
};

export const cart = writable(initialCart);
export const isCartOpen = writable(false); // Changed default to false
export const selectedVariantId = writable(null);

export const addToCart = async (
  variantId = "",
  quantity = 1,
  customAttributes = []
) => {
  // Validate inputs
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  console.log(
    "Adding to cart with variantId:",
    variantId,
    "and quantity:",
    quantity
  );

  try {
    let currentCart = get(cart);
    let cartId = currentCart?.id;

    console.log("Current cart state:", currentCart);
    console.log("Cart ID:", cartId);

    // Ensure we have a valid cart
    if (!cartId) {
      console.log("No cart ID found, creating new cart...");
      const newCart = await createCheckout();

      if (!newCart || !newCart.id) {
        throw new Error("Failed to create cart");
      }

      if (browser) {
        localStorage.setItem("cartId", newCart.id);
      }

      cart.set(newCart);
      cartId = newCart.id;
      console.log("Created new cart with ID:", cartId);
    }

    // Double-check we have a valid cart ID
    if (!cartId) {
      throw new Error("Unable to obtain valid cart ID");
    }

    const lineItemsToAdd = [
      {
        quantity: parseInt(quantity, 10),
        variantId: String(variantId),
        customAttributes: customAttributes || []
      }
    ];

    console.log("Adding to cart with:", {
      cartId,
      lineItemsToAdd
    });

    const updatedCart = await addLineItems(cartId, lineItemsToAdd);

    if (!updatedCart) {
      throw new Error("Failed to add items to cart");
    }

    cart.set(updatedCart);
    isCartOpen.set(true);

    console.log("Successfully added to cart");
    return updatedCart;
  } catch (error) {
    console.error("Error adding to cart:", error);

    // If there's an error, try to recover by creating a fresh cart
    try {
      console.log("Attempting to recover with fresh cart...");

      if (browser) {
        localStorage.removeItem("cartId");
      }

      const newCart = await createCheckout();

      if (!newCart || !newCart.id) {
        throw new Error("Failed to create recovery cart");
      }

      if (browser) {
        localStorage.setItem("cartId", newCart.id);
      }

      cart.set(newCart);

      const lineItemsToAdd = [
        {
          quantity: parseInt(quantity, 10),
          variantId: String(variantId),
          customAttributes: customAttributes || []
        }
      ];

      console.log("Retrying with new cart ID:", newCart.id);

      const updatedCart = await addLineItems(newCart.id, lineItemsToAdd);

      if (!updatedCart) {
        throw new Error("Failed to add items to recovery cart");
      }

      cart.set(updatedCart);
      isCartOpen.set(true);

      console.log("Successfully recovered and added to cart");
      return updatedCart;
    } catch (retryError) {
      console.error("Recovery attempt failed:", retryError);

      // Reset cart to initial state
      cart.set(initialCart);

      alert(
        "Failed to add item to cart. Please refresh the page and try again."
      );
      throw retryError;
    }
  }
};

export const fetchCartItems = async () => {
  if (!browser) {
    console.log("Not in browser environment, skipping cart fetch");
    return;
  }

  try {
    let cartId = localStorage.getItem("cartId"); // Changed from checkoutId to cartId
    console.log("Retrieved cart ID from localStorage:", cartId);

    if (cartId) {
      try {
        console.log("Attempting to fetch existing cart:", cartId);
        const cart = await fetchCheckout(cartId);

        if (cart) {
          console.log("Successfully fetched valid cart");
          cart.set(cart);
          return cart;
        } else {
          console.log("Cart not found, removing from storage");
          localStorage.removeItem("cartId");
          cartId = null;
        }
      } catch (fetchError) {
        console.log("Error fetching cart, will create new one:", fetchError);
        localStorage.removeItem("cartId");
        cartId = null;
      }
    }

    // Create new cart if we don't have a valid one
    if (!cartId) {
      console.log("Creating new cart...");
      const newCart = await createCheckout();

      if (!newCart || !newCart.id) {
        throw new Error("Failed to create new cart");
      }

      console.log("Successfully created new cart:", newCart.id);
      localStorage.setItem("cartId", newCart.id);
      cart.set(newCart);
      return newCart;
    }
  } catch (error) {
    console.error("Error in fetchCartItems:", error);

    // Clean up and reset
    localStorage.removeItem("cartId");
    cart.set(initialCart);

    throw error;
  }
};

export const incrementItem = async (variantId) => {
  const currentCart = get(cart);

  if (!currentCart.lineItems) return;

  const lineItems = currentCart.lineItems
    .map((lineItem) => {
      if (lineItem.variant.id === variantId) {
        return {
          ...lineItem,
          quantity: lineItem.quantity + 1
        };
      }
      return lineItem;
    })
    .filter(Boolean);

  if (lineItems.length > 0) {
    await updateCart({ ...currentCart, lineItems });
  }
};

export const decrementItem = async (variantId) => {
  const currentCart = get(cart);

  if (!currentCart.lineItems) return;

  const lineItems = currentCart.lineItems
    .map((lineItem) => {
      if (lineItem.variant.id === variantId) {
        const newQuantity = lineItem.quantity - 1;
        if (newQuantity <= 0) {
          return null; // This will remove the item
        }
        return {
          ...lineItem,
          quantity: newQuantity
        };
      }
      return lineItem;
    })
    .filter(Boolean);

  await updateCart({ ...currentCart, lineItems });
};

export const removeItem = async (variantId) => {
  const currentCart = get(cart);
  if (!currentCart.lineItems || !currentCart.id) return;

  // Find the lineItem(s) with this variantId
  const lineItemsToRemove = currentCart.lineItems.filter(
    (lineItem) => lineItem.variant.id === variantId
  );
  if (lineItemsToRemove.length === 0) return;

  // Shopify expects lineItem.id, not variant.id
  const lineItemIds = lineItemsToRemove.map((item) => item.id);
  const updatedCart = await removeLineItems(currentCart.id, lineItemIds);
  cart.set(updatedCart);
  return updatedCart;
};

export const updateCart = async (_cart) => {
  try {
    if (!_cart.lineItems) {
      console.error("No line items to update");
      return;
    }

    const lineItemsToUpdate = _cart.lineItems.map((item) => ({
      id: item.id,
      quantity: item.quantity
    }));

    const updatedCart = await updateLineItems(_cart.id, lineItemsToUpdate);
    cart.set(updatedCart);

    return updatedCart;
  } catch (error) {
    console.error("Error updating cart:", error);

    if (browser) {
      localStorage.removeItem("checkoutId");
    }

    alert("Failed to update cart. Please refresh and try again.");
    throw error;
  }
};

// Helper function to ensure cart is properly initialized
export const initializeCart = async () => {
  console.log("Initializing cart...");
  try {
    await fetchCartItems();
    const currentCart = get(cart);
    console.log("Cart initialized with ID:", currentCart?.id);
    return currentCart;
  } catch (error) {
    console.error("Failed to initialize cart:", error);
    throw error;
  }
};

// Helper function to get cart total
export const getCartTotal = () => {
  const currentCart = get(cart);
  return currentCart.totalPrice || "0.00";
};

// Helper function to get cart item count
export const getCartItemCount = () => {
  const currentCart = get(cart);
  return (
    currentCart.lineItems?.reduce((total, item) => total + item.quantity, 0) ||
    0
  );
};
