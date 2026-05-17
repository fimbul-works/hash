import { U64_MAX } from "../constants.js";

/**
 * wangHash64 — A 64-bit integer mixer that provides high avalanche.
 * This is based on Thomas Wang's 64-bit mix function.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} n - The 64-bit integer to hash (as a bigint)
 * @returns {bigint} The mixed 64-bit integer
 */
export const wangHash64 = (n: bigint): bigint => {
  n = (~n + (n << 21n)) & U64_MAX; // key = (key << 21) - key - 1;
  n = n ^ (n >> 24n);
  n = (n + (n << 3n) + (n << 8n)) & U64_MAX; // key * 265
  n = n ^ (n >> 14n);
  n = (n + (n << 2n) + (n << 4n)) & U64_MAX; // key * 21
  n = n ^ (n >> 28n);
  n = (n + (n << 31n)) & U64_MAX;
  return n;
};
