<script>
  import { ref } from "firebase/storage";
  import { storage } from "$lib/firebase";

  export let isRemovingBackground;
  import {
    clearAll,
    deleteItem,
    bringToFront,
    verticallyAlign,
    horizontallyAlign,
    getImageInCanvas,
    hasImageInCanvas,
    replaceActiveImageSrc,
  } from "root/src/lib/api/fabric";

  export let canvas;

  import IconButton from "./IconButton.svelte";

  const removeBackground = async () => {
    if (!canvas) return;
    isRemovingBackground = true;
    const hasImage = hasImageInCanvas(canvas);
    if (!hasImage) {
      isRemovingBackground = false;
      return alert("No image to remove background of");
    }
    const imageSRC = getImageInCanvas(canvas);

    if (!imageSRC) {
      isRemovingBackground = false;
      return alert("No image selected. Please select an image to remove the background.");
    }

    const response = await fetch(`/api/cleanup`, {
      method: "POST",
      body: JSON.stringify({ imageUrl: imageSRC }),
    });

    const data = await response.json();

    if (response.status >= 400 && response.status <= 500) {
      isRemovingBackground = false;
      return alert("Failed to remove background. Something went wrong.");
    }

    if (response.status >= 500) {
      isRemovingBackground = false;
      return alert("something went wrong...");
    }

    isRemovingBackground = false;
    return replaceActiveImageSrc(canvas, data.imageUrl);
  };
</script>

{#if canvas}
  <div class="tools-box-wrapper flex flex-col justify-center">
    <div class="flex flex-col gap-2 p-2 rounded-md tools-box shadow-[0px_2px_8px_rgba(99,99,99,0.2)]">
      <IconButton
        label="Vertically align"
        iconName="vertical_align_center"
        on:click="{() => verticallyAlign(canvas)}" />

      <IconButton
        label="Horizontally align"
        iconName="align_horizontal_center"
        on:click="{() => horizontallyAlign(canvas)}" />

      <IconButton label="Delete" iconName="delete" on:click="{() => deleteItem(canvas)}" />

      <IconButton
        label="Clear everything"
        iconName="clear_all"
        on:click="{() => clearAll(canvas)}" />

      <!-- <IconButton
        label="Bring to front"
        iconName="layers"
        on:click="{() => bringToFront(canvas)}" /> -->

      {#if !isRemovingBackground}
        <IconButton
          className="!bg-brand-accent-light !text-white !border-brand-accent-light active:!bg-brand-accent"
          on:click="{removeBackground}"
          label="Clear Background"
          isbackground={true}
          iconName="wallpaper" />
      {:else}
        <div
          class="h-6 w-6 rounded-full border-brand-accent border-2 border-r-transparent animate-spin">
        </div>
      {/if}
    </div>
  </div>
{/if}
