<script>
  import { createEventDispatcher } from "svelte";
  export let isChecked = false;
  import { fade, fly, scale } from "svelte/transition";

  const toggle = () => {
    isChecked = !isChecked;
    dispatch("change", { isChecked });
  };

  const dispatch = createEventDispatcher();
</script>

<button on:click={toggle}>
  {#if !$$slots.default}
    {#if isChecked}
      <i in:scale={{ start: 0.85 }} class="material-symbols-rounded filled"
        >check_box</i>
    {:else}
      <i in:scale={{ start: 0.85 }} class="material-symbols-rounded thin"
        >check_box_outline_blank</i>
    {/if}
  {:else}
    <slot></slot>
  {/if}
</button>

<style>
  .material-symbols-rounded.filled {
    font-variation-settings:
      "FILL" 1,
      "wght" 300,
      "GRAD" 0,
      "opsz" 20;
  }

  .material-symbols-rounded.thin {
    font-variation-settings:
      "FILL" 1,
      "wght" 280,
      "GRAD" 0,
      "opsz" 20;
  }
</style>
