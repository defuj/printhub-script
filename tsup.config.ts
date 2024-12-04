import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"], // Build for commonJS and ESmodules
  dts: false, // Generate declaration file (.d.ts)
  minify: true,
  outDir: "dist",
  splitting: false,
  clean: true,
  tsconfig: "tsconfig.json",
  globalName: "PrintHub",
});
