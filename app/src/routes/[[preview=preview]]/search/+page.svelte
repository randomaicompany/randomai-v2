<script>
  import { PrismicLink } from "@prismicio/svelte";
  export let data;

  $: productResults = data?.results?.filter(doc => doc.type === 'product') || [];
  $: numProductsFound = productResults.length;

</script>

<div class="shell py-16">
  <h1 class="mb-2 text-3xl">Search Results</h1>
  <p>{numProductsFound} {numProductsFound === 1 ? 'product' : 'products'} found.</p>
  <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8">
    {#each productResults as page}
      {#if page?.uid}
        <li>
          <PrismicLink
            class="block p-4 bg-white border border-gray-300 rounded-md"
            field={page}
          >
            {#if page.data?.product?.image?.src}
              <div class="min-h-[220px] max-w-[500px] mb-4">
                <img
                  src={page.data.product.image.src}
                  alt={page.data?.product?.name || 'Product Image'} class="mb-4"
                />
              </div>
            {/if}

            <p
              class="flex justify-start max-w-[max-content] p-2 py-1 mb-4 text-xs uppercase bg-brand-smoke-darker rounded-sm"
            >
              {page.type} </p>
            <!-- <div class="mb-8">
              <p class="mt-2 text-xs text-gray-600">{page.url}</p>
            </div> -->

            <div
              class="inline-flex items-center gap-1 md:gap-4 p-2 md:p-4 py-1 md:py-2 text-xs border border-gray-400"
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