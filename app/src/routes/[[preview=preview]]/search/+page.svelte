<script>
  import { PrismicLink } from "@prismicio/svelte";
  export let data;
</script>

<div class="shell max-w-5xl py-16">
  <h1 class="mb-2 text-3xl">Search Results</h1>
  <p>{data.results.length} documents found.</p>
  <ul class="flex flex-col gap-4 pt-8">
    {#each data.results as page}
      {#if page?.uid}
        <li>
          <PrismicLink class="block p-4 bg-white border border-gray-400" field="{page}">
            <p class="inline-block p-2 py-1 text-xs uppercase bg-brand-smoke-darker">{page.type}</p>
            <div class="mb-8">
              <p class="mt-2 text-xs text-gray-600">{page.url}</p>
            </div>

            <div class="inline-flex items-center gap-4 p-4 py-2 text-xs border border-gray-400">
              <i class="material-symbols-rounded !text-lg">open_in_new</i>
              <p>View this Page</p>
            </div>
          </PrismicLink>
        </li>
      {/if}
    {/each}
  </ul>
</div>
