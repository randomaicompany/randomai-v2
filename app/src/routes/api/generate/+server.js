import axios from "axios";
import { json } from "@sveltejs/kit";
import { generate } from "root/src/lib/api/replicate.js";
import { RUNPOD_API_KEY } from "$env/static/private";

export async function POST({ request }) {
  try {
    const body = await request.json();

    const reqConfig = {
      method: "post",
      url: "https://api.runpod.ai/v2/t5gcx96q8cx2uk/runsync",
      headers: {
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
        "Content-Type": "application/json",
      },

      data: JSON.stringify({
        input: body,
      }),
    };

    const response = await axios(reqConfig);
    const output = response?.data?.output;
    const src = `data:image/jpeg;base64,${output}`;
    return json({ src }, { status: 200 });
  } catch (error) {
    console.log(error);
    return json({ error }, { status: 500 });
  }
}
