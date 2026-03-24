import { FAST_MIX_MUL_64, FAST_UNMIX_MUL_64, U64_MAX } from "../constants.js";

/**
 * fastMix64 — High-speed symmetric 64-bit integer mixer.
 * Scrambles one or two bigints into one using 64-bit multiply-xorshift.
 *
 * @remark This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} a - First bigint to mix
 * @param {bigint} [b=0n] - Optional second bigint to mix (XORed with a, default: 0)
 * @returns {bigint} A well-distributed 64-bit unsigned bigint
 */
export const fastMix64 = (a: bigint, b = 0n): bigint => {
  let x = (a ^ b) & U64_MAX;
  x = (((x >> 32n) ^ x) * FAST_MIX_MUL_64) & U64_MAX;
  x = (((x >> 32n) ^ x) * FAST_MIX_MUL_64) & U64_MAX;
  return (x >> 32n) ^ x;
};

/**
 * fastUnmix64 — Reverses the fastMix64 transformation.
 *
 * @param {bigint} h - The mixed 64-bit bigint
 * @returns {bigint} The original unmixed bigint
 */
export const fastUnmix64 = (h: bigint): bigint => {
  let x = h & U64_MAX;
  x = (((x >> 32n) ^ x) * FAST_UNMIX_MUL_64) & U64_MAX;
  x = (((x >> 32n) ^ x) * FAST_UNMIX_MUL_64) & U64_MAX;
  return (x >> 32n) ^ x;
};

/**
 * Verifies that a 64-bit mixed hash was produced from the given data and parent.
 *
 * @param {bigint} mixed - The mixed 64-bit hash to verify
 * @param {bigint} data - The original data bigint (a)
 * @param {bigint} [parent=0n] - The parent bigint (b, default: 0n)
 * @returns {boolean} True if the hash matches the data and parent
 */
export const verifyFastMix64 = (mixed: bigint, data: bigint, parent = 0n): boolean =>
  (fastUnmix64(mixed) ^ parent) === data;
