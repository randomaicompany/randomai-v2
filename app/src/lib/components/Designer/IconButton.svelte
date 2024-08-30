<script>
  export let label = "";
  export let iconName = "";
  export let className = "";
</script>

<button
  on:click
  class="relative flex items-center justify-center w-8 h-8 transition-all bg-white border rounded-full outline-none group hover:bg-gray-100 active:bg-gray-200 {className}">
  <i class="material-symbols-rounded !text-xl">{iconName}</i>

  {#if label}
    <p
      class="opacity-0 group-hover:opacity-100 absolute md:top-1.5 -top-6 md:left-full left-auto select-none pointer-events-none whitespace-nowrap text-xs bg-gray-800 text-white p-1 pb-[5px] leading-none px-2 rounded-xl z-[1] transition-all">
      {label}
    </p>
  {/if}
</button>
