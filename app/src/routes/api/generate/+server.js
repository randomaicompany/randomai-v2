import axios from "axios";
import Replicate from "replicate";
import { json, text } from "@sveltejs/kit";
import { generate } from "root/src/lib/api/replicate.js";
import { RUNPOD_API_KEY, REPLICATE_TOKEN } from "$env/static/private";

const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

export async function POST({ request }) {
  try {
    const body = await request.json();

    const input = {
      ...body,
      go_fast: true,
      output_format: "jpg",
    };

    const output = await replicate.run("black-forest-labs/flux-schnell", { input });
    const src = output.toString();

    return json({ src }, { status: 200 });
  } catch (error) {
    console.log(error);
    return json({ error }, { status: 500 });
  }
}
