import { createClient } from "root/src/lib/prismicio";
import { asText } from "@prismicio/client";

export async function load({ fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const page = await client.getByUID("page", "home");
  return {
    page,
    title: asText(page.data.title),
    meta_description: page.data.meta_description,
    meta_title: page.data.meta_title
  };
}

export async function entries() {
  const client = createClient();
  const page = await client.getByUID("page", "home");
  return [{ uid: page.uid }];
}
