import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      wailsjs: path.resolve(__dirname, "./src/shared/lib/wailsjs/go/main/App"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
