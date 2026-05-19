/**
 * mulberry — A very fast and simple 32-bit integer mixer.
 * Great for generating a stream of randomness from a single seed.
 *
 * @param {number} n - 32-bit integer to hash.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const mulberry = (n: number): number => {
  n = ((n | 0) + 0x6d2b79f5) | 0;
  let t = Math.imul(n ^ (n >>> 15), n | 1);
  t = (t + Math.imul(t ^ (t >>> 7), t | 61)) | 0;
  return (t ^ (t >>> 14)) >>> 0;
};
