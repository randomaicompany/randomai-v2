<script>
  /** @type {import("@prismicio/client").Content.AccordionsSlice} */
  import { slide } from "svelte/transition";
  import { isFilled } from "@prismicio/client";
  import { PrismicRichText } from "@prismicio/svelte";
  export let slice;

  let state = {};
  const toggle = (idx) => () => (state = { ...state, [idx]: !state[idx] });
</script>

<section
  class="shell"
  class:max-w-5xl="{slice.primary.is_narrow}"
  data-slice-type="{slice.slice_type}"
  data-slice-variation="{slice.variation}">
  {#each slice.items as item, idx}
    <button
      on:click="{toggle(idx)}"
      class="flex items-center w-full gap-2 p-4 text-left border-b outline-none">
      <div class="w-full font-medium">
        <PrismicRichText field="{item.heading}" />
      </div>
      <i class:rotate-180="{state[idx]}" class="transition-transform material-symbols-rounded"
        >keyboard_arrow_down</i>
    </button>

    {#if state[idx]}
      <div
        transition:slide="{{ duration: 300 }}"
        class="p-4 border-b border-transparent last:border-transparent"
        class:border-b-gray-200="{isFilled.richText(item.content)}">
        <PrismicRichText field="{item.content}" />
      </div>
      <!-- {/if} -->
    {/if}
  {/each}
</section>
