<script>
  import { onDestroy } from "svelte";
  import { activeLabelButtonId } from "../../stores/icon-bottom";

  export let label = "";
  export let iconName = "";
  export let className = "";
  export let isbackground = false;

  const id = Math.random().toString(36).substring(2, 9);

  let currentActiveButtonId = null;
  const unsubscribe = activeLabelButtonId.subscribe((value) => {
    currentActiveButtonId = value;
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    if (currentActiveButtonId === id) {
      activeLabelButtonId.set(null);
    }
  });

  function handleInteractionStart() {
    activeLabelButtonId.set(id);
  }

  function handleInteractionEnd() {
    if (currentActiveButtonId === id) {
      activeLabelButtonId.set(null);
    }
  }

  $: restingLabelClasses = (() => {
    if (isbackground) {
      const anotherButtonIsActive =
        currentActiveButtonId !== null && currentActiveButtonId !== id;

      if (anotherButtonIsActive) {
        return "opacity-0";
      } else {
        return "opacity-100 translate-y-2 md:opacity-0 md:translate-y-3";
      }
    } else {
      return "opacity-0";
    }
  })();
</script>

<button
  on:click
  on:mouseenter={handleInteractionStart}
  on:mouseleave={handleInteractionEnd}
  on:focus={handleInteractionStart}
  on:blur={handleInteractionEnd}
  class="group relative flex h-8 w-8 items-center justify-center rounded-full border bg-white outline-none transition-all hover:border-brand-accent hover:bg-brand-accent hover:text-white active:bg-gray-200 {className}">
  <i class="material-symbols-rounded !text-xl">{iconName}</i>

  {#if label}
    <p
      class="duration-400 pointer-events-none absolute left-[50%] top-[-45px] z-[1] -translate-x-1/2 translate-y-3 select-none whitespace-nowrap rounded-xl border border-brand-accent bg-brand-accent p-1 px-2 pb-[5px] text-xs leading-none text-white transition-all
             group-hover:translate-y-1 group-hover:opacity-100
             group-focus:translate-y-1 group-focus:opacity-100
             {restingLabelClasses}">
      {label}
    </p>
  {/if}
</button>

<!-- <script>
  export let label = "";
  export let iconName = "";
  export let className = "";
  export let isbackground;
</script>

<button
  on:click
  class="relative flex items-center justify-center w-8 h-8 transition-all bg-white border rounded-full outline-none group hover:bg-brand-accent hover:border-brand-accent hover:text-white active:bg-gray-200 {className}">
  <i class="material-symbols-rounded !text-xl">{iconName}</i>

  {#if label}
    <p
      class={`mobile-label group-hover:opacity-100 group-hover:translate-y-1 absolute select-none pointer-events-none whitespace-nowrap text-xs border border-brand-accent bg-brand-accent text-white p-1 pb-[5px] leading-none px-2 rounded-xl z-[1] transition-all duration-400 translate-y-3 left-[50%] top-[-45px] -translate-x-1/2 ${isbackground ? 'opacity-1 translate-y-2 md:opacity-0' : 'opacity-0'}`}>
      {label}
    </p>
  {/if}
</button> -->
