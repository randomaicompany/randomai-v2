<script>
	/**
	 * @typedef {Object} Props
	 * @property {number} [quantity]
	 */

	/** @type {Props} */
	let { quantity = $bindable(1) } = $props();
</script>

<div class="w-full">
	<div class="flex w-full items-center gap-2">
		<button
			aria-label="icon button"
			onclick={() => quantity >= 2 && (quantity = quantity - 1)}
			class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-hidden"
			type="button"
		>
			<svg
				class="h-2 w-2"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 16 2"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
					d="M1 1h16"
				></path>
			</svg>
		</button>
		<div>
			<p
				class="flex h-8 min-w-8 items-center justify-center overflow-hidden text-ellipsis rounded-full bg-gray-50 px-2 text-sm text-gray-900 outline-hidden"
			>
				{quantity}
			</p>
			<input type="number" bind:value={quantity} class="hidden" placeholder="1" min="1" required />
		</div>
		<button
			onclick={() => (quantity = quantity + 1)}
			class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-hidden"
			type="button"
		>
			<span class="sr-only">Quantity button</span>
			<svg
				class="h-2 w-2"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 16 16"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="3"
					d="M9 1v16M1 9h16"
				></path>
			</svg>
		</button>
	</div>
</div>
