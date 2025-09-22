<script>
	import { isFilled } from '@prismicio/client';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	let { slice } = $props();
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
	<div class:max-w-5xl={slice.primary.is_narrow} class="shell">
		<div class="mb-8">
			{#if isFilled.richText(slice.primary.title)}
				<div class="mb-8 text-3xl md:text-4xl">
					<PrismicRichText field={slice.primary.title} />
				</div>
			{/if}

			{#if isFilled.richText(slice.primary.description)}
				<div class="rich-text text-base font-light">
					<PrismicRichText field={slice.primary.description} />
				</div>
			{/if}
		</div>

		{#each slice.items as item, idx (idx)}
			<PrismicImage class="mb-8 max-h-144 w-full object-cover" field={item.image} />

			{#if isFilled.richText(item.text_content)}
				<div class="rich-content text-base font-light">
					<PrismicRichText field={item.text_content} />
				</div>
			{/if}
		{/each}
	</div>
</section>
