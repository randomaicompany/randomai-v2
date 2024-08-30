<script>
  export let slice;
  import * as R from "ramda";
  import "@splidejs/svelte-splide/css";

  import { isFilled } from "@prismicio/client";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { PrismicLink, PrismicText, PrismicImage, PrismicRichText } from "@prismicio/svelte";

  const prepareTags = (item) => {
    const tags = R.defaultTo("", R.prop("tags", item));
    const tagsString = R.trim(tags);
    const tagsList = R.defaultTo([], R.split(",", tagsString));
    const tagsListNormalized = R.map(R.pipe(R.trim), tagsList);
    return R.reject(R.isEmpty, tagsListNormalized);
  };
</script>

{#if slice.variation == "default"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div class:shell="{slice.primary.is_contained}">
      <div>
        <div class="mb-2">
          <PrismicRichText field="{slice.primary.eyebrow_headline}" />
        </div>
        <div class="mb-2 text-3xl md:text-4xl md:mb-4">
          <PrismicRichText field="{slice.primary.heading}" />
        </div>
        <div class="text-base text-brand-primary/70">
          <PrismicRichText field="{slice.primary.description}" />
        </div>
      </div>

      <ul
        class="grid grid-cols-1 gap-16 mt-12 md:gap-2 {slice.primary.is_4_col_layout
          ? 'md:grid-cols-4'
          : 'md:grid-cols-3'} ">
        {#each slice.items as item}
          <li>
            <PrismicLink
              field="{item.link}"
              class="block transition-opacity hover:opacity-90 group">
              <div class="bg-brand-smoke-darker">
                <PrismicImage
                  field="{item.image}"
                  class="w-full h-96 {slice.primary.is_cover
                    ? 'object-cover'
                    : 'object-contain'} " />
              </div>

              <div class="mt-4 text-base font-medium">
                <PrismicRichText field="{item.title}" />
              </div>

              <div class="mt-2 font-normal text-brand-gray text-brand-primary">
                <PrismicRichText field="{item.subtext}" />
              </div>

              {#if R.not(R.isEmpty(prepareTags(item)))}
                <ul class="hidden tags-list">
                  {#each prepareTags(item) as tag}
                    <li>{tag}</li>
                  {/each}
                </ul>
              {/if}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

{#if slice.variation == "cardsWithColorToggle"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div class="shell">
      <div class="mb-12">
        <div class="mb-2">
          <PrismicRichText field="{slice.primary.eyebrow_headline}" />
        </div>
        <div class="mb-2 text-3xl md:text-4xl md:mb-4">
          <PrismicRichText field="{slice.primary.heading}" />
        </div>
        <div class="text-base text-brand-primary/70">
          <PrismicRichText field="{slice.primary.description}" />
        </div>
      </div>

      <div>
        <Splide
          options="{{
            rewind: true,
            pagination: false,
            perPage: 4,
            gap: 16,
            breakpoints: {
              1024: {
                perPage: 3,
              },

              768: {
                perPage: 2,
              },

              480: {
                perPage: 1,
              },
            },
          }}">
          {#each slice.items as item, idx}
            <SplideSlide>
              <div class="relative">
                <PrismicLink field="{item.link}" class="transition-opacity hover:opacity-90 ">
                  <PrismicImage
                    class="object-cover w-full h-96 bg-brand-smoke-darker"
                    field="{item.image}" />

                  <div class="mt-4">
                    <PrismicImage
                      class="object-contain object-left w-full h-6 "
                      field="{item.swatches_image}" />
                  </div>

                  <div class="mt-4 text-base font-medium">
                    <PrismicRichText field="{item.title}" />
                  </div>

                  <div class="mt-4 font-normal text-brand-gray text-brand-primary/70">
                    <PrismicRichText field="{item.subtext}" />
                  </div>

                  {#if isFilled.richText(item.review_text)}
                    <div class="flex flex-wrap items-start gap-2 mt-2">
                      <svg
                        width="108"
                        height="19"
                        viewBox="0 0 108 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1718_4100)">
                          <path
                            d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
                            fill="#FFE500"></path>
                        </g>
                        <g clip-path="url(#clip1_1718_4100)">
                          <path
                            d="M25.825 19L27.45 11.975L22 7.25L29.2 6.625L32 0L34.8 6.625L42 7.25L36.55 11.975L38.175 19L32 15.275L25.825 19Z"
                            fill="#FFE500"></path>
                        </g>
                        <g clip-path="url(#clip2_1718_4100)">
                          <path
                            d="M47.825 19L49.45 11.975L44 7.25L51.2 6.625L54 0L56.8 6.625L64 7.25L58.55 11.975L60.175 19L54 15.275L47.825 19Z"
                            fill="#FFE500"></path>
                        </g>
                        <g clip-path="url(#clip3_1718_4100)">
                          <path
                            d="M69.825 19L71.45 11.975L66 7.25L73.2 6.625L76 0L78.8 6.625L86 7.25L80.55 11.975L82.175 19L76 15.275L69.825 19Z"
                            fill="#FFE500"></path>
                        </g>
                        <g clip-path="url(#clip4_1718_4100)">
                          <path
                            d="M91.825 19L93.45 11.975L88 7.25L95.2 6.625L98 0L100.8 6.625L108 7.25L102.55 11.975L104.175 19L98 15.275L91.825 19Z"
                            fill="#FFE500"></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_1718_4100">
                            <rect width="20" height="19" fill="white"></rect>
                          </clipPath>
                          <clipPath id="clip1_1718_4100">
                            <rect width="20" height="19" fill="white" transform="translate(22)"
                            ></rect>
                          </clipPath>
                          <clipPath id="clip2_1718_4100">
                            <rect width="20" height="19" fill="white" transform="translate(44)"
                            ></rect>
                          </clipPath>
                          <clipPath id="clip3_1718_4100">
                            <rect width="20" height="19" fill="white" transform="translate(66)"
                            ></rect>
                          </clipPath>
                          <clipPath id="clip4_1718_4100">
                            <rect width="20" height="19" fill="white" transform="translate(88)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>

                      <p class="mb-0.5 text-sm">
                        <PrismicText field="{item.review_text}"></PrismicText>
                      </p>
                    </div>
                  {/if}
                </PrismicLink>
              </div>
            </SplideSlide>
          {/each}
        </Splide>
      </div>

      {#if isFilled.link(slice.primary.link)}
        <div class="mt-16 text-center">
          <PrismicLink class="inline-flex button secondary" field="{slice.primary.link}"
            >{slice.primary.button_text}</PrismicLink>
        </div>
      {/if}
    </div>
  </section>
{/if}

{#if slice.variation == "cardsReviews"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div class="bg-brand-smoke-darker">
      <div>
        <div class="shell">
          <Splide
            class="py-16 "
            options="{{
              rewind: true,
              focus: 'center',
              pagination: false,
              perPage: 3,
              gap: 16,
              breakpoints: {
                1024: {
                  perPage: 3,
                },

                768: {
                  perPage: 2,
                },

                480: {
                  perPage: 1,
                },
              },
            }}">
            {#each slice.items as item}
              <SplideSlide class="relative p-4 bg-white ">
                <div class="flex flex-col gap-4 transition-opacity hover:opacity-90">
                  <div class="flex items-center gap-4">
                    <PrismicImage
                      class="object-cover rounded-full w-14 h-14"
                      field="{item.image}" />

                    <p class="text-xl">
                      <PrismicText field="{item.name}" />
                    </p>
                  </div>

                  <div>
                    <svg
                      width="108"
                      height="19"
                      viewBox="0 0 108 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_1718_4100)">
                        <path
                          d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
                          fill="#FFE500"></path>
                      </g>
                      <g clip-path="url(#clip1_1718_4100)">
                        <path
                          d="M25.825 19L27.45 11.975L22 7.25L29.2 6.625L32 0L34.8 6.625L42 7.25L36.55 11.975L38.175 19L32 15.275L25.825 19Z"
                          fill="#FFE500"></path>
                      </g>
                      <g clip-path="url(#clip2_1718_4100)">
                        <path
                          d="M47.825 19L49.45 11.975L44 7.25L51.2 6.625L54 0L56.8 6.625L64 7.25L58.55 11.975L60.175 19L54 15.275L47.825 19Z"
                          fill="#FFE500"></path>
                      </g>
                      <g clip-path="url(#clip3_1718_4100)">
                        <path
                          d="M69.825 19L71.45 11.975L66 7.25L73.2 6.625L76 0L78.8 6.625L86 7.25L80.55 11.975L82.175 19L76 15.275L69.825 19Z"
                          fill="#FFE500"></path>
                      </g>
                      <g clip-path="url(#clip4_1718_4100)">
                        <path
                          d="M91.825 19L93.45 11.975L88 7.25L95.2 6.625L98 0L100.8 6.625L108 7.25L102.55 11.975L104.175 19L98 15.275L91.825 19Z"
                          fill="#FFE500"></path>
                      </g>
                      <defs>
                        <clipPath id="clip0_1718_4100">
                          <rect width="20" height="19" fill="white"></rect>
                        </clipPath>
                        <clipPath id="clip1_1718_4100">
                          <rect width="20" height="19" fill="white" transform="translate(22)"
                          ></rect>
                        </clipPath>
                        <clipPath id="clip2_1718_4100">
                          <rect width="20" height="19" fill="white" transform="translate(44)"
                          ></rect>
                        </clipPath>
                        <clipPath id="clip3_1718_4100">
                          <rect width="20" height="19" fill="white" transform="translate(66)"
                          ></rect>
                        </clipPath>
                        <clipPath id="clip4_1718_4100">
                          <rect width="20" height="19" fill="white" transform="translate(88)"
                          ></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <div class="font-normal text-brand-gray text-brand-primary/70">
                    <PrismicRichText field="{item.description}" />
                  </div>
                </div>
              </SplideSlide>
            {/each}
          </Splide>
        </div>
      </div>
    </div>
  </section>
{/if}

{#if slice.variation == "cards2ColumnsBig"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
      {#each slice.items as item}
        <li>
          <PrismicLink
            field="{item.link}"
            class="relative transition-opacity hover:opacity-90 block">
            <PrismicImage field="{item.image}" class="object-cover w-full lg:h-[48rem] h-[36rem]" />

            <div class="absolute top-0 left-0 flex items-end justify-center w-full h-full pb-16">
              <p class="button secondary">{item.button_text}</p>
            </div>
          </PrismicLink>
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if slice.variation == "cardsDualColumn"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div class="shell">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="mb-2">
            <PrismicRichText field="{slice.primary.eyebrow_headline}" />
          </div>
          <div class="text-3xl md:text-4xl">
            <PrismicRichText field="{slice.primary.heading}" />
          </div>

          {#if isFilled.richText(slice.primary.description)}
            <div class="mt-4 text-base text-brand-primary/80">
              <PrismicRichText field="{slice.primary.description}" />
            </div>
          {/if}
        </div>

        <PrismicLink
          field="{slice.primary.link}"
          class="inline-flex items-center gap-2 mt-2 md:mb-1 md:mt-0 group">
          <p class="text-sm font-medium md:text-base">
            {slice.primary.button_text}
          </p>
          <svg
            class="group-hover:translate-x-2 mt-0.5 transition-transform"
            width="40"
            height="16"
            viewBox="0 0 40 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M0 9H40M40 9L31.0344 17.5M40 9L31.0344 0.5" stroke="#3D3D3D"></path>
          </svg>
        </PrismicLink>
      </div>

      <ul class="grid grid-cols-1 gap-16 mt-16 md:gap-6 md:grid-cols-2">
        {#each slice.items as item}
          <li>
            <PrismicLink field="{item.link}" class="transition-opacity hover:opacity-90">
              <PrismicImage class="object-cover w-full h-80" field="{item.image}" />

              <div class="mt-4 text-xl font-medium">
                <PrismicRichText field="{item.title}" />
              </div>

              <div class="mt-4 text-base font-normal text-brand-gray text-brand-primary/50">
                <PrismicRichText field="{item.subtext}" />
              </div>

              <div class="mt-8 text-left">
                <p class="inline-flex button secondary">{item.button_text}</p>
              </div>
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

{#if slice.variation == "cardsListLayout"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div class="py-16">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div class="mb-2">
            <PrismicRichText field="{slice.primary.eyebrow_headline}" />
          </div>
          <div class="text-3xl md:text-4xl">
            <PrismicRichText field="{slice.primary.heading}" />
          </div>

          {#if isFilled.richText(slice.primary.description)}
            <div class="mt-4 text-base text-brand-primary/70">
              <PrismicRichText field="{slice.primary.description}" />
            </div>
          {/if}
        </div>
      </div>

      <ul class="grid grid-cols-1 gap-16 mt-16">
        {#each slice.items as item}
          <li>
            <PrismicLink field="{item.link}" class="transition-opacity hover:opacity-90">
              <div class="relative">
                <PrismicImage class="object-cover w-full h-[38rem]" field="{item.image}" />

                {#if isFilled.keyText(item.tag)}
                  <p
                    class="absolute px-6 py-1.5 text-sm font-medium uppercase bg-white/90 top-4 left-4">
                    {item.tag}
                  </p>
                {/if}
              </div>

              <div class="py-8">
                {#if isFilled.keyText(item.publisher_name)}
                  <div class="flex items-center gap-3">
                    <div class="w-4 h-4 rounded-full bg-brand-tertiary"></div>
                    <p class="text-base">{item.publisher_name}</p>
                  </div>
                {/if}

                {#if isFilled.date(item.published_date)}
                  <p class="mt-2 text-sm">
                    {new Date(item.published_date).toDateString()}
                  </p>
                {/if}
              </div>

              <div class="text-xl">
                <PrismicRichText field="{item.title}" />
              </div>

              <div class="mt-2 text-base font-normal text-brand-gray text-brand-primary/80">
                <PrismicRichText field="{item.subtext}" />
              </div>

              {#if isFilled.keyText(item.button_text)}
                <div class="mt-8 text-left">
                  <p class="inline-flex h-10 button secondary">
                    {item.button_text}
                  </p>
                </div>
              {/if}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

{#if slice.variation == "cardsFlatList"}
  <section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
    <div>
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div class="mb-2">
            <PrismicRichText field="{slice.primary.eyebrow_headline}" />
          </div>
          <div class="text-xl font-medium">
            <PrismicRichText field="{slice.primary.heading}" />
          </div>

          {#if isFilled.richText(slice.primary.description)}
            <div class="mt-4 text-base text-brand-primary/70">
              <PrismicRichText field="{slice.primary.description}" />
            </div>
          {/if}
        </div>
      </div>

      <ul class="grid grid-cols-1 gap-16 mt-8">
        {#each slice.items as item}
          <li>
            <PrismicLink field="{item.link}" class="transition-opacity hover:opacity-90">
              <div class="relative">
                <PrismicImage class="object-cover w-full h-80" field="{item.image}" />

                {#if isFilled.keyText(item.tag)}
                  <p class="py-4 text-brand-tertiary">
                    {item.tag}
                  </p>
                {/if}
              </div>

              <div class="text-base font-medium">
                <PrismicRichText field="{item.title}" />
              </div>

              <div class="mt-2 text-sm font-normal text-brand-gray text-brand-primary/80">
                <PrismicRichText field="{item.subtext}" />
              </div>

              {#if isFilled.keyText(item.button_text)}
                <div class="mt-8 text-left">
                  <p class="inline-flex h-10 button secondary">
                    {item.button_text}
                  </p>
                </div>
              {/if}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}
