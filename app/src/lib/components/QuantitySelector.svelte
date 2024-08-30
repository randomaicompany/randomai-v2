<script>
  let quantity = 1;

  const increment = () => (quantity = quantity + 1);
  const decrement = () => (quantity = quantity - 1);
</script>

<div class="flex items-center justify-between w-28">
  <button
    on:click="{decrement}"
    class="flex items-center justify-center w-8 min-w-[2rem] h-8 border rounded-full active:bg-brand-smoke-darker">
    <i class="material-symbols-rounded !text-lg">remove</i>
  </button>

  <input
    type="number"
    min="1"
    bind:value="{quantity}"
    class="w-24 pl-4 overflow-hidden text-sm text-center border-none outline-none appearance-none" />

  <button
    on:click="{increment}"
    class="flex items-center justify-center w-8 min-w-[2rem] h-8 border rounded-full active:bg-brand-smoke-darker">
    <i class="material-symbols-rounded !text-lg">add</i>
  </button>
</div>
