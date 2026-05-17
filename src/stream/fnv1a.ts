import { U32_MAX_BIG } from "../constants.js";
import { getBytes } from "../util/get-bytes.js";

const FNV_PRIME_32 = 16777619n;
const FNV_OFFSET_32 = 2166136261n;

/**
 * Compute the Fowler–Noll–Vo 1a 32-bit hash of the input data.
 *
 * This function uses BigInt internally for intermediate calculations
 * to handle 32-bit overflow correctly, which has higher overhead than imul-based hashes.
 *
 * @param {unknown} data - The input data to hash
 * @returns {number} The computed FNV-1a hash
 */
export const fnv1aHash = (data: unknown): number => {
  const bytes = getBytes(data);
  let hash = FNV_OFFSET_32;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i]);
    hash = (hash * FNV_PRIME_32) & U32_MAX_BIG;
  }
  return Number(hash);
};
