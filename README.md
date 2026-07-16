# @fimbul-works/hash

[![license](https://img.shields.io/npm/l/%40fimbul-works%2Fhash?color=brightgreen&style=flat-square)](LICENSE)
[![npm version](https://img.shields.io/npm/v/%40fimbul-works%2Fhash?color=blue&style=flat-square)](https://www.npmjs.com/package/@fimbul-works/hash)
[![code style](https://img.shields.io/badge/code_style-biome-dfdbd6?style=flat-square)](https://biomejs.dev)
[![bundle size](https://img.shields.io/badge/bundle_size-ultra--light-blueviolet?style=flat-square)](#performance--bundle-size-leaderboard)

An ultra-lightweight, ESM-first mathematical toolkit for high-performance hashing, bijective integer mixing, coordinate pairing, and stream serialization.

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

## Documentation

For full type signatures and module documentation, refer to the co-located [/docs](https://github.com/fimbul-works/hash/tree/main/docs) folder.

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built with ⚡ by [FimbulWorks](https://github.com/fimbul-works)
