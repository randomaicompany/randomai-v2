<script>
  /** @type {import("@prismicio/client").Content.CollectionProductCardSlice} */
  export let slice;

  import * as R from "ramda";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { PrismicImage, PrismicLink, PrismicRichText, PrismicText } from "@prismicio/svelte";

  import Heart from "components/Heart.svelte";
  import { isFilled } from "@prismicio/client";

  let slider;
  let activeIdx = 0;
  const goToSlide = (idx) => () => (slider.go(idx), (activeIdx = idx));
  const handleSlideMove = (event) => (activeIdx = event.detail.index);
</script>

<div class="relative" data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
  <Heart product="{slice}" />
  <Splide
    on:move="{handleSlideMove}"
    bind:this="{slider}"
    options="{{
      perPage: 1,
      rewind: true,
      arrows: false,
      pagination: false,
    }}">
    {#each slice.items as { image }}
      <SplideSlide>
        <PrismicImage class="object-contain w-full h-96 bg-brand-smoke-darker" field="{image}" />
      </SplideSlide>
    {/each}
  </Splide>

  <ul class="flex flex-wrap gap-2 py-4">
    {#each slice.items as { swatch }, idx}
      {@const isCurrent = R.equals(activeIdx, idx)}
      <li>
        <button
          class="border rounded-full outline-none ring-offset-1 ring-brand-primary"
          class:ring-2="{isCurrent}"
          on:click="{goToSlide(idx)}">
          <PrismicImage class="w-4 h-4 rounded-full" field="{swatch}" />
        </button>
      </li>
    {/each}
  </ul>

  <div class="min-h-[10rem] flex flex-col">
    <div class="flex-1">
      <p class="text-base font-medium">
        {slice?.primary?.product?.title || ""}
      </p>
      <p class="mt-2 font-normal text-brand-gray text-brand-primary/70">
        ${slice.primary.product.variants[0]?.price || ""}
      </p>

      {#if slice?.primary?.review_text}
        <div class="flex items-center justify-start gap-2 pt-2">
          <PrismicImage
            class="object-contain object-left w-28"
            field="{slice?.primary?.review_stars}" />
          <p class="text-sm">{slice?.primary?.review_text || ""}</p>
        </div>
      {/if}
    </div>

    {#if isFilled.link(slice.primary.link)}
      <div class="pt-4">
        <PrismicLink field="{slice.primary.link}" class="button button-compact">
          <PrismicText field="{slice.primary.link_text}" />
        </PrismicLink>
      </div>
    {/if}
  </div>
</div>
