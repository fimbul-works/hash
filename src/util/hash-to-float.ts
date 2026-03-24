import { U32_MAX, FRACT } from "../constants.js";

/**
 * Convert a 32-bit unsigned hash to a float in [0, 1).
 * Multiplies by 2⁻³² (≈ 2.328e-10), the inverse of the 32-bit range.
 *
 * @param {number} hash - A 32-bit unsigned integer hash value
 * @returns {number} A float in the range [0, 1)
 */
export const hashToFloat = (hash: number): number => (hash > U32_MAX ? hash >>> 0 : hash) * FRACT;
