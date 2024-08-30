<script>
  import * as R from "ramda";
  import whishlist from "root/src/lib/stores/whishlist";
  import { onMount } from "svelte";
  import { db, auth } from "root/src/lib/firebase";
  import { asImageSrc, asLink } from "@prismicio/client";
  import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    onSnapshot,
    arrayUnion,
    arrayRemove,
  } from "firebase/firestore";

  export let product = {};

  let list = [];
  let isInProgress = false;

  const link = asLink(product.primary.link);
  const title = product.primary.product.title;
  const image = asImageSrc(product.items[0].image);
  const price = product.primary.product.variants[0].price;

  $: isInWhishlist = list?.find(R.propEq(link, "link"), list);

  const addToWhislist = async () => {
    isInProgress = true;

    if (R.isEmpty(list)) {
      await setDoc(doc(db, "whishlist", auth.currentUser.uid), {
        list: [],
      });
    }

    await updateDoc(doc(db, "whishlist", auth.currentUser.uid), {
      list: arrayUnion({
        title,
        link,
        image,
        price,
      }),
    });

    isInProgress = false;
  };

  const removeWhishlistItem = async () => {
    isInProgress = true;

    await updateDoc(doc(db, "whishlist", auth.currentUser.uid), {
      list: arrayRemove({
        title,
        link,
        image,
        price,
      }),
    });

    isInProgress = false;
  };

  whishlist.subscribe((_list) => (list = _list));
</script>

<button
  disabled="{isInProgress}"
  class:opacity-50="{isInProgress}"
  on:click="{isInWhishlist ? removeWhishlistItem : addToWhislist}"
  class="absolute right-4 top-4 z-[1]">
  <svg
    width="25"
    height="22"
    viewBox="0 0 25 22"
    fill="{isInWhishlist ? 'red' : 'white'}"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.7643 2.98245L12.3333 3.6447L12.9022 2.98245C14.0729 1.61967 15.8717 0.75 17.7333 0.75C21.0166 0.75 23.5833 3.30512 23.5833 6.59401C23.5833 8.60716 22.6812 10.4982 20.9403 12.6262C19.1911 14.7643 16.6745 17.0488 13.5697 19.8616L13.5686 19.8626L12.3333 20.9862L11.0979 19.8626L11.0968 19.8616C7.99205 17.0488 5.47543 14.7643 3.72624 12.6262C1.98527 10.4982 1.08325 8.60716 1.08325 6.59401C1.08325 3.30512 3.64993 0.75 6.93325 0.75C8.79478 0.75 10.5937 1.61967 11.7643 2.98245Z"
      stroke="{isInWhishlist ? 'red' : '#3D3D3D'}"
      stroke-width="1.5"></path>
  </svg>
</button>
