/**
 * Squirrel5 — improved successor to Squirrel3 with better avalanche characteristics.
 * Five noise constants, five mix stages; significantly better distribution for
 * correlated inputs (e.g. sequential coordinates in a 2D/3D grid).
 *
 * @param {number} n - 32-bit integer to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const squirrel5 = (n: number, seed: number = 0): number => {
  const SQR5_NOISE1 = 0xd2a98b26;
  const SQR5_NOISE2 = 0xa884f197;
  const SQR5_NOISE3 = 0x6c62272e;
  const SQR5_NOISE4 = 0x516cac29;
  const SQR5_NOISE5 = 0x93f0cc77;

  let m = n;
  m = Math.imul(m, SQR5_NOISE1);
  m += seed;
  m ^= m >>> 9;
  m += SQR5_NOISE2;
  m ^= m << 11;
  m = Math.imul(m, SQR5_NOISE3);
  m ^= m >>> 13;
  m = Math.imul(m, SQR5_NOISE4);
  m ^= m << 15;
  m = Math.imul(m, SQR5_NOISE5);
  m ^= m >>> 17;
  return m >>> 0;
};
