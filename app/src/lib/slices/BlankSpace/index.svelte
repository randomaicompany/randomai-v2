<script>
  export let slice;

  import * as R from "ramda";

  let innerWidth;
  $: isViewMobile = innerWidth < 768 ? true : false;
  $: height = isViewMobile ? getHeight(slice) / 2 : getHeight(slice);

  const getHeight = R.pipe(
    R.prop("primary"),
    R.cond([
      [R.propEq("Small", "size"), R.always(4)],
      [R.propEq("Medium", "size"), R.always(8)],
      [R.propEq("Large", "size"), R.always(16)],
      [R.propEq("Extra Large", "size"), R.always(24)],
      [R.T, R.always(4)],
    ])
  );
</script>

<svelte:window bind:innerWidth />

<div
  style="height: {height}rem"
  data-slice-type="{slice.slice_type}"
  data-slice-variation="{slice.variation}">
</div>
