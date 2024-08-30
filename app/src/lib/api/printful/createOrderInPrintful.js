import axios from "axios";
import { PRINTFUL_TOKEN } from "$env/static/private";
export default async (printfulPayload) => {
  const url = "https://api.printful.com/orders?update_existing=true";

  console.log("Printful: Creating draft order");
  await axios.post(url, printfulPayload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PRINTFUL_TOKEN}`,
    },
  });
  console.log("Printful: Created draft order");
};
