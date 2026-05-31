import { readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { defineConfig, type UserConfig } from "tsdown";

const entryPoints: Record<string, string> = {
  bundle: "src/index.ts",
  integer: "src/integer/index.ts",
  stream: "src/stream/index.ts",
  util: "src/util/index.ts",
};

const addDirectoryToEntries = (dir: string): void =>
  readdirSync(dir)
    .filter((file: string) => file !== "index.ts" && !file.includes(".test."))
    .forEach((file) => {
      entryPoints[basename(file, extname(file))] = join(dir, file);
    });

addDirectoryToEntries("src/stream");
addDirectoryToEntries("src/mash");
addDirectoryToEntries("src/integer");
addDirectoryToEntries("src/pair");

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

const mainBundles = ["bundle", "integer", "stream", "util"];

export default defineConfig(
  Object.entries(entryPoints).map(([key, entry]) => ({
    entry: {
      [key]: entry,
    },
    ...commonConfig,
    dts: mainBundles.includes(key),
  })),
);
