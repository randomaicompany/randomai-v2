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
  {#if showPlaceholderImage}
    <Image
      src="{placeholder}"
      style="{convertToStyles(canvasStyles)}"
      class="absolute object-contain scale-[.7] -translate-y-[16%]" />
  {/if}

  <div bind:this="{canvasContainer}" class="absolute" style="{convertToStyles(canvasStyles)}">
    <canvas
      bind:this="{canvasElm}"
      class="w-full h-full border-dashed opacity-100 hover:border active:border"></canvas>
  </div>
</div>
