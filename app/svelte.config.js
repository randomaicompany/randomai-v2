import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const config = {
  kit: {
    adapter: adapter(),
    alias: {
      root: "./*",
      src: "./src/*",
      api: "./src/lib/api/*",
      utils: "./src/lib/utils/*",
      stores: "./src/lib/stores/*",
      slices: "./src/lib/slices/*",
      components: "./src/lib/components/*"
    }
  },
  preprocess: vitePreprocess()
};
export default config;
