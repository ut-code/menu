import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        theme_color: "#FBA01D",
        background_color: "#fff",
        lang: "ja",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "だるめし",
        name: "だるめし Dull Meshi",
        description: "献立提案システム",
        icons: [
          {
            src: "./icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "./icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "./icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
})
