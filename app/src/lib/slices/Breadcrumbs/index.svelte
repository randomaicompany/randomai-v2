<script>
  export let slice;
  import * as R from "ramda";
  import { PrismicLink } from "@prismicio/svelte";
</script>

<ul
  data-slice-type="{slice.slice_type}"
  data-slice-variation="{slice.variation}"
  class="shell items-center hidden gap-1 py-8 md:flex sm:flex">
  {#each slice.items as { link, text }, idx}
    {@const isLastItem = R.equals(R.length(slice.items), R.inc(idx))}
    <li>
      <PrismicLink class="text-xs font-light uppercase hover:underline" field="{link}">
        <span
          class:!font-medium="{isLastItem}"
          class:!text-brand-primary="{isLastItem}"
          class="text-brand-primary/80">{text || ""}</span>
      </PrismicLink>
    </li>

    {#if !isLastItem}
      <li>
        <i class="material-symbols-rounded !text-xl mt-0.5">chevron_right</i>
      </li>
    {/if}
  {/each}
</ul>
