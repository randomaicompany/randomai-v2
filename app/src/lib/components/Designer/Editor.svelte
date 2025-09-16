<script>
  export let data;
  import * as R from "ramda";
  import * as RA from "ramda-adjunct";

  import user from "stores/user";

  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  import Text from "components/Designer/Text.svelte";
  import Images from "components/Designer/Images.svelte";
  import Options from "components/Product/Options.svelte";
  import PromptInputForm from "components/PromptInputForm.svelte";

  import { setQueryParams } from "utils/common";
  import { findVariantImages } from "utils/shopify";
  import { addImageToCanvas, addBase64ImageToCanvas } from "api/fabric";
  //
  import { uploadImage } from "api/firebase/storage";
  import { addDocument, fetchDocumentsByUserId } from "api/firebase/firestore";

  export let canvas;
  export let choice = {};
  export let variant = {};
  export let product = {};
  export let images = [];
  export let imageUrl = "";
  export let isGenerating = false;
  export let generatedImages = [];
  export let promptSuggestions = [];
  export let selectedGalleryImage = null;
  export let currentViewIdx = 0;

  export let tempPromt = "";

  let tabIdx = 0;

  $: currentUser = $user;
  $: userId = currentUser?.uid;

  const stylePresets = R.path(["data", "style_presets"], data);

  const getAiSettings = R.pipe(
    R.path(["productPage", "data"]),
    R.pick([
      "aspect_ratio_front",
      "aspect_ratio_back",
      "output_quality",
      "seed"
    ])
  );

  const defaultAiSettings = getAiSettings(data);

  const getCurrentAiSettings = (idx, defaultAiSettings) => {
    const buildFront = R.pipe(
      R.omit(["aspect_ratio_back"]),
      RA.renameKey("aspect_ratio_front", "aspect_ratio"),
      RA.compact
    );

    const buildBack = R.pipe(
      R.omit(["aspect_ratio_front"]),
      RA.renameKey("aspect_ratio_back", "aspect_ratio"),
      RA.compact
    );
    return R.equals(idx, 0)
      ? buildFront(defaultAiSettings)
      : buildBack(defaultAiSettings);
  };

  $: aiSettings = getCurrentAiSettings(currentViewIdx, defaultAiSettings);

  const switchTab = (idx) => () => (tabIdx = idx);

  const setVariant = ({ detail: selectedVariant }) => {
    const { id, product_id } = selectedVariant;
    setQueryParams({ product: product_id, variant: id });
    images = R.pluck("src", findVariantImages(product, variant));
    return;
  };

  const addSelectedImageToCanvas = ({ detail: imageUrl }) => {
    selectedGalleryImage = imageUrl;
    addImageToCanvas(canvas, imageUrl, false)();
  };

  const loadImages = async () => {
    const docs = await fetchDocumentsByUserId("images", userId);
    generatedImages = docs;
    return generatedImages;
  };

  const uploadImageToStorage = async (base64Image) => {
    const imageRes = await fetch(base64Image);
    const imageBlob = await imageRes.blob();
    const blobURL = URL.createObjectURL(imageBlob);

    const url = await uploadImage(blobURL, `images/${String(Date.now())}`);
    await addDocument("images", {
      url,
      userId
    });

    await loadImages();
  };

  const setBase64ImagetoCanvas = (canvas, base64Image) => {
    const image = canvas
      .getActiveObjects()
      .find(({ objectType }) => objectType == "ai-generated-image");

    if (image) {
      return image.setSrc(base64Image, () => {
        canvas.renderAll();
      });
    }
  };

  const handleImageGenerate = async ({ detail: base64Image } = true) => {
    setBase64ImagetoCanvas(canvas, base64Image);
    addBase64ImageToCanvas(canvas, base64Image);
    await uploadImageToStorage(base64Image);
  };

  const setHomeGeneratedImage = () => {
    const localImageUrl = localStorage.getItem("imageUrl");
    const localPromt = localStorage.getItem("tempPromt");

    if (!browser || !localImageUrl) return;
    addBase64ImageToCanvas(canvas, localImageUrl);

    imageUrl = localImageUrl;
    tempPromt = localPromt;

    console.log("tempPromt", tempPromt);

    localStorage.removeItem("imageUrl");
    localStorage.removeItem("tempPromt");
  };

  onMount(() => {
    canvas && setHomeGeneratedImage();
  });
</script>

<div>
  <div>
    <h1 class="heading-lg hidden md:block">AI Designer</h1>
    <ul class="inline-flex flex-row items-center md:pt-8">
      <li class="flex-1">
        <button
          on:click={switchTab(0)}
          class:!bg-brand-smoke-darker={R.equals(tabIdx, 0)}
          class="flex items-center gap-2 whitespace-nowrap border border-r-0 border-gray-200 p-4 py-2 pl-2 text-xs font-medium transition-all md:py-3 md:text-sm md:font-normal">
          <i class="material-symbols-rounded">highlight</i>
          <p>Customize Art</p>
        </button>
      </li>
      <li class="flex-1">
        <button
          on:click={switchTab(1)}
          class:!bg-brand-smoke-darker={R.equals(tabIdx, 1)}
          class="flex items-center gap-2 whitespace-nowrap border border-gray-200 p-4 py-2 pl-2 text-xs font-medium transition-all md:py-3 md:text-sm md:font-normal">
          <i class="material-symbols-rounded">sort_by_alpha</i>
          <p>Customize Text</p>
        </button>
      </li>
    </ul>

    <div>
      {#if RA.isNotEmpty(product)}
        <div class="hidden" class:!block={R.equals(tabIdx, 0)}>
          <h2 class="heading-2xl hidden pt-10 md:block">
            {product?.title || ""}
          </h2>
          <div class="py-5">
            <PromptInputForm
              bind:imageUrl
              bind:isLoading={isGenerating}
              on:generate={handleImageGenerate}
              {aiSettings}
              {stylePresets}
              {promptSuggestions}
              {tempPromt} />
          </div>
          <Options
            on:change={setVariant}
            bind:choice
            bind:selectedVariant={variant}
            {product} />
        </div>
      {/if}

      <div class="hidden" class:!block={R.equals(tabIdx, 1)}>
        <div class="py-8">
          <Text bind:canvas />
        </div>
      </div>
    </div>

    <div class="relative hidden pt-4" class:!block={R.equals(tabIdx, 0)}>
      <Images
        gallery={data.data.gallery}
        bind:images={generatedImages}
        on:select={addSelectedImageToCanvas} />
    </div>
  </div>
</div>
