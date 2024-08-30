import os from "os";

import { uploadToGCS } from "api/storage";
import { json, error } from "@sveltejs/kit";

import removeBg from "api/utils/removeBg.js";
import downloadFile from "api/utils/downloadFile.js";

export const POST = async ({ request }) => {
  try {
    const { imageUrl } = await request.json();
    const localImageUrl = `${os.tmpdir()}/image.png`;

    const localfilePath = await downloadFile(imageUrl, localImageUrl);
    const response = await removeBg(localfilePath, false);

    const buffer = await response.arrayBuffer();
    const newImageUrl = await uploadToGCS(buffer);

    if (response.ok) {
      return json({ imageUrl: newImageUrl }, { status: 200 });
    } else {
      console.log(response);
      throw response;
    }
  } catch (err) {
    console.error(err);
    return json({ error: true }, { status: 500 });
  }

};