import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";

import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";

/** @type {import('eslint').Linter.Config[]} */
const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default [
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  js.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.js"]
  }
];
