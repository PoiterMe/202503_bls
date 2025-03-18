// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import pagefind from "astro-pagefind";
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "static",
  outDir: "docs",
  integrations: [pagefind(), alpinejs(), mdx(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
