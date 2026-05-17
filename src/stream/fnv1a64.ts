import { U64_MAX } from "../constants.js";
import { getBytes } from "../util/get-bytes.js";

const FNV64_PRIME = 1099511628211n;
const FNV64_OFFSET = 14695981039346656037n;

/**
 * fnv1a64Hash — 64-bit variant of the Fowler–Noll–Vo hash.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {unknown} data - The input data to hash
 * @param {bigint} seed - Optional 64-bit seed (as a bigint, default: FNV64_OFFSET)
 * @returns {bigint} The computed 64-bit hash as a bigint
 */
export const fnv1a64Hash = (data: unknown, seed = FNV64_OFFSET): bigint => {
  const bytes = getBytes(data);
  let hash = seed & U64_MAX;

  for (let i = 0; i < bytes.length; i++) {
    hash = ((hash ^ BigInt(bytes[i])) * FNV64_PRIME) & U64_MAX;
  }

  return hash;
};
