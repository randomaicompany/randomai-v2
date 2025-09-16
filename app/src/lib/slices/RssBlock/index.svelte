<script>
  import { PrismicText } from "@prismicio/svelte";

  
  /**
   * @typedef {Object} Props
   * @property {import("@prismicio/client").Content.RssBlockSlice} slice
   */

  /** @type {Props} */
  let { slice } = $props();
</script>

<section
  data-slice-type={slice.slice_type}
  data-slice-variation={slice.variation}>
  <div class="shell mb-6">
    <h2 class="mb-2 text-3xl">
      <PrismicText field={slice.primary.heading}></PrismicText>
    </h2>
    <p class="text-base font-thin">
      <PrismicText field={slice.primary.subtext}></PrismicText>
    </p>
  </div>
</section>
