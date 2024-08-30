
import fs from "fs";
import { REMOVE_BG_TOKEN } from "$env/static/private";

export default async (url) => {
  const formData = new FormData();
  formData.append("size", "auto");
  const blob = await fs.openAsBlob(url);
  formData.append("image_file", blob);
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": REMOVE_BG_TOKEN },
    body: formData,
  });

  return response;
};