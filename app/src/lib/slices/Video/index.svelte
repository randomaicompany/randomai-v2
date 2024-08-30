<script>
  export let slice;
  import clickOutside from "root/src/lib/utils/clickOutside";
  import { PrismicImage } from "@prismicio/svelte";
  import { fade, fly } from "svelte/transition";

  let openVideoModal = false;

  const toggle = () => (openVideoModal = !openVideoModal);
</script>

<section data-slice-type="{slice.slice_type}" data-slice-variation="{slice.variation}">
  <div class="flex items-end justify-center md:h-[700px]">
    <button on:click="{toggle}" class="relative w-full transition-opacity hover:opacity-80 group">
      <PrismicImage class="object-cover w-full h-[80vh]" field="{slice.primary.poster}" />
      <div class="absolute top-0 left-0 flex items-center justify-center w-full h-full">
        <svg
          width="64"
          height="64"
          viewBox="0 0 98 98"
          fill="none"
          class="transition-transform group-hover:scale-125"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1706_2116)">
            <path
              d="M49 0.46225C39.4002 0.46225 30.0159 3.30894 22.0339 8.64233C14.0519 13.9757 7.83072 21.5563 4.15702 30.4254C0.483311 39.2945 -0.477898 49.0538 1.39494 58.4692C3.26778 67.8846 7.89055 76.5332 14.6787 83.3213C21.4668 90.1095 30.1154 94.7322 39.5308 96.6051C48.9462 98.4779 58.7055 97.5167 67.5746 93.843C76.4437 90.1693 84.0243 83.9481 89.3577 75.9661C94.6911 67.9841 97.5378 58.5998 97.5378 49C97.5378 36.127 92.424 23.7812 83.3214 14.6786C74.2188 5.57603 61.873 0.46225 49 0.46225ZM74.8186 52.1029L33.2149 72.9048C32.6862 73.169 32.0987 73.2937 31.5083 73.2669C30.9178 73.2402 30.3441 73.0629 29.8414 72.752C29.3387 72.4411 28.9239 72.0069 28.6363 71.4905C28.3487 70.9742 28.1979 70.3929 28.1982 69.8019V28.1981C28.1985 27.6074 28.3497 27.0265 28.6376 26.5106C28.9254 25.9948 29.3403 25.561 29.8429 25.2505C30.3454 24.94 30.919 24.7631 31.5091 24.7365C32.0993 24.7099 32.6864 24.8346 33.2149 25.0986L74.8186 45.9005C75.3938 46.1887 75.8773 46.6313 76.2153 47.1787C76.5532 47.7261 76.7322 48.3567 76.7322 49C76.7322 49.6433 76.5532 50.2739 76.2153 50.8213C75.8773 51.3687 75.3938 51.8112 74.8186 52.0995V52.1029Z"
              fill="white"
              fill-opacity="0.7"></path>
          </g>
          <defs>
            <clipPath id="clip0_1706_2116">
              <rect width="98" height="98" fill="white"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
    </button>
  </div>
</section>

{#if openVideoModal}
  <div
    in:fade="{{ duration: 200 }}"
    out:fade="{{ duration: 200, delay: 200 }}"
    role="button"
    class="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-brand-primary/90">
    <div
      in:fly="{{ duration: 200, y: 24, delay: 200 }}"
      out:fly="{{ duration: 200, y: 24 }}"
      use:clickOutside
      on:clickOutside="{toggle}"
      class="flex items-center justify-center w-full max-w-4xl video-container h-96">
      {@html slice.primary.embed.html}
    </div>
  </div>
{/if}
