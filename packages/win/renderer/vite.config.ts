import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss(), react()],

  resolve: {
    alias: {
      "@src": path.join(__dirname, "src"),
      "@utils": path.join(__dirname, "src/utils"),
    },
  },
  build: {
    outDir: "../dist-renderer",
    minify: false,
    sourcemap: true,
    rollupOptions: {
      //
    },
  },
});
