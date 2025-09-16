<script>
  /** @type {import("@prismicio/client").Content.CollectionProductCardSlice} */
  export let slice;

  import * as R from "ramda";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import {
    PrismicImage,
    PrismicLink,
    PrismicRichText,
    PrismicText
  } from "@prismicio/svelte";
  import { onMount } from "svelte";

  import Heart from "components/Heart.svelte";
  import { isFilled } from "@prismicio/client";

  let slider;
  let activeIdx = 0;
  let zoomContainers = [];

  const goToSlide = (idx) => () => (slider.go(idx), (activeIdx = idx));
  const handleSlideMove = (event) => (activeIdx = event.detail.index);

  const editorLink = `/editor/products/${slice.primary.link?.uid}?variant=${slice.primary.product?.image?.variant_ids?.[0] || slice.primary.product.id}`;

  // Initialize zoom functionality after component mounts
  onMount(() => {
    zoomContainers.forEach((container, index) => {
      if (container) {
        const img = container.querySelector("img");
        const overlay = container.querySelector(".zoom-overlay");

        if (img && overlay) {
          const zoomSrc = img.getAttribute("data-zoom") || img.src;

          const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate zoom position
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            // Update overlay background
            overlay.style.backgroundImage = `url('${zoomSrc}')`;
            overlay.style.backgroundSize = "200%"; // 2x zoom
            overlay.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
            overlay.style.backgroundRepeat = "no-repeat";
          };

          const handleMouseEnter = () => {
            overlay.style.opacity = "1";
            overlay.style.visibility = "visible";
          };

          const handleMouseLeave = () => {
            overlay.style.opacity = "0";
            overlay.style.visibility = "hidden";
          };

          container.addEventListener("mousemove", handleMouseMove);
          container.addEventListener("mouseenter", handleMouseEnter);
          container.addEventListener("mouseleave", handleMouseLeave);

          // Cleanup function
          return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseenter", handleMouseEnter);
            container.removeEventListener("mouseleave", handleMouseLeave);
          };
        }
      }
    });
  });

  // Function to get zoom URL for image - you'll need to adapt this to your image structure
  const getZoomUrl = (image, newWidth, newHeight) => {
    const imageUrl = image?.url || image?.src;
    if (!imageUrl) return "";

    const parsedUrl = new URL(imageUrl);

    parsedUrl.searchParams.set("w", newWidth);
    parsedUrl.searchParams.set("h", newHeight);

    // Replace this logic with however you determine the zoom URL from your image field
    return parsedUrl.toString();
  };
</script>

<div
  class="relative"
  data-slice-type={slice.slice_type}
  data-slice-variation={slice.variation}>
  <Heart product={slice} />
  <Splide
    on:move={handleSlideMove}
    bind:this={slider}
    options={{
      perPage: 1,
      rewind: true,
      arrows: false,
      pagination: false
    }}>
    {#each slice.items as { image }, index}
      <SplideSlide>
        <div
          class="zoom-container relative overflow-hidden"
          bind:this={zoomContainers[index]}>
          {#if slice.primary.link_text?.[0]?.text
            .trim()
            .toLowerCase() !== "buy now"}
            <a href={editorLink}>
              <PrismicImage
                class="h-96 w-full bg-brand-smoke-darker object-cover object-top"
                field={image}
                data-zoom={getZoomUrl(image, 1200, 1200)} />
            </a>
          {:else}
            <PrismicLink field={slice.primary.link}>
              <PrismicImage
                class="h-96 w-full bg-brand-smoke-darker object-cover object-top"
                field={image}
                data-zoom={getZoomUrl(image, 1200, 1200)} />
            </PrismicLink>
          {/if}
          <div
            class="zoom-overlay pointer-events-none absolute inset-0 transition-opacity duration-300"
            style="opacity: 0; visibility: hidden;">
          </div>
        </div>
      </SplideSlide>
    {/each}
  </Splide>

  <ul class="flex flex-wrap gap-2 py-4">
    {#each slice.items as { swatch }, idx}
      {@const isCurrent = R.equals(activeIdx, idx)}
      <li>
        <button
          class="rounded-full border outline-none ring-brand-primary ring-offset-1"
          class:ring-2={isCurrent}
          on:click={goToSlide(idx)}>
          <PrismicImage class="h-4 w-4 rounded-full" field={swatch} />
        </button>
      </li>
    {/each}
  </ul>

  <div class="flex min-h-[10rem] flex-col">
    <div class="flex-1">
      <p class="text-base font-medium">
        {#if slice.primary.link_text?.[0]?.text
          .trim()
          .toLowerCase() !== "buy now"}
          <a href={editorLink}>
            {slice?.primary?.product?.title || ""}
          </a>
        {:else}
          <PrismicLink field={slice.primary.link}>
            {slice?.primary?.product?.title || ""}
          </PrismicLink>
        {/if}
      </p>
      <p class="text-brand-gray mt-2 font-normal text-brand-primary/70">
        ${slice.primary.product.variants[0]?.price || ""}
      </p>

      {#if slice?.primary?.review_text}
        <div class="flex items-center justify-start gap-2 pt-2">
          <PrismicImage
            class="w-28 object-contain object-left"
            field={slice?.primary?.review_stars} />
          <p class="text-sm">{slice?.primary?.review_text || ""}</p>
        </div>
      {/if}
    </div>

    {#if isFilled.link(slice.primary.link)}
      {#if slice.primary.link_text?.[0]?.text
        .trim()
        .toLowerCase() !== "buy now"}
        <div class="pt-4">
          <a href={editorLink} class="button button-compact">
            <PrismicText field={slice.primary.link_text} />
          </a>
        </div>
      {:else}
        <div class="pt-4">
          <PrismicLink field={slice.primary.link} class="button button-compact">
            <PrismicText field={slice.primary.link_text} />
          </PrismicLink>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .zoom-container {
    position: relative;
    cursor: crosshair;
  }

  .zoom-overlay {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(1px);
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .zoom-container:hover .zoom-overlay {
    opacity: 1 !important;
    visibility: visible !important;
  }
</style>
