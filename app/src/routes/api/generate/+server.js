import Replicate from "replicate";
import { json } from "@sveltejs/kit";
import { REPLICATE_TOKEN } from "$env/static/private";

const replicate = new Replicate({
  auth: REPLICATE_TOKEN
});

export async function POST({ request }) {
  try {
    const body = await request.json();

    const input = {
      ...body,
      go_fast: true,
      output_format: "jpg"
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input
    });
    const src = output.toString();

    return json({ src }, { status: 200 });
  } catch (error) {
    console.log(error);
    return json({ error }, { status: 500 });
  }
}
