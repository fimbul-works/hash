/**
 * int64ToDouble - Converts a 64-bit hash (bigint) to a [0, 1] range double-precision float.
 * Uses the upper 53 bits of the hash to ensure uniform distribution.
 *
 * @param {bigint} n - The 64-bit integer.
 * @returns {number} A double-precision float in the range [0, 1].
 */
export const int64ToDouble = (n: bigint): number => Number(n >> 11n) * 1.1102230246251565e-16; // 2^-52
