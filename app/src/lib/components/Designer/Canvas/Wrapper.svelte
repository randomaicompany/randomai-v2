<script>
	import { run } from 'svelte/legacy';

	import * as R from 'ramda';
	//
	import { onMount } from 'svelte';
	import Canvas from './Canvas.svelte';
	import Image from 'components/Image.svelte';
	import CanvasOptions from 'components/Designer/CanvasOptions.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} page
	 * @property {any} canvas
	 * @property {any} frontCanvas
	 * @property {any} backCanvas
	 * @property {boolean} [isLoading]
	 * @property {any} [canvasStyles]
	 * @property {any} [productImages]
	 * @property {string} [placeholderImage]
	 * @property {number} [currentViewIdx]
	 */

	/** @type {Props} */
	let {
		page,
		canvas = $bindable(),
		frontCanvas = $bindable(),
		backCanvas = $bindable(),
		isLoading = false,
		canvasStyles = [],
		productImages = [],
		placeholderImage = 'https://images.prismic.io/randomai-10/ZhPSPhrFxhpPBXhg_Placeholder.png',
		currentViewIdx = $bindable(0)
	} = $props();
	let hasImageLoaded = $state(false);

	let activeImage = $derived(productImages[currentViewIdx]);
	run(() => {
		canvas = currentViewIdx == 0 ? frontCanvas : backCanvas;
	});

	const handleImageLoad = () => setTimeout(() => (hasImageLoaded = true), 500);
	const switchView = (idx) => () => (currentViewIdx = idx);
	const setActiveView = () => {
		page.is_front_canvas_enabled && (currentViewIdx = 0);
		page.is_back_canvas_enabled && (currentViewIdx = 1);
		page.is_front_canvas_enabled && page.is_front_canvas_enabled && (currentViewIdx = 0);
	};

	onMount(setActiveView);
</script>

<div class="relative">
	{#if activeImage}
		<Image class=" md:border-none" src={activeImage} on:load={handleImageLoad} />
	{/if}

	{#if hasImageLoaded}
		{#if page.is_front_canvas_enabled}
			<div class:!visible={currentViewIdx == 0} class="invisible">
				<Canvas
					{isLoading}
					bind:canvas={frontCanvas}
					placeholder={placeholderImage}
					canvasStyles={canvasStyles[currentViewIdx]}
				></Canvas>
			</div>
		{/if}

		{#if page.is_back_canvas_enabled}
			<div class:!visible={currentViewIdx == 1} class="invisible">
				<Canvas
					{isLoading}
					bind:canvas={backCanvas}
					placeholder={placeholderImage}
					canvasStyles={canvasStyles[currentViewIdx]}
				></Canvas>
			</div>
		{/if}
	{/if}

	<div class="absolute top-0 md:bottom-[-60px] md:left-[50%] md:top-auto md:translate-x-[-50%]">
		<CanvasOptions {canvas} />
	</div>

	{#if page.is_front_canvas_enabled && page.is_back_canvas_enabled}
		<ul class:opacity-100={hasImageLoaded} class="absolute bottom-4 right-4 block opacity-0">
			{#each productImages as src, idx (idx)}
				{@const isCurrent = R.equals(idx, currentViewIdx)}
				<li>
					<button
						onclick={switchView(idx)}
						class:!opacity-100={isCurrent}
						class:!border-gray-500={isCurrent}
						class="w-16 border object-cover opacity-50"
					>
						<Image {src} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
