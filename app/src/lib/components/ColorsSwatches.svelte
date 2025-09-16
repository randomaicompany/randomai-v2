<script>
  import * as R from "ramda";

  import Checkbox from "./Checkbox.svelte";
  import { PrismicImage } from "@prismicio/svelte";

  export let label = "";
  export let values = [];
  export let options = [];

  const updateValues = (option) => () => {
    return (values = R.includes(option, values)
      ? R.without([option], values)
      : R.append(option, values));
  };
</script>

<div>
  <div class="mb-4 flex items-center gap-2">
    <p class="text-xl">{label}</p>
  </div>
  <ul class="flex flex-wrap gap-2 px-1">
    {#each options as { swatch, color_name } (color_name)}
      <li>
        <Checkbox on:change={updateValues(color_name)}>
          {@const isActive = R.includes(color_name, values)}
          {@const isFiltered = R.isEmpty(values)}
          <div
            class:opacity-50={!isFiltered}
            class:!opacity-100={isActive}
            class:!ring-brand-primary={isActive}
            class="h-5 w-5 rounded-full border ring-1 ring-transparent ring-offset-1 transition-all">
            <PrismicImage class="rounded-full" field={swatch} />
          </div>
        </Checkbox>
      </li>
    {/each}
  </ul>
</div>
