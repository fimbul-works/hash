import { getBytes } from "../util/get-bytes.js";

/**
 * FxHash32 — streaming variant of the FxHasher used in Firefox's Rust codebase.
 * Processes 4 bytes per iteration: rotate-left 5, XOR word, multiply by golden ratio.
 * Extremely cache-friendly; competes with xxHash32 on short inputs.
 *
 * @param {unknown} data - Input data to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const fxHash = (data: unknown, seed: number = 0): number => {
  const bytes = getBytes(data);
  const len = bytes.length;
  let hash = seed >>> 0;
  let i = 0;

  while (i + 4 <= len) {
    const word = (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0;
    hash = Math.imul(((hash << 5) | (hash >>> 27)) ^ word, 0x9e3779b9) >>> 0;
    i += 4;
  }

  while (i < len) {
    hash = Math.imul(((hash << 5) | (hash >>> 27)) ^ bytes[i], 0x9e3779b9) >>> 0;
    i++;
  }

  return hash;
};
