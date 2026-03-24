import { getBytes } from "../util/get-bytes.js";

/**
 * Jenkins one-at-a-time hash.
 *
 * @param {unknown} data - The input data to hash
 * @returns {number} The computed Jenkins hash (32-bit unsigned)
 */
export const jenkinsHash = (data: unknown): number => {
  const bytes = getBytes(data);
  let hash = 0;
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
