<script>
  export let file;
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const blobURL = URL.createObjectURL(selectedFile);

        dispatch("change", {
          name: String(Date.now()),
          blobURL
        });

        const timeout = setTimeout(() => {
          URL.revokeObjectURL(blobURL);
          clearTimeout(timeout);
        }, 3000);
      };

      reader.readAsDataURL(selectedFile);
    } else {
      alert("Please select a valid file");
    }
  };
</script>

<div>
  <label
    for="file"
    class="group flex cursor-pointer items-center gap-1 text-xs text-brand-accent md:text-sm">
    <i class="material-symbols-rounded !text-xl">upload</i>
    <span class="block group-hover:underline">Upload Image</span>
  </label>
  <input
    id="file"
    class="hidden"
    type="file"
    bind:files={file}
    on:change={handleFileChange} />
</div>
