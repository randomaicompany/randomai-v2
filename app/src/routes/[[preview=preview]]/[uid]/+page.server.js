import { createClient } from "root/src/lib/prismicio";

export async function load({ params, fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const page = await client.getByUID("page", params.uid);

  return {
    page,
    meta_title: page.data.meta_title,
    meta_description: page.data.meta_description,
  };
}

export async function entries() {
  const client = createClient();

  const pages = await client.getAllByType("page");
  return pages.map((page) => {
    return { uid: page.uid };
  });
}
