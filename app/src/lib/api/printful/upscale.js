import Replicate from "replicate";
import { REPLICATE_UPSCALER_MODEL, REPLICATE_TOKEN } from "$env/static/private";

const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

export default async (imageUrl) => {
  if (!imageUrl) return null;

  const response = await replicate.run(REPLICATE_UPSCALER_MODEL, {
    input: {
      scale: 2,
      image: imageUrl,
      face_enhance: true,
    },
  });

  const outputImageUrl = response.toString();
  return outputImageUrl;
};
