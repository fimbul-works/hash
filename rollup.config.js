import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig({
  input: { "util-hash": "src/index.ts" },
  output: [
    { dir: "dist", format: "esm", entryFileNames: "[name].js" },
    { dir: "dist", format: "cjs", entryFileNames: "[name].cjs" },
  ],
  plugins: [
    esbuild({ target: "esnext", platform: "browser" }),
  ],
  treeshake: "smallest",
});
