# @fimbul-works/util-hash

A comprehensive collection of high-performance hashing algorithms for TypeScript and JavaScript.

[![npm version](https://badge.fury.io/js/%40fimbul-works%2Futil-hash.svg)](https://www.npmjs.com/package/@fimbul-works/util-hash)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/microsoft/TypeScript)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@fimbul-works/util-hash)](https://bundlephobia.com/package/@fimbul-works/util-hash)

## ✨ Highlights

- **🎯 Type Safe**: Full TypeScript support with strict typing for all algorithms.
- **⚡ High Performance**: Optimized implementations of modern and classic hashing functions.
- **🌳 Tree-Shakeable**: Import only the specific algorithms you need.
- **🧮 Comprehensive**: Covers stream hashing, integer hashing, PRNGs, and pairing functions.
- **📦 Zero Dependencies**: Lightweight and portable across various environments.

## 📦 Installation

```bash
pnpm add @fimbul-works/util-hash
# or
npm install @fimbul-works/util-hash
# or
yarn add @fimbul-works/util-hash
```

## 🚀 Quick Start

```typescript
import { xxHash, cantorPair, hashToFloat } from '@fimbul-works/util-hash';

// Stream hashing (string or buffer)
const hash = xxHash('Hello, FimbulWorks!');
console.log(hash); // 32-bit integer hash

// Pairing integers into a unique single value
const pair = cantorPair(10, 20);
console.log(pair); // 495

// Convert a 32-bit hash to a float in [0, 1)
const randomFloat = hashToFloat(hash);
console.log(randomFloat);
```

## 📖 API Overview

The library exports a wide variety of algorithms, grouped logically by their use case:

### 🌊 Stream & Buffer Hashing
High-performance algorithms for hashing strings or byte buffers:
- `xxHash`, `xxHash64`
- `murmur3Hash`, `murmur3Hash128`
- `sipHash13`
- `wyHash`
- `fnv1aHash`, `fnv1a64Hash`
- `jenkinsHash`
- `crc32`, `crc64`

### 🔢 Integer Hashing (Single Pass)
Fast, non-cryptographic hashes for single integer values:
- `fastHash`, `fastMixHash`
- `jenkinsMixHash`
- `fxHash`
- `wangHash`, `wangHash64`

### 🎲 PRNGs & Mashes
Algorithms for pseudo-random number generation and state mashing:
- `squirrel3`, `squirrel5`
- `splitMix`, `splitMix64`
- `mulberry`
- `createMash`, `createMash64`

### 🛠️ Mixing & Bitwise Utilities
Low-level building blocks for custom hashing and bit manipulation:
- `fastMix`, `fastMix64`, `pcgMix`, `jenkinsMix`
- `fastUnmix`, `fastUnmix64`
- `verifyFastMix`, `verifyFastMix64`
- `clampBits`

> [!TIP]
> `fastMix` and `fastMix64` are **bijective (invertible)**. This is a powerful property for diagnostics and debugging, allowing you to "un-mix" a value to verify calculation chains.

### 🖇️ Pairing Functions
Map two non-negative integers to a single unique integer, and back:
- `cantorPair`, `reverseCantorPair`
- `szudzikPair`, `reverseSzudzikPair`

### 🔄 Conversion Utilities
Helpers for transforming hash results between formats:
- `hashToFloat`, `hash64ToDouble`
- `getBytes`

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

Built with ⚡ by [FimbulWorks](https://github.com/fimbul-works)
