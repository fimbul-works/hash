import { getBytes } from "../util/get-bytes.js";
import { GOLDEN_RATIO_32 } from "../constants.js";

/**
 * FxHash32 — streaming variant of the FxHasher used in Firefox's Rust codebase.
 * Processes 4 bytes per iteration: rotate-left 5, XOR word, multiply by golden ratio.
 * Extremely cache-friendly; competes with xxHash32 on short inputs.
 *
 * @param {unknown} data - The input data to hash
 * @param {number} seed - Optional seed (defaul: 0)
 * @returns {number} A 32-bit unsigned hash
 */
export const fxHash = (data: unknown, seed = 0): number => {
  const bytes = getBytes(data);
  let hash = seed >>> 0;
  let i = 0;
  const len = bytes.length;

  while (i + 4 <= len) {
    const word = (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0;
    hash = Math.imul(((hash << 5) | (hash >>> 27)) ^ word, GOLDEN_RATIO_32) >>> 0;
    i += 4;
  }

  while (i < len) {
    hash = Math.imul(((hash << 5) | (hash >>> 27)) ^ bytes[i], GOLDEN_RATIO_32) >>> 0;
    i++;
  }

  return hash;
};
