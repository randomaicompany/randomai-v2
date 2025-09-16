import * as R from "ramda";

export const includesInList = R.flip(R.includes);
export const getColorNames = R.pipe(R.pluck("color_name"), R.flatten);
export const getColors = R.pipe(R.prop("items"), getColorNames);
export const getPrice = R.pipe(
  R.path(["primary", "product", "variants"]),
  R.head,
  R.prop("price")
);
