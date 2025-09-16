<script>
	import { PrismicImage, PrismicLink } from '@prismicio/svelte';
	let { data = {} } = $props();
</script>

<footer class="bg-brand-black-2 text-brand-tertiary/70 text-sm font-light">
	<div
		class=" shell gric-cols-1 grid gap-6 py-16 md:grid-cols-3 md:gap-16 lg:grid-cols-4 xl:grid-cols-5 xl:flex-nowrap"
	>
		<!-- Col 1 -->
		<div class="col-span-1 flex flex-col gap-4">
			<a href="/" class="block text-left">
				<PrismicImage class="h-8 w-full object-contain object-left invert" field={data.data.logo} />
			</a>
			<p>Sign up to our newsletter to stay up to date with the latest arrivals</p>

			<!-- <div class="h-[56px] overflow-hidden">
        {#if data.data.klaviyo_form_embed && data.data.klaviyo_form_embed.length > 0}
          {@html data.data.klaviyo_form_embed[0].text}
        {/if}
      </div> -->
		</div>

		<!-- Col 2 -->
		<div class="flex-[1_1_33.33%]">
			<p class="mb-3 text-base font-light text-white md:mb-6">Information</p>
			<ul>
				{#each data.data.links_group_1 as { link, label } (label)}
					<li>
						<PrismicLink field={link} class="inline-block pb-2">
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex-[1_1_33.33%]">
			<p class="mb-3 text-base font-light text-white md:mb-6">Support</p>
			<ul>
				{#each data.data.links_group_2 as { link, label } (label)}
					<li>
						<PrismicLink field={link} class="inline-block pb-2">
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex-[1_1_33.33%]">
			<p class="mb-3 text-base font-light text-white md:mb-6">Support</p>
			<ul>
				{#each data.data.links_group_3 as { link, label } (label)}
					<li>
						<PrismicLink field={link} class="inline-block pb-2">
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex-[1_1_33.33%]">
			<p class="mb-3 text-base font-light text-white md:mb-6">Social</p>
			<ul class="flex flex-wrap items-center gap-2">
				{#each data.data.social_links as { link, icon } (icon)}
					<li>
						<PrismicLink
							field={link}
							class="bg-brand-tertiary flex h-8 w-8 items-center justify-center rounded-full"
						>
							<PrismicImage class="h-6" field={icon} />
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</footer>
