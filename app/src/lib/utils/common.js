import * as R from "ramda";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { get } from "svelte/store";

export const clickOutside = (node) => {
  if (!browser) return;

  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(new CustomEvent("clickOutside", node));
    }
  };
  document.addEventListener("click", handleClick, true);
  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
};

export const getProductSearchParams = () => {
  if (!browser) return {};
  const search = new URLSearchParams(location.search);
  const productId = search.get("product");
  const variantId = search.get("variant");
  return {
    productId,
    variantId,
  };
};

export const setQueryParams = (updates) => {
  if (!browser) return;
  const currentPage = get(page);
  const newUrl = new URL(currentPage.url);

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) return;
    newUrl.searchParams.set(key, value);
  });
  return goto(newUrl, { replaceState: true });
};

export const extractId = R.pipe(
  R.prop("id"),
  R.when(R.is(Number), R.toString),
  R.defaultTo(""),
  R.trim,
  R.split("/"),
  R.last
);

export const findVariantById = (id, product) =>
  R.pipe(
    R.prop("variants"),
    R.defaultTo([]),
    R.find((variant) => {
      const currVariantId = R.prop("id", variant);
      return R.includes(id, currVariantId);
    })
  )(product);

export const pluckPromptSuggestions =
  R.ifElse(R.hasPath(["data", "prompt_suggestions"]),
    R.pipe(
      R.path(["data", "prompt_suggestions"]),
      R.pluck("prompt"),
      R.uniq
    ),
    R.always([])
  )

