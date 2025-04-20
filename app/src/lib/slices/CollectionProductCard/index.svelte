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

  const editorLink = `/editor/products/${slice.primary.link?.uid}?variant=${slice.primary.product?.image?.variant_ids?.[0] || slice.primary.product.id}`;

  // console.log('slicees...', slice)
  console.log('link text....', slice.primary.link_text?.[0]?.text)
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
        {#if slice.primary.link_text?.[0]?.text !== 'Buy Now'}
          <a href={editorLink}>
            <PrismicImage class="object-cover object-top w-full h-96 bg-brand-smoke-darker" field="{image}" />
          </a>
        {:else}
          <PrismicLink field="{slice.primary.link}">
            <PrismicImage class="object-cover object-top w-full h-96 bg-brand-smoke-darker" field="{image}" />
          </PrismicLink>
        {/if}
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
        {#if slice.primary.link_text?.[0]?.text !== 'Buy Now'}
          <a href={editorLink}>
            {slice?.primary?.product?.title || ""}
          </a>
        {:else}
        <PrismicLink field="{slice.primary.link}">
          {slice?.primary?.product?.title || ""}
        </PrismicLink>
        {/if}
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
      {#if slice.primary.link_text?.[0]?.text !== 'Buy Now'}
        <div class="pt-4">
          <a href={editorLink} class="button button-compact">
            <PrismicText field={slice.primary.link_text} />
          </a>
        </div>
      {:else}
      <div class="pt-4">
        <PrismicLink field={slice.primary.link} class="button button-compact">
          <PrismicText field={slice.primary.link_text} />
        </PrismicLink>
      </div>
      {/if}
    {/if}
  </div>
</div>
