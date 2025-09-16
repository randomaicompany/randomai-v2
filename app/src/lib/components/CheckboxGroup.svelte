<script>
  import * as R from "ramda";
  import Checkbox from "./Checkbox.svelte";

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
  <p class="mb-2 text-xl">{label}</p>
  <ul class="mb-6">
    {#each options as option (option)}
      <li
        class="font-normaltext-brand-secondary flex items-center justify-between text-sm">
        <p>{option}</p>
        <Checkbox isChecked={true} on:change={updateValues(option)} />
      </li>
    {/each}
  </ul>
</div>
