<script>
	import { clickOutside } from 'root/src/lib/utils/common.js';

	/**
	 * @typedef {Object} Props
	 * @property {any[]} [stylePresets]
	 * @property {string} [selectedStyle]
	 * @property {boolean} [disabled]
	 */

	/** @type {Props} */
	let {
		stylePresets = [],
		selectedStyle = $bindable(''),
		disabled = false
	} = $props();

	let isOpen = $state(false);

	const toggleDropdown = () => {
		isOpen = !isOpen;
	};

	const selectStyle = (style) => {
		selectedStyle = JSON.stringify(style);
		isOpen = false;
	};

	const getSelectedStyleName = () => {
		try {
			return JSON.parse(selectedStyle)?.name || 'Select Style';
		} catch {
			return 'Select Style';
		}
	};

	const closeDropdown = () => {
		isOpen = false;
	};
</script>

<div class="relative">
	<button
		onclick={toggleDropdown}
		type="button"
		disabled={disabled}
		class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ring-1 ring-gray-200 transition-all hover:bg-gray-50"
		title={getSelectedStyleName()}
	>
		<i class="material-symbols-sharp text-[18px]">palette</i>
	</button>

	{#if isOpen}
		<div
			use:clickOutside
			onclickOutside={closeDropdown}
			class="absolute bottom-full right-0 mb-2 max-h-60 w-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
		>
			{#each stylePresets as style (style.name)}
				<button
					type="button"
					onclick={() => selectStyle(style)}
					class="flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50"
					class:bg-gray-100={getSelectedStyleName() === style.name}
				>
					{style.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
