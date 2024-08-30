import { redirectToPreviewURL } from "@prismicio/svelte/kit";
import { createClient } from "root/src/lib/prismicio";

export async function GET({ fetch, request, cookies }) {
  const client = createClient({ fetch });
  return await redirectToPreviewURL({ client, request, cookies });
}
