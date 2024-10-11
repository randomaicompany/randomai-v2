<script>
  export let data = {};

  import * as R from "ramda";
  //
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  //
  import { exportCanvas } from "utils/canvas.js";
  import { findVariantImages } from "utils/shopify";
  import { addToCartWithProps } from "utils/cart.js";
  import { uploadImage } from "api/firebase/storage.js";
  import { pluckPromptSuggestions } from "utils/common.js";
  import { isCanvasEmpty, addBase64ImageToCanvas } from "api/fabric.js";

  import Canvas from "components/Designer/Canvas";
  import Editor from "components/Designer/Editor.svelte";
  //
  const pageData = R.path(["productPage", "data"], data);
  const canvasStyles = R.values(R.pick(["front", "back"], pageData));
  const isFrontCanvasOnly = R.prop("is_front_only", pageData);

  //
  let canvas;
  let frontCanvas;
  let backCanvas;

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

  const handleSegmentExport = ({ detail }) => {
    addBase64ImageToCanvas(canvas, detail, "segment-image");
    toggle();
  };

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
      <div class="flex-0 md:w-[26rem]">
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

    <footer class="flex items-center justify-end gap-4 pt-14">
      <button
        on:click="{exportAndAddToCart}"
        disabled="{isAddToCartInProgress}"
        class="border-transparent button bg-brand-accent-light">
        {#if isAddToCartInProgress}
          Please wait...
        {:else}
          Add to Cart
        {/if}
      </button>
    </footer>
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

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
