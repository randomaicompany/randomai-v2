import { createClient } from "root/src/lib/prismicio";

export async function load({ fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const page = await client.getSingle("layout");

  return {
    data: page.data
  };
}
