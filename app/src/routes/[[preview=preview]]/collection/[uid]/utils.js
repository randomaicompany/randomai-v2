import * as R from "ramda";

export const pluckListByProp = (prop, list) =>
  R.pipe(R.pluck("primary"), R.flatten, R.pluck(prop), R.uniq)(list);

export const getBreadcrumbSlices = R.filter(R.propEq("breadcrumbs", "slice_type"));
export const getProductCardSlices = R.filter(R.propEq("collection_product_card", "slice_type"));

export const getAllColorSwatches = R.pipe(
  R.pluck("items"),
  R.flatten,
  R.uniqBy(R.prop("color_name"))
);

export const getRestSlices = R.dropWhile((slice) => {
  const sliceType = R.prop("slice_type", slice);
  const excludeSlides = ["breadcrumbs", "collection_product_card"];
  return R.includes(sliceType, excludeSlides);
});

export const getLastBreadcrumbItemText = R.pipe(
  R.head,
  R.prop("items"),
  R.last,
  R.prop("text"),
  R.defaultTo("")
);
