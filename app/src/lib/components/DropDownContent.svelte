<script>
  import { accordion } from "root/src/lib/utils/accordion";

  /**
   * @typedef {Object} Props
   * @property {boolean} [isOpen]
   * @property {string} [name]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { isOpen = false, name = "Accordion Heading", children } = $props();

  let open = $state(isOpen);

  const toggle = () => (open = !open);
</script>

<div>
  <button
    onclick={toggle}
    class:!text-brand-primary={open}
    class="!last:border-b-transparent flex w-full flex-1 cursor-pointer items-center border-t p-4 text-left text-base font-medium text-brand-tertiary">
    <p class="flex-1">{name}</p>
    <i
      class:rotate-45={open}
      class="material-symbols-rounded ml-2 text-2xl! transition-transform duration-150"
      >add</i>
  </button>

  <div use:accordion={open}>
    <div class="overflow-hidden text-base transition-all">
      {@render children?.()}
    </div>
  </div>
</div>
