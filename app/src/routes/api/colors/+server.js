import { json, error } from "@sveltejs/kit";
import { getColors } from "root/src/lib/api/printful";

export const GET = async () => {
  try {
    const colors = await getColors();

    return json(colors, { status: 200 });
  } catch (err) {
    console.error(err.response);
    error(500, err);
  }
};
