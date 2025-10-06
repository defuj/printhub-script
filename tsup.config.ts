import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  dts: false,
  minify: true,
  outDir: "dist",
  splitting: false,
  clean: true,
  tsconfig: "tsconfig.json",
  globalName: "PrintHub",
  platform: "browser",
  noExternal: ["qrcode", "jsbarcode"],
  esbuildOptions(options) {
    options.platform = "browser";
    options.mainFields = ["browser", "module", "main"];
    options.conditions = ["browser"];
  },
});
