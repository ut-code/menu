/// <reference types="vitest" />
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    visualizer(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        theme_color: "#FBA01D",
        background_color: "#fff",
        lang: "ja",
        display: "standalone",
        scope: "/",
        start_url: "/?ref=a2hs",
        short_name: "だるめし",
        name: "だるめし Dull Meshi",
        description: "献立提案システム",
        icons: [
          {
            purpose: "any maskable",
            src: "./icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            purpose: "any maskable",
            src: "./icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            purpose: "any maskable",
            src: "./icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            purpose: "any maskable",
            src: "./icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
      external: [/^node:.*/],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
})
