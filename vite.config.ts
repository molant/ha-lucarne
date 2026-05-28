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
    // The integration bundles and auto-registers this file; HACS ships it as part
    // of the integration package (HACS does not run a build). async_setup serves
    // only ha-lucarne.js, so sourcemaps are disabled (the .map wouldn't be served
    // and would be dead weight in the shipped integration).
    outDir: "custom_components/lucarne_family/frontend",
    sourcemap: false,
  },
});
