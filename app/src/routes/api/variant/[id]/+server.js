import { json } from "@sveltejs/kit";
import { getVariant } from "root/src/lib/api/shopify";

export const GET = async ({ params: { id } }) => {
  const variant = await getVariant(id);
  return json(variant, { status: 200 });
};

// var variant = {
//   id: 48592492724499,
//   product_id: 9237784396051,
//   title: "Navy / 2XL",
//   price: "30.69",
//   sku: "7588516_10560",
//   position: 10,
//   inventory_policy: "deny",
//   compare_at_price: null,
//   fulfillment_service: "manual",
//   inventory_management: "shopify",
//   option1: "Navy",
//   option2: "2XL",
//   option3: null,
//   created_at: "2024-04-08T05:37:57-05:00",
//   updated_at: "2024-04-08T05:38:30-05:00",
//   taxable: true,
//   barcode: null,
//   grams: 397,
//   weight: 14,
//   weight_unit: "oz",
//   inventory_item_id: 50610171937043,
//   inventory_quantity: 9999,
//   old_inventory_quantity: 9999,
//   requires_shipping: true,
//   admin_graphql_api_id: "gid://shopify/ProductVariant/48592492724499",
//   image_id: 45694739546387,
// };
