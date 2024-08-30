import Replicate from "replicate";
import { REPLICATE_TOKEN, REPLICATE_MODEL_ID } from "$env/static/private";

const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

export const generate = async (prompt) => {
  const input = {
    prompt,
    seed: 2992471961,
    width: 768,
    height: 1024,
    scheduler: "K_EULER",
    num_outputs: 1,
    guidance_scale: 1,
    negative_prompt: "worst quality, low quality",
    num_inference_steps: 4,
  };

  const output = await replicate.run(REPLICATE_MODEL_ID, {
    input: {
      ...input,
    },
  });

  return output;
};
