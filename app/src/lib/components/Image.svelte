<script>
  import { createEventDispatcher } from "svelte";

  export let src = "";
  export let alt = "";
  export let isLoading = true;

  const dispatch = createEventDispatcher();

  const handleLoad = () => {
    isLoading = false;
    dispatch("load");
  };

  $: src, (isLoading = true);
</script>

<div class:!opacity-50={isLoading} class="opacity-100 transition-opacity">
  <img {src} {alt} {...$$restProps} on:load={handleLoad} />
</div>
