<script>
  export let label = "";
  export let iconName = "";
  export let className = "";
  export let isbackground;
</script>

<button
  on:click
  class="relative flex items-center justify-center w-8 h-8 transition-all bg-white border rounded-full outline-none group hover:bg-gray-100 active:bg-gray-200 {className}">
  <i class="material-symbols-rounded !text-xl">{iconName}</i>

  {#if label}
    <p
      class={`group-hover:opacity-100 group-hover:translate-y-1 absolute select-none pointer-events-none whitespace-nowrap text-sm border bg-white text-brand-primary p-1 pb-[5px] leading-none px-2 rounded-xl z-[1] transition-all duration-400 translate-y-3 left-[50%] top-[-45px] -translate-x-1/2 ${isbackground ? 'opacity-1 translate-y-2 md:opacity-0' : 'opacity-0'}`}>
      {label}
    </p>
  {/if}
</button>
