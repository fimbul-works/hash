import { fastMix } from "../integer/fast-mix.js";
import { getBytes } from "../util/get-bytes.js";

/**
 * fastMixHash — fast, non-cryptographic streaming hash.
 * Streaming hash built on fastMix, consuming arbitrary data 8 bytes at a time.
 * Each 8-byte chunk is read as two 32-bit little-endian words and folded into
 * running state via fastMix. Total length is mixed in at the end for domain separation.
 *
 * @param {unknown} data - Input data to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const fastMixHash = (data: unknown, seed: number = 0): number => {
  const bytes = getBytes(data);
  const len = bytes.length;
  let state = seed >>> 0;
  let i = 0;

  while (i + 8 <= len) {
    const lo = (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0;
    const hi = (bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24)) >>> 0;
    state = fastMix(state ^ lo, hi);
    i += 8;
  }

  if (i < len) {
    let lo = 0,
      hi = 0;
    const rem = len - i;
    for (let j = 0; j < Math.min(4, rem); j++) lo |= bytes[i + j] << (j * 8);
    for (let j = 4; j < rem; j++) hi |= bytes[i + j] << ((j - 4) * 8);
    state = fastMix(state ^ (lo >>> 0), hi >>> 0);
  }

  return fastMix(state, len) >>> 0;
};
