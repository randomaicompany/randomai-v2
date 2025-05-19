<script>
  export let data = {};

  import * as R from "ramda";
  //
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { browser } from "$app/environment";
  //
  import { clickOutside } from "root/src/lib/utils/common.js";
  import { exportCanvas } from "utils/canvas.js";
  import { findVariantImages } from "utils/shopify";
  import { addToCartWithProps } from "utils/cart.js";
  import { uploadImage } from "api/firebase/storage.js";
  import { pluckPromptSuggestions } from "utils/common.js";
  import { isCanvasEmpty, addBase64ImageToCanvas } from "api/fabric.js";
  import { PrismicText, PrismicImage, PrismicRichText, PrismicLink } from "@prismicio/svelte";

  import Canvas from "components/Designer/Canvas";
  import Editor from "components/Designer/Editor.svelte";
  import DropDownContent from "components/DropDownContent.svelte";
  //
  const pageData = R.path(["productPage", "data"], data);
  const canvasStyles = R.values(R.pick(["front", "back"], pageData));
  const isFrontCanvasOnly = R.prop("is_front_only", pageData);
  const uid = R.path(["productPage", "uid"], data);

  //
  let canvas;
  let frontCanvas;
  let backCanvas;
  let isModalOpen = false;

  let isLoading = true;
  let generatedImage = "";
  let selectedGalleryImage = null;
  let isAddToCartInProgress = false;
  let hasProductAndVariantIds = true;
  let isGenerating = false;

  let choice = {};
  let product = data.productPage.data.product;
  let variant = {};
  let productImages = [];
  let currentViewIdx = 0;
  let quantity = $page.url.searchParams.get("quantity") || "1";

  const promptSuggestions = pluckPromptSuggestions(data);

  const exportAndAddToCart = async () => {
    isAddToCartInProgress = true;

    let frontImageUrl = null;
    let backImageUrl = null;

    let frontImageHostedUrl = null;
    let backImageHostedUrl = null;

    let isFrontCanvasEmpty = true;
    let isBackCanvasEmpty = true;

    frontCanvas && (isFrontCanvasEmpty = isCanvasEmpty(frontCanvas));
    backCanvas && (isBackCanvasEmpty = isCanvasEmpty(backCanvas));

    if (
      pageData.is_front_canvas_enabled &&
      pageData.is_back_canvas_enabled &&
      isFrontCanvasEmpty &&
      isBackCanvasEmpty
    ) {
      isAddToCartInProgress = false;
      return alert("Both sides cannot be empty");
    }

    if (isBackCanvasEmpty && !pageData.is_front_canvas_enabled && pageData.is_back_canvas_enabled) {
      isAddToCartInProgress = false;
      return alert("Canvas cannot be empty");
    }

    if (!isFrontCanvasEmpty) {
      frontImageUrl = await exportCanvas(frontCanvas);
    }

    if (!isBackCanvasEmpty) {
      backImageUrl = await exportCanvas(backCanvas);
    }

    if (frontImageUrl) {
      frontImageHostedUrl = await uploadImage(frontImageUrl, `images/front-${String(Date.now())}`);
    }

    if (backImageUrl) {
      backImageHostedUrl = await uploadImage(backImageUrl, `images/back-${String(Date.now())}`);
    }

    await addToCartWithProps(
      {
        ...variant,
        frontImageUrl: frontImageHostedUrl,
        backImageUrl: backImageHostedUrl,
      },
      Number(quantity)
    );

    isAddToCartInProgress = false;
  };

  onMount(async () => {
    const variantId = $page.url.searchParams.get("variant");

    if (!product.id || !variantId) {
      isLoading = false;
      hasProductAndVariantIds = false;
      return;
    }

    const variantReq = await fetch("/api/variant/" + variantId);
    const variantResponse = await variantReq.json();

    variant = variantResponse;
    choice = variantResponse;
    productImages = R.pluck("src", findVariantImages(product, variant));

    isLoading = false;
    hasProductAndVariantIds = true;
  });

  const openModal = () => isModalOpen = true;
  const closeModal = () => isModalOpen = false;

  $: browser && (document.body.style.overflow = isModalOpen ? "hidden" : "auto");
</script>

<svelte:head>
  <title>{data.meta_title}</title>
  <meta name="description" content="{data.meta_description}" />

  {#if data.data.head && data.data.head.length > 0}
    {@html data.data.head[0].text}
  {/if}
</svelte:head>

{#if isLoading}
  <p class="block p-4 text-center">Loading...</p>
{:else}
  <div class="shell md:py-16 py-8" class:!hidden="{!hasProductAndVariantIds}">
    <div class="flex flex-col-reverse md:gap-12 gap-4 md:flex-row">
      <div class="flex-0 md:w-[30rem] mt-[100px] md:mt-0">
        {#if canvas}
          <Editor
            {canvas}
            {data}
            {promptSuggestions}
            bind:choice
            bind:product
            bind:variant
            bind:selectedGalleryImage
            bind:isGenerating
            bind:currentViewIdx
            bind:images="{productImages}"
            bind:imageUrl="{generatedImage}" />
        {/if}

        <footer class="flex items-center justify-end gap-4 pt-[50px] md:pt-[20px] flex-wrap md:flex-nowrap">
          <button
            on:click="{exportAndAddToCart}"
            disabled="{isAddToCartInProgress}"
            class="border-transparent button bg-brand-accent-light w-full md:max-w-max">
            {#if isAddToCartInProgress}
              Please wait...
            {:else}
              Add to Cart
            {/if}
          </button>
          <!-- <a href="/products/{uid}" class="button w-full md:max-w-max">
            Product Description
          </a> -->
          <button on:click={openModal} class="button w-full md:max-w-max">
            Product Description
          </button>
        </footer>
      </div>

      <div class="relative max-w-2xl ml-auto">
        <div class="pb-4">
          <h2 class="md:heading-2xl heading-lg md:font-normal font-medium md:hidden block">
            {product?.title || ""}
          </h2>
        </div>
        <Canvas
          isLoading="{isGenerating}"
          page="{pageData}"
          {isFrontCanvasOnly}
          bind:canvas
          bind:productImages
          bind:frontCanvas
          bind:backCanvas
          bind:currentViewIdx
          {canvasStyles} />
      </div>
    </div>

    <!-- <footer class="flex items-center justify-end gap-4 pt-[50px] md:pt-[120px] flex-wrap md:flex-nowrap">
      <button
        on:click="{exportAndAddToCart}"
        disabled="{isAddToCartInProgress}"
        class="border-transparent button bg-brand-accent-light w-full md:max-w-max">
        {#if isAddToCartInProgress}
          Please wait...
        {:else}
          Add to Cart
        {/if}
      </button>
      <button on:click={openModal} class="button w-full md:max-w-max">
        Product Description
      </button>
    </footer> -->
  </div>

  {#if !hasProductAndVariantIds}
    <div class="flex items-center justify-center h-[60vh]">
      <!--  -->
      <div class="w-full max-w-xl p-8 text-center bg-white">
        <div class="mb-16">
          <p class="mb-2 text-4xl">Please select a product</p>
          <p class="text-lg text-brand-primary/50">
            You must select a product before you can use the editor.
          </p>
        </div>

        <a href="/" class="button">See All Products</a>
      </div>
    </div>
  {/if}
{/if}

{#if isModalOpen}
  <div
    in:fade="{{ duration: 300 }}"
    out:fade="{{ duration: 300 }}"
    class="fixed top-0 left-0 z-10 flex items-start justify-center w-full h-full p-4 overflow-auto bg-brand-black/50 rounded-md">
    <div
      in:fly="{{ duration: 300, delay: 100, y: 12 }}"
      out:fly="{{ duration: 300, y: 12 }}"
      class="flex-1 max-w-xl bg-white mt-[8vh] p-8 relative rounded-md"
      use:clickOutside
      on:clickOutside="{closeModal}">
      <button on:click="{closeModal}" class="absolute px-2 bg-brand-accent text-white -top-3 -right-3 md:-top-6 md:-right-6 w-8 h-8 md:w-10 md:h-10 rounded-full flex justify-center items-center"
        ><i class="material-symbols-rounded !text-xl">close</i>
      </button>
        <div>
          <div>
            <ul>
              {#each pageData.product_details as { heading, content }, i}
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
          <div class="pt-16">
            <p class="text-base font-medium">
              Reviews ({R.length(pageData.reviews)})
            </p>
            <ul class="flex flex-col max-w-xl gap-8 pt-6">
              {#each pageData.reviews || [] as { user_name, title, review }}
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
                        <rect width="20" height="19" fill="white" transform="translate(22)"></rect>
                      </clipPath>
                      <clipPath id="clip2_1718_4100">
                        <rect width="20" height="19" fill="white" transform="translate(44)"></rect>
                      </clipPath>
                      <clipPath id="clip3_1718_4100">
                        <rect width="20" height="19" fill="white" transform="translate(66)"></rect>
                      </clipPath>
                      <clipPath id="clip4_1718_4100">
                        <rect width="20" height="19" fill="white" transform="translate(88)"></rect>
                      </clipPath>
                    </defs>
                  </svg>
      
                  <div>
                    <p class="mt-3 mb-3 text-xs text-brand-secondary">
                      {user_name}
                    </p>
                    <div>
                      <p class="mb-3 text-base text-brand-primary">{title}</p>
                      <p class="text-sm font-light text-brand-secondary">
                        <PrismicText field="{review}" />
                      </p>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </div>
    </div>
  </div>
{/if}

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
