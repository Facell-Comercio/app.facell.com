import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      // Outras opções de configuração
      workbox: {
        // Você pode definir aqui as opções para cachear arquivos
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       serviceWorker: path.resolve(__dirname, 'src/service-worker.js'),
  //     },
  //   },
  // }
});
