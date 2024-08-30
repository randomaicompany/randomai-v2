<script>
  import { accordion } from "root/src/lib/utils/accordion";

  export let isOpen = false;
  export let name = "Accordion Heading";

  const toggle = () => (isOpen = !isOpen);
</script>

<div>
  <button
    on:click="{toggle}"
    class:!text-brand-primary="{isOpen}"
    class="flex items-center flex-1 text-brand-tertiary font-medium w-full p-4 text-base text-left border-t cursor-pointer !last:border-b-transparent">
    <p class="flex-1">{name}</p>
    <i
      class:rotate-45="{isOpen}"
      class="ml-2 !text-2xl transition-transform duration-150 material-symbols-rounded"
      >add</i>
  </button>

  <div use:accordion="{isOpen}">
    <div class="overflow-hidden text-base transition-all">
      <slot />
    </div>
  </div>
</div>
