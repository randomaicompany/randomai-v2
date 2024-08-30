// import Shopify from "shopify-api-node";
import { PUBLIC_SHOPIFY_DOMAIN } from "$env/static/public";
import { SHOPIFY_API_PASSWORD } from "$env/static/private";

import axios from "axios";

export const getProduct = async (productId) => {
  const response = await axios.get(
    `https://${PUBLIC_SHOPIFY_DOMAIN}/admin/api/2024-04/products/${productId}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_API_PASSWORD,
      },
    }
  );

  return response.data.product;
};

export const getVariant = async (variantId) => {
  const response = await axios.get(
    `https://${PUBLIC_SHOPIFY_DOMAIN}/admin/api/2024-04/variants/${variantId}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_API_PASSWORD,
      },
    }
  );

  return response.data.variant;
};
