<script>
  import { accordion } from "root/src/lib/utils/accordion";

  export let isOpen = false;
  export let name = "Accordion Heading";

  let open = isOpen;

  const toggle = () => (open = !open);
</script>

<div>
  <button
    on:click={toggle}
    class:!text-brand-primary={open}
    class="!last:border-b-transparent flex w-full flex-1 cursor-pointer items-center border-t p-4 text-left text-base font-medium text-brand-tertiary">
    <p class="flex-1">{name}</p>
    <i
      class:rotate-45={open}
      class="material-symbols-rounded ml-2 !text-2xl transition-transform duration-150"
      >add</i>
  </button>

  <div use:accordion={open}>
    <div class="overflow-hidden text-base transition-all">
      <slot />
    </div>
  </div>
</div>
