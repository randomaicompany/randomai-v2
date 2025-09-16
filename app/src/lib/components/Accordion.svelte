<script>
  import { accordion } from "root/src/lib/utils/accordion";

  export let isOpen = false;
  export let name = "Accordion Heading";

  const toggle = () => (isOpen = !isOpen);
</script>

<div>
  <button
    on:click={toggle}
    class="flex w-full flex-1 cursor-pointer items-center py-2 text-left text-sm font-medium">
    {name}
    <i
      class:rotate-180={isOpen}
      class="material-symbols-rounded ml-2 !text-lg transition-transform duration-150"
      >expand_more</i>
  </button>

  <div use:accordion={isOpen}>
    <div class="overflow-hidden text-base transition-all">
      <slot />
    </div>
  </div>
</div>
