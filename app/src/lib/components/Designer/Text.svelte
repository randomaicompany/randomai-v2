<script>
  import { clickOutside } from "root/src/lib/utils/common";
  import { changeFontFamily, addTextToCanvas, changeActiveColor } from "root/src/lib/api/fabric";

  let textInput = "";
  let textColor = "black";
  // let fontFamily = "Arial";
  export let canvas;
  export let fontFamily = { label: "inherit", value: "inherit" };

  let fonts = [
    "Arial",
    "Arial Black",
    "Courier New",
    "Georgia",
    "Impact",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ];

  const toggleFontDropdown = () => (isFontDropdownOpen = !isFontDropdownOpen);
  const closeFontDropdown = () => (isFontDropdownOpen = false);
  const fontFamilyList = [
    {
      label: "Creepster",
      value: '"Creepster", system-ui',
    },
    {
      label: "Luckiest Guy",
      value: '"Luckiest Guy", cursive',
    },

    {
      label: "Orbitron",
      value: '"Orbitron", sans-serif',
    },

    {
      label: "Shadows Into Light",
      value: '"Shadows Into Light", cursive',
    },

    {
      label: "Lobster",
      value: '"Lobster", sans-serif;',
    },

    {
      label: "Jacquard 24",
      value: '"Jacquard 24", system-ui',
    },

    {
      label: "Jersey 25",
      value: '"Jersey 25", sans-serif',
    },

    {
      label: "Bungee Spice",
      value: '"Bungee Spice", sans-serif',
    },
  ];

  let isFontDropdownOpen = false;

  const setFontFamily =
    ({ label, value }) =>
    () => {
      fontFamily = { label, value };
      changeFontFamily(canvas, fontFamily.value);
      closeFontDropdown();
    };

  const addText = () => {
    if (!textInput) return;

    console.log(textColor);
    addTextToCanvas(canvas, { textColor, textInput, fontFamily: fontFamily.value });
    textInput = "";
    fontFamily = { label: "inherit", value: "inherit" };
    return;
  };

  $: textColor, textColor && canvas && changeColor(textColor);
  const changeColor = () => {
    changeActiveColor(canvas, textColor);
    return;
  };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap"
    rel="stylesheet" />

  <link
    href="https://fonts.googleapis.com/css2?family=Bungee+Spice&family=Creepster&family=Honk:MORF@45&family=Jacquard+24&family=Jersey+25&family=Lobster&family=Luckiest+Guy&family=Orbitron:wght@400..900&family=Shadows+Into+Light&display=swap"
    rel="stylesheet" />
</svelte:head>

<div>
  <h2 class="mb-2 font-medium">Preview</h2>
  <div class="p-4 mt-4 border-2 border-gray-400 border-dashed">
    {#if textInput}
      {#key textInput || fontFamily.value || textColor}
        <p
          class="overflow-hidden text-xl break-words"
          style="font-family:{fontFamily.value}; color:{textColor};">
          {textInput}
        </p>
      {/key}
    {:else}
      <p style="font-family: {fontFamily};" class="overflow-hidden text-xl text-gray-400">
        Enter your text to preview here...
      </p>
    {/if}
  </div>
</div>

<div>
  <p class="mt-8 mb-2 text-sm">Enter your text</p>
  <form on:submit|preventDefault="{addText}">
    <div class="relative flex-1">
      <textarea
        rows="2"
        bind:value="{textInput}"
        maxlength="40"
        required
        placeholder="Enter text you want to print"
        class="min-w-[16rem] resize-none py-4 font-normal border-gray-400 md:text-sm text-base border outline-none focus:border px-4 w-full"
      ></textarea>

      <input
        type="color"
        bind:value="{textColor}"
        class="absolute block cursor-pointer w-7 h-7 top-2 right-4" />
    </div>

    <div class="mt-4 text-right">
      <!-- <div class="inline-flex items-center bg-brand-smoke-darker">
        <select
          class="h-10 px-4 text-base bg-transparent outline-none appearance-none md:text-sm"
          bind:value="{fontFamily}"
          on:change="{() => changeFont(fontFamily, canvas)}">
          <option value="inherit">Default Font</option>
          {#each fonts as font}
            <option value="{font}">{font}</option>
          {/each}
        </select>
        <i class="material-symbols-rounded !text-lg mr-4">expand_more</i>
      </div> -->

      <div class="relative" use:clickOutside on:clickOutside="{closeFontDropdown}">
        <button
          type="button"
          on:click="{toggleFontDropdown}"
          class="flex items-center justify-between w-full gap-4 py-3 pl-4 pr-3 font-medium border border-gray-400 cursor-pointer h-14">
          {#if fontFamily.label.match("fontFamily")}
            <p>Select a Font</p>
          {:else}
            <p class="text-lg" style="font-family: {fontFamily.value};">{fontFamily.label}</p>
          {/if}

          <i class="material-symbols-rounded !text-xl">expand_more</i>
        </button>

        {#if isFontDropdownOpen}
          <ul
            class="absolute left-0 w-full h-64 overflow-auto bg-white border border-gray-400 shadow-2xl top-full">
            {#each fontFamilyList as { label, value }}
              <li>
                <button
                  on:click="{setFontFamily({ label, value })}"
                  class="w-full p-4 text-left hover:bg-stone-100">
                  <p class="text-xl" style="font-family: {value};">{label}</p>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="flex justify-end mt-16 text-right">
        <button type="submit" class="button"> Add This Text </button>
      </div>
    </div>
  </form>
</div>
