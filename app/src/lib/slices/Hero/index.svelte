<script>
	import * as R from 'ramda';
	import { asLink } from '@prismicio/client';

	import { Splide, SplideTrack, SplideSlide } from '@splidejs/svelte-splide';
	import { PrismicLink, PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import { pluckPromptSuggestions, extractAISettingsDefault } from 'utils/common.js';
	//
	import PromptInputForm from 'components/PromptInputForm.svelte';
	let { slice, context = {} } = $props();

	let imageUrl = $state('');
	let isLoading = $state(false);
	let buttonLink = $state('');

	const stylePresets = R.path(['data', 'style_presets'], context);
	const promptSuggestions = pluckPromptSuggestions(context);

	const handleImageGenerate = ({ detail: base64Image }) => (imageUrl = base64Image);

	const getDisplayStyles = R.pipe(
		R.pick(['top', 'left', 'width', 'height']),
		R.toPairs,
		R.map(([key, value]) => key + ':' + value + ';'),
		R.join('')
	);

	const setActiveButtonLink = (event) => {
		const idx = event.detail.splide.index;
		const item = slice.items[idx];
		const link = asLink(item.editor_link);
		return (buttonLink = link);
	};

	const aiSettings = extractAISettingsDefault(context);
</script>

{#if slice.variation == 'default'}
	<section
		class="bg-white"
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class:!bg-brand-smoke-darker={slice.primary.is_bg_gray}
	>
		<div class="relative flex min-h-[80vh] flex-col-reverse items-center lg:flex-row">
			<div class="shell relative z-[1] pb-24 md:pb-0">
				<div class="lg:w-1/2">
					<div class="mb-2">
						<PrismicRichText field={slice.primary.eyebrow_headline} />
					</div>
					<div class="heading-4xl lg:heading-5xl mb-4 lg:mb-7">
						<PrismicRichText field={slice.primary.heading} />
					</div>
					<div class="max-w-xl text-base">
						<PrismicRichText field={slice.primary.description} />
					</div>

					<div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
						{#if slice.primary.secondary_button_text}
							<PrismicLink class="button secondary" field={slice.primary.secondary_button_link}
								>{slice.primary.secondary_button_text}</PrismicLink
							>
						{/if}

						{#if slice.primary.primary_button_text}
							<PrismicLink class="button" field={slice.primary.primary_button_link}
								>{slice.primary.primary_button_text}</PrismicLink
							>
						{/if}
					</div>
				</div>
			</div>

			<PrismicImage
				class="right-0 top-0 h-full flex-1 object-contain py-16 lg:absolute lg:w-[60%] lg:py-0"
				field={slice.primary.image}
			/>
		</div>
	</section>
{/if}

{#if slice.variation == 'withImageGenerator'}
	<section
		class="bg-white pb-16"
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class:!bg-brand-smoke-darker={slice.primary.is_bg_gray}
	>
		<div
			class="shell relative z-[1] flex max-w-[1600px] flex-col-reverse items-center gap-4 py-8 md:flex-row md:gap-8 md:py-16"
		>
			<div class="flex-1">
				<div class="mb-2">
					<PrismicRichText field={slice.primary.eyebrow_headline} />
				</div>
				<div class="mb-4 hidden md:block lg:mb-2">
					<!-- <PrismicRichText field="{slice.primary.heading}" /> -->
					<h1 class="font-inter max-w-[1200px] text-6xl leading-[45px]">
						AI-<span class="font-ultra leading-5">Powered</span>,
						<span class="inline-block whitespace-nowrap leading-5"
							>human-<span class="font-ultra">Inspired</span>.</span
						>
					</h1>
				</div>
				<div class="mt-2 hidden max-w-xl text-base md:block">
					<PrismicRichText field={slice.primary.description} />
				</div>
				<div class="pb-4 md:pt-4">
					<PromptInputForm
						class="h-16"
						bind:imageUrl
						bind:isLoading
						{stylePresets}
						{aiSettings}
						{promptSuggestions}
						on:generate={handleImageGenerate}
					/>
				</div>
				<div class:opacity-50={!imageUrl} class:!pointer-events-none={isLoading || !imageUrl}>
					<a href={buttonLink} class="button bg-brand-accent rounded-md border-none">
						View Product
					</a>
				</div>
				<div class="mt-6 max-w-xl text-base md:hidden">
					<PrismicRichText field={slice.primary.description} />
				</div>
			</div>
			<div class="relative h-[400px] w-full flex-1 md:h-[600px] md:w-auto">
				<div class="heading-3xl lg:heading-5xl mb-4 leading-[26px] md:hidden lg:mb-2">
					<!-- <PrismicRichText field="{slice.primary.heading}" /> -->
					AI-<span class="font-ultra leading-5">Powered</span>,
					<span class="inline-block whitespace-nowrap leading-5"
						>human-<span class="font-ultra">Inspired</span>.</span
					>
				</div>
				<Splide
					on:mounted={setActiveButtonLink}
					on:moved={setActiveButtonLink}
					options={{ arrows: true, pagination: false }}
					hasTrack={false}
					aria-label="My Favorite Images"
					class="h-full"
				>
					<SplideTrack class="h-full">
						{#each slice.items as item, idx (idx)}
							{@const outputStyle = getDisplayStyles(item)}
							<SplideSlide class="relative h-full">
								{#if imageUrl}
									<img
										src={imageUrl}
										alt="geenrated art"
										style={outputStyle}
										class="absolute left-[36.5%] top-[26%] h-[28%] w-[20%] object-cover 2xl:max-w-[150px] 2xl:translate-x-[15px]"
									/>
								{/if}

								{#if isLoading}
									<div
										class="absolute left-[39%] top-[36%] z-10 flex h-[28%] w-[24%] items-center justify-center object-cover"
									>
										<div class="h-14 w-14 rounded-full bg-white p-2">
											<div
												style="animation-duration:0.4s"
												class="border-brand-accent h-full w-full animate-spin rounded-full border-[3px] border-r-transparent bg-transparent"
											></div>
										</div>
									</div>
								{/if}
								<PrismicImage
									class="h-[400px h-full w-full flex-1 object-contain md:h-[600px]"
									field={item.image}
								/>
							</SplideSlide>
						{/each}
					</SplideTrack>
				</Splide>
			</div>
		</div>
	</section>
{/if}

{#if slice.variation == 'forRssBlogs'}
	<section class="py-24" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
		<div class="shell max-w-3xl text-center">
			<div class="heading-3xl lg:heading-4xl relative mb-4 !font-medium leading-snug">
				<PrismicRichText field={slice.primary.heading} />

				{#if slice.primary.is_underlined}
					<div class="mx-auto h-1 w-[42%] bg-red-500 lg:w-[60%]"></div>
				{/if}
			</div>
			<div class="mx-auto text-lg">
				<PrismicRichText field={slice.primary.description} />
			</div>
		</div>
	</section>
{/if}
