<script>
  import { accordion } from "root/src/lib/utils/accordion";

  export let isOpen = false;
  export let name = "Accordion Heading";

  const toggle = () => (isOpen = !isOpen);
</script>

<div>
  <button
    on:click="{toggle}"
    class="flex items-center flex-1 w-full py-2 text-sm font-medium text-left cursor-pointer">
    {name}
    <i
      class:rotate-180="{isOpen}"
      class="!text-lg material-symbols-rounded transition-transform duration-150 ml-2"
      >expand_more</i>
  </button>

  <div use:accordion="{isOpen}">
    <div class="overflow-hidden text-base transition-all">
      <slot />
    </div>
  </div>
</div>
