<script>
  import * as R from "ramda";
  import Checkbox from "./Checkbox.svelte";

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
  <p class="text-xl mb-2">{label}</p>
  <ul class="mb-6">
    {#each options as option}
      <li class="flex items-center justify-between text-sm font-normaltext-brand-secondary">
        <p>{option}</p>
        <Checkbox isChecked="{true}" on:change="{updateValues(option)}" />
      </li>
    {/each}
  </ul>
</div>
