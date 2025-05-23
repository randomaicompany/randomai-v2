<script>
  export let aiSettings = {};
  export let promptSuggestions = [];
  export let stylePresets = [];
  import * as RA from "ramda-adjunct";
  import * as R from "ramda";
  import debounce from "debounce";
  //
  import { createEventDispatcher } from "svelte";
  import { consecutiveUniqueRandom } from "unique-random";

  let className = "";
  export { className as class };
  export let buttonText = "";
  export let iconName = "model_training";

  export let imageUrl = "";
  export let isLoading = false;

  let hasInitializedPrompt = false;
  export let tempPromt = "";
  export let prompt = "";

  $: if (!hasInitializedPrompt && !prompt?.trim() && tempPromt?.trim()) {
    console.log("Setting prompt from tempPromt:", tempPromt);
    prompt = tempPromt;
    hasInitializedPrompt = true;
  }

  let stylePreset = JSON.stringify(R.head(stylePresets));

  const dispatch = createEventDispatcher();
  const random = consecutiveUniqueRandom(0, R.dec(R.length(promptSuggestions)));

  const generate = async (prompt = "") => {
    const cleanPrompt = prompt.trim();
    const { prefix, suffix } = JSON.parse(stylePreset);

    if (!cleanPrompt) return;
    isLoading = true;

    const finalPrompt = prefix + prompt + suffix;
    localStorage.setItem("tempPromt", prompt);

    const response = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        ...aiSettings,
        prompt: finalPrompt,
      }),
    });

    const imageResponse = await response.json();

    imageUrl = R.prop("src", imageResponse);
    isLoading = false;
    localStorage.setItem("imageUrl", imageUrl);
    dispatch("generate", imageUrl);
    return imageUrl;
  };

  const suggestPrompt = () => {
    const randomIdx = random();
    const suggestedPrompt = promptSuggestions[randomIdx];
    prompt = suggestedPrompt;
    generate(prompt);
  };

  const handleInput = () => {
    if (!prompt.trim()) return;
    generate(prompt);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && prompt.trim()) {
        generate(prompt);
      }
    }
  };

  const debouncedInput = debounce(handleInput, 3000);
  const toggleStickerMode = () =>
    (isStickerModeEnabled = !isStickerModeEnabled);
</script>

<form
  class:opacity-50={isLoading}
  class="flex flex-col gap-4 relative"
  on:submit|preventDefault={() => generate(prompt)}
>
  {#if RA.isNonEmptyArray(stylePresets)}
    <div>
      <label class="input-field-container block w-full">
        <p class="text-sm font-medium mb-2">Style</p>
        <select
          bind:value={stylePreset}
          class="input-field border border-gray-200 md:text-sm text-base px-2 w-full"
        >
          {#each stylePresets as { name, ...rest }, idx}
            <option selected={idx} value={JSON.stringify({ name, ...rest })}
              >{name}</option
            >
          {/each}
        </select>
      </label>
    </div>
  {/if}

  <label
    class="input-field-container items-start gap-4 flex-1 input-box input-field shadow-bordered block min-h-[10em] py-2 pt-3 w-full text-[14px]"
  >
    <textarea
      required
      rows="1"
      maxlength="700"
      disabled={isLoading}
      bind:value={prompt}
      on:keydown={handleKeyDown}
      placeholder="Enter your prompt to generate an image"
      class="w-full resize-none font-light mb-10 outline-none ring-0 focus:ring-0 focus:outline-none border-none focus:border-none min-h-[5rem] {className}"
    ></textarea>

    <div
      class="absolute flex items-center h-8 gap-3 text-sm bottom-2 md:bottom-4 left-[115px] md:left-[130px] mt-5"
    >
      {#if isLoading}
        <div
          style="animation-duration:0.3s;"
          class="w-5 h-5 bg-transparent border-2 rounded-full animate-spin border-r-transparent border-brand-accent"
        ></div>
      {:else}
        <button
          on:click={() => generate(prompt)}
          disabled={!prompt}
          class="flex items-center justify-center relative group bg-[#fccc26] hover:ring-offset-4 transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p
            class="flex items-center gap-1 absolute right-0 px-3 py-1 md:py-[6px] font-medium rounded-full text-[12px] md:text-[14px] text-white transition-opacity delay-300 bg-[#fccc26] whitespace-nowrap"
          >
            <span class="flex items-center justify-center w-4 h-4 md:w-5">
              <img
                src="/magic-wand.png"
                alt="Magic Wand"
                class="w-4 h-4 invert object-contain"
              />
            </span>
            Generate
          </p>
        </button>

        <button
          on:click
          type="button"
          disabled={isLoading}
          class:!pl-2={buttonText}
          on:click={suggestPrompt}
          class="relative flex items-center justify-center w-6 h-6 gap-2 transition-all rounded-full group ring-offset-2 ring-gray-200 hover:ring-offset-4 text-brand-green ring-1 hover:bg-brand-green hover:text-white hover:ring-brand-green"
        >
          {#if buttonText}
            <p class="text-[13px]">{buttonText}</p>
          {/if}
          <i class="material-symbols-sharp !text-[21.5px]">{iconName}</i>
          <p
            class="absolute px-2 py-1 rounded-sm text-xs text-white transition-opacity delay-300 opacity-0 select-none bg-brand-green whitespace-nowrap -bottom-8 group-hover:opacity-100"
          >
            Random Prompt
          </p>
        </button>
      {/if}
    </div>
  </label>

  <!-- {#if prompt}
    <div class="pt-4">
      <button
        type="button"
        disabled="{isLoading}"
        on:click="{() => generate(prompt)}"
        class:pointer-events-none="{isLoading}"
        class="gap-2 button button-gradient-bg-var-5 button-compact">
        <i class:!animate-spin="{isLoading}" class="material-symbols-sharp !text-[21.5008px]">refresh</i>
        {#if isLoading}
          <span>Generating...</span>
        {:else}
          <span> Re-Generate </span>
        {/if}
      </button>
    </div>
    {/if} -->
</form>
