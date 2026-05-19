/**
 * wangHash64 — A 64-bit integer mixer that provides high avalanche.
 * This is based on Thomas Wang's 64-bit mix function.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} n - The 64-bit integer to hash.
 * @returns {bigint} The mixed 64-bit integer.
 */
export const wangHash64 = (n: bigint): bigint => {
  const MASK64 = 0xffffffffffffffffn;
  n = (~n + (n << 21n)) & MASK64;
  n = n ^ (n >> 24n);
  n = (n + (n << 3n) + (n << 8n)) & MASK64;
  n = n ^ (n >> 14n);
  n = (n + (n << 2n) + (n << 4n)) & MASK64;
  n = n ^ (n >> 28n);
  n = (n + (n << 31n)) & MASK64;
  return n;
};
