<script>
  import { SliceSimulator } from "@slicemachine/adapter-sveltekit/simulator";
  import { SliceZone } from "@prismicio/svelte";
  import { components } from "root/src/lib/slices";
</script>

<SliceSimulator >
  {#snippet children({ slices })}
    <SliceZone {slices} {components} />
  {/snippet}
</SliceSimulator>
