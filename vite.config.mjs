import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vite.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  lib: {
    entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    name: "PrintHub",
    fileName: (format) => `printhub.${format}.js`,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  buildEnd() {
    mkdirSync("dist", { recursive: true });
  },
});
