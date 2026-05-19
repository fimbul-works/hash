import { getBytes } from "../util/get-bytes.js";

/**
 * Jenkins one-at-a-time hash.
 *
 * @param {unknown} data - Input data to hash
 * @param {number} [seed=0] - Optional seed value.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const jenkinsHash = (data: unknown, seed: number = 0): number => {
  const bytes = getBytes(data);
  let hash = seed >>> 0;
  for (let i = 0; i < bytes.length; i++) {
    hash += bytes[i];
    hash += hash << 10;
    hash ^= hash >>> 6;
  }
  hash += hash << 3;
  hash ^= hash >>> 11;
  hash += hash << 15;
  return hash >>> 0;
};
