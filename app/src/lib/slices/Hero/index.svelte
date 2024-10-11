<script>
  export let slice;
  export let context = {};
  import * as R from "ramda";
  import * as RA from "ramda-adjunct";
  import { asLink } from "@prismicio/client";

  import { pluckPromptSuggestions, extractAISettings } from "utils/common.js";
  import { Splide, SplideTrack, SplideSlide } from "@splidejs/svelte-splide";
  import { PrismicLink, PrismicImage, PrismicRichText } from "@prismicio/svelte";
  //
  import PromptInputForm from "components/PromptInputForm.svelte";

  let imageUrl = "";
  let isLoading = false;
  let buttonLink = "";

  const stylePresets = R.path(["data", "style_presets"], context);
  const promptSuggestions = pluckPromptSuggestions(context);

  const handleImageGenerate = ({ detail: base64Image }) => (imageUrl = base64Image);

  const getDisplayStyles = R.pipe(
    R.pick(["top", "left", "width", "height"]),
    R.toPairs,
    R.map(([key, value]) => key + ":" + value + ";"),
    R.join("")
  );

  const setActiveButtonLink = (event) => {
    const idx = event.detail.splide.index;
    const item = slice.items[idx];
    const link = asLink(item.editor_link);
    return (buttonLink = link);
  };

  const aiSettings = extractAISettings(context);
</script>

{#if slice.variation == "default"}
  <section
    class="bg-white"
    data-slice-type="{slice.slice_type}"
    data-slice-variation="{slice.variation}"
    class:!bg-brand-smoke-darker="{slice.primary.is_bg_gray}">
    <div class="relative flex lg:flex-row flex-col-reverse items-center min-h-[80vh]">
      <div class="shell relative z-[1] md:pb-0 pb-24">
        <div class="lg:w-1/2">
          <div class="mb-2">
            <PrismicRichText field="{slice.primary.eyebrow_headline}" />
          </div>
          <div class="mb-4 heading-4xl lg:heading-5xl lg:mb-7">
            <PrismicRichText field="{slice.primary.heading}" />
          </div>
          <div class="max-w-xl text-base">
            <PrismicRichText field="{slice.primary.description}" />
          </div>

          <div class="grid grid-cols-1 gap-4 mt-10 md:grid-cols-2">
            {#if slice.primary.secondary_button_text}
              <PrismicLink class="button secondary" field="{slice.primary.secondary_button_link}"
                >{slice.primary.secondary_button_text}</PrismicLink>
            {/if}

            {#if slice.primary.primary_button_text}
              <PrismicLink class="button" field="{slice.primary.primary_button_link}"
                >{slice.primary.primary_button_text}</PrismicLink>
            {/if}
          </div>
        </div>
      </div>

      <PrismicImage
        class="lg:absolute top-0 right-0 flex-1 lg:w-[60%] lg:py-0 py-16 h-full object-contain"
        field="{slice.primary.image}" />
    </div>
  </section>
{/if}

{#if slice.variation == "withImageGenerator"}
  <section
    class="pb-16 bg-white"
    data-slice-type="{slice.slice_type}"
    data-slice-variation="{slice.variation}"
    class:!bg-brand-smoke-darker="{slice.primary.is_bg_gray}">
    <div class="shell relative z-[1] flex md:flex-row flex-col-reverse items-center gap-8 py-16">
      <div class="flex-1">
        <div class="mb-2">
          <PrismicRichText field="{slice.primary.eyebrow_headline}" />
        </div>
        <div class="mb-4 heading-3xl lg:heading-5xl lg:mb-7">
          <PrismicRichText field="{slice.primary.heading}" />
        </div>
        <div class="max-w-xl text-base">
          <PrismicRichText field="{slice.primary.description}" />
        </div>

        <div class="pt-8 pb-4">
          <PromptInputForm
            class="h-16"
            bind:imageUrl
            bind:isLoading
            {stylePresets}
            {aiSettings}
            {promptSuggestions}
            on:generate="{handleImageGenerate}" />
        </div>

        <div class:opacity-50="{!imageUrl}" class:!pointer-events-none="{isLoading || !imageUrl}">
          <a href="{buttonLink}" class="button bg-brand-accent border-none">
            {slice.primary.link_label}
          </a>
        </div>
      </div>
      <div class="relative flex-1 md:h-[600px] h-[400px] md:w-auto w-full">
        <Splide
          on:mounted="{setActiveButtonLink}"
          on:moved="{setActiveButtonLink}"
          options="{{ arrows: true, pagination: false }}"
          hasTrack="{false}"
          aria-label="My Favorite Images"
          class="h-full">
          <SplideTrack class="h-full">
            {#each slice.items as item}
              {@const outputStyle = getDisplayStyles(item)}
              <SplideSlide class="relative h-full">
                {#if imageUrl}
                  <img
                    src="{imageUrl}"
                    alt="geenrated art"
                    style="{outputStyle}"
                    class="absolute top-[26%] object-cover left-[36.5%] w-[24%] h-[28%]" />
                {/if}

                {#if isLoading}
                  <div
                    class="flex items-center justify-center absolute z-10 object-cover top-[36%] left-[39%] w-[24%] h-[28%]">
                    <div class="w-14 h-14 p-2 rounded-full bg-white">
                      <div
                        style="animation-duration:0.4s"
                        class="bg-transparent border-[3px] rounded-full animate-spin border-r-transparent w-full h-full border-brand-accent">
                      </div>
                    </div>
                  </div>
                {/if}
                <PrismicImage
                  class="flex-1 object-contain w-full h-full md:h-[600px] h-[400px"
                  field="{item.image}" />
              </SplideSlide>
            {/each}
          </SplideTrack>
        </Splide>
      </div>
    </div>
  </section>
{/if}

{#if slice.variation == "forRssBlogs"}
  <section
    class="py-24"
    data-slice-type="{slice.slice_type}"
    data-slice-variation="{slice.variation}">
    <div class="shell max-w-3xl text-center">
      <div class="relative mb-4 !font-medium leading-snug heading-3xl lg:heading-4xl">
        <PrismicRichText field="{slice.primary.heading}" />

        {#if slice.primary.is_underlined}
          <div class="lg:w-[60%] w-[42%] h-1 bg-red-500 mx-auto"></div>
        {/if}
      </div>
      <div class="mx-auto text-lg">
        <PrismicRichText field="{slice.primary.description}" />
      </div>
    </div>
  </section>
{/if}
