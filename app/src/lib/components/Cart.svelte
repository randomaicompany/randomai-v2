<script>
  import { fade, fly } from "svelte/transition";
  import { cart, decrementItem, incrementItem } from "root/src/lib/stores/cart";

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

  console.log($cart)

</script>

{#if isCartOpen}
  <button
    in:fade="{{ duration: 200 }}"
    out:fade="{{ duration: 200, delay: 100 }}"
    on:click="{close}"
    class="fixed top-0 left-0 z-50 flex justify-end w-full h-full bg-white bg-opacity-10 backdrop-blur-md">
  </button>

  <div
    in:fly="{{ x: 24, duration: 200, delay: 200 }}"
    out:fly="{{ x: 24, duration: 200 }}"
    class="h-screen flex flex-col bg-white t shadow-xl shadow-slate-900 fixed top-0 right-0 w-full max-w-[24rem] z-50">
    <div
      class="sticky top-0 inline-flex items-center w-full gap-1 py-8 pl-4 pr-4 bg-white border-b sm:pl-8 text-stone-700">
      <p class="text-lg md:text-xl">Your Cart</p>
      <p class="flex-1 text-sm leading-none opacity-75">
        ({$cart?.lineItems?.length || 0})
      </p>

      <button class="p-1" on:click="{close}">
        <i class="material-symbols-rounded">close</i>
      </button>
    </div>

    <ul class="flex-1 overflow-auto">
      {#each $cart?.lineItems || [] as lineItem}
        {@const frontImageUrl = attributesToMap(lineItem)["front"]}
        {@const backImageUrl = attributesToMap(lineItem)["back"]}
        <li
          class="flex flex-col items-start w-full gap-4 p-4 border-b text-stone-700 border-stone-200">
          <div class="flex gap-2">
            {#if frontImageUrl || backImageUrl}
              <div
                class="flex items-center justify-center object-contain w-16 h-16 text-center border">
                {#if frontImageUrl}
                  <img
                    alt="{lineItem.title}"
                    class="object-contain w-16 h-16"
                    src="{frontImageUrl}" />
                {:else}
                  <p class="text-xs">Front is Empty</p>
                {/if}
              </div>

              <div
                class="flex items-center justify-center object-contain w-16 h-16 text-center border">
                {#if backImageUrl}
                  <img
                    alt="{lineItem.title}"
                    class="object-contain w-16 h-16"
                    src="{backImageUrl}" />
                {:else}
                  <p class="text-xs">Back is Empty</p>
                {/if}
              </div>
            {/if}
            <img
              alt="{lineItem.title}"
              class="object-contain w-16 h-16 border"
              src="{lineItem?.variant?.image?.src}" />
          </div>

          <div class="w-full">
            <p class="text-base font-medium leading-snug">{lineItem.variant?.product?.title}</p>
            <small class="text-brand-tertiary">{lineItem.variant.title}</small>
            <div class="flex items-center justify-between">
              <p class="flex-1 mt-4 text-base">
                ${lineItem?.variant?.price}
              </p>

              <ul class="inline-flex items-center mt-4">
                <li>
                  <button
                    on:click="{decrement(lineItem.variant.id)}"
                    disabled="{isLoading}"
                    class="p-1 transition-all bg-white border active:border-brand-yellow active:bg-brand-smoke-darker">
                    <i class="material-symbols-rounded !text-lg">remove</i>
                  </button>
                </li>
                <li class="flex items-center justify-center h-10 p-1 px-4 border">
                  <p class="text-xs">{lineItem.quantity}</p>
                </li>
                <li>
                  <button
                    disabled="{isLoading}"
                    on:click="{increment(lineItem.variant.id)}"
                    class="p-1 transition-all bg-white border active:border-brand-yellow active:bg-brand-smoke-darker">
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
      <div class="p-4 pb-4 border-t">
        <div class="">
          <div class="flex items-center justify-between mb-8">
            <p class="text-lg">Subtotal:</p>
            <p class="text-lg font-semibold">
              ${$cart?.subtotalPrice || "..."}
            </p>
          </div>

          <a class="button" href="{$cart.webUrl}">Checkout</a>
          <p class="p-4 text-sm text-center text-stone-600">
            All discounts are applied on the checkout
          </p>
        </div>
      </div>
    {/if}
  </div>
{/if}
