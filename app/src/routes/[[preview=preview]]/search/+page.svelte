<script>
	import { PrismicLink } from '@prismicio/svelte';
	let { data } = $props();

	let productResults = $derived(data?.results?.filter((doc) => doc.type === 'product') || []);
	let numProductsFound = $derived(productResults.length);
</script>

<div class="shell py-16">
	<h1 class="mb-2 text-3xl">Search Results</h1>
	<p>
		{numProductsFound}
		{numProductsFound === 1 ? 'product' : 'products'} found.
	</p>
	<ul class="grid grid-cols-2 gap-4 pt-8 md:grid-cols-3 lg:grid-cols-4">
		{#each productResults as page, idx (idx)}
			{#if page?.uid}
				<li>
					<PrismicLink class="block rounded-md border border-gray-300 bg-white p-4" field={page}>
						{#if page.data?.product?.image?.src}
							<div class="mb-4 min-h-[220px] max-w-[500px]">
								<img
									src={page.data.product.image.src}
									alt={page.data?.product?.name || 'Product Image'}
									class="mb-4"
								/>
							</div>
						{/if}

						<p
							class="bg-brand-smoke-darker mb-4 flex max-w-[max-content] justify-start rounded-sm p-2 py-1 text-xs uppercase"
						>
							{page.type}
						</p>
						<!-- <div class="mb-8">
              <p class="mt-2 text-xs text-gray-600">{page.url}</p>
            </div> -->

						<div
							class="inline-flex items-center gap-1 border border-gray-400 p-2 py-1 text-xs md:gap-4 md:p-4 md:py-2"
						>
							<i class="material-symbols-rounded !text-lg">open_in_new</i>
							<p>View Product</p>
						</div>
					</PrismicLink>
				</li>
			{/if}
		{/each}
	</ul>
</div>
