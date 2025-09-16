<script>
  import { accordion } from "root/src/lib/utils/accordion";

  /**
   * @typedef {Object} Props
   * @property {boolean} [isOpen]
   * @property {string} [name]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { isOpen = $bindable(false), name = "Accordion Heading", children } = $props();

  const toggle = () => (isOpen = !isOpen);
</script>

<div>
  <button
    onclick={toggle}
    class="flex w-full flex-1 cursor-pointer items-center py-2 text-left text-sm font-medium">
    {name}
    <i
      class:rotate-180={isOpen}
      class="material-symbols-rounded ml-2 !text-lg transition-transform duration-150"
      >expand_more</i>
  </button>

  <div use:accordion={isOpen}>
    <div class="overflow-hidden text-base transition-all">
      {@render children?.()}
    </div>
  </div>
</div>
