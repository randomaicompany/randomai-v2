<script>
  import * as R from "ramda";
  //
  import { onMount } from "svelte";
  import Canvas from "./Canvas.svelte";
  import Image from "components/Image.svelte";
  import CanvasOptions from "components/Designer/CanvasOptions.svelte";

  export let page;
  export let canvas;
  export let frontCanvas;
  export let backCanvas;
  export let isLoading = false;

  export let canvasStyles = [];
  export let productImages = [];
  export let placeholderImage =
    "https://images.prismic.io/randomai-10/ZhPSPhrFxhpPBXhg_Placeholder.png";

  export let currentViewIdx = 0;
  let hasImageLoaded = false;

  $: activeImage = productImages[currentViewIdx];
  $: canvas = currentViewIdx == 0 ? frontCanvas : backCanvas;

  const handleImageLoad = () => setTimeout(() => (hasImageLoaded = true), 500);
  const switchView = (idx) => () => (currentViewIdx = idx);
  const setActiveView = () => {
    page.is_front_canvas_enabled && (currentViewIdx = 0);
    page.is_back_canvas_enabled && (currentViewIdx = 1);
    page.is_front_canvas_enabled && page.is_front_canvas_enabled && (currentViewIdx = 0);
  };

  onMount(setActiveView);
</script>

<div class="relative">
  {#if activeImage}
    <Image class="md:border-none border" src="{activeImage}" on:load="{handleImageLoad}" />
  {/if}

  {#if hasImageLoaded}
    {#if page.is_front_canvas_enabled}
      <div class:!visible="{currentViewIdx == 0}" class="invisible">
        <Canvas
          {isLoading}
          bind:canvas="{frontCanvas}"
          placeholder="{placeholderImage}"
          canvasStyles="{canvasStyles[currentViewIdx]}">
        </Canvas>
      </div>
    {/if}

    {#if page.is_back_canvas_enabled}
      <div class:!visible="{currentViewIdx == 1}" class="invisible">
        <Canvas
          {isLoading}
          bind:canvas="{backCanvas}"
          placeholder="{placeholderImage}"
          canvasStyles="{canvasStyles[currentViewIdx]}">
        </Canvas>
      </div>
    {/if}
  {/if}

  <div class="absolute top-4 left-4">
    <CanvasOptions {canvas} />
  </div>

  {#if page.is_front_canvas_enabled && page.is_back_canvas_enabled}
    <ul class:opacity-100="{hasImageLoaded}" class="absolute block opacity-0 bottom-4 right-4">
      {#each productImages as src, idx}
        {@const isCurrent = R.equals(idx, currentViewIdx)}
        <li>
          <button
            on:click="{switchView(idx)}"
            class:!opacity-100="{isCurrent}"
            class:!border-gray-500="{isCurrent}"
            class="object-cover w-16 border opacity-50">
            <Image {src} />
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
