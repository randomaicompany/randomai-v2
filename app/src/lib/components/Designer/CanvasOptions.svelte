<script>
  import { run } from 'svelte/legacy';

  import { fabric } from "fabric";

  import {
    clearAll,
    deleteItem,
    verticallyAlign,
    horizontallyAlign,
    getImageInCanvas,
    hasImageInCanvas,
    replaceActiveImageSrc
  } from "root/src/lib/api/fabric";


  import IconButton from "./IconButton.svelte";

  // Zoom state and helpers
  let zoom = $state(1);
  /**
   * @typedef {Object} Props
   * @property {any} isRemovingBackground
   * @property {any} canvas
   * @property {number} [minZoom]
   * @property {number} [maxZoom]
   * @property {number} [zoomStep]
   */

  /** @type {Props} */
  let {
    isRemovingBackground = $bindable(),
    canvas,
    minZoom = 0.25,
    maxZoom = 4,
    zoomStep = 0.1
  } = $props();

  run(() => {
    if (canvas && typeof canvas.getZoom === "function") {
      // keep local zoom in sync when canvas changes externally
      zoom = canvas.getZoom();
    }
  });

  const setZoom = (value) => {
    if (!canvas) return;
    const clamped = Math.max(minZoom, Math.min(maxZoom, value));
    const center = new fabric.Point(
      canvas.getWidth() / 2,
      canvas.getHeight() / 2
    );
    canvas.zoomToPoint(center, clamped);
    zoom = canvas.getZoom();
    canvas.requestRenderAll();
  };

  const zoomIn = () => setZoom(zoom + zoomStep);
  const zoomOut = () => setZoom(zoom - zoomStep);
  const resetZoom = () => {
    if (!canvas) return;
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    zoom = 1;
    canvas.requestRenderAll();
  };

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
      return alert(
        "No image selected. Please select an image to remove the background."
      );
    }

    const response = await fetch(`/api/cleanup`, {
      method: "POST",
      body: JSON.stringify({ imageUrl: imageSRC })
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
    <div
      class="tools-box flex gap-2 rounded-md p-2 shadow-[0px_2px_8px_rgba(99,99,99,0.2)]">
      <IconButton
        label="Delete"
        iconName="delete"
        on:click={() => deleteItem(canvas)} />

      <IconButton
        label="Clear everything"
        iconName="clear_all"
        on:click={() => clearAll(canvas)} />

      <IconButton
        label="Vertically align"
        iconName="vertical_align_center"
        on:click={() => verticallyAlign(canvas)} />

      <IconButton
        label="Horizontally align"
        iconName="align_horizontal_center"
        on:click={() => horizontallyAlign(canvas)} />

      <!-- Zoom controls -->
      <div class="mx-2 h-6 w-px self-center bg-gray-200" aria-hidden="true">
      </div>
      <IconButton label="Zoom out" iconName="zoom_out" on:click={zoomOut} />
      <div class="flex items-center gap-2 px-1">
        <input
          class="w-28 accent-brand-accent"
          type="range"
          min={minZoom}
          max={maxZoom}
          step={zoomStep}
          value={zoom}
          oninput={(e) => setZoom(+e.target.value)}
          aria-label="Canvas zoom" />
        <span class="w-10 select-none text-center text-xs"
          >{Math.round(zoom * 100)}%</span>
      </div>
      <IconButton label="Zoom in" iconName="zoom_in" on:click={zoomIn} />
      <IconButton
        label="Reset zoom"
        iconName="center_focus_strong"
        on:click={resetZoom} />

      <!-- <IconButton
        label="Bring to front"
        iconName="layers"
        on:click="{() => bringToFront(canvas)}" /> -->

      {#if !isRemovingBackground}
        <IconButton
          className="!bg-brand-accent-light !text-white !border-brand-accent-light active:!bg-brand-accent"
          on:click={removeBackground}
          label="Clear Background"
          isbackground={true}
          iconName="wallpaper" />
      {:else}
        <div
          class="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-r-transparent">
        </div>
      {/if}
    </div>
  </div>
{/if}
