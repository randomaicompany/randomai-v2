<script>
	import * as R from 'ramda';
	import '@splidejs/svelte-splide/css';

	import { isFilled } from '@prismicio/client';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import { PrismicLink, PrismicText, PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	let { slice } = $props();
	let zoomContainers = $state([]);
	const prepareTags = (item) => {
		const tags = R.defaultTo('', R.prop('tags', item));
		const tagsString = R.trim(tags);
		const tagsList = R.defaultTo([], R.split(',', tagsString));
		const tagsListNormalized = R.map(R.pipe(R.trim), tagsList);
		return R.reject(R.isEmpty, tagsListNormalized);
	};
	onMount(() => {
		zoomContainers.forEach((container) => {
			if (container) {
				const img = container.querySelector('img');
				const overlay = container.querySelector('.zoom-overlay');

				if (img && overlay) {
					const zoomSrc = img.getAttribute('data-zoom') || img.src;

					const handleMouseMove = (e) => {
						const rect = container.getBoundingClientRect();
						const x = e.clientX - rect.left;
						const y = e.clientY - rect.top;

						// Calculate zoom position
						const xPercent = (x / rect.width) * 100;
						const yPercent = (y / rect.height) * 100;

						// Update overlay background
						overlay.style.backgroundImage = `url('${zoomSrc}')`;
						overlay.style.backgroundSize = '200%'; // 2x zoom
						overlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
						overlay.style.backgroundRepeat = 'no-repeat';
					};

					const handleMouseEnter = () => {
						overlay.style.opacity = '1';
						overlay.style.visibility = 'visible';
					};

					const handleMouseLeave = () => {
						overlay.style.opacity = '0';
						overlay.style.visibility = 'hidden';
					};

					container.addEventListener('mousemove', handleMouseMove);
					container.addEventListener('mouseenter', handleMouseEnter);
					container.addEventListener('mouseleave', handleMouseLeave);

					// Cleanup function
					return () => {
						container.removeEventListener('mousemove', handleMouseMove);
						container.removeEventListener('mouseenter', handleMouseEnter);
						container.removeEventListener('mouseleave', handleMouseLeave);
					};
				}
			}
		});
	});

	const getZoomUrl = (image, newWidth, newHeight) => {
		const parsedUrl = new URL(image.url || image.src);

		parsedUrl.searchParams.set('w', newWidth);
		parsedUrl.searchParams.set('h', newHeight);

		// Replace this logic with however you determine the zoom URL from your image field
		return parsedUrl.toString();
	};
</script>

{#if slice.variation == 'default'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class:shell={slice.primary.is_contained}>
			<div>
				<div class="mb-2">
					<PrismicRichText field={slice.primary.eyebrow_headline} />
				</div>
				<div class="mb-2 text-3xl md:mb-4 md:text-4xl">
					<PrismicRichText field={slice.primary.heading} />
				</div>
				<div class="text-brand-primary/70 text-base">
					<PrismicRichText field={slice.primary.description} />
				</div>
			</div>

			<ul
				class="mt-12 grid grid-cols-1 gap-16 md:gap-2 {slice.primary.is_4_col_layout
					? 'md:grid-cols-4'
					: 'md:grid-cols-3'} "
			>
				{#each slice.items as item, index (index)}
					<li>
						<PrismicLink field={item.link} class="group block transition-opacity hover:opacity-90">
							<div
								class="zoom-container bg-brand-smoke-darker relative overflow-hidden"
								bind:this={zoomContainers[index]}
							>
								<PrismicImage
									field={item.image}
									data-zoom={getZoomUrl(item.image, 1200, 1200)}
									class="h-96 w-full {slice.primary.is_cover ? 'object-cover' : 'object-contain'} "
								/>

								<div
									class="zoom-overlay pointer-events-none absolute inset-0 transition-opacity duration-300"
									style="opacity: 0; visibility: hidden;"
								></div>
							</div>

							<div class="mt-4 text-base font-medium">
								<PrismicRichText field={item.title} />
							</div>

							<div class="text-brand-gray text-brand-primary mt-2 font-normal">
								<PrismicRichText field={item.subtext} />
							</div>

							{#if R.not(R.isEmpty(prepareTags(item)))}
								<ul class="tags-list hidden">
									{#each prepareTags(item) as tag (tag)}
										<li>{tag}</li>
									{/each}
								</ul>
							{/if}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

{#if slice.variation == 'cardsWithColorToggle'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="shell">
			<div class="mb-12">
				<div class="mb-2">
					<PrismicRichText field={slice.primary.eyebrow_headline} />
				</div>
				<div class="mb-2 text-3xl md:mb-4 md:text-4xl">
					<PrismicRichText field={slice.primary.heading} />
				</div>
				<div class="text-brand-primary/70 text-base">
					<PrismicRichText field={slice.primary.description} />
				</div>
			</div>

			<div>
				<Splide
					options={{
						rewind: true,
						pagination: false,
						perPage: 4,
						gap: 16,
						breakpoints: {
							1024: {
								perPage: 3
							},

							768: {
								perPage: 2
							},

							480: {
								perPage: 1
							}
						}
					}}
				>
					{#each slice.items as item, idx (idx)}
						<SplideSlide>
							<div class="relative">
								<PrismicLink field={item.link} class="transition-opacity hover:opacity-90 ">
									<PrismicImage
										class="bg-brand-smoke-darker h-96 w-full object-cover"
										field={item.image}
									/>

									<div class="mt-4">
										<PrismicImage
											class="h-6 w-full object-contain object-left "
											field={item.swatches_image}
										/>
									</div>

									<div class="mt-4 text-base font-medium">
										<PrismicRichText field={item.title} />
									</div>

									<div class="text-brand-gray text-brand-primary/70 mt-4 font-normal">
										<PrismicRichText field={item.subtext} />
									</div>

									{#if isFilled.richText(item.review_text)}
										<div class="mt-2 flex flex-wrap items-start gap-2">
											<svg
												width="108"
												height="19"
												viewBox="0 0 108 19"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<g clip-path="url(#clip0_1718_4100)">
													<path
														d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
														fill="#FFE500"
													></path>
												</g>
												<g clip-path="url(#clip1_1718_4100)">
													<path
														d="M25.825 19L27.45 11.975L22 7.25L29.2 6.625L32 0L34.8 6.625L42 7.25L36.55 11.975L38.175 19L32 15.275L25.825 19Z"
														fill="#FFE500"
													></path>
												</g>
												<g clip-path="url(#clip2_1718_4100)">
													<path
														d="M47.825 19L49.45 11.975L44 7.25L51.2 6.625L54 0L56.8 6.625L64 7.25L58.55 11.975L60.175 19L54 15.275L47.825 19Z"
														fill="#FFE500"
													></path>
												</g>
												<g clip-path="url(#clip3_1718_4100)">
													<path
														d="M69.825 19L71.45 11.975L66 7.25L73.2 6.625L76 0L78.8 6.625L86 7.25L80.55 11.975L82.175 19L76 15.275L69.825 19Z"
														fill="#FFE500"
													></path>
												</g>
												<g clip-path="url(#clip4_1718_4100)">
													<path
														d="M91.825 19L93.45 11.975L88 7.25L95.2 6.625L98 0L100.8 6.625L108 7.25L102.55 11.975L104.175 19L98 15.275L91.825 19Z"
														fill="#FFE500"
													></path>
												</g>
												<defs>
													<clipPath id="clip0_1718_4100">
														<rect width="20" height="19" fill="white"></rect>
													</clipPath>
													<clipPath id="clip1_1718_4100">
														<rect width="20" height="19" fill="white" transform="translate(22)"
														></rect>
													</clipPath>
													<clipPath id="clip2_1718_4100">
														<rect width="20" height="19" fill="white" transform="translate(44)"
														></rect>
													</clipPath>
													<clipPath id="clip3_1718_4100">
														<rect width="20" height="19" fill="white" transform="translate(66)"
														></rect>
													</clipPath>
													<clipPath id="clip4_1718_4100">
														<rect width="20" height="19" fill="white" transform="translate(88)"
														></rect>
													</clipPath>
												</defs>
											</svg>

											<p class="mb-0.5 text-sm">
												<PrismicText field={item.review_text}></PrismicText>
											</p>
										</div>
									{/if}
								</PrismicLink>
							</div>
						</SplideSlide>
					{/each}
				</Splide>
			</div>

			{#if isFilled.link(slice.primary.link)}
				<div class="mt-16 text-center">
					<PrismicLink class="button secondary inline-flex" field={slice.primary.link}
						>{slice.primary.button_text}</PrismicLink
					>
				</div>
			{/if}
		</div>
	</section>
{/if}

{#if slice.variation == 'cardsReviews'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="bg-brand-smoke-darker">
			<div>
				<div class="shell">
					<Splide
						class="py-16 "
						options={{
							rewind: true,
							focus: 'center',
							pagination: false,
							perPage: 3,
							gap: 16,
							breakpoints: {
								1024: {
									perPage: 3
								},

								768: {
									perPage: 2
								},

								480: {
									perPage: 1
								}
							}
						}}
					>
						{#each slice.items as item (item)}
							<SplideSlide class="relative bg-white p-4 ">
								<div class="flex flex-col gap-4 transition-opacity hover:opacity-90">
									<div class="flex items-center gap-4">
										<PrismicImage class="h-14 w-14 rounded-full object-cover" field={item.image} />

										<p class="text-xl">
											<PrismicText field={item.name} />
										</p>
									</div>

									<div>
										<svg
											width="108"
											height="19"
											viewBox="0 0 108 19"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<g clip-path="url(#clip0_1718_4100)">
												<path
													d="M3.825 19L5.45 11.975L0 7.25L7.2 6.625L10 0L12.8 6.625L20 7.25L14.55 11.975L16.175 19L10 15.275L3.825 19Z"
													fill="#FFE500"
												></path>
											</g>
											<g clip-path="url(#clip1_1718_4100)">
												<path
													d="M25.825 19L27.45 11.975L22 7.25L29.2 6.625L32 0L34.8 6.625L42 7.25L36.55 11.975L38.175 19L32 15.275L25.825 19Z"
													fill="#FFE500"
												></path>
											</g>
											<g clip-path="url(#clip2_1718_4100)">
												<path
													d="M47.825 19L49.45 11.975L44 7.25L51.2 6.625L54 0L56.8 6.625L64 7.25L58.55 11.975L60.175 19L54 15.275L47.825 19Z"
													fill="#FFE500"
												></path>
											</g>
											<g clip-path="url(#clip3_1718_4100)">
												<path
													d="M69.825 19L71.45 11.975L66 7.25L73.2 6.625L76 0L78.8 6.625L86 7.25L80.55 11.975L82.175 19L76 15.275L69.825 19Z"
													fill="#FFE500"
												></path>
											</g>
											<g clip-path="url(#clip4_1718_4100)">
												<path
													d="M91.825 19L93.45 11.975L88 7.25L95.2 6.625L98 0L100.8 6.625L108 7.25L102.55 11.975L104.175 19L98 15.275L91.825 19Z"
													fill="#FFE500"
												></path>
											</g>
											<defs>
												<clipPath id="clip0_1718_4100">
													<rect width="20" height="19" fill="white"></rect>
												</clipPath>
												<clipPath id="clip1_1718_4100">
													<rect width="20" height="19" fill="white" transform="translate(22)"
													></rect>
												</clipPath>
												<clipPath id="clip2_1718_4100">
													<rect width="20" height="19" fill="white" transform="translate(44)"
													></rect>
												</clipPath>
												<clipPath id="clip3_1718_4100">
													<rect width="20" height="19" fill="white" transform="translate(66)"
													></rect>
												</clipPath>
												<clipPath id="clip4_1718_4100">
													<rect width="20" height="19" fill="white" transform="translate(88)"
													></rect>
												</clipPath>
											</defs>
										</svg>
									</div>

									<div class="text-brand-gray text-brand-primary/70 font-normal">
										<PrismicRichText field={item.description} />
									</div>
								</div>
							</SplideSlide>
						{/each}
					</Splide>
				</div>
			</div>
		</div>
	</section>
{/if}

{#if slice.variation == 'cards2ColumnsBig'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
			{#each slice.items as item, idx (idx)}
				<li>
					<PrismicLink field={item.link} class="relative block transition-opacity hover:opacity-90">
						<PrismicImage field={item.image} class="h-[36rem] w-full object-cover lg:h-[48rem]" />

						<div class="absolute left-0 top-0 flex h-full w-full items-end justify-center pb-16">
							<p class="button secondary">{item.button_text}</p>
						</div>
					</PrismicLink>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if slice.variation == 'cardsDualColumn'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="shell">
			<div class="flex flex-wrap items-end justify-between gap-4">
				<div>
					<div class="mb-2">
						<PrismicRichText field={slice.primary.eyebrow_headline} />
					</div>
					<div class="text-3xl md:text-4xl">
						<PrismicRichText field={slice.primary.heading} />
					</div>

					{#if isFilled.richText(slice.primary.description)}
						<div class="text-brand-primary/80 mt-4 text-base">
							<PrismicRichText field={slice.primary.description} />
						</div>
					{/if}
				</div>

				<PrismicLink
					field={slice.primary.link}
					class="group mt-2 inline-flex items-center gap-2 md:mb-1 md:mt-0"
				>
					<p class="text-sm font-medium md:text-base">
						{slice.primary.button_text}
					</p>
					<svg
						class="mt-0.5 transition-transform group-hover:translate-x-2"
						width="40"
						height="16"
						viewBox="0 0 40 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M0 9H40M40 9L31.0344 17.5M40 9L31.0344 0.5" stroke="#3D3D3D"></path>
					</svg>
				</PrismicLink>
			</div>

			<ul class="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-6">
				{#each slice.items as item, idx (idx)}
					<li>
						<PrismicLink field={item.link} class="transition-opacity hover:opacity-90">
							<PrismicImage class="h-80 w-full object-cover" field={item.image} />

							<div class="mt-4 text-xl font-medium">
								<PrismicRichText field={item.title} />
							</div>

							<div class="text-brand-gray text-brand-primary/50 mt-4 text-base font-normal">
								<PrismicRichText field={item.subtext} />
							</div>

							<div class="mt-8 text-left">
								<p class="button secondary inline-flex">{item.button_text}</p>
							</div>
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

{#if slice.variation == 'cardsListLayout'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="py-16">
			<div class="flex flex-wrap items-end justify-between gap-8">
				<div>
					<div class="mb-2">
						<PrismicRichText field={slice.primary.eyebrow_headline} />
					</div>
					<div class="text-3xl md:text-4xl">
						<PrismicRichText field={slice.primary.heading} />
					</div>

					{#if isFilled.richText(slice.primary.description)}
						<div class="text-brand-primary/70 mt-4 text-base">
							<PrismicRichText field={slice.primary.description} />
						</div>
					{/if}
				</div>
			</div>

			<ul class="mt-16 grid grid-cols-1 gap-16">
				{#each slice.items as item, idx (idx)}
					<li>
						<PrismicLink field={item.link} class="transition-opacity hover:opacity-90">
							<div class="relative">
								<PrismicImage class="h-[38rem] w-full object-cover" field={item.image} />

								{#if isFilled.keyText(item.tag)}
									<p
										class="absolute left-4 top-4 bg-white/90 px-6 py-1.5 text-sm font-medium uppercase"
									>
										{item.tag}
									</p>
								{/if}
							</div>

							<div class="py-8">
								{#if isFilled.keyText(item.publisher_name)}
									<div class="flex items-center gap-3">
										<div class="bg-brand-tertiary h-4 w-4 rounded-full"></div>
										<p class="text-base">{item.publisher_name}</p>
									</div>
								{/if}

								{#if isFilled.date(item.published_date)}
									<p class="mt-2 text-sm">
										{new Date(item.published_date).toDateString()}
									</p>
								{/if}
							</div>

							<div class="text-xl">
								<PrismicRichText field={item.title} />
							</div>

							<div class="text-brand-gray text-brand-primary/80 mt-2 text-base font-normal">
								<PrismicRichText field={item.subtext} />
							</div>

							{#if isFilled.keyText(item.button_text)}
								<div class="mt-8 text-left">
									<p class="button secondary inline-flex h-10">
										{item.button_text}
									</p>
								</div>
							{/if}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

{#if slice.variation == 'cardsFlatList'}
	<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div>
			<div class="flex flex-wrap items-end justify-between gap-8">
				<div>
					<div class="mb-2">
						<PrismicRichText field={slice.primary.eyebrow_headline} />
					</div>
					<div class="text-xl font-medium">
						<PrismicRichText field={slice.primary.heading} />
					</div>

					{#if isFilled.richText(slice.primary.description)}
						<div class="text-brand-primary/70 mt-4 text-base">
							<PrismicRichText field={slice.primary.description} />
						</div>
					{/if}
				</div>
			</div>

			<ul class="mt-8 grid grid-cols-1 gap-16">
				{#each slice.items as item, idx (idx)}
					<li>
						<PrismicLink field={item.link} class="transition-opacity hover:opacity-90">
							<div class="relative">
								<PrismicImage class="h-80 w-full object-cover" field={item.image} />

								{#if isFilled.keyText(item.tag)}
									<p class="text-brand-tertiary py-4">
										{item.tag}
									</p>
								{/if}
							</div>

							<div class="text-base font-medium">
								<PrismicRichText field={item.title} />
							</div>

							<div class="text-brand-gray text-brand-primary/80 mt-2 text-sm font-normal">
								<PrismicRichText field={item.subtext} />
							</div>

							{#if isFilled.keyText(item.button_text)}
								<div class="mt-8 text-left">
									<p class="button secondary inline-flex h-10">
										{item.button_text}
									</p>
								</div>
							{/if}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.zoom-container {
		position: relative;
		cursor: crosshair;
	}

	.zoom-overlay {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(1px);
		border: 2px solid rgba(255, 255, 255, 0.8);
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.zoom-container:hover .zoom-overlay {
		opacity: 1 !important;
		visibility: visible !important;
	}
</style>
