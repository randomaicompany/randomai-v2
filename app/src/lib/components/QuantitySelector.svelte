<script>
  let quantity = 1;

  const increment = () => (quantity = quantity + 1);
  const decrement = () => (quantity = quantity - 1);
</script>

<div class="flex w-28 items-center justify-between">
  <button
    on:click={decrement}
    class="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full border active:bg-brand-smoke-darker">
    <i class="material-symbols-rounded !text-lg">remove</i>
  </button>

  <input
    type="number"
    min="1"
    bind:value={quantity}
    class="w-24 appearance-none overflow-hidden border-none pl-4 text-center text-sm outline-none" />

  <button
    on:click={increment}
    class="flex h-8 w-8 min-w-[2rem] items-center justify-center rounded-full border active:bg-brand-smoke-darker">
    <i class="material-symbols-rounded !text-lg">add</i>
  </button>
</div>
