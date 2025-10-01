<script>
	import { clickOutside } from 'root/src/lib/utils/common.js';
	import { fly } from 'svelte/transition';

	/**
	 * @typedef {Object} Props
	 * @property {any[]} [stylePresets]
	 * @property {string} [selectedStyle]
	 * @property {boolean} [disabled]
	 */

	/** @type {Props} */
	let { stylePresets = [], selectedStyle = $bindable(''), disabled = false } = $props();

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
		{disabled}
		class:!ring-transparent={isOpen}
		class:!bg-red-50={isOpen}
		class={[
			'group flex h-8 w-8 max-w-8 flex-shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-1.5 ring-1 ring-gray-200 duration-500 hover:w-64 hover:bg-gray-50 md:w-8 md:max-w-full',
			{ 'md:w-64': isOpen }
		]}
	>
		<i class="material-symbols-sharp flex-shrink-0 !text-[20px]">palette</i>
		<span class="truncate whitespace-nowrap text-xs font-medium">{getSelectedStyleName()}</span>
	</button>

	{#if isOpen}
		<div
			transition:fly={{ duration: 300, y: 12 }}
			use:clickOutside
			onclickOutside={closeDropdown}
			class="absolute bottom-full z-10 mb-2 max-h-60 w-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg md:w-96"
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
