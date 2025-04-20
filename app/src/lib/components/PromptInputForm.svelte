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

  export let tempPromt = "";
  export let prompt = "";

  $: if (!prompt && tempPromt) {
    prompt = tempPromt;
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

  const debouncedInput = debounce(handleInput, 3000);
  const toggleStickerMode = () => (isStickerModeEnabled = !isStickerModeEnabled);
</script>

<form class:opacity-50="{isLoading}" class="flex flex-col gap-4">
  {#if RA.isNonEmptyArray(stylePresets)}
    <div>
      <label class="input-field-container block w-full">
        <p class="text-sm font-medium mb-2">Style</p>
        <select bind:value="{stylePreset}" class="input-field md:text-sm text-base px-2 w-full">
          {#each stylePresets as { name, ...rest }, idx}
            <option selected="{idx}" value="{JSON.stringify({ name, ...rest })}">{name}</option>
          {/each}
        </select>
      </label>
    </div>
  {/if}

  <label class="input-field-container !flex items-start gap-4 flex-1">
    <textarea
      required
      rows="1"
      maxlength="700"
      disabled="{isLoading}"
      bind:value="{prompt}"
      class:!pr-64="{buttonText}"
      class:!pr-28="{!buttonText}"
      placeholder="Please enter your prompt"
      class="input-field block min-h-[6rem] !pr-24 py-2 pt-3 w-full md:text-[14px] focus:border-brand-secondary resize-none {className}"
    ></textarea>

    <div class="absolute flex items-center h-8 gap-3 text-sm bottom-4 right-4">
      {#if isLoading}
        <div
          style="animation-duration:0.3s;"
          class="w-5 h-5 bg-transparent border-2 rounded-full animate-spin border-r-transparent border-brand-accent">
        </div>
      {:else}
        <button
          on:click="{() => generate(prompt)}"
          class:hidden="{!prompt}"
          class="flex items-center justify-center relative group bg-[#fccc26] w-8 h-8 rounded-full ring-1 ring-offset-2 ring-[#fccc26] hover:ring-offset-4 transition-all hover:opacity-80">
          <svg
            class="object-contain w-6 h-6 rounded-full"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            zoomAndPan="magnify"
            viewBox="0 0 705 591.000005"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
            ><defs
              ><g></g><clipPath id="92473ccd86"
                ><path
                  d="M 0.59375 0 L 704.402344 0 L 704.402344 590 L 0.59375 590 Z M 0.59375 0 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="3977bb2470"
                ><path d="M 160 356 L 200 356 L 200 409 L 160 409 Z M 160 356 " clip-rule="nonzero"
                ></path
                ></clipPath
              ><clipPath id="ee3e2d39e7"
                ><path
                  d="M 144.378906 368.4375 L 184.023438 345.792969 L 219.25 407.460938 L 179.605469 430.105469 Z M 144.378906 368.4375 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="fe59c4f877"
                ><path
                  d="M 70.441406 410.671875 L 184.96875 345.253906 L 235.289062 433.355469 L 120.757812 498.769531 Z M 70.441406 410.671875 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="d02b99555d"
                ><path d="M 137 140 L 217 140 L 217 245 L 137 245 Z M 137 140 " clip-rule="nonzero"
                ></path
                ></clipPath
              ><clipPath id="6693bec0c7"
                ><path
                  d="M 105.925781 164.824219 L 185.214844 119.535156 L 258.175781 247.277344 L 178.886719 292.566406 Z M 105.925781 164.824219 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="cb22935dd2"
                ><path
                  d="M -41.957031 249.289062 L 187.097656 118.457031 L 287.738281 294.65625 L 58.683594 425.488281 Z M -41.957031 249.289062 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="87e41946b6"
                ><path d="M 477 314 L 557 314 L 557 418 L 477 418 Z M 477 314 " clip-rule="nonzero"
                ></path
                ></clipPath
              ><clipPath id="853e1f01fe"
                ><path
                  d="M 445.277344 338.53125 L 524.566406 293.242188 L 597.53125 420.988281 L 518.242188 466.273438 Z M 445.277344 338.53125 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="2b54e1f09d"
                ><path
                  d="M 297.394531 422.996094 L 526.453125 292.167969 L 627.09375 468.363281 L 398.035156 599.195312 Z M 297.394531 422.996094 "
                  clip-rule="nonzero"></path
                ></clipPath
              ><clipPath id="791540a78d"
                ><path
                  d="M 305.328125 363.125 L 421.5 363.125 L 421.5 414.355469 L 305.328125 414.355469 Z M 305.328125 363.125 "
                  clip-rule="nonzero"></path
                ></clipPath
              ></defs
            ><g clip-path="url(#92473ccd86)"
              ><path
                fill="#ffffff"
                d="M 0.59375 0 L 704.40625 0 L 704.40625 590 L 0.59375 590 Z M 0.59375 0 "
                fill-opacity="1"
                fill-rule="nonzero"></path
              ><path
                fill="#fbcc26"
                d="M 0.59375 0 L 704.40625 0 L 704.40625 590 L 0.59375 590 Z M 0.59375 0 "
                fill-opacity="1"
                fill-rule="nonzero"></path
              ></g
            ><g clip-path="url(#3977bb2470)"
              ><g clip-path="url(#ee3e2d39e7)"
                ><g clip-path="url(#fe59c4f877)"
                  ><path
                    fill="#ffffff"
                    d="M 198.066406 370.722656 C 183.207031 379.078125 179.191406 378.808594 166.539062 356.917969 C 166.300781 356.503906 165.773438 356.359375 165.367188 356.59375 C 164.957031 356.828125 164.8125 357.355469 165.046875 357.769531 C 177.476562 379.789062 175.667969 383.386719 160.921875 391.941406 C 160.398438 392.242188 160.210938 392.914062 160.511719 393.433594 C 160.808594 393.957031 161.480469 394.140625 162.007812 393.84375 C 176.867188 385.484375 180.882812 385.753906 193.535156 407.648438 C 193.773438 408.058594 194.300781 408.203125 194.707031 407.96875 C 195.117188 407.734375 195.261719 407.207031 195.027344 406.796875 C 182.597656 384.773438 184.40625 381.179688 199.152344 372.625 C 199.679688 372.320312 199.863281 371.648438 199.5625 371.128906 C 199.265625 370.605469 198.59375 370.425781 198.066406 370.722656 Z M 198.066406 370.722656 "
                    fill-opacity="1"
                    fill-rule="nonzero"></path
                  ></g
                ></g
              ></g
            ><g clip-path="url(#d02b99555d)"
              ><g clip-path="url(#6693bec0c7)"
                ><g clip-path="url(#cb22935dd2)"
                  ><path
                    fill="#ffffff"
                    d="M 213.378906 169.375 C 183.648438 186.097656 175.617188 185.554688 150.300781 141.757812 C 149.828125 140.933594 148.773438 140.644531 147.957031 141.113281 C 147.136719 141.582031 146.847656 142.636719 147.316406 143.460938 C 172.183594 187.519531 168.566406 194.710938 139.0625 211.824219 C 138.015625 212.433594 137.644531 213.773438 138.242188 214.816406 C 138.835938 215.859375 140.179688 216.222656 141.238281 215.628906 C 170.964844 198.910156 178.996094 199.449219 204.3125 243.25 C 204.785156 244.070312 205.839844 244.359375 206.660156 243.890625 C 207.476562 243.425781 207.765625 242.371094 207.300781 241.546875 C 182.433594 197.488281 186.050781 190.296875 215.554688 173.183594 C 216.601562 172.574219 216.96875 171.230469 216.375 170.1875 C 215.777344 169.144531 214.4375 168.785156 213.378906 169.375 Z M 213.378906 169.375 "
                    fill-opacity="1"
                    fill-rule="nonzero"></path
                  ></g
                ></g
              ></g
            ><g clip-path="url(#87e41946b6)"
              ><g clip-path="url(#853e1f01fe)"
                ><g clip-path="url(#2b54e1f09d)"
                  ><path
                    fill="#ffffff"
                    d="M 552.734375 343.085938 C 523.003906 359.804688 514.972656 359.265625 489.65625 315.464844 C 489.179688 314.640625 488.128906 314.355469 487.308594 314.824219 C 486.488281 315.292969 486.203125 316.34375 486.671875 317.171875 C 511.535156 361.226562 507.917969 368.421875 478.417969 385.53125 C 477.367188 386.140625 477 387.480469 477.59375 388.523438 C 478.191406 389.566406 479.535156 389.933594 480.589844 389.339844 C 510.320312 372.621094 518.351562 373.160156 543.667969 416.960938 C 544.140625 417.78125 545.195312 418.066406 546.011719 417.597656 C 546.832031 417.132812 547.121094 416.078125 546.652344 415.253906 C 521.785156 371.195312 525.402344 364.003906 554.90625 346.890625 C 555.957031 346.28125 556.324219 344.941406 555.726562 343.898438 C 555.132812 342.855469 553.789062 342.492188 552.734375 343.085938 Z M 552.734375 343.085938 "
                    fill-opacity="1"
                    fill-rule="nonzero"></path
                  ></g
                ></g
              ></g
            ><g clip-path="url(#791540a78d)"
              ><path
                fill="#ffffff"
                d="M 305.328125 363.125 L 421.398438 363.125 L 421.398438 414.355469 L 305.328125 414.355469 Z M 305.328125 363.125 "
                fill-opacity="1"
                fill-rule="nonzero"></path
              ></g
            ><g fill="#ffffff" fill-opacity="1"
              ><g transform="translate(204.649082, 462.198189)"
                ><g
                  ><path
                    d="M 162.5 -129.453125 L 104.4375 -129.453125 L 104.4375 0 L 31.578125 0 L 31.578125 -353.640625 L 162.984375 -353.640625 C 204.753906 -353.640625 236.972656 -344.328125 259.640625 -325.703125 C 282.316406 -307.085938 293.65625 -280.78125 293.65625 -246.78125 C 293.65625 -222.644531 288.429688 -202.519531 277.984375 -186.40625 C 267.546875 -170.300781 251.71875 -157.472656 230.5 -147.921875 L 307.015625 -3.40625 L 307.015625 0 L 228.796875 0 Z M 104.4375 -188.484375 L 163.21875 -188.484375 C 181.519531 -188.484375 195.6875 -193.140625 205.71875 -202.453125 C 215.757812 -211.765625 220.78125 -224.597656 220.78125 -240.953125 C 220.78125 -257.628906 216.046875 -270.742188 206.578125 -280.296875 C 197.109375 -289.847656 182.578125 -294.625 162.984375 -294.625 L 104.4375 -294.625 Z M 104.4375 -188.484375 "
                  ></path
                  ></g
                ></g
              ></g
            ></svg>

          <p
            class="absolute px-2 text-xs text-white transition-opacity delay-300 opacity-0 select-none right-[-50%] bg-brand-black whitespace-nowrap -top-8 group-hover:opacity-100">
            Generate
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
        <i class:!animate-spin="{isLoading}" class="material-symbols-sharp !text-[21.5px]">refresh</i>
        {#if isLoading}
          <span>Generating...</span>
        {:else}
          <span> Re-Generate </span>
        {/if}
      </button>
    </div>
    {/if} -->
</form>
