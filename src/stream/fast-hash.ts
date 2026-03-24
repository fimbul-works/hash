import { getBytes } from "../util/get-bytes.js";

const FASTHASH_MULT = 0x2127599;

/**
 * fastHash — a simple and fast non-cryptographic hash function.
 * Adaptation of the FastHash algorithm by Zilong Tan.
 *
 * @param {unknown} data - The input data to hash
 * @param {number} seed - Optional seed value (default: 0)
 * @returns {number} The computed 32-bit unsigned hash
 */
export const fastHash = (data: unknown, seed = 0): number => {
  const bytes = getBytes(data);
  const len = bytes.length;
  let h = (seed ^ len) >>> 0;

  const mix = (v: number): number => {
    v ^= v >>> 23;
    v = Math.imul(v, FASTHASH_MULT) >>> 0;
    v ^= v >>> 33;
    v = Math.imul(v, FASTHASH_MULT) >>> 0;
    v ^= v >>> 10;
    return v >>> 0;
  };

  let i = 0;
  while (i + 4 <= len) {
    const w = (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0;
    h ^= mix(w);
    h = Math.imul(h, FASTHASH_MULT) >>> 0;
    i += 4;
  }

  if (i < len) {
    let tail = 0;
    const rem = len - i;
    for (let j = 0; j < rem; j++) {
      tail |= bytes[i + j] << (j * 8);
    }
    h ^= mix(tail >>> 0);
    h = Math.imul(h, FASTHASH_MULT) >>> 0;
  }

  return mix(h);
};
