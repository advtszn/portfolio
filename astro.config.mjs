// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://advtszn.xyz",
  output: "server",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  adapter: vercel({ webAnalytics: { enabled: true } }),
});
