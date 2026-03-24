import { GOLDEN_RATIO_32, MH3_FINAL1, MH3_FINAL2 } from "../constants.js";

/**
 * SplitMix — 32-bit port of splitmix64.
 * Applies a golden-ratio increment then MurmurHash3-style finalization.
 * Outstanding distribution for sequential inputs; one of the fastest options
 * for integer-keyed procgen (terrain, noise, entity spawning).
 *
 * @param {number} n - The integer input
 * @returns {number} A 32-bit unsigned hash
 */
export const splitMix = (n: number): number => {
  n = (n + GOLDEN_RATIO_32) >>> 0;
  n ^= n >>> 16;
  n = Math.imul(n, MH3_FINAL1) >>> 0;
  n ^= n >>> 13;
  n = Math.imul(n, MH3_FINAL2) >>> 0;
  n ^= n >>> 16;
  return n >>> 0;
};
