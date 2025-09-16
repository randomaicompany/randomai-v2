import axios from "axios";
import * as R from "ramda";
import * as RA from "ramda-adjunct";
import { PRINTFUL_TOKEN } from "$env/static/private";

const pluckColors = R.pipe(
  R.path(["data", "result", "items"]),
  R.pluck("colors"),
  R.flatten,
  R.map(
    R.pipe(
      R.evolve({
        color_codes: R.head
      }),
      RA.renameKeys({
        color_name: "name",
        color_codes: "hex"
      })
    )
  )
);

const url = `https://api.printful.com/product-templates?limit=100`;

export const getColors = async () => {
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PRINTFUL_TOKEN}`
    }
  });

  const colors = pluckColors(response);
  return colors;
};
