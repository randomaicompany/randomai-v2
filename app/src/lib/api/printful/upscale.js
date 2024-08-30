import Replicate from "replicate";
import { REPLICATE_UPSCALER_MODEL, REPLICATE_TOKEN } from "$env/static/private";

const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

export default async (imageURL) => {
  if (!imageURL) return null;

  const outputImageURL = await replicate.run(REPLICATE_UPSCALER_MODEL, {
    input: {
      scale: 2,
      image: imageURL,
      face_enhance: true,
    },
  });

  return outputImageURL;
};
