import axios from "axios";
import { PRINTFUL_TOKEN } from "$env/static/private";

export default async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.printful.com/product-templates",
      headers: {
        Authorization: `Bearer ${PRINTFUL_TOKEN}`,
      },
    });

    return response.data;
  } catch (e) {
    return console.error("Printful; Failed to get templates", e.response.data);
  }
};
