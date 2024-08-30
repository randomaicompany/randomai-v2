import Client from "shopify-buy";
import {
  PUBLIC_SHOPIFY_DOMAIN,
  PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
} from "$env/static/public";

const shopify = Client.buildClient({
  apiVersion: "2023-01",
  domain: PUBLIC_SHOPIFY_DOMAIN,
  storefrontAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
});

export const createCheckout = () => shopify.checkout.create();

export const addLineItems = (checkoutId = "", lineItemsToAdd) =>
  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd);

export const updateLineItems = (checkoutId = "", lineItemsToUpdate = [{}]) =>
  shopify.checkout.updateLineItems(checkoutId, lineItemsToUpdate);

export const fetchCheckout = (checkoutId = "") =>
  shopify.checkout.fetch(checkoutId);

export default shopify;
