<script>
  import { onMount } from "svelte";
  import { fabric } from "fabric";
  //
  import { resizeCanvas, convertToStyles } from "root/src/lib/utils/canvas";
  import {
    isCanvasEmpty,
    putBoundaryConstraints
  } from "root/src/lib/api/fabric";
  //
  import Image from "components/Image.svelte";
  //

  export let canvas;
  export let placeholder;
  export let isLoading = false;
  export { className as class };
  export let canvasStyles = {};
  //
  let className = "";
  let canvasElm;
  let canvasContainer;
  let showPlaceholderImage = true;

  const resize = () => resizeCanvas(canvas, canvasContainer);

  const init = () => {
    canvas = new fabric.Canvas(canvasElm, { preserveObjectStacking: false });
    // putBoundaryConstraints(canvas);

    showPlaceholderImage = isCanvasEmpty(canvas);
    canvas.on(
      "object:removed",
      () => (showPlaceholderImage = isCanvasEmpty(canvas))
    );
    canvas.on(
      "object:added",
      () => (showPlaceholderImage = isCanvasEmpty(canvas))
    );
  };

  onMount(() => {
    init();
    resize();
    window.addEventListener("resize", resize);
    () => {
      window.removeEventListener("resize", resize);
    };
  });
</script>

<div class={className}>
  {#if showPlaceholderImage && !isLoading}
    <Image
      src={placeholder}
      style={convertToStyles(canvasStyles)}
      class="absolute -translate-y-[16%] scale-[.7] object-contain" />
  {/if}

  <div
    bind:this={canvasContainer}
    class="absolute"
    style={convertToStyles(canvasStyles)}>
    <div class="relative">
      {#if isLoading}
        <div
          class="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center pb-16">
          <div class="h-14 w-14 rounded-full bg-white p-2">
            <div
              style="animation-duration:0.4s"
              class="h-full w-full animate-spin rounded-full border-[3px] border-brand-accent border-r-transparent bg-transparent">
            </div>
          </div>
        </div>
      {/if}

      <canvas
        bind:this={canvasElm}
        class="h-full w-full border-dashed opacity-100 hover:border active:border"
      ></canvas>
    </div>
  </div>
</div>
