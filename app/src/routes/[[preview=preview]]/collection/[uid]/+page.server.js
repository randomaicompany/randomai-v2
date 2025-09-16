import * as R from "ramda";
import { createClient } from "root/src/lib/prismicio";
import {
  getRestSlices,
  pluckListByProp,
  getAllColorSwatches,
  getProductCardSlices,
  getBreadcrumbSlices,
  getLastBreadcrumbItemText
} from "./utils";

export async function load({ params, fetch, cookies }) {
  try {
    const client = createClient({ fetch, cookies });
    const pageResponse = await client.getByUID("collection", params.uid);

    const allSlices = R.path(["data", "slices"], pageResponse);

    const slices = getRestSlices(allSlices);
    const breadcrumbSlices = getBreadcrumbSlices(allSlices);
    const productCardSlices = getProductCardSlices(allSlices);

    const title = getLastBreadcrumbItemText(breadcrumbSlices);

    const page = {
      title,
      pageResponse,
      data: { breadcrumbSlices, productCardSlices, slices },
      brands: pluckListByProp("brand", productCardSlices),
      genders: pluckListByProp("gender", productCardSlices),
      productColors: getAllColorSwatches(productCardSlices),
      collections: pluckListByProp("collection", productCardSlices),
      productTypes: pluckListByProp("product_type", productCardSlices)
    };

    return {
      page,
      meta_title: pageResponse.data.meta_title,
      meta_description: pageResponse.data.meta_description
    };
  } catch (error) {
    console.log({ error });
  }
}

export async function entries() {
  const client = createClient();

  const pages = await client.getAllByType("collection");
  return pages.map((page) => {
    return { uid: page.uid };
  });
}
