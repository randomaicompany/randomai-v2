<script>
  import { onMount } from "svelte";
  import { fabric } from "fabric";
  //
  import { resizeCanvas, convertToStyles } from "root/src/lib/utils/canvas";
  import { isCanvasEmpty, putBoundaryConstraints } from "root/src/lib/api/fabric";
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
    canvas.on("object:removed", () => (showPlaceholderImage = isCanvasEmpty(canvas)));
    canvas.on("object:added", () => (showPlaceholderImage = isCanvasEmpty(canvas)));
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

<div class="{className}">
  {#if showPlaceholderImage && !isLoading}
    <Image
      src="{placeholder}"
      style="{convertToStyles(canvasStyles)}"
      class="absolute object-contain scale-[.7] -translate-y-[16%]" />
  {/if}

  <div bind:this="{canvasContainer}" class="absolute" style="{convertToStyles(canvasStyles)}">
    <div class="relative">
      {#if isLoading}
        <div
          class="w-full h-full flex items-center justify-center absolute top-0 left-0 pb-16 z-10">
          <div class="w-14 h-14 p-2 rounded-full bg-white">
            <div
              style="animation-duration:0.4s"
              class="bg-transparent border-[3px] rounded-full animate-spin border-r-transparent w-full h-full border-brand-accent">
            </div>
          </div>
        </div>
      {/if}

      <canvas
        bind:this="{canvasElm}"
        class="w-full h-full border-dashed opacity-100 hover:border active:border"></canvas>
    </div>
  </div>
</div>
