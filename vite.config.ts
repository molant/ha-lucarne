import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "ha-lucarne.js",
    },
    rollupOptions: {
      external: [],
    },
    outDir: "dist",
    sourcemap: true,
  },
});
