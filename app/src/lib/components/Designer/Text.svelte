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

    { label: "Pacifico", value: '"Pacifico", cursive' },
    { label: "Rubik Doodle Shadow", value: '"Rubik Doodle Shadow", cursive' },
    { label: "Fredericka the Great", value: '"Fredericka the Great", cursive' },
    { label: "Amatic SC", value: '"Amatic SC", cursive' },
    { label: "Monoton", value: '"Monoton", cursive' },
    { label: "Dancing Script", value: '"Dancing Script", cursive' },
    { label: "Bebas Neue", value: '"Bebas Neue", cursive' },
    { label: "Raleway", value: '"Raleway", sans-serif' },
    { label: "Playfair Display", value: '"Playfair Display", serif' },
    { label: "Cinzel", value: '"Cinzel", serif' },
    { label: "Great Vibes", value: '"Great Vibes", cursive' },
    { label: "Abril Fatface", value: '"Abril Fatface", cursive' },
    { label: "Alfa Slab One", value: '"Alfa Slab One", serif' },
    { label: "Comfortaa", value: '"Comfortaa", cursive' },
    { label: "Satisfy", value: '"Satisfy", cursive' },
    {
      label: "Anton", value: '"Anton", sans-serif'
    },
    {
      label: "Architects Daughter", value: '"Architects Daughter", cursive'
    },
    {
      label: "Baloo 2", value: '"Baloo 2", cursive'
    },
    {
      label: "Barlow Condensed", value: '"Barlow Condensed", sans-serif'
    },
    {
      label: "Black Ops One", value: '"Black Ops One", cursive'
    },
    {
      label: "Bree Serif", value: '"Bree Serif", serif'
    },
    {
      label: "Caveat", value: '"Caveat", cursive'
    },
    {
      label: "Chewy", value: '"Chewy", cursive'
    },
    {
      label: "Chivo", value: '"Chivo", sans-serif'
    },
    {
      label: "Coda Caption", value: '"Coda Caption", sans-serif'
    },
    {
      label: "Dosis", value: '"Dosis", sans-serif'
    },
    {
      label: "Exo 2", value: '"Exo 2", sans-serif'
    },
    {
      label: "Fjalla One", value: '"Fjalla One", sans-serif'
    },
    {
      label: "Fugaz One", value: '"Fugaz One", cursive'
    },
    {
      label: "Gloria Hallelujah", value: '"Gloria Hallelujah", cursive'
    },
    {
      label: "Gruppo", value: '"Gruppo", cursive'
    },
    {
      label: "Handlee", value: '"Handlee", cursive'
    },
    {
      label: "Hind Madurai", value: '"Hind Madurai", sans-serif'
    },
    {
      label: "Indie Flower", value: '"Indie Flower", cursive'
    },
    {
      label: "Josefin Sans", value: '"Josefin Sans", sans-serif'
    },
    {
      label: "Kalam", value: '"Kalam", cursive'
    },
    {
      label: "Kanit", value: '"Kanit", sans-serif'
    },
    {
      label: "Knewave", value: '"Knewave", cursive'
    },
    {
      label: "Lato", value: '"Lato", sans-serif'
    },
    {
      label: "Lilita One", value: '"Lilita One", cursive'
    },
    {
      label: "Lora", value: '"Lora", serif'
    },
    {
      label: "Merriweather", value: '"Merriweather", serif'
    },
    {
      label: "Mochiy Pop One", value: '"Mochiy Pop One", sans-serif'
    },
    {
      label: "Mukta", value: '"Mukta", sans-serif'
    },
    {
      label: "Neucha", value: '"Neucha", cursive'
    },
    {
      label: "Noto Sans", value: '"Noto Sans", sans-serif'
    },
    {
      label: "Oswald", value: '"Oswald", sans-serif'
    },
    {
      label: "Patua One", value: '"Patua One", cursive'
    },
    {
      label: "Permanent Marker", value: '"Permanent Marker", cursive'
    },
    {
      label: "Poppins", value: '"Poppins", sans-serif'
    },
    {
      label: "Press Start 2P", value: '"Press Start 2P", cursive'
    },
    {
      label: "Quicksand", value: '"Quicksand", sans-serif'
    },
    {
      label: "Righteous", value: '"Righteous", cursive'
    },
    {
      label: "Sacramento", value: '"Sacramento", cursive'
    },
    {
      label: "Titan One", value: '"Titan One", cursive'
    },
    {
      label: "Zilla Slab", value: '"Zilla Slab", serif'
    }
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
    href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alfa+Slab+One&family=Amatic+SC&family=Anton&family=Architects+Daughter&family=Baloo+2&family=Barlow+Condensed&family=Bebas+Neue&family=Black+Ops+One&family=Bree+Serif&family=Bungee+Spice&family=Caveat&family=Chewy&family=Chivo&family=Cinzel&family=Coda+Caption&family=Comfortaa&family=Creepster&family=Dancing+Script&family=Dosis&family=Exo+2&family=Fjalla+One&family=Fredericka+the+Great&family=Fugaz+One&family=Gloria+Hallelujah&family=Great+Vibes&family=Gruppo&family=Handlee&family=Hind+Madurai&family=Indie+Flower&family=Jacquard+24&family=Jersey+25&family=Josefin+Sans&family=Kalam&family=Kanit&family=Knewave&family=Lato&family=Lilita+One&family=Lobster&family=Lora&family=Luckiest+Guy&family=Monoton&family=Merriweather&family=Mochiy+Pop+One&family=Mukta&family=Neucha&family=Noto+Sans&family=Orbitron:wght@400..900&family=Oswald&family=Pacifico&family=Patua+One&family=Permanent+Marker&family=Playfair+Display&family=Poppins&family=Press+Start+2P&family=Quicksand&family=Raleway&family=Righteous&family=Rubik+Doodle+Shadow&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Titan+One&family=Zilla+Slab&display=swap"
    rel="stylesheet"
  />  
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

      <div class="flex justify-end mt-8 text-right">
        <button type="submit" class="button"> Add This Text </button>
      </div>
    </div>
  </form>
</div>
