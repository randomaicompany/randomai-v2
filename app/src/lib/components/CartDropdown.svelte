<script>
  import { fly } from "svelte/transition";

  export let isOpen = false;
  const toggle = () => (isOpen = !isOpen);
</script>

<div class="relative">
  <button
    on:click={toggle}
    class:bg-brand-smoke-darker={isOpen}
    class="z-10 rounded-full p-3 transition-all">
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

  {#if isOpen}
    <div
      transition:fly={{ duration: 300, y: 12 }}
      class="z-100 absolute right-1/2 top-full w-[24rem]">
      <ul class="rounded border bg-white text-left shadow-2xl">
        {#each [1, 2, 3] as idx}
          <li class="flex gap-2 border-b p-4 last:border-b-transparent">
            <div class="flex w-16 min-w-[4rem] border bg-brand-smoke">
              <img
                alt="front"
                class="object-cover"
                src="https://s3-alpha-sig.figma.com/img/fc8d/1ac1/977961541c5a5afa92658d098bae838e?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=OoaoWhx-6m1GDxT615RTaFSUxTtJ9fgI~x7txOO3-Vn0I7NdR-KJigP56UvZ1nfWVmDcNXmg76PVpx6aepti7lCZeR6mIx1nJpMRfyMs1lZKy0UYVRvwiL3FpRu71odIxs9SMYCfOQ0zS~VmN2SytNv79GdWcgoFtpPfIZyg-lG1jqdJNVMuVoPtYmyz2cEXBSoKdkHilOvNplzUpSiNdVplYD0q1zAhVRmlsrtaokQHeYNPO7B8kpBSJ53D7om4-C5cC-27i6J~-GvhnVDmDZHFQUzhvkL1~X9SY7EurDlaAu8bSTEqxsQ4bfjmnI~mwr3eQlxRLfjmy91yXtycuw__" />
            </div>

            <div class="flex w-16 min-w-[4rem] border bg-brand-smoke">
              <img
                alt="back"
                class="object-cover"
                src="https://s3-alpha-sig.figma.com/img/2fef/b59e/2905eab7563e6030c50fbb1026839671?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=mn406s98kBaGBimjOaVL34Nc0rPlYS6QiUN-rZ1jBN4OLL1SZZcoY~YLW57j~uuaneru0qWkGJIuF~hU3Ax76yqO6~P8hLwno1SpgjsjB6RW-CUptzfSCxWthcFfQ4ANvXsvn7yLcFRWcJovXCWZZv9EXzhhjRgymQ3z90sRkYHW0R~560dugmrY08LPI4213pnFd7bVJsLULlJExoQB8vKmBAqTPDE-Lq1I3a~ITN2L~02qVngMOsBS2JQYiOqXeiMybudJaNOzIYIx6v-YlrQquiiUCJS05-64pxWQYkZyq3qP9w8ZkU0UZZ420MWCtI2MxidJre3fvaslTKnq7w__" />
            </div>

            <div class="ml-4 flex-1">
              <div class="flex flex-col gap-2">
                <p class="font-medium">Hoodie in cotton</p>
                <p class="text-sm font-light">CA$40.00</p>
                <div>
                  <p class="text-sm">
                    Size: <span class="font-medium">M</span>
                  </p>
                  <p class="text-sm">
                    Color: <span class="font-medium">Black</span>
                  </p>
                </div>
              </div>
            </div>
          </li>
        {/each}

        <li class="flex w-full flex-col gap-2 p-4 pt-8">
          <a href="/cart" class="button secondary h-12 w-full font-normal"
            >View Cart</a>

          <a
            href="/checkout"
            class="button h-12 w-full border-brand-accent-light bg-brand-accent-light font-normal"
            >Checkout</a>
        </li>
      </ul>
    </div>
  {/if}
</div>
