/**
 * pcgMix — A high-quality 32-bit integer mixer based on Permuted Congruential Generator.
 *
 * @param {number} n - The 32-bit integer seed or state
 * @returns {number} A well-distributed 32-bit unsigned integer
 */
export const pcgMix = (n: number): number => {
  n = n >>> 0;
  const word = (((n >>> ((n >>> 28) + 4)) ^ n) * 277803737) >>> 0;
  return ((word >>> 22) ^ word) >>> 0;
};
