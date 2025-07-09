// src/stores/cart.js
import { browser } from "$app/environment";
import { get, writable } from "svelte/store";
import { addLineItems, fetchCheckout, createCheckout, updateLineItems } from "root/src/lib/shopify";

let initialCart = {
  lineItems: [],
};

export const cart = writable(initialCart);
export const isCartOpen = writable(true);
export const selectedVariantId = writable(null);

export const addToCart = async (variantId = "", quantity = 1, customAttributes = []) => {
  const { id: checkoutId } = get(cart) || {};
  const lineItemsToAdd = [
    {
      quantity,
      variantId,
      customAttributes,
    },
  ];
  try {
    const checkout = await addLineItems(checkoutId, lineItemsToAdd);
    cart.set(checkout);
    isCartOpen.set(true);
  } catch (error) {
    console.error(error);
    localStorage.removeItem("checkoutId");
    alert("Failed to add to the cart. Please refresh and try again");
  }
};

export const fetchCartItems = async () => {
  if (browser) {
    try {
      let checkoutId = localStorage.getItem("checkoutId");

      if (checkoutId) {
        const checkout = await fetchCheckout(checkoutId);

        cart.set(checkout);
      } else {
        const newCheckout = await createCheckout();
        localStorage.setItem("checkoutId", newCheckout.id);
        cart.set(newCheckout);
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("checkoutId");
      // location.reload();
    }
  }
};

export const incrementItem = async (variantId) => {
  const currentCart = get(cart);
  const lineItems = currentCart.lineItems
    .map(
      (lineItem) =>
        lineItem.variant.id === variantId && {
          ...lineItem,
          quantity: lineItem.quantity + 1,
        }
    )
    .filter(Boolean);

  if (lineItems.length > 0) {
    await updateCart({ ...currentCart, lineItems });
  }
};

export const decrementItem = async (variantId) => {
  const currentCart = get(cart);

  const lineItems = currentCart.lineItems
    .map(
      (lineItem) =>
        lineItem.variant.id === variantId && {
          ...lineItem,
          quantity: lineItem.quantity - 1,
        }
    )
    .filter(Boolean);

  if (lineItems.length > 0) {
    await updateCart({ ...currentCart, lineItems });
  }
};

export const updateCart = async (_cart) => {
  try {
    const lineItemsToUpdate = _cart.lineItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    const updatedCart = await updateLineItems(_cart.id, lineItemsToUpdate);

    cart.set(updatedCart);
  } catch (error) {
    console.error(error);
    localStorage.removeItem("checkoutId");
    alert("Failed to update to the cart. Please refresh and try again");
  }
};
