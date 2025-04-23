<script>
  export let data;
  import { onMount } from "svelte";
  import { isFilled } from "@prismicio/client";
  import { cart, isCartOpen, fetchCartItems } from "root/src/lib/stores/cart";
  import { PrismicImage, PrismicLink, PrismicRichText } from "@prismicio/svelte";
  //
  import Cart from "components/Cart.svelte";
  import WishList from "components/WishList.svelte";
  import { fly } from "svelte/transition";
  import { beforeNavigate } from "$app/navigation";
  //
  let isOpen = false;
  let isMenuOpen = false;
  let isCartLoading = true;
  const hasNoticeText = isFilled.richText(data.data.notice);

  const openCart = () => ($isCartOpen = true);
  const toggleMenu = () => (isMenuOpen = !isMenuOpen);

  onMount(async () => {
    await fetchCartItems();
    isCartLoading = false;
  });

  beforeNavigate(() => (isMenuOpen = false));
</script>

{#if hasNoticeText}
  <div
    class="sticky top-0 z-10 flex items-center justify-center w-full text-sm text-white bg-brand-accent h-9">
    <PrismicRichText field="{data.data.notice}" />
  </div>
{/if}

<header class:top-9="{hasNoticeText}" class="sticky top-0 z-10 bg-white border">
  <nav class="shell flex items-center w-full h-20 gap-4">
    <button on:click="{toggleMenu}" class="relative xl:hidden flex items-center justify-center">
      {#if isMenuOpen}
        <i class="material-symbols-rounded">close</i>
        <div class="absolute w-9 h-9 bg-brand-primary/10 -top-1.5 -left-1.5 rounded-full"></div>
      {:else}
        <i class="material-symbols-rounded">menu</i>
      {/if}
    </button>

    <a href="/">
      <PrismicImage class="object-contain w-full h-5 min-w-24" field="{data.data.logo}" />
    </a>

    <div class="flex-1">
      <ul class="items-center justify-center flex-1 hidden xl:flex">
        {#each data.data.links as { link, label }}
          <li>
            <PrismicLink field="{link}" class="px-5 py-4 text-sm font-medium">
              {label}
            </PrismicLink>
          </li>
        {/each}
      </ul>
    </div>

    <form action="/search" method="get" class="md:block hidden">
      <label class="input-field-container">
        <input placeholder="Search" name="query" class="input-field shadow-bordered input-w-icon-left" />
        <button type="submit">
          <i class="absolute h-6 material-symbols-rounded opacity-55 top-2.5 left-4">search</i>
        </button>
      </label>
    </form>

    <ul class="flex items-center gap-1">
      <li class="h-[42px] w-[42px] flex items-center justify-center">
        <PrismicLink field="{data.data.account_link}">
          <img class="w-5" alt="user icon" src="/user.svg" />
        </PrismicLink>
      </li>

      <li class="h-[42px] w-[42px] flex items-center justify-center">
        <WishList />
      </li>

      <li class="h-[42px] w-[42px] flex items-center justify-center">
        <button
          on:click="{openCart}"
          class:bg-brand-smoke-darker="{isOpen}"
          class="relative z-10 p-3 transition-all rounded-full">
          {#if $cart?.lineItems?.length}
            <p
              class="absolute -top-1 right-2 h-4 text-xs text-white rounded-full min-w-[1rem] bg-brand-accent-light leading-none flex items-center justify-center">
              {$cart?.lineItems?.length || 0}
            </p>
          {/if}
          <svg
            width="24"
            height="22"
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_753_8007)">
              <path
                d="M7.90896 21.2492C8.4738 21.2492 8.93169 20.7903 8.93169 20.2242C8.93169 19.6581 8.4738 19.1992 7.90896 19.1992C7.34412 19.1992 6.88623 19.6581 6.88623 20.2242C6.88623 20.7903 7.34412 21.2492 7.90896 21.2492Z"
                stroke="#3D3D3D"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M21.2046 21.2492C21.7695 21.2492 22.2273 20.7903 22.2273 20.2242C22.2273 19.6581 21.7695 19.1992 21.2046 19.1992C20.6398 19.1992 20.1819 19.6581 20.1819 20.2242C20.1819 20.7903 20.6398 21.2492 21.2046 21.2492Z"
                stroke="#3D3D3D"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M0.75 0.75H4.26315L7.13451 16.125H22.2273"
                stroke="#3D3D3D"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
              <path
                d="M6.60847 12.0258H21.13C21.2366 12.0259 21.3399 11.989 21.4223 11.9214C21.5048 11.8538 21.5612 11.7597 21.5822 11.6551L23.241 3.35255C23.2544 3.2856 23.2527 3.21652 23.2362 3.15028C23.2197 3.08403 23.1887 3.02229 23.1454 2.9695C23.1022 2.91672 23.0477 2.8742 22.9861 2.84502C22.9244 2.81584 22.857 2.80073 22.7888 2.80078L4.84082 2.80078"
                stroke="#3D3D3D"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
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
      transition:fly="{{ duration: 200, y: -12 }}"
      class="absolute left-0 w-full pt-0 bg-white border-t shadow-xl top-full">
      <nav class="shell pb-8">
        <ul>
          {#each data.data.links as { link, label }}
            <li>
              <PrismicLink
                field="{link}"
                class="block px-5 py-4 text-sm font-medium hover:underline">
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
  <Cart bind:isCartOpen="{$isCartOpen}" bind:isLoading="{isCartLoading}" />
</div>
