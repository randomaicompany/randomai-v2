<script>
  export let data;
  import * as R from "ramda";
  import * as RA from "ramda-adjunct";
  import { components } from "root/src/lib/slices";
  import { SliceZone } from "@prismicio/svelte";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";

  import { formatDistanceToNowStrict } from "date-fns";
  import { clickOutside } from "root/src/lib/utils/common.js";
  import { fade, fly } from "svelte/transition";
  import { browser } from "$app/environment";

  let isModalOpen = false;
  let previewItem = {};
  const options = {
    gap: "2rem",
    pagination: false,
    perPage: 3,
    breakpoints: {
      1024: {
        perPage: 2,
      },
      768: {
        perPage: 1,
      },
    },
  };

  const filterFeedWithItems = R.filter(R.pipe(R.prop("items"), RA.isNotEmpty));
  const heroSlice = R.filter(R.propEq("hero", "slice_type"), data.page.data.slices);

  const openModal = (item) => () => ((previewItem = item), (isModalOpen = true));
  const closeModal = () => ((previewItem = {}), (isModalOpen = false));

  const convertToPlainText = (html) => {
    if (!browser) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  $: browser && (document.body.style.overflow = isModalOpen ? "hidden" : "auto");

  let scrollContainer;

  let isAtStart = true;
  let isAtEnd = false;
  const scrollByAmount = 200;

  function updateButtonStates() {
    if (!scrollContainer) return;
    isAtStart = scrollContainer.scrollLeft <= 0;
    isAtEnd =
      scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth;
  }

  const scrollLeft = () => {
    scrollContainer.scrollBy({ left: -scrollByAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainer.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  };

  function handleScroll() {
    updateButtonStates();
  }

  // Ensure correct state on mount
  import { onMount } from "svelte";
  onMount(() => {
    updateButtonStates();
  });
</script>

<svelte:head>
  <title>{data.meta_title}</title>
  <meta name="description" content="{data.meta_description}" />

  {#if data.data.head && data.data.head.length > 0}
    {@html data?.data?.head[0]?.text}
  {/if}
</svelte:head>

<SliceZone slices="{heroSlice}" {components} />

<div class="relative max-w-7xl mx-auto mb-8">
  <!-- Scroll Buttons -->
  <button
    on:click={scrollLeft}
    disabled={isAtStart}
    class="text-brand-accent-light absolute right-10 top -top-[40px] z-10 rounded-full cursor-pointer"
    aria-label="Scroll left"
  >
    ◀
  </button>

  <button
    on:click={scrollRight}
    disabled={isAtEnd}
    class="text-brand-accent-light absolute right-3 -top-[40px] bg-white rounded-full cursor-pointer"
    aria-label="Scroll right"
  >
    ▶
  </button>

  <!-- Scrollable List -->
  <ul
    bind:this={scrollContainer}
    on:scroll={handleScroll}
    class="flex items-start gap-4 overflow-x-auto scrollbar-hide p-2 bg-white rounded scroll-smooth">
    {#each data.feeds as feed}
      <li>
        <a
          href={`#${feed.name}`}
          class="block whitespace-nowrap px-4 py-2 text-sm font-medium rounded border hover:text-brand-accent bg-gray-50"
        >
          {feed.name}
        </a>
      </li>
    {/each}
  </ul>
</div>

<!-- <ul
  class="flex items-start gap-4 max-w-7xl mx-auto overflow-x-auto scrollbar-hide mb-8 bg-white p-2 rounded">
  {#each data.feeds as feed}
    <li>
      <a
        href="#{feed.name}"
        class="block whitespace-nowrap p-4 py-2 text-sm font-medium rounded border hover:text-brand-accent bg-gray-50"
        >{feed.name}</a>
    </li>
  {/each}
</ul> -->

<div class="shell pb-16">
  <div class="flex flex-col gap-16">
    {#each filterFeedWithItems(data.feeds) as feed}
      <div id="{feed.name}">
        <div class="mb-8">
          <h2 class="md:heading-2xl heading-xl">{feed.name}</h2>
        </div>

        {#if R.not(R.isEmpty(feed.items))}
          <Splide {options}>
            {#each feed.items as item}
              <SplideSlide>
                <div class=" p-4 bg-white border border-gray-300 h-[42.5rem] flex flex-col">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-4">
                      <img alt="logo" class="w-8 h-8 rounded-full" src="{feed.logo}" />
                      <p class="text-sm">{feed.name}</p>
                    </div>

                    {#if item.image}
                      <img
                        alt="card"
                        src="{item.image}"
                        class="object-cover w-full h-64 mb-4 border" />
                    {:else}
                      <img
                        alt="randomai logo"
                        class="w-full h-64 mb-4 border object-contain"
                        src="https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress" />
                    {/if}

                    <div class="relative">
                      <p class="mb-1 text-xs text-brand-tertiary">
                        {formatDistanceToNowStrict(new Date(item.pubDate), { addSuffix: true })}
                      </p>

                      <div class="group">
                        <h3 class="text-lg font-medium line-clamp-2">{item.title}</h3>

                        {#if item.title.length > 120}
                          <p
                            class="absolute transition-opacity left-0 p-4 text-sm font-medium bg-white border shadow opacity-0 group-hover:opacity-100 bottom-[60%]">
                            {item.title}
                          </p>
                        {/if}
                      </div>

                      <p class="mt-2 text-sm font-thin line-clamp-2">
                        {convertToPlainText(item.content)}
                      </p>

                      <ul class="flex flex-wrap items-center gap-2 mt-4">
                        {#each R.slice(0, 3, item.categories) as category}
                          <li>
                            <p class="inline-block px-3 py-1 text-xs rounded bg-brand-tertiary/30">
                              {category}
                            </p>
                          </li>
                        {/each}
                      </ul>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 mb-2">
                    <p class="text-xs font-medium">{item.creator}</p>
                  </div>

                  <button on:click="{openModal({ ...feed, ...item })}" class="mt-4 button-compact"
                    >Read More</button>
                </div>
              </SplideSlide>
            {/each}
          </Splide>
        {/if}
      </div>
    {/each}
  </div>
</div>

{#if isModalOpen}
  <div
    in:fade="{{ duration: 300 }}"
    out:fade="{{ duration: 300 }}"
    class="fixed top-0 left-0 z-10 flex items-start justify-center w-full h-full p-4 overflow-auto bg-brand-black/50">
    <div
      in:fly="{{ duration: 300, delay: 100, y: 12 }}"
      out:fly="{{ duration: 300, y: 12 }}"
      class="flex-1 max-w-xl bg-white mt-[8vh] p-8 relative"
      use:clickOutside
      on:clickOutside="{closeModal}">
      <button on:click="{closeModal}" class="absolute right-0 p-1 px-2 bg-white -top-8"
        ><i class="material-symbols-rounded !text-xl">close</i></button>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 mb-4">
          <img alt="logo" class="w-8 h-8 rounded-full" src="{previewItem.logo}" />

          <p class="text-sm">{previewItem.name}</p>
        </div>

        <div class="flex items-center gap-3 mb-2">
          <p class="text-xs font-medium">{previewItem.creator}</p>
        </div>
      </div>

      <img
        alt="item"
        class="object-cover w-full h-64 mb-4 border"
        src="{previewItem.image ||
          `https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress`}" />

      <div class="relative">
        <p class="mb-1 text-xs text-brand-tertiary">
          {formatDistanceToNowStrict(new Date(previewItem.pubDate), { addSuffix: true })}
        </p>

        <div class="group">
          <h3 class="text-lg font-medium">{previewItem.title}</h3>
        </div>

        <div class="mt-2 text-sm font-thin blog-popup-html">{@html previewItem.content}</div>

        <ul class="flex flex-wrap items-center gap-2 mt-4">
          {#each previewItem.categories as category}
            <li>
              <p class="inline-block px-3 py-1 text-xs rounded bg-brand-tertiary/30">
                {category}
              </p>
            </li>
          {/each}
        </ul>

        <a target="_blank" href="{previewItem.link}" class="mt-16 button-compact"
          >View Full Story</a>
      </div>
    </div>
  </div>
{/if}

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}


<style>
  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>