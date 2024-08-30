import { asText } from "@prismicio/client";
import { createClient } from "root/src/lib/prismicio";

export async function load({ params, fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const page = await client.getByUID("post", params.uid);

  return {
    page,
    title: asText(page.data.title),
    meta_description: page.data.meta_description,
    meta_title: page.data.meta_title,
  };
}

export async function entries() {
  const client = createClient();

  const pages = await client.getAllByType("post");
  return pages.map((page) => {
    return { uid: page.uid };
  });
}
