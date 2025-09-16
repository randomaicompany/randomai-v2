<script>
  import * as R from "ramda";
  import whishlist from "root/src/lib/stores/whishlist";

  import { auth, db } from "../firebase";
  import { fade } from "svelte/transition";
  import { onDestroy } from "svelte";

  import { beforeNavigate } from "$app/navigation";
  import { onAuthStateChanged } from "firebase/auth";
  import {
    doc,
    getDoc,
    updateDoc,
    onSnapshot,
    arrayRemove
  } from "firebase/firestore";

  export let isOpen = false;

  let unsub;

  const open = () => (isOpen = true);
  const close = () => (isOpen = false);

  beforeNavigate(close);

  const getWhishlist = async (currentUser) => {
    const docSnap = await getDoc(doc(db, "whishlist", currentUser.uid));
    const list = docSnap.exists() ? docSnap.data().list : [];
    whishlist.set(list);
  };

  const removeWhishlistItem = (item) => async () => {
    await updateDoc(
      doc(db, "whishlist", auth.currentUser.uid),
      {
        list: arrayRemove(item)
      }
    );
  };

  onAuthStateChanged(auth, (currentUser) => {
    if (!currentUser) return;
    getWhishlist(currentUser);
    unsub = onSnapshot(doc(db, "whishlist", currentUser.uid), (docSnap) => {
      const list = docSnap.exists() ? docSnap.data().list : [];
      whishlist.set(list);
    });
  });

  onDestroy(() => unsub && unsub());
</script>

<button on:click={open}>
  <img class="w-6" alt="heart icon" src="/heart.svg" /></button>
{#if isOpen}
  <div
    transition:fade={{ duration: 200 }}
    class="fixed left-0 top-0 z-50 h-full w-full bg-black/50 py-8">
    <div
      class="mx-auto max-h-[90vh] max-w-6xl overflow-auto rounded-xl bg-white">
      <div
        class="sticky top-0 z-[1] flex items-center justify-between bg-white p-8 pb-4">
        <div>
          <h2 class="text-xl md:text-xl">Favourite Items</h2>
          <p class="text-sm font-thin text-brand-tertiary">
            {R.length($whishlist)} items
          </p>
        </div>
        <button on:click={close}
          ><i class="material-symbols-rounded">close</i></button>
      </div>

      <div class="flex h-full min-h-[20rem] w-full">
        <div class="w-full p-8">
          {#if R.isEmpty($whishlist)}
            <p class="w-full text-center text-sm font-thin">
              No items in your whishlist
            </p>
          {/if}
          <ul class="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {#each $whishlist as item (item.link)}
              <li class="relative">
                <button
                  on:click={removeWhishlistItem(item)}
                  class="absolute right-3 top-3">
                  <svg
                    width="24"
                    height="19"
                    viewBox="0 0 25 22"
                    fill="red"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.7643 2.98245L12.3333 3.6447L12.9022 2.98245C14.0729 1.61967 15.8717 0.75 17.7333 0.75C21.0166 0.75 23.5833 3.30512 23.5833 6.59401C23.5833 8.60716 22.6812 10.4982 20.9403 12.6262C19.1911 14.7643 16.6745 17.0488 13.5697 19.8616L13.5686 19.8626L12.3333 20.9862L11.0979 19.8626L11.0968 19.8616C7.99205 17.0488 5.47543 14.7643 3.72624 12.6262C1.98527 10.4982 1.08325 8.60716 1.08325 6.59401C1.08325 3.30512 3.64993 0.75 6.93325 0.75C8.79478 0.75 10.5937 1.61967 11.7643 2.98245Z"
                      stroke="red"
                      stroke-width="1.5"></path>
                  </svg>
                </button>
                <a href={item.link} class="block">
                  <img
                    alt="product"
                    src={item.image}
                    class="mb-4 h-80 w-full bg-gray-100 object-cover p-4" />

                  <div>
                    <p class="line-clamp-2 min-h-[52px]">{item.title}</p>
                    <p class=" text-brand-tertiary">${item.price}</p>
                  </div>

                  <a href={item.link} class="button-compact mt-4 py-1"
                    >Start Designing</a>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}
