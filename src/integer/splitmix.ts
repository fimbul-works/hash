/**
 * SplitMix — 32-bit port of splitmix64.
 * Applies a golden-ratio increment then MurmurHash3-style finalization.
 * Outstanding distribution for sequential inputs; one of the fastest options
 * for integer-keyed procgen (terrain, noise, entity spawning).
 *
 * @param {number} n - 32-bit integer to hash.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const splitMix = (n: number): number => {
  n = (n + 0x9e3779b9) >>> 0;
  n ^= n >>> 16;
  n = Math.imul(n, 0x85ebca6b) >>> 0;
  n ^= n >>> 13;
  n = Math.imul(n, 0xc2b2ae35) >>> 0;
  n ^= n >>> 16;
  return n >>> 0;
};
