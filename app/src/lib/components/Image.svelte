<script>
  import { run } from 'svelte/legacy';

  import { createEventDispatcher } from "svelte";

  /**
   * @typedef {Object} Props
   * @property {string} [src]
   * @property {string} [alt]
   * @property {boolean} [isLoading]
   */

  /** @type {Props & { [key: string]: any }} */
  let { src = "", alt = "", isLoading = $bindable(true), ...rest } = $props();

  const dispatch = createEventDispatcher();

  const handleLoad = () => {
    isLoading = false;
    dispatch("load");
  };

  run(() => {
    src, (isLoading = true);
  });
</script>

<div class:!opacity-50={isLoading} class="opacity-100 transition-opacity">
  <img {src} {alt} {...rest} onload={handleLoad} />
</div>
