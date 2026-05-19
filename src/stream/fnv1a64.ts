import { getBytes } from "../util/get-bytes.js";

/**
 * fnv1a64Hash — 64-bit variant of the Fowler–Noll–Vo hash.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {unknown} data - Input data to hash.
 * @param {bigint} [seed=14695981039346656037n] - Optional seed.
 * @returns {bigint} The computed 64-bit hash as a bigint
 */
export const fnv1a64Hash = (data: unknown, seed: bigint = 14695981039346656037n): bigint => {
  const MASK64 = 0xffffffffffffffffn;
  const bytes = getBytes(data);
  let hash = seed & MASK64;
  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash ^ BigInt(bytes[i])) * 1099511628211n) & MASK64;
  }
  return hash;
};
