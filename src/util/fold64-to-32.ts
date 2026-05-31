/**
 * fold64To32 — Bijectively fold an unsigned 64-bit BigInt into a 32-bit unsigned integer.
 * Blends entropy from the upper and lower 32 bits.
 *
 * @param {bigint} n - The 64-bit BigInt to fold.
 * @returns {number} An unsigned 32-bit integer.
 */
export const fold64To32 = (n: bigint): number => {
  return Number((n ^ (n >> 32n)) & 0xffffffffn) >>> 0;
};
