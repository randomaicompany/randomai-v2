import * as R from "ramda";

const zipOptions = R.pipe(
  R.indexBy(R.prop("name")),
  R.values,
  R.addIndex(R.map)(({ value }, idx) => {
    const optionName = R.concat("option", R.toString(R.inc(idx)));
    return {
      [optionName]: value
    };
  }),
  R.mergeAll
);

export const formatVariantOptions = R.pipe(
  R.evolve({
    variants: R.map(({ selectedOptions, ...variant }) => {
      const options = zipOptions(selectedOptions);
      return { ...variant, ...options };
    }),
    options: R.map(
      R.evolve({
        name: R.identity,
        values: R.pluck("value")
      })
    )
  })
);

const getImageProp = R.ifElse(
  R.hasPath(["image", "id"]),
  R.path(["image", "id"]),
  R.prop("image_id")
);

export const findVariantImages = R.curry((product, variant) => {
  const nth = R.flip(R.nth);
  const idx = R.findIndex(
    R.propEq(getImageProp(variant), "id"),
    R.prop("images", product)
  );
  return R.map(R.pipe(nth(product.images)), [idx, R.inc(idx)]);
});
