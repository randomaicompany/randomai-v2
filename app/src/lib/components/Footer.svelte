<script>
  export let data = {};
  import { PrismicImage, PrismicLink } from "@prismicio/svelte";
</script>

<footer class="text-sm font-light bg-brand-black-2 text-brand-tertiary/70">
  <div
    class=" shell grid gap-16 py-16 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gric-cols-1 xl:flex-nowrap">
    <!-- Col 1 -->
    <div class="flex flex-col col-span-1 gap-4">
      <a href="/" class="block text-left">
        <PrismicImage
          class="object-contain invert object-left w-full h-8"
          field="{data.data.logo}" />
      </a>
      <p>Sign up to our newsletter to stay up to date with the latest arrivals</p>

      <div class="h-[56px] overflow-hidden">
        {#if data.data.klaviyo_form_embed && data.data.klaviyo_form_embed.length > 0}
          {@html data.data.klaviyo_form_embed[0].text}
        {/if}
      </div>
    </div>

    <!-- Col 2 -->
    <div class="flex-[1_1_33.33%]">
      <p class="mb-6 text-base font-light text-white">Information</p>
      <ul>
        {#each data.data.links_group_1 as { link, label }}
          <li>
            <PrismicLink field="{link}" class="inline-block pb-2">
              {label}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>

    <div class="flex-[1_1_33.33%]">
      <p class="mb-6 text-base font-light text-white">Support</p>
      <ul>
        {#each data.data.links_group_2 as { link, label }}
          <li>
            <PrismicLink field="{link}" class="inline-block pb-2">
              {label}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>

    <div class="flex-[1_1_33.33%]">
      <p class="mb-6 text-base font-light text-white">Support</p>
      <ul>
        {#each data.data.links_group_3 as { link, label }}
          <li>
            <PrismicLink field="{link}" class="inline-block pb-2">
              {label}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>

    <div class="flex-[1_1_33.33%]">
      <p class="mb-6 text-base font-light text-white">Social</p>
      <ul class="flex flex-wrap items-center gap-2">
        {#each data.data.social_links as { link, icon }}
          <li>
            <PrismicLink
              field="{link}"
              class="flex items-center justify-center w-8 h-8 rounded-full bg-brand-tertiary">
              <PrismicImage class="h-6" field="{icon}" />
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</footer>
