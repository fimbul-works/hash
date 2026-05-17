import { defineConfig, type UserConfig } from "tsdown";

const entryPoints = {
  bundle: "src/index.ts",
  integer: "src/integer/index.ts",
  stream: "src/stream/index.ts",
  util: "src/util/index.ts",
};

const commonConfig: UserConfig = {
  platform: "neutral",
  format: ["esm"],
  target: "es2022",
  dts: true,
  treeshake: true,
  outDir: "bundles",
  inputOptions: {
    optimization: {
      inlineConst: false,
    },
    experimental: {
      attachDebugInfo: "none",
    },
  },
};

export default defineConfig(
  Object.entries(entryPoints).map(([key, entry]) => ({
    entry: {
      [key]: entry,
    },
    ...commonConfig,
  })),
);
