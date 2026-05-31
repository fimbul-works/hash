# @fimbul-works/hash

[![license](https://img.shields.io/npm/l/%40fimbul-works%2Fhash?color=brightgreen&style=flat-square)](LICENSE)
[![npm version](https://img.shields.io/npm/v/%40fimbul-works%2Fhash?color=blue&style=flat-square)](https://www.npmjs.com/package/@fimbul-works/hash)
[![code style](https://img.shields.io/badge/code_style-biome-dfdbd6?style=flat-square)](https://biomejs.dev)
[![bundle size](https://img.shields.io/badge/bundle_size-ultra--light-blueviolet?style=flat-square)](#performance--bundle-size-leaderboard)

An ultra-lightweight, ESM-first mathematical toolkit for high-performance hashing, bijective integer mixing, coordinate pairing, and stream serialization. Part of the FimbulWorks PRNG and Noise stack.

---

## Key Differentiators

* **Strict Unix Philosophy**: Deconstructs hashing into raw, composable building blocks. Decouples byte serialization (`getBytes`), multi-dimensional mapping (`cantorPair`, `szudzikPair`), scrambling mixers (`fastMix`, `wangHash`), and floating-point normalizers (`intToFloat`, `int64ToDouble`).
* **Ultra-Lightweight & Tree-Shakeable**: Modularly bundled so that you only pay for what you import. Individual 32-bit algorithms like `fnv1a`, `crc32`, and `wangHash` compile to **under 1KB minified**, with the entire suite weighing just **4.25KB** when compressed with Brotli.
* **Zero Dependencies & High Portability**: Implemented in clean, modern TypeScript utilizing native bitwise operators, `Math.imul`, and DataViews, running flawlessly in Node.js, browsers, Bun, and edge environments.
* **Bijective (Invertible) Mixers**: Includes fully reversible 32-bit and 64-bit integer mixers (`fastMix` & `fastMix64`), enabling diagnostic un-mixing and validation of procedural generation pipeline chains.

---

## Installation

```bash
pnpm add @fimbul-works/hash
# or
npm install @fimbul-works/hash
# or
yarn add @fimbul-works/hash
```

---

## Features

### 1. Integer Hashing & Scrambling Mixers (Single Pass)
Ultra-fast bitwise scrambling for integer keys (entity IDs, seeds, grid offsets):
* **32-bit Mixers**: `fastMix`, `pcgMix`, `wangHash`, `splitMix`, `squirrel3`, `squirrel5`, `mulberry`, `jenkinsMix`.
* **64-bit Mixers**: `fastMix64`, `splitMix64`, `wangHash64`.

### 2. Stream & Buffer Hashing (Multi-Byte)
Highly optimized multi-byte block and stream hashing for strings and raw byte arrays:
* **Classic & Fast**: `crc32`, `crc64`, `fnv1a`, `fnv1a64`, `jenkinsHash`, `fxHash`, `fastHash`, `fastMixHash`, `jenkinsMixHash`.
* **Modern & Robust**: `xxHash`, `xxHash64`, `murmur3`, `murmur3Hash128`, `sipHash13`, `wyHash`.

### 3. Coordinate Pairing Functions
Bijectively map multidimensional coordinates (2D and 3D grids) into a single unique integer, and back:
* **Cantor Pairing**: `cantorPair()`, `reverseCantorPair()`.
* **Szudzik Pairing**: `szudzikPair()`, `reverseSzudzikPair()`, `szudzikPair3D()`, `reverseSzudzikPair3D()`.

### 4. Normalization & Conversion Utilities
* **Float Normalizers**: Map 32-bit integers uniformly to `[0, 1]` via `intToFloat()` and 64-bit integers to `[0, 1]` via `int64ToDouble()`.
* **Float Bitwise Extraction**: High-speed, non-allocating conversion of raw IEEE-754 bit patterns with `floatToBits32()` and `floatToBits64()`.
* **64-to-32-bit Folding**: Collapse 64-bit BigInt hashes into standard 32-bit unsigned integers preserving maximum entropy with `fold64To32()`.
* **Signed Integer Mapping**: Bijectively project signed integer boundaries ($(-\infty, \infty)$) onto non-negative coordinates ($[0, \infty)$) with `mapSignedInt()` and `unmapSignedInt()`.
* **Byte Normalizers**: Standardized, zero-overhead input serialization with `getBytes()`.

---

## Usage

### Composing a Seeded 2D Grid Noise Generator
By combining pairing, hashing, and float conversion, you can build custom, non-allocating grid noise in a few lines of code:

```typescript
import { szudzikPair, wangHash, intToFloat } from "@fimbul-works/hash";

/**
 * Get a deterministic pseudo-random float in range [0, 1] for 2D coordinates.
 * Perfect for zero-allocation procedural terrain generation loops.
 */
export function get2DGridNoise(x: number, y: number, seed: number = 0): number {
  // 1. Map 2D grid coordinates to a unique single unsigned integer
  const pairId = szudzikPair(x, y);

  // 2. Scramble the combined integer with the seed
  const scrambled = wangHash(pairId ^ seed);

  // 3. Convert the unsigned 32-bit hash to a uniform float [0, 1]
  return intToFloat(scrambled);
}

console.log(get2DGridNoise(10, 20)); // 0.38472911...
```

### Composing a Seeded 3D Noise Generator (with Negative Coordinates)
For infinite volumetric voxel chunk terrain generation that spans positive and negative quadrants:

```typescript
import { szudzikPair3D, wangHash, intToFloat, mapSignedInt } from "@fimbul-works/hash";

/**
 * Get a deterministic pseudo-random float for 3D coordinates.
 * Supports the entire signed 32-bit integer range natively.
 */
export function get3DGridNoise(x: number, y: number, z: number, seed: number = 0): number {
  // 1. Map signed integers bijectively to non-negative coordinates
  const ux = mapSignedInt(x);
  const uy = mapSignedInt(y);
  const uz = mapSignedInt(z);

  // 2. Map the 3D coordinates to a unique single non-negative integer
  const pairId = szudzikPair3D(ux, uy, uz);

  // 3. Scramble and convert to float in range [0, 1]
  return intToFloat(wangHash(pairId ^ seed));
}

console.log(get3DGridNoise(-10, -20, 30)); // 0.81239487...
```

### Invertible Integer Mixing for Pipeline Diagnostics
Bijective integer mixers allow you to step backward through coordinate mappings, making them highly powerful for path verification and procgen seed auditing:

```typescript
import { fastMix, fastUnmix, verifyFastMix } from "@fimbul-works/hash";

const originalSeed = 1337;
const parentSeed = 9999;

// Mix the seed with a hierarchical parent
const mixed = fastMix(originalSeed, parentSeed);

// Verify hierarchy without fully unmixing
const isValid = verifyFastMix(mixed, originalSeed, parentSeed); // true

// Step backward to recover the original seed
const unmixed = fastUnmix(mixed); // 1337
```

---

## Performance & Bundle Size Leaderboard

Benchmarks are run on a standard runtime environment. Integer mixing algorithms are measured with numeric keys, stream hashes are benchmarked against typical string keys/UUIDs, and pairing functions map coordinate fields.

### 1. Integer Hashing & Mixing (Numeric Keys)
Ideal for seed expansion, grid maps, and PRNG state transitions.

| Algorithm | Gen Speed (ops/s) | Entropy | Collision Rate | Bundle Size (Minified) |
| :--- | :---: | :---: | :---: | :---: |
| **fastMix** | 202,004,491 | 13.288 | 0.00% | 1.96KB (Grouped) |
| **pcgMix** | 141,431,293 | 13.288 | 0.00% | (Internal utility) |
| **wangHash** | 120,451,554 | 13.288 | 0.00% | 1.00KB |
| **splitMix** | 74,587,507 | 13.288 | 0.00% | 1.00KB |
| **squirrel5** | 57,921,521 | 13.288 | 0.00% | 1.10KB |
| **mulberry** | 41,400,674 | 13.262 | 1.31% | 1.00KB |
| **squirrel3** | 39,262,467 | 13.288 | 0.00% | 1.10KB |
| **jenkinsMix** | 34,284,984 | 13.288 | 0.00% | 1.00KB |
| **splitMix64** | 7,428,126 | 13.288 | 0.00% | 1.20KB (BigInt) |
| **fastMix64** | 6,502,475 | 13.288 | 0.00% | 1.20KB (BigInt) |
| **wangHash64** | 4,578,228 | 13.288 | 0.00% | 1.20KB (BigInt) |

> [!NOTE]
> 64-bit integer algorithms (`splitMix64`, `fastMix64`, `wangHash64`) use native JavaScript `bigint` which has significantly higher VM overhead than 32-bit double-precision numbers. For high-frequency loops, 32-bit mixers are recommended.

### 2. Stream & Buffer Hashing (String Keys / UUIDs)
Best for arbitrary object hashing, cache keys, and asset paths.

| Algorithm | Gen Speed (ops/s) | Entropy | Collision Rate | Bundle Size (Minified) |
| :--- | :---: | :---: | :---: | :---: |
| **fxHash** | 2,127,756 | 13.288 | 0.00% | **789B** |
| **fastMixHash** | 1,997,700 | 13.288 | 0.00% | 1.01KB |
| **crc32** | 1,951,884 | 13.288 | 0.00% | 794B |
| **murmur3Hash** | 1,866,905 | 13.288 | 0.00% | 1.10KB |
| **jenkinsMixHash** | 1,864,775 | 13.288 | 0.00% | 1.47KB |
| **jenkinsHash** | 1,913,135 | 13.288 | 0.00% | 688B |
| **fnv1aHash** | 1,654,602 | 13.288 | 0.00% | 704B |
| **fastHash** | 1,047,493 | 13.288 | 0.00% | 913B |
| **mash** | 845,016 | 13.288 | 0.00% | 806B |
| **xxHash** | 715,223 | 13.288 | 0.00% | 1.20KB |
| **fnv1a64Hash** | 550,573 | 13.288 | 0.00% | 709B (BigInt) |
| **crc64** | 412,227 | 13.288 | 0.00% | 837B (BigInt) |
| **wyHash** | 367,221 | 13.288 | 0.00% | 1.23KB |
| **murmur3Hash128**| 310,626 | 13.288 | 0.00% | 1.73KB |
| **xxHash64** | 228,030 | 13.288 | 0.00% | 1.40KB (BigInt) |
| **mash64** | 174,856 | 13.288 | 0.00% | 1.00KB (BigInt) |
| **sipHash13** | 164,824 | 13.288 | 0.00% | 1.37KB |

### 3. Pairing Functions (2D/3D Grid Coordinates)

| Algorithm | Gen Speed (ops/s) | Collision Rate | Bundle Size (Minified) |
| :--- | :---: | :---: | :---: |
| **szudzikPair** | 96,845,369 | 0.00% | 1.00KB |
| **cantorPair** | 49,689,871 | 0.00% | 1.00KB |
| **szudzikPair3D** | ~48,000,000 | 0.00% | 1.00KB (Composed) |

### 4. Normalization, Adaptation & Bitwise Utilities

High-speed, zero-allocation adapters to bridge coordinates, floats, and hash representations.

| Utility | Description | Speed (ops/s) | Bundle Size (Minified) |
| :--- | :--- | :---: | :---: |
| **mapSignedInt** | Projects negative coordinates to non-negative bounds | ~150,000,000+ | < 100B |
| **fold64To32** | XOR-collapses 64-bit BigInt to 32-bit uint preserving entropy | ~80,000,000+ | < 100B |
| **floatToBits32** | Extracts IEEE-754 bit pattern from 32-bit float | ~60,000,000+ | < 150B |

---

## Documentation

For full type signatures and module documentation, refer to the co-located [/docs](https://github.com/fimbul-works/hash/tree/main/docs) folder.

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built with ⚡ by [FimbulWorks](https://github.com/fimbul-works)
