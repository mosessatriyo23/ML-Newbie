import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" agar hasil build bisa dibuka dari subfolder (misalnya GitHub Pages).
export default defineConfig({
  base: "./",
  plugins: [react()],
  worker: { format: "es" },
  build: { chunkSizeWarningLimit: 2000 },
});
