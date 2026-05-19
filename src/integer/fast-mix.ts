/**
 * fastMix — High-speed symmetric 32-bit integer mixer.
 * Scrambles one or two numbers into one using multiply-xorshift.
 *
 * @param {number} a - First 32-bit integer to mix.
 * @param {number} [b=0] - Optional second 32-bit integer.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const fastMix = (a: number, b: number = 0): number => {
  let x = (a ^ b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
};

/**
 * fastUnmix — Reverses the fastMix 32-bit transformation.
 *
 * @param {number} hash - The mixed 32-bit integer.
 * @returns {number} The original unmixed 32-bit integer.
 */
export const fastUnmix = (hash: number): number => {
  let x = hash >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x119de1f3) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x119de1f3) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
};

/**
 * Verifies that a mixed hash was produced from the given data and parent.
 *
 * @param {number} mixed - The mixed hash to verify.
 * @param {number} a - The original first 32-bit integer (a).
 * @param {number} [b] - The original second 32-bit integer (b). Default: 0
 * @returns {boolean} `true` if the hash matches the data and parent.
 */
export const verifyFastMix = (mixed: number, a: number, b: number = 0): boolean =>
  (fastUnmix(mixed) ^ (b >>> 0)) === a >>> 0;
