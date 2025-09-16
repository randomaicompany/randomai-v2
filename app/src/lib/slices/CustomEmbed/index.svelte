<script>
  import { browser } from "$app/environment";
  import { PrismicText } from "@prismicio/svelte";

  export let slice;

  console.log(slice.primary.embed[0].text);
</script>

<section class="shell max-w-4xl">
  <div class="m-auto">
    <h2 class="heading-2xl mb-2 md:mb-4">
      <PrismicText field={slice.primary.heading} />
    </h2>
    <p class="text-base text-brand-secondary">
      <PrismicText field={slice.primary.subtext} />
    </p>
  </div>

  {#if browser}
    {#if slice.primary.embed && slice.primary.embed.length > 0}
      <div class="mt-16">
        {@html slice.primary.embed[0].text}
      </div>
    {/if}
  {/if}
</section>
