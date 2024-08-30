import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],

  resolve: {
    alias: {
      root: "./*",
      src: "./src/*",
      utils: "./src/utils/*",
      components: "./src/lib/components/*",
    },
  },
});
