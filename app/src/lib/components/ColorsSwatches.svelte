<script>
  import * as R from "ramda";
  import * as RA from "ramda-adjunct";

  import Checkbox from "./Checkbox.svelte";
  import { PrismicImage } from "@prismicio/svelte";

  export let label = "";
  export let values = [];
  export let options = [];

  const updateValues = (option) => (event) => {
    return (values = R.includes(option, values)
      ? R.without([option], values)
      : R.append(option, values));
  };
</script>

<div>
  <div class="flex items-center gap-2 mb-4">
    <p class="text-xl">{label}</p>
  </div>
  <ul class="flex flex-wrap gap-2 px-1">
    {#each options as { swatch, color_name }, idx}
      <li>
        <Checkbox on:change="{updateValues(color_name)}">
          {@const isActive = R.includes(color_name, values)}
          {@const isFiltered = R.isEmpty(values)}
          <div
            class:opacity-50="{!isFiltered}"
            class:!opacity-100="{isActive}"
            class:!ring-brand-primary="{isActive}"
            class="w-5 h-5 transition-all border rounded-full ring-1 ring-offset-1 ring-transparent">
            <PrismicImage class="rounded-full" field="{swatch}" />
          </div>
        </Checkbox>
      </li>
    {/each}
  </ul>
</div>
