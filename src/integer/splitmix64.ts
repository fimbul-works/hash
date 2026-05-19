/**
 * splitMix64 — A high-quality 64-bit integer mixer.
 * Often used to initialize PRNGs or as a fast hash for 64-bit keys.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} n - 64-bit integer to hash.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const splitMix64 = (n: bigint): bigint => {
  const MASK64 = 0xffffffffffffffffn;
  n = ((n ^ (n >> 30n)) * 0xff51afd7ed558ccdn) & MASK64;
  n = ((n ^ (n >> 27n)) * 0xc4ceb9fe1a85ec53n) & MASK64;
  n = n ^ (n >> 31n);
  return n;
};
