<script>
  import user from "root/src/lib/stores/user";
  //
  import { asImageSrc } from "@prismicio/client";
  import { createEventDispatcher } from "svelte";
  import { PrismicImage } from "@prismicio/svelte";
  import { uploadImage } from "root/src/lib/api/firebase/storage";
  import {
    addDocument,
    fetchDocumentsByUserId
  } from "root/src/lib/api/firebase/firestore";
  //
  import UploadImage from "components/Designer/UploadImage.svelte";

  //
  let currentUser = $derived($user);
  let userId = $derived(currentUser?.uid);
  const dispatch = createEventDispatcher();

  let isLoadingImages = $state(true);
  let isUploadingInProgress = $state(false);

  let { images = $bindable([]), gallery = [] } = $props();

  const selectImage = (url) => () => dispatch("select", url);

  const loadImages = async () => {
    isLoadingImages = true;
    const docs = await fetchDocumentsByUserId("images", userId);
    images = docs;
    isLoadingImages = false;
    return images;
  };

  const handleFileUpload = async ({ detail: { name, blobURL } }) => {
    isUploadingInProgress = true;
    const url = await uploadImage(blobURL, `images/${name}`);
    await addDocument("images", {
      url,
      userId
    });

    await loadImages();
    isUploadingInProgress = false;
  };
</script>

<div class="flex items-center justify-between pb-4 text-sm">
  <p class="heading-base">Images</p>
  <div>
    {#if isUploadingInProgress}
      <p class=" text-brand-accent-light">Please wait...</p>
    {:else}
      <UploadImage on:change={handleFileUpload} />
    {/if}
  </div>
</div>

<ul class="flex gap-2 overflow-x-auto">
  {#if userId}
    {#await loadImages()}
      {#if isLoadingImages}
        <p>Please wait...</p>
      {:else}
        {#each images as { url } (url)}
          <li>
            <button onclick={selectImage(url)}>
              <img
                width="96"
                height="96"
                src={url}
                alt="user generated art"
                class="bg-gray h-16 w-16 min-w-[4rem] border object-contain transition-opacity hover:opacity-90 md:h-24 md:w-24 md:min-w-[6rem]" />
            </button>
          </li>
        {:else}
          {#each gallery as { image } (image.url || image.src)}
            <button onclick={selectImage(asImageSrc(image))}>
              <PrismicImage
                field={image}
                class="md:w-24 md:h-24 md:min-w-[6rem] w-16 h-16 min-w-[4rem] object-contain  hover:opacity-90 transition-opacity" />
            </button>
          {/each}
        {/each}
      {/if}
    {/await}
  {/if}
</ul>
