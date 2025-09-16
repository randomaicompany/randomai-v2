<script>
  import * as R from "ramda";
  import { components } from "root/src/lib/slices";
  import { SliceZone } from "@prismicio/svelte";

  import Hero from "components/Product/Hero.svelte";
  let { data = {} } = $props();

  const slices = data.productPage.data.slices;
  const breadbrumbsSlices = R.filter(
    R.propEq("breadcrumbs", "slice_type"),
    slices
  );
  const baseSlices = R.reject(R.propEq("breadcrumbs", "slice_type"), slices);
</script>

<svelte:head>
  <title>{data.meta_title}</title>
  <meta name="description" content={data.meta_description} />

  {#if data.data.head && data.data.head.length > 0}
    {@html data.data.head[0].text}
  {/if}
</svelte:head>

<SliceZone slices={breadbrumbsSlices} {components} />
<Hero {data} />
<SliceZone slices={baseSlices} {components} />

{#if data.data.body && data.data.body.length > 0}
  {@html data.data.body[0].text}
{/if}
