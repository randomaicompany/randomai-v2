<script>
	import * as R from 'ramda';
	import * as RA from 'ramda-adjunct';
	import { components } from 'root/src/lib/slices';
	import { SliceZone } from '@prismicio/svelte';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';

	import { formatDistanceToNowStrict } from 'date-fns';
	import { clickOutside } from 'root/src/lib/utils/common.js';
	import { fade, fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	// Ensure correct state on mount
	import { onMount } from 'svelte';
	let { data } = $props();

	let isModalOpen = $state(false);
	let previewItem = $state({});
	const options = {
		gap: '2rem',
		pagination: false,
		perPage: 3,
		breakpoints: {
			1024: {
				perPage: 2
			},
			768: {
				perPage: 1
			}
		}
	};

	const filterFeedWithItems = R.filter(R.pipe(R.prop('items'), RA.isNotEmpty));
	const heroSlice = R.filter(R.propEq('hero', 'slice_type'), data.page.data.slices);
	const manualBlogSlices = R.filter(R.propEq('manual_blog_block', 'slice_type'), data.page.data.slices);

	const openModal = (item) => () => ((previewItem = item), (isModalOpen = true));
	const closeModal = () => ((previewItem = {}), (isModalOpen = false));

	const convertToPlainText = (html) => {
		if (!browser) return;
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return doc.body.textContent || '';
	};

	$effect(() => {
		browser && (document.body.style.overflow = isModalOpen ? 'hidden' : 'auto');
	});

	let scrollContainer = $state();

	let isAtStart = $state(true);
	let isAtEnd = $state(false);
	const scrollByAmount = 200;

	function updateButtonStates() {
		if (!scrollContainer) return;
		isAtStart = scrollContainer.scrollLeft <= 0;
		isAtEnd =
			scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth;
	}

	const scrollLeft = () => {
		scrollContainer.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
	};

	const scrollRight = () => {
		scrollContainer.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
	};

	function handleScroll() {
		updateButtonStates();
	}

	onMount(() => {
		updateButtonStates();
	});
</script>

<svelte:head>
	<title>{data.meta_title}</title>
	<meta name="description" content={data.meta_description} />

	{#if data.data.head && data.data.head.length > 0}
		{@html data?.data?.head[0]?.text}
	{/if}
</svelte:head>

<SliceZone slices={heroSlice} {components} />

<div class="relative mx-auto mb-8 max-w-7xl">
	<!-- Scroll Buttons -->
	<button
		onclick={scrollLeft}
		disabled={isAtStart}
		class="top text-brand-accent-light absolute -top-[40px] right-10 z-10 cursor-pointer rounded-full"
		aria-label="Scroll left"
	>
		◀
	</button>

	<button
		onclick={scrollRight}
		disabled={isAtEnd}
		class="text-brand-accent-light absolute -top-[40px] right-3 cursor-pointer rounded-full bg-white"
		aria-label="Scroll right"
	>
		▶
	</button>

	<!-- Scrollable List -->
	<ul
		bind:this={scrollContainer}
		onscroll={handleScroll}
		class="scrollbar-hide flex items-start gap-4 overflow-x-auto scroll-smooth rounded-sm bg-white p-2"
	>
		{#if manualBlogSlices.length > 0}
			<li>
				<a
					href="#random-ai"
					class="hover:text-brand-accent block whitespace-nowrap rounded-sm border bg-gray-50 px-4 py-2 text-sm font-medium"
				>
					Random AI
				</a>
			</li>
		{/if}
		{#each data.feeds as feed, idx (idx)}
			<li>
				<a
					href={`#${feed.name}`}
					class="hover:text-brand-accent block whitespace-nowrap rounded-sm border bg-gray-50 px-4 py-2 text-sm font-medium"
				>
					{feed.name}
				</a>
			</li>
		{/each}
	</ul>
</div>

{#if manualBlogSlices.length > 0}
	<div id="random-ai">
		<SliceZone slices={manualBlogSlices} {components} />
	</div>
{/if}

<!-- <ul
  class="flex items-start gap-4 max-w-7xl mx-auto overflow-x-auto scrollbar-hide mb-8 bg-white p-2 rounded-sm">
  {#each data.feeds as feed}
    <li>
      <a
        href="#{feed.name}"
        class="block whitespace-nowrap p-4 py-2 text-sm font-medium rounded-sm border hover:text-brand-accent bg-gray-50"
        >{feed.name}</a>
    </li>
  {/each}
</ul> -->

<div class="shell pb-16">
	<div class="flex flex-col gap-16">
		{#each filterFeedWithItems(data.feeds) as feed, idx (idx)}
			<div id={feed.name}>
				<div class="mb-8">
					<h2 class="md:heading-2xl heading-xl">{feed.name}</h2>
				</div>

				{#if R.not(R.isEmpty(feed.items))}
					<Splide {options}>
						{#each feed.items as item, idx (idx)}
							<SplideSlide>
								<div class=" flex h-170 flex-col border border-gray-300 bg-white p-4">
									<div class="flex-1">
										<div class="mb-4 flex items-center gap-3">
											<img alt="logo" class="h-8 w-8 rounded-full" src={feed.logo} />
											<p class="text-sm">{feed.name}</p>
										</div>

										{#if item.image}
											<img
												alt="card"
												src={item.image}
												class="mb-4 h-64 w-full border object-cover"
											/>
										{:else}
											<img
												alt="randomai logo"
												class="mb-4 h-64 w-full border object-contain"
												src="https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress"
											/>
										{/if}

										<div class="relative">
											<p class="text-brand-tertiary mb-1 text-xs">
												{formatDistanceToNowStrict(new Date(item.pubDate), {
													addSuffix: true
												})}
											</p>

											<div class="group">
												<h3 class="line-clamp-2 text-lg font-medium">
													{item.title}
												</h3>

												{#if item.title.length > 120}
													<p
														class="absolute bottom-[60%] left-0 border bg-white p-4 text-sm font-medium opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
													>
														{item.title}
													</p>
												{/if}
											</div>

											<p class="mt-2 line-clamp-2 text-sm">
												{convertToPlainText(item.content)}
											</p>

											<ul class="mt-4 flex flex-wrap items-center gap-2">
												{#each R.slice(0, 3, item.categories) as category, idx (idx)}
													<li>
														<p class="bg-brand-tertiary/30 inline-block rounded-sm px-3 py-1 text-xs">
															{category}
														</p>
													</li>
												{/each}
											</ul>
										</div>
									</div>

									<div class="mb-2 flex items-center gap-3">
										<p class="text-xs font-medium">{item.creator}</p>
									</div>

									<button onclick={openModal({ ...feed, ...item })} class="button-compact mt-4"
										>Read More</button
									>
								</div>
							</SplideSlide>
						{/each}
					</Splide>
				{/if}
			</div>
		{/each}
	</div>
</div>

{#if isModalOpen}
	<div
		in:fade={{ duration: 300 }}
		out:fade={{ duration: 300 }}
		class="bg-brand-black/50 fixed left-0 top-0 z-10 flex h-full w-full items-start justify-center overflow-auto p-4"
	>
		<div
			in:fly={{ duration: 300, delay: 100, y: 12 }}
			out:fly={{ duration: 300, y: 12 }}
			class="relative mt-[8vh] max-w-xl flex-1 bg-white p-8"
			use:clickOutside
			onclickOutside={closeModal}
		>
			<button onclick={closeModal} class="absolute -top-8 right-0 bg-white p-1 px-2"
				><i class="material-symbols-rounded text-xl!">close</i></button
			>

			<div class="flex items-center justify-between">
				<div class="mb-4 flex items-center gap-3">
					<img alt="logo" class="h-8 w-8 rounded-full" src={previewItem.logo} />

					<p class="text-sm">{previewItem.name}</p>
				</div>

				<div class="mb-2 flex items-center gap-3">
					<p class="text-xs font-medium">{previewItem.creator}</p>
				</div>
			</div>

			<img
				alt="item"
				class="mb-4 h-64 w-full border object-cover"
				src={previewItem.image ||
					`https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress`}
			/>

			<div class="relative">
				<p class="text-brand-tertiary mb-1 text-xs">
					{formatDistanceToNowStrict(new Date(previewItem.pubDate), {
						addSuffix: true
					})}
				</p>

				<div class="group">
					<h3 class="text-lg font-medium">{previewItem.title}</h3>
				</div>

				<div class="blog-popup-html mt-2 text-sm">
					{@html previewItem.content}
				</div>

				<ul class="mt-4 flex flex-wrap items-center gap-2">
					{#each previewItem.categories as category, idx (idx)}
						<li>
							<p class="bg-brand-tertiary/30 inline-block rounded-sm px-3 py-1 text-xs">
								{category}
							</p>
						</li>
					{/each}
				</ul>

				<a target="_blank" href={previewItem.link} class="button-compact mt-16">View Full Story</a>
			</div>
		</div>
	</div>
{/if}

{#if data.data.body && data.data.body.length > 0}
	{@html data.data.body[0].text}
{/if}

<style>
	button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
</style>
