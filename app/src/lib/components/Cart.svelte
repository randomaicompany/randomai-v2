<script>
  import { fade, fly } from "svelte/transition";
  import {
    cart,
    decrementItem,
    incrementItem,
    removeItem
  } from "root/src/lib/stores/cart";

  export let isLoading = false;
  export let isCartOpen = false;

  const close = () => (isCartOpen = false);

  const increment = (variantId) => async () => {
    isLoading = true;
    await incrementItem(variantId);
    isLoading = false;
  };

  const decrement = (variantId) => async () => {
    isLoading = true;
    await decrementItem(variantId);
    isLoading = false;
  };

  $: isCartOpen,
    (() => {
      if (typeof document !== "undefined") {
        return isCartOpen
          ? (document.body.style.overflow = "hidden")
          : (document.body.style.overflow = "inherit");
      }
    })();

  cart.subscribe((cart) => cart?.lineItems?.length <= 0 && close());

  const attributesToMap = (lineItem) => {
    let map = {};
    lineItem.customAttributes.forEach(({ key, value }) => (map[key] = value));

    return map;
  };

  const remove = (variantId) => async () => {
    isLoading = true;
    console.log(variantId);
    await removeItem(variantId);
    isLoading = false;
  };
</script>

{#if isCartOpen}
  <button
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200, delay: 100 }}
    on:click={close}
    class="fixed left-0 top-0 z-50 flex h-full w-full justify-end bg-white bg-opacity-10 backdrop-blur-md">
  </button>

  <div
    in:fly={{ x: 24, duration: 200, delay: 200 }}
    out:fly={{ x: 24, duration: 200 }}
    class="t fixed right-0 top-0 z-50 flex h-screen w-full max-w-[24rem] flex-col bg-white shadow-xl shadow-slate-900">
    <div
      class="sticky top-0 inline-flex w-full items-center gap-1 border-b bg-white py-8 pl-4 pr-4 text-stone-700 sm:pl-8">
      <p class="text-lg md:text-xl">Your Cart</p>
      <p class="flex-1 text-sm leading-none opacity-75">
        ({$cart?.lineItems?.length || 0})
      </p>

      <button class="p-1" on:click={close}>
        <i class="material-symbols-rounded">close</i>
      </button>
    </div>

    <ul class="flex-1 overflow-auto">
      {#each $cart?.lineItems || [] as lineItem (lineItem.variant.id)}
        {@const frontImageUrl = attributesToMap(lineItem)["front"]}
        {@const backImageUrl = attributesToMap(lineItem)["back"]}
        <li
          class="relative flex w-full flex-col items-start gap-4 border-b border-stone-200 p-4 text-stone-700">
          <!-- Remove Icon Button -->
          <button
            class="absolute right-2 top-2 rounded p-1 transition hover:bg-red-100"
            aria-label="Remove item"
            on:click={remove(lineItem.variant.id)}
            disabled={isLoading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5 text-red-500">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="flex gap-2">
            {#if frontImageUrl || backImageUrl}
              <div
                class="flex h-16 w-16 items-center justify-center border object-contain text-center">
                {#if frontImageUrl}
                  <img
                    alt={lineItem.title}
                    class="h-16 w-16 object-contain"
                    src={frontImageUrl} />
                {:else}
                  <p class="text-xs">Front is Empty</p>
                {/if}
              </div>

              <div
                class="flex h-16 w-16 items-center justify-center border object-contain text-center">
                {#if backImageUrl}
                  <img
                    alt={lineItem.title}
                    class="h-16 w-16 object-contain"
                    src={backImageUrl} />
                {:else}
                  <p class="text-xs">Back is Empty</p>
                {/if}
              </div>
            {/if}
            <img
              alt={lineItem.title}
              class="h-16 w-16 border object-contain"
              src={lineItem?.variant?.image?.src} />
          </div>

          <div class="w-full">
            <p class="text-base font-medium leading-snug">
              {lineItem.variant?.product?.title}
            </p>
            <small class="text-brand-tertiary">{lineItem.variant.title}</small>
            <div class="flex items-center justify-between">
              <p class="mt-4 flex-1 text-base">
                ${lineItem?.variant?.price}
              </p>

              <ul class="mt-4 inline-flex items-center">
                <li>
                  <button
                    on:click={decrement(lineItem.variant.id)}
                    disabled={isLoading}
                    class="active:border-brand-yellow active:bg-brand-smoke-darker border bg-white p-1 transition-all">
                    <i class="material-symbols-rounded !text-lg">remove</i>
                  </button>
                </li>
                <li
                  class="flex h-10 items-center justify-center border p-1 px-4">
                  <p class="text-xs">{lineItem.quantity}</p>
                </li>
                <li>
                  <button
                    disabled={isLoading}
                    on:click={increment(lineItem.variant.id)}
                    class="active:border-brand-yellow active:bg-brand-smoke-darker border bg-white p-1 transition-all">
                    <i class="material-symbols-rounded !text-lg">add</i>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      {:else}
        <div class="flex items-center justify-center h-full bg-white">
          <p class="text-stone-500">Your cart is Empty</p>
        </div>
      {/each}
    </ul>

    {#if $cart?.lineItems?.length > 0}
      <div class="border-t p-4 pb-4">
        <div class="">
          <div class="mb-8 flex items-center justify-between">
            <p class="text-lg">Subtotal:</p>
            <p class="text-lg font-semibold">
              ${$cart?.subtotalPrice || "..."}
            </p>
          </div>

          <a class="button" href={$cart.checkoutUrl}>Checkout</a>
          <p class="p-4 text-center text-sm text-stone-600">
            All discounts are applied on the checkout
          </p>
        </div>
      </div>
    {/if}
  </div>
{/if}
