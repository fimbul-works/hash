/**
 * fastMix64 — High-speed symmetric 64-bit integer mixer.
 * Scrambles one or two bigints into one using 64-bit multiply-xorshift.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {bigint} a - First 64-bit integer to mix.
 * @param {bigint} [b=0n] - Optional second 64-bit integer to mix.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const fastMix64 = (a: bigint, b: bigint = 0n): bigint => {
  const MASK64 = 0xffffffffffffffffn;
  let x = (a ^ b) & MASK64;
  x = (((x >> 32n) ^ x) * 0xd6e8feb86659fd93n) & MASK64;
  x = (((x >> 32n) ^ x) * 0xd6e8feb86659fd93n) & MASK64;
  return (x >> 32n) ^ x;
};

/**
 * fastUnmix64 — Reverses the fastMix64 transformation.
 *
 * @param {bigint} h - The mixed 64-bit integer.
 * @returns {bigint} The original unmixed 64-bit integer.
 */
export const fastUnmix64 = (h: bigint): bigint => {
  const MASK64 = 0xffffffffffffffffn;
  let x = h & MASK64;
  x = (((x >> 32n) ^ x) * 0xcfee444d8b59a89bn) & MASK64;
  x = (((x >> 32n) ^ x) * 0xcfee444d8b59a89bn) & MASK64;
  return (x >> 32n) ^ x;
};

/**
 * Verifies that a 64-bit mixed hash was produced from the given data and parent.
 *
 * @param {bigint} mixed - The mixed 64-bit hash to verify.
 * @param {bigint} data - The original 64-bit integer (a).
 * @param {bigint} [parent] - The parent 64-bit integer (b). Default: 0n
 * @returns {boolean} `true` if the hash matches the data and parent.
 */
export const verifyFastMix64 = (mixed: bigint, data: bigint, parent: bigint = 0n): boolean =>
  (fastUnmix64(mixed) ^ parent) === data;
