<script>
  export let data;

  import * as R from "ramda";
  import * as RA from "ramda-adjunct";
  //
  import { onMount } from "svelte";
  import { components } from "$lib/slices";
  import { afterNavigate } from "$app/navigation";
  import { PrismicImage, SliceZone } from "@prismicio/svelte";
  import { getColorNames, getColors, getPrice } from "utils/page";
  //
  import Checkbox from "components/Checkbox.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import CheckboxGroup from "components/CheckboxGroup.svelte";
  import ColorsSwatches from "components/ColorsSwatches.svelte";
  import Slice from "$lib/slices/CollectionProductCard/index.svelte";

  let page = R.propOr({}, "page", data);
  let title = R.propOr("", "title", page);
  let slices = R.pathOr([], ["data", "slices"], page);
  let breadcrumbSlices = R.pathOr([], ["data", "breadcrumbSlices"], page);
  let productCardSlices = R.pathOr([], ["data", "productCardSlices"], page);

  let productTypes = R.pathOr([], ["productTypes"], page);
  let collections = R.pathOr([], ["collections"], page);
  let brands = R.pathOr([], ["brands"], page);
  let genders = R.pathOr([], ["genders"], page);
  let productColors = R.pathOr([], ["productColors"], page);

  let isFilterPanelOpen = false;
  let filteredProductCardSlices = productCardSlices;

  let filters = {
    colors: getColorNames(productColors),
    brands,
    genders,
    collections,
    productTypes,
    sortDirection: 0,
    priceRange: [0, 200],
  };

  const isInRange = R.curry((value, range) => {
    const [min, max] = range;
    return RA.inRange(min, max, value);
  });

  const init = () => {
    page = R.propOr({}, "page", data);
    title = R.propOr("", "title", page);
    slices = R.pathOr([], ["data", "slices"], page);
    breadcrumbSlices = R.pathOr([], ["data", "breadcrumbSlices"], page);
    productCardSlices = R.pathOr([], ["data", "productCardSlices"], page);

    productTypes = R.pathOr([], ["productTypes"], page);
    collections = R.pathOr([], ["collections"], page);
    brands = R.pathOr([], ["brands"], page);
    genders = R.pathOr([], ["genders"], page);
    productColors = R.pathOr([], ["productColors"], page);

    filters = {
      colors: getColorNames(productColors),
      brands,
      genders,
      collections,
      productTypes,
      sortDirection: 0,
      priceRange: [0, 200],
    };
  };

  afterNavigate(init);
</script>

<svelte:head>
  <title>{data.meta_title}</title>
  <meta name="description" content="{data.meta_description}" />
  {#if data.data.head && data.data.head.length > 0}
    {@html data.data.head[0].text}
  {/if}
</svelte:head>

<SliceZone slices="{breadcrumbSlices}" {components} />

<div class:!gap-0="{!isFilterPanelOpen}" class="shell flex items-start gap-16 overflow-x-hidden">
  <aside
    class:!max-w-0="{!isFilterPanelOpen}"
    class="flex-[0_0_14rem] flex flex-col gap-12 max-w-[14rem] overflow-hidden transition-all">
    <div>
      <div class="mb-4 -mt-1.5 inline-flex items-center">
        <h1 class="text-xl md:text-2xl">{title}</h1>
        <button
          class="flex items-center ml-2 transition-all rounded-full hover:text-red-300 active:text-red-500"
          on:click="{() => (isFilterPanelOpen = false)}"
          ><i class="material-symbols-rounded !text-xl rounded-full">close</i></button>
      </div>

      <div class="px-4 pt-8">
        <RangeSlider
          min="{0}"
          max="{200}"
          pips
          float
          first="label"
          last="label"
          bind:values="{filters['priceRange']}" />
      </div>
    </div>

    <div class="pt-8">
      <CheckboxGroup label="Gender" options="{page.genders}" bind:values="{filters['genders']}" />
    </div>

    <div>
      <CheckboxGroup
        label="Collection"
        options="{page.collections}"
        bind:values="{filters['collections']}" />
    </div>

    <div>
      <CheckboxGroup label="Brand" options="{page.brands}" bind:values="{filters['brands']}" />
    </div>

    <div>
      <CheckboxGroup
        label="Product"
        options="{page.productTypes}"
        bind:values="{filters['productTypes']}" />
    </div>

    <div>
      <ColorsSwatches
        label="Colors"
        options="{page.productColors}"
        bind:values="{filters['colors']}" />
    </div>
  </aside>

  <div class="pt-1">
    <button
      class:ring-1="{isFilterPanelOpen}"
      class:!bg-gray-100="{isFilterPanelOpen}"
      on:click="{() => (isFilterPanelOpen = !isFilterPanelOpen)}"
      class="flex items-center justify-between gap-1 px-4 py-1.5 pl-2 mb-4 border ring-brand-tertiary">
      <i class:rotate-180="{!isFilterPanelOpen}" class="material-symbols-rounded !text-xl"
        >menu_open</i>

      <p class="text-sm">Filters</p>
    </button>

    <div class="grid gap-4 pb-32 gap-y-16 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3">
      {#each productCardSlices as slice}
        {@const price = getPrice(slice)}
        {@const isInPriceRange = isInRange(price, filters.priceRange)}
        {@const isBrandMatch = R.includes(slice.primary.brand, filters.brands)}
        {@const isGenderMatch = R.includes(slice.primary.gender, filters.genders)}
        {@const isCollectionAMatch = R.includes(slice.primary.collection, filters.collections)}
        {@const isProductTypeAMatch = R.includes(slice.primary.product_type, filters.productTypes)}
        {@const isProductColorAMatch = R.isEmpty(R.difference(getColors(slice), filters.colors))}

        {#if isBrandMatch && isInPriceRange && isGenderMatch && isCollectionAMatch && isProductTypeAMatch && isProductColorAMatch}
          <Slice {slice} />
        {/if}
      {/each}
    </div>
  </div>
</div>

<SliceZone {slices} {components} />

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
