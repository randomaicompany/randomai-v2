import { createClient } from "root/src/lib/prismicio";
import { filter } from "@prismicio/client";

export async function load({ url, fetch, cookies }) {
  const client = createClient({ fetch, cookies });
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get("query") || "";

  if (!query) return { results: [] };

  const page = await client.get({
    pageSize: 100,
    orderings: {
      direction: "asc",
    },
    filters: [filter.fulltext("document", query)],
  });

  return {
    results: page.results,
  };
}

export async function entries() {
  return [{}];
}
