<script>
	import { createBubbler, preventDefault } from 'svelte/legacy';

	const bubble = createBubbler();
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { onMount } from 'svelte';
	import { isFilled } from '@prismicio/client';
	import { cart, isCartOpen, fetchCartItems } from 'root/src/lib/stores/cart';
	import { PrismicImage, PrismicLink, PrismicRichText } from '@prismicio/svelte';
	//
	import Cart from 'components/Cart.svelte';
	import WishList from 'components/WishList.svelte';
	import { fly } from 'svelte/transition';
	import { beforeNavigate } from '$app/navigation';
	let { data } = $props();
	//
	let isOpen = false;
	let isMenuOpen = $state(false);
	let isCartLoading = $state(true);
	const hasNoticeText = isFilled.richText(data.data.notice);

	const openCart = () => ($isCartOpen = true);
	const toggleMenu = () => (isMenuOpen = !isMenuOpen);

	onMount(async () => {
		await fetchCartItems();
		isCartLoading = false;

		// Check if we should autofocus the search input
		shouldAutofocus = page.url.pathname.includes('/search');
	});

	beforeNavigate(() => (isMenuOpen = false));

	let query = '';
	let debounceTimeout;
	let inputRef = $state();
	let shouldAutofocus = $state(false);

	function handleInput(event) {
		query = event.target.value;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			const trimmed = query.trim();

			const active = document.activeElement;

			goto(trimmed ? `/search?query=${encodeURIComponent(trimmed)}` : '/search', {
				keepfocus: true,
				noScroll: true,
				replaceState: true
			}).then(() => {
				if (active === inputRef) {
					inputRef?.focus();
				}
			});
		}, 300);
	}
</script>

<header class="fixed top-0 z-10 w-full border-b bg-white">
	{#if hasNoticeText}
		<div class="flex w-full items-center justify-center bg-brand-accent py-2 text-sm text-white">
			<PrismicRichText field={data.data.notice} />
		</div>
	{/if}

	<nav class="shell flex h-20 w-full items-center gap-4">
		<button onclick={toggleMenu} class="relative flex items-center justify-center xl:hidden">
			{#if isMenuOpen}
				<i class="material-symbols-rounded">close</i>
				<div class="absolute -top-1.5 -left-1.5 h-9 w-9 rounded-full bg-brand-primary/10"></div>
			{:else}
				<i class="material-symbols-rounded">menu</i>
			{/if}
		</button>

		<a href="/">
			<PrismicImage class="h-5 w-full min-w-24 object-contain" field={data.data.logo} />
		</a>

		<div class="flex-1">
			<ul class="hidden flex-1 items-center justify-center xl:flex">
				{#each data.data.links as { link, label } (label)}
					<li>
						<PrismicLink field={link} class="px-5 py-4 text-sm font-medium">
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>

		<form onsubmit={preventDefault(bubble('submit'))} class="hidden md:block">
			<label class="input-field-container relative block">
				<!-- svelte-ignore a11y_autofocus -->
				<input
					bind:this={inputRef}
					placeholder="Search"
					name="query"
					class="input-field input-w-icon-left shadow-bordered"
					oninput={handleInput}
					autofocus={shouldAutofocus ? true : undefined}
				/>
				<button type="submit">
					<i class="material-symbols-rounded absolute top-[8px] left-4 opacity-55"> search </i>
				</button>
			</label>
		</form>

		<ul class="flex items-center gap-1">
			<li class="flex h-[42px] w-[42px] items-center justify-center">
				<PrismicLink field={data.data.account_link}>
					<img class="w-5" alt="user icon" src="/user.svg" />
				</PrismicLink>
			</li>

			<li class="flex h-[42px] w-[42px] items-center justify-center">
				<WishList />
			</li>

			<li class="flex h-[42px] w-[42px] items-center justify-center">
				<button
					onclick={openCart}
					class:bg-brand-smoke-darker={isOpen}
					class="relative z-10 rounded-full p-3 transition-all"
				>
					{#if $cart?.lineItems?.length}
						<p
							class="absolute -top-1 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent-light text-xs leading-none text-white"
						>
							{$cart?.lineItems?.length || 0}
						</p>
					{/if}
					<svg
						width="24"
						height="22"
						viewBox="0 0 24 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_753_8007)">
							<path
								d="M7.90896 21.2492C8.4738 21.2492 8.93169 20.7903 8.93169 20.2242C8.93169 19.6581 8.4738 19.1992 7.90896 19.1992C7.34412 19.1992 6.88623 19.6581 6.88623 20.2242C6.88623 20.7903 7.34412 21.2492 7.90896 21.2492Z"
								stroke="#3D3D3D"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M21.2046 21.2492C21.7695 21.2492 22.2273 20.7903 22.2273 20.2242C22.2273 19.6581 21.7695 19.1992 21.2046 19.1992C20.6398 19.1992 20.1819 19.6581 20.1819 20.2242C20.1819 20.7903 20.6398 21.2492 21.2046 21.2492Z"
								stroke="#3D3D3D"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M0.75 0.75H4.26315L7.13451 16.125H22.2273"
								stroke="#3D3D3D"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
							<path
								d="M6.60847 12.0258H21.13C21.2366 12.0259 21.3399 11.989 21.4223 11.9214C21.5048 11.8538 21.5612 11.7597 21.5822 11.6551L23.241 3.35255C23.2544 3.2856 23.2527 3.21652 23.2362 3.15028C23.2197 3.08403 23.1887 3.02229 23.1454 2.9695C23.1022 2.91672 23.0477 2.8742 22.9861 2.84502C22.9244 2.81584 22.857 2.80073 22.7888 2.80078L4.84082 2.80078"
								stroke="#3D3D3D"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							></path>
						</g>
						<defs>
							<clipPath id="clip0_753_8007">
								<rect width="24" height="22" fill="white"></rect>
							</clipPath>
						</defs>
					</svg>
				</button>
			</li>
		</ul>
	</nav>

	{#if isMenuOpen}
		<div
			transition:fly={{ duration: 200, y: -12 }}
			class="absolute top-full left-0 w-full border-t bg-white pt-0 shadow-xl"
		>
			<nav class="shell pb-8">
				<ul>
					{#each data.data.links as { link, label } (label)}
						<li>
							<PrismicLink field={link} class="block px-5 py-4 text-sm font-medium hover:underline">
								{label}
							</PrismicLink>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
</header>

<div>
	<Cart bind:isCartOpen={$isCartOpen} bind:isLoading={isCartLoading} />
</div>
