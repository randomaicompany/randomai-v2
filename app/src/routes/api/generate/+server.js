import axios from "axios";
import { json } from "@sveltejs/kit";
import { generate } from "root/src/lib/api/replicate.js";
import { RUNPOD_API_KEY } from "$env/static/private";

export async function GET({ url }) {
  try {
    const prompt = url.searchParams.get("prompt");

    const reqConfig = {
      method: "post",
      url: "https://api.runpod.ai/v2/xy81yey6y4feu2/runsync",
      headers: {
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
        "Content-Type": "application/json",
      },

      data: JSON.stringify({
        input: {
          prompt: prompt,
          refiner_inference_steps: 10,
          width: 768,
          height: 768,
        },
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

