import { MH3_FINAL_64_1, MH3_FINAL_64_2, U64_MAX } from "../constants.js";

/**
 * splitMix64 — A high-quality 64-bit integer mixer.
 * Often used to initialize PRNGs or as a fast hash for 64-bit keys.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} n - The 64-bit integer to hash
 * @returns {bigint} The mixed 64-bit integer
 */
export const splitMix64 = (n: bigint): bigint => {
  n = ((n ^ (n >> 30n)) * MH3_FINAL_64_1) & U64_MAX;
  n = ((n ^ (n >> 27n)) * MH3_FINAL_64_2) & U64_MAX;
  n = n ^ (n >> 31n);
  return n;
};
