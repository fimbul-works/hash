/**
 * Convert a 32-bit unsigned integer to a float in range [0, 1].
 * Multiplies by 2⁻³², the inverse of the 32-bit range.
 *
 * @param {number} value - 32-bit unsigned integer.
 * @returns {number} A float in the range [0, 1].
 */
export const intToFloat = (value: number): number => (value >>> 0) * 2.3283064365386963e-10;
