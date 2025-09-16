<script>
	import { run } from 'svelte/legacy';

	/** @type {import("@prismicio/client").Content.GallerySlice} */
	import * as R from 'ramda';

	import { isFilled } from '@prismicio/client';
	import { clickOutside } from 'utils/common';
	import { fade, fly } from 'svelte/transition';
	import { PrismicImage, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import { browser } from '$app/environment';
	import IconButton from '../../components/Designer/IconButton.svelte';

	let { slice } = $props();

	let isOpen = $state(false);
	let currentItem = $state({});

	const close = () => {
		isOpen = false;
		currentItem = {};
	};
	const openCurrent = (item) => () => {
		currentItem = item;
		isOpen = true;
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text[0].text).then(() => {});
	};

	run(() => {
		(isOpen,
			isOpen
				? browser && (document.body.style.overflow = 'hidden')
				: browser && (document.body.style.overflow = 'auto'));
	});
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} class="shell">
	<div class="mb-2 text-3xl md:mb-4 md:text-4xl">
		<PrismicRichText field={slice.primary.heading} />
	</div>

	<div class="text-brand-primary/70 text-base">
		<PrismicRichText field={slice.primary.subtext} />
	</div>

	<div class="grid grid-cols-1 gap-2 pt-14 sm:grid-cols-2 md:grid-cols-3">
		{#each R.splitEvery(2, slice.items) as group, idx (idx)}
			<ul class="grid gap-2">
				{#each group as item, idx (idx)}
					<li class="group relative">
						<PrismicImage class="h-full max-w-full rounded-lg object-cover" field={item.image} />
						{#if isFilled.richText(item.title) || isFilled.richText(item.description)}
							<button
								onclick={openCurrent(item)}
								class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-black/50 p-6 text-left opacity-0 transition-opacity group-hover:opacity-100"
							>
								<p class="mb-2 text-base font-medium text-white">
									<PrismicText field={item.title} />
								</p>
								<p class="line-clamp-2 text-sm text-gray-200 md:text-base">
									<PrismicText field={item.description} />
								</p>
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</section>

{#if isOpen}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed left-0 top-0 z-10 flex h-full w-full items-start justify-center overflow-auto bg-gray-900/50 p-4"
	>
		<div
			transition:fly={{ y: 12, duration: 200 }}
			use:clickOutside
			onclickOutside={close}
			class="mt-[16vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-8 shadow-xl"
		>
			<PrismicImage class="mb-4 rounded-lg object-contain" field={currentItem.image} />

			<p class="mb-2 flex justify-between text-lg font-medium md:text-xl">
				<PrismicText field={currentItem.title} />
				<IconButton
					label="copy"
					iconName="content_copy"
					on:click={() => copyToClipboard(currentItem.description)}
				/>
			</p>

			<PrismicText field={currentItem.description} />
		</div>
	</div>
{/if}
