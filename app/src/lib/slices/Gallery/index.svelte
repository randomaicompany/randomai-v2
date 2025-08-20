<script>
  /** @type {import("@prismicio/client").Content.GallerySlice} */
  import * as R from "ramda";

  import { isFilled } from "@prismicio/client";
  import { clickOutside } from "utils/common";
  import { fade, fly } from "svelte/transition";
  import { PrismicImage, PrismicRichText, PrismicText } from "@prismicio/svelte";
  import { browser } from "$app/environment";
  import IconButton from "../../components/Designer/IconButton.svelte";
  
  

  export let slice;

  let isOpen = false;
  let currentItem = {};

  const close = () => {
    isOpen = false;
    currentItem = {};
  };
  const openCurrent = (item) => () => {
    currentItem = item;
    isOpen = true;
  };


  const copyToClipboard = (text) => {
    console.log(text[0].text)
    navigator.clipboard.writeText(text[0].text).then(() => {
      console.log("Copied to clipboard:", text[0].text);
    });
  };

  $: isOpen,
    isOpen
      ? browser && (document.body.style.overflow = "hidden")
      : browser && (document.body.style.overflow = "auto");
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

  <div class="grid sm:grid-cols-2 grid-cols-1 gap-2 pt-14 md:grid-cols-3">
    {#each R.splitEvery(2, slice.items) as group}
      <ul class="grid gap-2">
        {#each group as item, idx}
          <li class="relative group">
            <PrismicImage class="object-cover h-full max-w-full rounded-lg" field="{item.image}" />
            {#if isFilled.richText(item.title) || isFilled.richText(item.description)}
              <button
                on:click="{openCurrent(item)}"
                class="absolute top-0 left-0 text-left flex flex-col justify-end w-full h-full p-6 overflow-hidden transition-opacity rounded-lg opacity-0 cursor-pointer bg-black/50 group-hover:opacity-100">
                <p class="mb-2 text-base font-medium text-white">
                  <PrismicText field="{item.title}" />
                </p>
                <p class="text-sm text-gray-200 md:text-base line-clamp-2">
                  <PrismicText field="{item.description}" />
                </p>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {/each}
  </div>
</section>

{#if isOpen}
  <div
    transition:fade="{{ duration: 200 }}"
    class="fixed top-0 left-0 w-full h-full bg-gray-900/50 flex items-start justify-center z-10 p-4 overflow-auto">
    <div
      transition:fly="{{ y: 12, duration: 200 }}"
      use:clickOutside
      on:clickOutside="{close}"
      class="max-w-lg w-full p-8 rounded-lg bg-white mt-[16vh] shadow-xl overflow-auto">
      <PrismicImage class="object-contain rounded-lg mb-4" field="{currentItem.image}" />

      <p class="font-medium md:text-xl text-lg mb-2 flex justify-between">
        <PrismicText field="{currentItem.title}" />
         <IconButton label="copy" iconName="content_copy" on:click="{() => copyToClipboard(currentItem.description)}" />
      </p>

      <PrismicText field="{currentItem.description}" />
    </div>
  </div>
{/if}
