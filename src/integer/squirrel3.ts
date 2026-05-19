/**
 * Squirrel3 — by Squirrel Eiserloh (GDC 2017).
 * Fast, high-quality integer hash designed for procedural generation.
 * Maps any (position, seed) pair to a well-distributed 32-bit value.
 *
 * @param {number} n - 32-bit integer to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const squirrel3 = (n: number, seed: number = 0): number => {
  const SQR3_NOISE1 = 0xb5297a4d;
  const SQR3_NOISE2 = 0x68e31da4;
  const SQR3_NOISE3 = 0x1b56c4e9;

  let m = n;
  m = Math.imul(m, SQR3_NOISE1);
  m += seed;
  m ^= m >>> 8;
  m += SQR3_NOISE2;
  m ^= m << 8;
  m = Math.imul(m, SQR3_NOISE3);
  m ^= m >>> 8;
  return m >>> 0;
};
