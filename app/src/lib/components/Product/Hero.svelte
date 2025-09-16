<script>
  export let data = {};

  import * as R from "ramda";
  import "@splidejs/svelte-splide/css";

  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { browser } from "$app/environment";

  import { addToCart } from "root/src/lib/stores/cart";
  import { convertToStyles } from "root/src/lib/utils/canvas";
  import { findVariantImages } from "root/src/lib/utils/shopify.js";

  import { isFilled } from "@prismicio/client";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import {
    PrismicText,
    PrismicImage,
    PrismicRichText,
    PrismicLink
  } from "@prismicio/svelte";

  import Image from "components/Image.svelte";
  import Options from "components/Product/Options.svelte";
  import DropDownContent from "components/DropDownContent.svelte";
  import QuantityPicker from "components/Product/QuantityPicker.svelte";

  const uid = R.path(["productPage", "uid"], data);
  const page = R.path(["productPage", "data"], data);
  const product = R.path(["productPage", "data", "product"], data);

  let slider;
  let thumbs;
  let quantity = 1;
  let variantImages = [];
  let selectedVariant = {};
  let currentImageIdx = 0;
  let isAddingToCart = false;
  let isPlaceholderVisible = true;

  const frontStyles = convertToStyles(page.front);
  const backStyles = convertToStyles(page.back);

  $: selectedVariant,
    (variantImages = findVariantImages(product, selectedVariant));

  const changeImageIdx = (event) => {
    currentImageIdx = event.detail.index;
    isPlaceholderVisible = true;
  };

  const changeSlide = (idx) => () => slider.go(idx);
  const hidePlaceholder = () => (isPlaceholderVisible = false);

  const addProductToCart = async () => {
    try {
      console.log("Adding to cart", selectedVariant, quantity);

      isAddingToCart = true;
      await addToCart(selectedVariant.admin_graphql_api_id, quantity);
      isAddingToCart = false;
    } catch (error) {
      alert("Something went wrong while adding to cart");
      console.error(error);
      isAddingToCart = false;
    }
  };

  onMount(() => {
    if (!browser) return;
    slider && thumbs && slider.sync(thumbs.splide);
  });
</script>

{#if product}
  <div class="shell pb-16 pt-8 md:pt-0">
    <div class="block pb-4 md:hidden">
      <p class="md:heading-2xl heading-lg font-medium">
        {product.title}
      </p>
    </div>

    <div class="relative flex flex-col items-start gap-8 md:flex-row md:gap-16">
      <div class="w-full select-none self-start">
        <Splide
          bind:this={slider}
          on:move={changeImageIdx}
          on:dragging={hidePlaceholder}
          options={{ pagination: false, arrows: false }}
          aria-label="product images">
          {#each variantImages as image, idx (idx)}
            {#if image?.src}
              <SplideSlide>
                <div class="relative mx-auto max-w-xl border md:border-none">
                  {#if !page.is_predesigned && isPlaceholderVisible}
                    <div in:fade={{ duration: 200 }}>
                      {#if currentImageIdx == 0}
                        {#if page.is_front_canvas_enabled}
                          <div style={frontStyles} class="absolute">
                            <PrismicImage
                              class="z-[2] object-contain p-4"
                              field={page.placeholder_sicker} />
                          </div>
                        {/if}
                      {/if}

                      {#if currentImageIdx == 1}
                        {#if page.is_back_canvas_enabled}
                          <div style={backStyles} class="absolute">
                            <PrismicImage
                              class="z-[2] object-contain p-4 "
                              field={page.placeholder_sicker} />
                          </div>
                        {/if}
                      {/if}
                    </div>
                  {/if}
                  <Image class="object-contain" src={image?.src} />
                </div>
              </SplideSlide>
            {/if}
          {/each}
        </Splide>

        <div class="mt-4 flex items-start gap-2">
          {#each variantImages as image, idx (idx)}
            {@const isCurrent = R.equals(idx, currentImageIdx)}
            {#if image?.src}
              <button
                class="border opacity-50"
                class:!opacity-100={isCurrent}
                class:border-brand-accent={isCurrent}
                on:click={changeSlide(idx)}>
                <Image
                  src={image?.src}
                  class="h-14 w-14 object-contain md:h-20 md:w-20" />
              </button>
            {/if}
          {/each}
        </div>

        <div class="hidden pt-16 md:block">
          <p class="text-base font-medium">
            Reviews ({R.length(page.reviews)})
          </p>
          <ul class="flex max-w-xl flex-col gap-8 pt-6">
            {#each page.reviews || [] as { user_name, title, review } (user_name + title)}
              <li>
                <svg
                  width="90"
                  height="16"
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
                      <rect
                        width="20"
                        height="19"
                        fill="white"
                        transform="translate(22)"></rect>
                    </clipPath>
                    <clipPath id="clip2_1718_4100">
                      <rect
                        width="20"
                        height="19"
                        fill="white"
                        transform="translate(44)"></rect>
                    </clipPath>
                    <clipPath id="clip3_1718_4100">
                      <rect
                        width="20"
                        height="19"
                        fill="white"
                        transform="translate(66)"></rect>
                    </clipPath>
                    <clipPath id="clip4_1718_4100">
                      <rect
                        width="20"
                        height="19"
                        fill="white"
                        transform="translate(88)"></rect>
                    </clipPath>
                  </defs>
                </svg>

                <div>
                  <p class="mb-3 mt-3 text-xs text-brand-secondary">
                    {user_name}
                  </p>
                  <div>
                    <p class="mb-3 text-base text-brand-primary">{title}</p>
                    <p class="text-sm font-light text-brand-secondary">
                      <PrismicText field={review} />
                    </p>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="flex flex-[0_0_28rem] flex-col gap-8">
        <div class="flex flex-col md:gap-[18px]">
          <h1 class="text-4xl">
            <PrismicText field={page.heading} />
          </h1>

          <p class="md:heading-2xl heading-xl hidden md:block">
            {product.title}
          </p>

          {#if isFilled.link(page.reviews_link)}
            <PrismicLink
              field={page.reviews_link}
              class="flex items-center gap-2">
              <PrismicImage
                field={page.review_stars}
                class="mr-2 h-8 w-32 object-contain object-left" />
              <p class="text text-rush-blue-500 text-sm/8">
                {page.review_stars_text}
              </p>
            </PrismicLink>
          {/if}

          <div class="inline-flex items-center gap-2">
            <p class="text-xl">
              ${product.variants[0].price}
            </p>

            {#if product.variants[0].compare_at_price}
              <p class="font-light text-gray-400 line-through">
                ${product.variants[0].compare_at_price}
              </p>
            {/if}
          </div>
          {#if page.is_predesigned}
            <Options bind:selectedVariant {product} />
          {/if}
          {#if page.is_predesigned}
            <div class="py-4 md:py-8">
              <QuantityPicker bind:quantity />
            </div>
          {/if}
        </div>

        {#if page.is_predesigned}
          <div class="flex gap-4 py-2">
            <button
              on:click={addProductToCart}
              disabled={isAddingToCart}
              class="button w-full border-[#ED7675] bg-[#ED7675] text-white">
              {#if isAddingToCart}
                Adding to Cart...
              {:else}
                Add To Cart
              {/if}
            </button>
          </div>
        {:else}
          <div class="py-2">
            <a
              href="/editor/products/{uid}?variant={selectedVariant?.id}&quantity={quantity}"
              class="button border-[#ED7675] bg-[#ED7675] text-white">
              Edit Product</a>
          </div>
        {/if}

        <div>
          <ul>
            {#each page.product_details as { heading, content }, i (i)}
              <li>
                <DropDownContent name={heading} isOpen={i === 0}>
                  <div class="px-4 pb-6 text-sm">
                    <PrismicRichText field={content} />
                  </div>
                </DropDownContent>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="block pt-8 md:hidden">
        <p class="text-base font-medium">
          Reviews ({R.length(page.reviews)})
        </p>
        <ul class="flex max-w-xl flex-col gap-8 pt-6">
          {#each page.reviews || [] as { user_name, title, review } (user_name + title)}
            <li>
              <svg
                width="90"
                height="16"
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
                    <rect
                      width="20"
                      height="19"
                      fill="white"
                      transform="translate(22)"></rect>
                  </clipPath>
                  <clipPath id="clip2_1718_4100">
                    <rect
                      width="20"
                      height="19"
                      fill="white"
                      transform="translate(44)"></rect>
                  </clipPath>
                  <clipPath id="clip3_1718_4100">
                    <rect
                      width="20"
                      height="19"
                      fill="white"
                      transform="translate(66)"></rect>
                  </clipPath>
                  <clipPath id="clip4_1718_4100">
                    <rect
                      width="20"
                      height="19"
                      fill="white"
                      transform="translate(88)"></rect>
                  </clipPath>
                </defs>
              </svg>

              <div>
                <p class="mb-3 mt-3 text-xs text-brand-secondary">
                  {user_name}
                </p>
                <div>
                  <p class="mb-3 text-base text-brand-primary">{title}</p>
                  <p class="text-sm font-light text-brand-secondary">
                    <PrismicText field={review} />
                  </p>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}
