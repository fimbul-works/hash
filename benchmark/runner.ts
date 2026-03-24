import * as fs from "node:fs";
import { performance } from "node:perf_hooks";
import { bench, group, run } from "mitata";
import * as integerHashes from "../src/integer/index.js";
import { createMash, createMash64 } from "../src/mash/index.js";
import * as pairHashes from "../src/pair/index.js";
import * as streamHashes from "../src/stream/index.js";
import { clampBits } from "../src/util/clamp-bits.js";
import { getBenchmarkData } from "./data.js";
import { calculateCollisionRate, calculateEntropy } from "./metrics.js";

type Algo = { name: string; fn: (...args: any[]) => number | bigint; supportsStrings: boolean };
type PairAlgo = { name: string; fn: (...args: any[]) => number[]; supportsStrings: boolean };

const DATA_COUNT = 10000;
const { numbers, paths, uuids } = getBenchmarkData(DATA_COUNT);

const allAlgos = [
  ...Object.entries(integerHashes).map(([name, fn]) => ({ name, fn, supportsStrings: false })),
  ...Object.entries(streamHashes).map(([name, fn]) => ({ name, fn, supportsStrings: true })),
  { name: "mash", fn: createMash(), supportsStrings: true },
  { name: "mash64", fn: createMash64(), supportsStrings: true },
] as Algo[];

const pairAlgos = Object.entries(pairHashes).map(([name, fn]) => ({
  name: `pair:${name}`,
  fn: (v: any) => fn(v, v),
  supportsStrings: false,
})) as PairAlgo[];

const bitWidths = [8, 16, 20, 24, 32, 53, 64];

console.log(`\n=== Hashing Benchmark Suite ===`);
console.log(`Data count: ${DATA_COUNT}\n`);

const bigIntHashes = new Set([
  "wangHash64",
  "splitMix64",
  "fnv1a64Hash",
  "murmur3Hash128",
  "crc64",
  "wyHash",
  "xxHash64",
  "fastMix64",
  "fastUnmix64",
]);

// --- 1. Speed Benchmarks ---
group("Speed: Numeric Keys (1 to 10k)", () => {
  for (const { name, fn } of allAlgos) {
    const isBigInt = bigIntHashes.has(name);
    bench(name, () => {
      for (let i = 0; i < numbers.length; i++) {
        const n = numbers[i];
        const input = isBigInt ? BigInt(n) : n;
        const a1 = isBigInt ? BigInt((n * 0x45d9f3b) >>> 0) : (n * 0x45d9f3b) >>> 0;
        const a2 = isBigInt ? BigInt((n * 0x9e3779b1) >>> 0) : (n * 0x9e3779b1) >>> 0;
        fn(input as any, a1 as any, a2 as any);
      }
    });
  }
});

group("Speed: Pairing Functions", () => {
  for (const { name, fn } of pairAlgos) {
    bench(name, () => {
      for (let i = 1; i < numbers.length; i++) {
        fn(numbers[i], numbers[i - 1]);
      }
    });
  }
});

group("Speed: String Keys (Route Paths)", () => {
  // Only test algorithms that support string/arbitrary data
  for (const { name, fn, supportsStrings } of allAlgos) {
    if (!supportsStrings) continue;
    bench(name, () => {
      for (let i = 0; i < paths.length; i++) {
        fn(paths[i]);
      }
    });
  }
});

group("Speed: String Keys (UUIDs)", () => {
  // Only test algorithms that support string/arbitrary data
  for (const { name, fn, supportsStrings } of allAlgos) {
    if (!supportsStrings) continue;
    bench(name, () => {
      for (let i = 0; i < uuids.length; i++) {
        fn(uuids[i]);
      }
    });
  }
});

// --- 2. Entropy & Collision Analysis ---
let report = `=== Entropy & Quality Analysis (on ${DATA_COUNT} items) ===\n`;
report += `Format: [Algo] | [Bits] | Entropy (Max is ~9.96) | Collisions (%) | Speed (ops/s)\n`;
report += `--------------------------------------------------------------------------------\n`;

const runEntropyTest = (label: string, list: (Algo | PairAlgo)[], testData?: any[]) => {
  report += `\n--- ${label} ---\n`;
  for (const { name, fn, supportsStrings } of list) {
    const dataToTest = testData ?? (supportsStrings ? paths : numbers);
    const typeLabel = testData ? "" : supportsStrings ? "(strings)" : "(numbers)";
    const isBigInt = bigIntHashes.has(name) || name.includes("64") || name.includes("128");

    // Measure baseline speed for the algorithm
    const timingIterations = 100;
    const start = performance.now();
    for (let j = 0; j < timingIterations; j++) {
      for (let i = 0; i < dataToTest.length; i++) {
        const d = dataToTest[i];
        const input = isBigInt && typeof d === "number" ? BigInt(d) : d;
        fn(input as any);
      }
    }
    const end = performance.now();
    const opsPerSec = Math.round((dataToTest.length * timingIterations) / ((end - start) / 1000));

    report += `Algo: ${name} ${typeLabel} | Baseline Speed: ${opsPerSec.toLocaleString()} ops/s\n`;

    for (const bits of bitWidths) {
      const results: (number | bigint)[] = dataToTest.map((d, i) => {
        const input = isBigInt && typeof d === "number" ? BigInt(d) : d;

        // If numeric hashing, pass multiple params for algorithms like jenkinsMix
        if (typeof d === "number" && !supportsStrings) {
          const a1 = isBigInt ? BigInt((d * 0x45d9f3b) >>> 0) : (d * 0x45d9f3b) >>> 0;
          const a2 = isBigInt ? BigInt((d * 0x9e3779b1) >>> 0) : (d * 0x9e3779b1) >>> 0;
          const h = fn(input as any, a1 as any, a2 as any);
          return clampBits(h as any, bits as any);
        }

        const h = fn(input as any);
        return clampBits(h as any, bits as any);
      });

      const entropy = calculateEntropy(results).toFixed(3);
      const collisions = (calculateCollisionRate(results) * 100).toFixed(2);

      report += `${name.padEnd(18)} | ${bits.toString().padEnd(4)} | ${entropy.padEnd(7)} | ${collisions}% | ${opsPerSec.toLocaleString().padEnd(12)} ops/s\n`;
    }
    report += `--------------------------------------------------------------------------------\n`;
  }
};

runEntropyTest(
  "General Hashing (Numbers)",
  allAlgos.filter((a) => !a.name.startsWith("verify")),
);
runEntropyTest(
  "General Hashing (Paths)",
  allAlgos.filter((a) => a.supportsStrings && !a.name.startsWith("verify")),
  paths,
);
runEntropyTest(
  "General Hashing (UUIDs)",
  allAlgos.filter((a) => a.supportsStrings && !a.name.startsWith("verify")),
  uuids,
);
runEntropyTest(
  "Pairing Functions",
  pairAlgos.filter((a) => !a.name.toLowerCase().includes("reverse")),
);

console.log(report);
fs.writeFileSync("benchmark_results.txt", report);

// Run the high-precision speed benchmarks
await run();
