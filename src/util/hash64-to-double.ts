/**
 * hash64ToDouble — Converts a 64-bit hash (bigint) to a 0..1 double-precision float.
 * Uses the upper 53 bits of the hash to ensure uniform distribution in 0..1.
 *
 * @param {bigint} hash - The 64-bit hash as a bigint
 * @returns {number} A double-precision float in the range [0, 1)
 */
export const hash64ToDouble = (hash: bigint): number => Number(hash >> 11n) / 9007199254740992;
