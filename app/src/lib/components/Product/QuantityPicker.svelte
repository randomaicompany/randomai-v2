<script>
  export let quantity = 1;
</script>

<div class="w-full">
  <div class="flex items-center w-full gap-2">
    <button
      on:click="{() => quantity >= 2 && (quantity = quantity - 1)}"
      class="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100"
      type="button">
      <svg
        class="w-2 h-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 2">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M1 1h16"></path>
      </svg>
    </button>
    <div>
      <p
        class="flex items-center justify-center h-8 px-2 overflow-hidden text-sm text-gray-900 rounded-full outline-none min-w-8 bg-gray-50 text-ellipsis">
        {quantity}
      </p>
      <input
        type="number"
        bind:value="{quantity}"
        class="hidden"
        placeholder="1"
        min="1"
        required />
    </div>
    <button
      on:click="{() => (quantity = quantity + 1)}"
      class="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100"
      type="button">
      <span class="sr-only">Quantity button</span>
      <svg
        class="w-2 h-2"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 16 16">
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M9 1v16M1 9h16"></path>
      </svg>
    </button>
  </div>
</div>
