import { FAST_MIX_MUL_32, FAST_UNMIX_MUL_32 } from "../constants.js";

/**
 * fastMix — High-speed symmetric 32-bit integer mixer.
 * Scrambles one or two numbers into one using multiply-xorshift.
 *
 * @param {number} a - First number to mix
 * @param {number} [b=0] - Optional second number to mix (XORed with a, default: 0)
 * @returns {number} A well-distributed 32-bit unsigned integer
 */
export const fastMix = (a: number, b = 0): number => {
  let x = (a ^ b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), FAST_MIX_MUL_32) >>> 0;
  x = Math.imul(x ^ (x >>> 16), FAST_MIX_MUL_32) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
};

/**
 * fastUnmix — Reverses the fastMix 32-bit transformation.
 *
 * @param {number} h - The mixed 32-bit integer
 * @returns {number} The original unmixed integer
 */
export const fastUnmix = (h: number): number => {
  let x = h >>> 0;
  x = Math.imul(x ^ (x >>> 16), FAST_UNMIX_MUL_32) >>> 0;
  x = Math.imul(x ^ (x >>> 16), FAST_UNMIX_MUL_32) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
};

/**
 * Verifies that a mixed hash was produced from the given data and parent.
 *
 * @param {number} mixed - The mixed hash to verify
 * @param {number} data - The original data hash (a)
 * @param {number} [parent=0] - The parent hash (b, default: 0)
 * @returns {boolean} True if the hash matches the data and parent
 */
export const verifyFastMix = (mixed: number, data: number, parent = 0): boolean =>
  (fastUnmix(mixed) ^ (parent >>> 0)) === data >>> 0;
