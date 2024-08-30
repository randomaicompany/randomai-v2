<script>
  /** @type {import("@prismicio/client").Content.GallerySlice} */
  import * as R from "ramda";
  import { PrismicImage, PrismicRichText, PrismicText } from "@prismicio/svelte";
  import { isFilled } from "@prismicio/client";

  export let slice;
</script>

<section
  data-slice-type="{slice.slice_type}"
  data-slice-variation="{slice.variation}"
  class="shell">
  <div class="mb-2 text-3xl md:text-4xl md:mb-4">
    <PrismicRichText field="{slice.primary.heading}" />
  </div>

  <div class="text-base text-brand-primary/70">
    <PrismicRichText field="{slice.primary.subtext}" />
  </div>

  <div class="grid grid-cols-2 gap-2 pt-14 md:grid-cols-3">
    {#each R.splitEvery(2, slice.items) as group}
      <ul class="grid gap-2">
        {#each group as item}
          <li class="relative group">
            <PrismicImage class="object-cover h-full max-w-full rounded-lg" field="{item.image}" />
            {#if isFilled.richText(item.title) || isFilled.richText(item.description)}
              <div
                class="absolute top-0 left-0 flex flex-col justify-end w-full h-full p-6 overflow-hidden transition-opacity rounded-lg opacity-0 cursor-pointer bg-black/50 group-hover:opacity-100">
                <p class="mb-2 text-base font-medium text-white">
                  <PrismicText field="{item.title}" />
                </p>
                <p class="text-sm text-gray-200 md:text-base">
                  <PrismicText field="{item.description}" />
                </p>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/each}
  </div>
</section>
