import { createClient } from "root/src/lib/prismicio";

const client = createClient();

export const load = async ({ params }) => {
  const productPage = await client.getByUID("product", params.uid);

  return {
    productPage,
    meta_description: productPage.data.meta_description,
    meta_title: productPage.data.meta_title,
  };
};
