<script>
	import * as R from 'ramda';
	import * as RA from 'ramda-adjunct';
	//
	import { components } from '$lib/slices';
	import { afterNavigate } from '$app/navigation';
	import { SliceZone } from '@prismicio/svelte';
	import { getColorNames, getColors, getPrice } from 'utils/page';
	//

	import RangeSlider from 'svelte-range-slider-pips';
	import CheckboxGroup from 'components/CheckboxGroup.svelte';
	import ColorsSwatches from 'components/ColorsSwatches.svelte';
	import Slice from '$lib/slices/CollectionProductCard/index.svelte';
	let { data } = $props();

	let page = $derived(R.propOr({}, 'page', data));
	let title = $derived(R.propOr('', 'title', page));
	let slices = $derived(R.pathOr([], ['data', 'slices'], page));
	let breadcrumbSlices = $derived(R.pathOr([], ['data', 'breadcrumbSlices'], page));
	let productCardSlices = $derived(R.pathOr([], ['data', 'productCardSlices'], page));

	let productTypes = $derived(R.pathOr([], ['productTypes'], page));
	let collections = $derived(R.pathOr([], ['collections'], page));
	let genders = $derived(R.pathOr([], ['genders'], page));
	let productColors = $derived(R.pathOr([], ['productColors'], page));

	let isFilterPanelOpen = $state(false);

	// Unnested filters as individual variables
	let filterGenders = $derived(genders);
	let filterCollections = $derived(collections);
	let filterProductTypes = $derived(productTypes);
	let brands = $derived(page.brands);
	let priceRange = $state([0, 100]);
	let colors = $derived(getColorNames(productColors));

	const isInRange = R.curry((value, range) => {
		const [min = 10, max = 20] = range;

		const low = R.max(min, 0);
		const high = R.max(max, 1);

		return RA.inRange(low, high, value);
	});

	const init = () => {
		page = R.propOr({}, 'page', data);
		title = R.propOr('', 'title', page);
		slices = R.pathOr([], ['data', 'slices'], page);
		breadcrumbSlices = R.pathOr([], ['data', 'breadcrumbSlices'], page);
		productCardSlices = R.pathOr([], ['data', 'productCardSlices'], page);

		productTypes = R.pathOr([], ['productTypes'], page);
		collections = R.pathOr([], ['collections'], page);
		brands = page.brands;
		genders = R.pathOr([], ['genders'], page);
		productColors = R.pathOr([], ['productColors'], page);

		// Reset filter states
		filterGenders = genders;
		filterCollections = collections;
		filterProductTypes = productTypes;

		colors = getColorNames(productColors);
		brands = page.brands;
		priceRange = [0, 200];
	};

	afterNavigate(init);
</script>

<svelte:head>
	<title>{data.meta_title}</title>
	<meta name="description" content={data.meta_description} />
	{#if data.data.head && data.data.head.length > 0}
		{@html data.data.head[0].text}
	{/if}
</svelte:head>

<SliceZone slices={breadcrumbSlices} {components} />

<div class:!gap-0={!isFilterPanelOpen} class="shell flex items-start gap-12 overflow-x-hidden">
	<aside
		class:!max-w-0={!isFilterPanelOpen}
		class="mt-[60px] flex max-w-full flex-[0_0_18rem] flex-col gap-12 overflow-hidden transition-all"
	>
		<div class="relative rounded-md border border-gray-200 p-5">
			<div>
				<div class="-mt-1.5 mb-4 inline-flex items-center">
					<h1 class="text-xl md:text-2xl">{title}</h1>
					<button
						class="absolute right-2 top-2 ml-2 flex items-center rounded-full transition-all hover:text-red-300 active:text-red-500"
						onclick={() => (isFilterPanelOpen = false)}
						><i class="material-symbols-rounded text-xl! rounded-full">close</i></button
					>
				</div>

				<div class="mb-6 px-4 pt-4">
					<RangeSlider
						min={0}
						max={200}
						pips
						float
						first="label"
						last="label"
						bind:values={priceRange}
					/>
				</div>
			</div>

			<div class="pt-8">
				<CheckboxGroup label="Gender" options={page.genders} bind:values={filterGenders} />
			</div>

			<div>
				<CheckboxGroup
					label="Collection"
					options={page.collections}
					bind:values={filterCollections}
				/>
			</div>

			<div>
				<CheckboxGroup label="Brand" options={page.brands} bind:values={brands} />
			</div>

			<div>
				<CheckboxGroup
					label="Product"
					options={page.productTypes}
					bind:values={filterProductTypes}
				/>
			</div>

			<div>
				<ColorsSwatches label="Colors" options={page.productColors} bind:values={colors} />
			</div>
		</div>
	</aside>

	<div class="pt-1">
		<button
			onclick={() => (isFilterPanelOpen = !isFilterPanelOpen)}
			class="bg-brand-accent-light mb-4 ml-auto flex items-center justify-between gap-1 rounded-md px-4 py-1.5 pl-2 text-white"
		>
			<i class:rotate-180={!isFilterPanelOpen} class="material-symbols-rounded text-xl!"
				>menu_open</i
			>

			<p class="text-sm">Filters</p>
		</button>

		<div class="grid gap-4 gap-y-16 pb-32 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
			{#each productCardSlices as slice, idx (idx)}
				{@const price = getPrice(slice)}
				{@const isInPriceRange = isInRange(price, priceRange)}
				{@const isBrandMatch = R.includes(slice.primary.brand, brands)}
				{@const isGenderMatch = R.includes(slice.primary.gender, filterGenders)}
				{@const isCollectionAMatch = R.includes(slice.primary.collection, filterCollections)}
				{@const isProductTypeAMatch = R.includes(slice.primary.product_type, filterProductTypes)}
				{@const isProductColorAMatch = R.isEmpty(R.difference(getColors(slice), colors))}

				{#if isBrandMatch && isInPriceRange && isGenderMatch && isCollectionAMatch && isProductTypeAMatch && isProductColorAMatch}
					<Slice {slice} />
				{/if}
			{/each}
		</div>
	</div>
</div>

<SliceZone {slices} {components} />

{#if data.data.body && data.data.body.length > 0}
	{@html data.data.body[0].text}
{/if}
