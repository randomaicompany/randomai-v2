<script>
	import { run, preventDefault } from 'svelte/legacy';

	import { clickOutside } from 'root/src/lib/utils/common';
	import { changeFontFamily, addTextToCanvas, changeActiveColor } from 'root/src/lib/api/fabric';

	let textInput = $state('');
	let textColor = $state('black');

	/**
	 * @typedef {Object} Props
	 * @property {any} canvas - let fontFamily = "Arial";
	 * @property {any} [fontFamily]
	 */

	/** @type {Props} */
	let { canvas, fontFamily = $bindable({ label: 'inherit', value: 'inherit' }) } = $props();

	const toggleFontDropdown = () => (isFontDropdownOpen = !isFontDropdownOpen);
	const closeFontDropdown = () => (isFontDropdownOpen = false);
	const fontFamilyList = [
		// ... your existing fonts
		{
			label: 'Creepster',
			value: '"Creepster", system-ui'
		},
		{
			label: 'Luckiest Guy',
			value: '"Luckiest Guy", cursive'
		},
		{
			label: 'Orbitron',
			value: '"Orbitron", sans-serif'
		},
		{
			label: 'Shadows Into Light',
			value: '"Shadows Into Light", cursive'
		},
		{
			label: 'Lobster',
			value: '"Lobster", sans-serif;' // Note: you had a semicolon here, it's fine but usually not needed for the value
		},
		{
			label: 'Jacquard 24',
			value: '"Jacquard 24", system-ui'
		},
		{
			label: 'Jersey 25',
			value: '"Jersey 25", sans-serif'
		},
		{
			label: 'Bungee Spice',
			value: '"Bungee Spice", sans-serif'
		},
		{ label: 'Pacifico', value: '"Pacifico", cursive' },
		{ label: 'Rubik Doodle Shadow', value: '"Rubik Doodle Shadow", cursive' },
		{ label: 'Fredericka the Great', value: '"Fredericka the Great", cursive' },
		{ label: 'Amatic SC', value: '"Amatic SC", cursive' },
		{ label: 'Monoton', value: '"Monoton", cursive' },
		{ label: 'Dancing Script', value: '"Dancing Script", cursive' },
		{ label: 'Bebas Neue', value: '"Bebas Neue", cursive' }, // Bebas Neue is typically a sans-serif font
		{ label: 'Raleway', value: '"Raleway", sans-serif' },
		{ label: 'Playfair Display', value: '"Playfair Display", serif' },
		{ label: 'Cinzel', value: '"Cinzel", serif' },
		{ label: 'Great Vibes', value: '"Great Vibes", cursive' },
		{ label: 'Abril Fatface', value: '"Abril Fatface", cursive' }, // Abril Fatface is often considered a display or serif font
		{ label: 'Alfa Slab One', value: '"Alfa Slab One", serif' }, // Alfa Slab One is a display or serif font
		{ label: 'Comfortaa', value: '"Comfortaa", cursive' }, // Comfortaa is a sans-serif font
		{ label: 'Satisfy', value: '"Satisfy", cursive' },
		{
			label: 'Anton',
			value: '"Anton", sans-serif'
		},
		{
			label: 'Architects Daughter',
			value: '"Architects Daughter", cursive'
		},
		{
			label: 'Baloo 2',
			value: '"Baloo 2", cursive' // Baloo 2 is a sans-serif font
		},
		{
			label: 'Barlow Condensed',
			value: '"Barlow Condensed", sans-serif'
		},
		{
			label: 'Black Ops One',
			value: '"Black Ops One", cursive' // Black Ops One is a display font
		},
		{
			label: 'Bree Serif',
			value: '"Bree Serif", serif'
		},
		{
			label: 'Caveat',
			value: '"Caveat", cursive'
		},
		{
			label: 'Chewy',
			value: '"Chewy", cursive'
		},
		{
			label: 'Chivo',
			value: '"Chivo", sans-serif'
		},
		{
			label: 'Coda Caption',
			value: '"Coda Caption", sans-serif'
		},
		{
			label: 'Dosis',
			value: '"Dosis", sans-serif'
		},
		{
			label: 'Exo 2',
			value: '"Exo 2", sans-serif'
		},
		{
			label: 'Fjalla One',
			value: '"Fjalla One", sans-serif'
		},
		{
			label: 'Fugaz One',
			value: '"Fugaz One", cursive' // Fugaz One is a display font
		},
		{
			label: 'Gloria Hallelujah',
			value: '"Gloria Hallelujah", cursive'
		},
		{
			label: 'Gruppo',
			value: '"Gruppo", cursive' // Gruppo is a display or sans-serif font
		},
		{
			label: 'Handlee',
			value: '"Handlee", cursive'
		},
		{
			label: 'Hind Madurai',
			value: '"Hind Madurai", sans-serif'
		},
		{
			label: 'Indie Flower',
			value: '"Indie Flower", cursive'
		},
		{
			label: 'Josefin Sans',
			value: '"Josefin Sans", sans-serif'
		},
		{
			label: 'Kalam',
			value: '"Kalam", cursive'
		},
		{
			label: 'Kanit',
			value: '"Kanit", sans-serif'
		},
		{
			label: 'Knewave',
			value: '"Knewave", cursive' // Knewave is a display font
		},
		{
			label: 'Lato',
			value: '"Lato", sans-serif'
		},
		{
			label: 'Lilita One',
			value: '"Lilita One", cursive' // Lilita One is a display font
		},
		{
			label: 'Lora',
			value: '"Lora", serif'
		},
		{
			label: 'Merriweather',
			value: '"Merriweather", serif'
		},
		{
			label: 'Mochiy Pop One',
			value: '"Mochiy Pop One", sans-serif'
		},
		{
			label: 'Mukta',
			value: '"Mukta", sans-serif'
		},
		{
			label: 'Neucha',
			value: '"Neucha", cursive'
		},
		{
			label: 'Noto Sans',
			value: '"Noto Sans", sans-serif'
		},
		{
			label: 'Oswald',
			value: '"Oswald", sans-serif'
		},
		{
			label: 'Patua One',
			value: '"Patua One", cursive' // Patua One is a display or serif font
		},
		{
			label: 'Permanent Marker',
			value: '"Permanent Marker", cursive'
		},
		{
			label: 'Poppins',
			value: '"Poppins", sans-serif'
		},
		{
			label: 'Press Start 2P',
			value: '"Press Start 2P", cursive' // Press Start 2P is a display font (pixel/bitmap)
		},
		{
			label: 'Quicksand',
			value: '"Quicksand", sans-serif'
		},
		{
			label: 'Righteous',
			value: '"Righteous", cursive' // Righteous is a display font
		},
		{
			label: 'Sacramento',
			value: '"Sacramento", cursive'
		},
		{
			label: 'Titan One',
			value: '"Titan One", cursive' // Titan One is a display font
		},
		{
			label: 'Zilla Slab',
			value: '"Zilla Slab", serif'
		},
		// --- NEW FONTS START HERE ---
		{
			label: 'Montserrat',
			value: '"Montserrat", sans-serif'
		},
		{
			label: 'Roboto Slab',
			value: '"Roboto Slab", serif'
		},
		{
			label: 'Source Sans Pro', // It's Source Sans 3 now, but Pro is still widely available.
			value: '"Source Sans Pro", sans-serif'
		},
		{
			label: 'Nunito',
			value: '"Nunito", sans-serif'
		},
		{
			label: 'PT Sans',
			value: '"PT Sans", sans-serif'
		},
		{
			label: 'Ubuntu',
			value: '"Ubuntu", sans-serif'
		},
		{
			label: 'Open Sans',
			value: '"Open Sans", sans-serif'
		},
		{
			label: 'Yellowtail',
			value: '"Yellowtail", cursive'
		},
		{
			label: 'Kaushan Script',
			value: '"Kaushan Script", cursive'
		},
		{
			label: 'Rock Salt',
			value: '"Rock Salt", cursive'
		},
		{
			label: 'Special Elite',
			value: '"Special Elite", cursive' // Typewriter style
		},
		{
			label: 'Bangers',
			value: '"Bangers", cursive' // Comic style, often considered display
		},
		{
			label: 'Ultra',
			value: '"Ultra", serif' // Chunky slab serif
		},
		{
			label: 'Cormorant Garamond',
			value: '"Cormorant Garamond", serif'
		},
		{
			label: 'Playfair Display SC', // Small Caps version
			value: '"Playfair Display SC", serif'
		},
		{
			label: 'Audiowide',
			value: '"Audiowide", cursive' // Often considered display, futuristic
		},
		{
			label: 'Geo',
			value: '"Geo", sans-serif' // Geometric, display
		},
		{
			label: 'Megrim',
			value: '"Megrim", cursive' // Display, very thin
		},
		{
			label: 'Poiret One',
			value: '"Poiret One", cursive' // Decorative, sans-serif
		},
		{
			label: 'Syncopate',
			value: '"Syncopate", sans-serif' // Wide, display
		},
		{
			label: 'Philosopher',
			value: '"Philosopher", sans-serif' // Has some serif characteristics
		},
		{
			label: 'Quattrocento Sans',
			value: '"Quattrocento Sans", sans-serif'
		},
		{
			label: 'Six Caps',
			value: '"Six Caps", sans-serif' // Very condensed, display
		},
		{
			label: 'Unica One',
			value: '"Unica One", cursive' // Often considered display, sans-serif
		}
	];

	let isFontDropdownOpen = $state(false);

	const setFontFamily =
		({ label, value }) =>
		() => {
			fontFamily = { label, value };
			changeFontFamily(canvas, fontFamily.value);
			closeFontDropdown();
		};

	const addText = () => {
		if (!textInput) return;

		addTextToCanvas(canvas, {
			textColor,
			textInput,
			fontFamily: fontFamily.value
		});
		textInput = '';
		fontFamily = { label: 'inherit', value: 'inherit' };
		return;
	};

	const changeColor = () => {
		changeActiveColor(canvas, textColor);
		return;
	};
	run(() => {
		(textColor, textColor && canvas && changeColor(textColor));
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alfa+Slab+One&family=Amatic+SC&family=Anton&family=Architects+Daughter&family=Audiowide&family=Baloo+2&family=Bangers&family=Barlow+Condensed&family=Bebas+Neue&family=Black+Ops+One&family=Bree+Serif&family=Bungee+Spice&family=Caveat&family=Chewy&family=Chivo&family=Cinzel&family=Coda+Caption&family=Comfortaa&family=Cormorant+Garamond&family=Creepster&family=Dancing+Script&family=Dosis&family=Exo+2&family=Fjalla+One&family=Fredericka+the+Great&family=Fugaz+One&family=Geo&family=Gloria+Hallelujah&family=Great+Vibes&family=Gruppo&family=Handlee&family=Hind+Madurai&family=Indie+Flower&family=Jacquard+24&family=Jersey+25&family=Josefin+Sans&family=Kalam&family=Kanit&family=Kaushan+Script&family=Knewave&family=Lato&family=Lilita+One&family=Lobster&family=Lora&family=Luckiest+Guy&family=Megrim&family=Merriweather&family=Mochiy+Pop+One&family=Monoton&family=Montserrat&family=Mukta&family=Neucha&family=Noto+Sans&family=Nunito&family=Open+Sans&family=Orbitron:wght@400..900&family=Oswald&family=PT+Sans&family=Pacifico&family=Patua+One&family=Permanent+Marker&family=Philosopher&family=Playfair+Display+SC&family=Playfair+Display&family=Poiret+One&family=Poppins&family=Press+Start+2P&family=Quattrocento+Sans&family=Quicksand&family=Raleway&family=Righteous&family=Roboto+Slab&family=Rock+Salt&family=Rubik+Doodle+Shadow&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Six+Caps&family=Source+Sans+Pro&family=Special+Elite&family=Syncopate&family=Titan+One&family=Ubuntu&family=Ultra&family=Unica+One&family=Yellowtail&family=Zilla+Slab&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div>
	<h2 class="mb-2 font-medium">Preview</h2>
	<div class="mt-4 border-2 border-dashed border-gray-400 p-4">
		{#if textInput}
			{#key textInput || fontFamily.value || textColor}
				<p
					class="overflow-hidden break-words text-xl"
					style="font-family:{fontFamily.value}; color:{textColor};"
				>
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
	<p class="mb-2 mt-8 text-sm">Enter your text</p>
	<form onsubmit={preventDefault(addText)}>
		<div class="relative flex-1">
			<textarea
				rows="2"
				bind:value={textInput}
				maxlength="40"
				required
				placeholder="Enter text you want to print"
				class="w-full min-w-[256px] resize-none border border-gray-400 px-4 py-4 text-base font-normal outline-hidden focus:border md:text-sm"
			></textarea>

			<input
				type="color"
				bind:value={textColor}
				class="absolute right-4 top-2 block h-7 w-7 cursor-pointer"
			/>
		</div>

		<div class="mt-4 text-right">
			<!-- <div class="inline-flex items-center bg-brand-smoke-darker">
        <select
          class="h-10 px-4 text-base bg-transparent outline-hidden appearance-none md:text-sm"
          bind:value="{fontFamily}"
          on:change="{() => changeFont(fontFamily, canvas)}">
          <option value="inherit">Default Font</option>
          {#each fonts as font}
            <option value="{font}">{font}</option>
          {/each}
        </select>
        <i class="material-symbols-rounded text-lg! mr-4">expand_more</i>
      </div> -->

			<div class="relative" use:clickOutside onclickOutside={closeFontDropdown}>
				<button
					type="button"
					onclick={toggleFontDropdown}
					class="flex h-14 w-full cursor-pointer items-center justify-between gap-4 border border-gray-400 py-3 pl-4 pr-3 font-medium"
				>
					{#if fontFamily.label.match('fontFamily')}
						<p>Select a Font</p>
					{:else}
						<p class="text-lg" style="font-family: {fontFamily.value};">
							{fontFamily.label}
						</p>
					{/if}

					<i class="material-symbols-rounded text-xl!">expand_more</i>
				</button>

				{#if isFontDropdownOpen}
					<ul
						class="absolute left-0 top-full h-64 w-full overflow-auto border border-gray-400 bg-white shadow-2xl"
					>
						{#each fontFamilyList as { label, value } (value)}
							<li>
								<button
									onclick={setFontFamily({ label, value })}
									class="w-full p-4 text-left hover:bg-stone-100"
								>
									<p class="text-xl" style="font-family: {value};">{label}</p>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>

			<div class="mt-8 flex justify-end text-right">
				<button type="submit" class="button"> Add This Text </button>
			</div>
		</div>
	</form>
</div>
