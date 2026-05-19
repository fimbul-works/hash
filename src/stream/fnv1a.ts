import { getBytes } from "../util/get-bytes.js";

/**
 * Compute the Fowler–Noll–Vo 1a 32-bit hash of the input data.
 *
 * This function uses BigInt internally for intermediate calculations
 * to handle 32-bit overflow correctly, which has higher overhead than imul-based hashes.
 *
 * @param {unknown} data - Input data to hash
 * @param {number} [seed=2166136261] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const fnv1aHash = (data: unknown, seed: number = 2166136261): number => {
  const bytes = getBytes(data);
  let hash = BigInt(seed) & 0xffffffffn;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= BigInt(bytes[i]);
    hash = (hash * 16777619n) & 0xffffffffn;
  }
  return Number(hash);
};
