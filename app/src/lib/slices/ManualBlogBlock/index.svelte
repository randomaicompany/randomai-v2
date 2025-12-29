<script>
	import { asDate } from '@prismicio/client';
	import { PrismicImage, PrismicRichText, PrismicText } from '@prismicio/svelte';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import { formatDistanceToNowStrict } from 'date-fns';
	import { fade, fly } from 'svelte/transition';
	import { clickOutside } from 'root/src/lib/utils/common.js';
	import { browser } from '$app/environment';

	let { slice } = $props();

	let isModalOpen = $state(false);
	let previewItem = $state(null);

	const options = {
		gap: '2rem',
		pagination: false,
		perPage: 3,
		breakpoints: {
			1024: { perPage: 2 },
			768: { perPage: 1 }
		}
	};

	const parseCategories = (cats) => cats?.split(',').map((c) => c.trim()).filter(Boolean) || [];

	const openModal = (post) => () => {
		previewItem = post;
		isModalOpen = true;
	};

	const closeModal = () => {
		previewItem = null;
		isModalOpen = false;
	};

	$effect(() => {
		browser && (document.body.style.overflow = isModalOpen ? 'hidden' : 'auto');
	});
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class="shell pb-16">
		<div class="mb-8">
			<div class="md:heading-2xl heading-xl">
				<PrismicRichText field={slice.primary.heading} />
			</div>
		</div>

		{#if slice.items && slice.items.length > 0}
			<Splide {options}>
				{#each slice.items as post, idx (idx)}
					{@const categories = parseCategories(post.categories)}
					{@const pubDate = asDate(post.publish_date)}
					<SplideSlide>
						<div class="flex h-170 flex-col border border-gray-300 bg-white p-4">
							<div class="flex-1">
								<div class="mb-4 flex items-center gap-3">
									<img
										alt="Random AI logo"
										class="h-8 w-8 rounded-full object-contain"
										src="https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress"
									/>
									<p class="text-sm">Random AI</p>
								</div>

								<PrismicImage
									field={post.featured_image}
									class="mb-4 h-64 w-full border object-contain"
								/>

								<div class="relative">
									{#if pubDate}
										<p class="text-brand-tertiary mb-1 text-xs">
											{formatDistanceToNowStrict(pubDate, { addSuffix: true })}
										</p>
									{/if}

									<div class="group">
										<h3 class="line-clamp-2 text-lg font-medium">
											<PrismicText field={post.title} />
										</h3>
									</div>

									<p class="mt-2 line-clamp-2 text-sm">
										<PrismicText field={post.excerpt} />
									</p>

									{#if categories.length > 0}
										<ul class="mt-4 flex flex-wrap items-center gap-2">
											{#each categories.slice(0, 3) as category, catIdx (catIdx)}
												<li>
													<p class="bg-brand-tertiary/30 inline-block rounded-sm px-3 py-1 text-xs">
														{category}
													</p>
												</li>
											{/each}
										</ul>
									{/if}
								</div>
							</div>

							<div class="mb-2 flex items-center gap-3">
								<p class="text-xs font-medium">{post.author || 'Random AI Team'}</p>
							</div>

							<button onclick={openModal(post)} class="button-compact mt-4">Read More</button>
						</div>
					</SplideSlide>
				{/each}
			</Splide>
		{/if}
	</div>
</section>

{#if isModalOpen && previewItem}
	{@const categories = parseCategories(previewItem.categories)}
	{@const pubDate = asDate(previewItem.publish_date)}
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
			<button onclick={closeModal} class="absolute -top-8 right-0 bg-white p-1 px-2">
				<i class="material-symbols-rounded text-xl!">close</i>
			</button>

			<div class="flex items-center justify-between">
				<div class="mb-4 flex items-center gap-3">
					<img
						alt="Random AI logo"
						class="h-8 w-8 rounded-full object-contain"
						src="https://images.prismic.io/randomai-10/ZqJ4sh5LeNNTxgB3_Logorandomdef.png?auto=format,compress"
					/>
					<p class="text-sm">Random AI</p>
				</div>

				<div class="mb-2 flex items-center gap-3">
					<p class="text-xs font-medium">{previewItem.author || 'Random AI Team'}</p>
				</div>
			</div>

			<PrismicImage field={previewItem.featured_image} class="mb-4 h-64 w-full border object-contain" />

			<div class="relative">
				{#if pubDate}
					<p class="text-brand-tertiary mb-1 text-xs">
						{formatDistanceToNowStrict(pubDate, { addSuffix: true })}
					</p>
				{/if}

				<div class="group">
					<h3 class="text-lg font-medium">
						<PrismicText field={previewItem.title} />
					</h3>
				</div>

				<div class="blog-popup-html mt-4 text-sm">
					<PrismicRichText field={previewItem.content} />
				</div>

				{#if categories.length > 0}
					<ul class="mt-4 flex flex-wrap items-center gap-2">
						{#each categories as category, catIdx (catIdx)}
							<li>
								<p class="bg-brand-tertiary/30 inline-block rounded-sm px-3 py-1 text-xs">
									{category}
								</p>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
{/if}
