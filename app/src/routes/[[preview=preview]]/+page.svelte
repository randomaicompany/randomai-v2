<script>
  import { components } from "root/src/lib/slices";
  import { SliceZone } from "@prismicio/svelte";
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.meta_title}</title>
  <meta name="description" content={data.meta_description} />

  {#if data.data.head && data.data.head.length > 0}
    {@html data.data.head[0].text}
  {/if}
</svelte:head>

<SliceZone context={data} slices={data?.page?.data?.slices} {components} />

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
