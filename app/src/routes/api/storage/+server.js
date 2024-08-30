import { json, error } from "@sveltejs/kit";
import { generateSignedUrl } from "root/src/lib/api/storage";

export async function GET() {
  try {
    const signedURLResponse = await generateSignedUrl();

    return json(signedURLResponse, { status: 200 });
  } catch (err) {
    console.error(err);
    throw error(500, err);
  }
}
