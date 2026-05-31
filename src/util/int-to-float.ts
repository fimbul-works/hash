/**
 * Convert a 32-bit unsigned integer to a float in range [0, 1].
 *
 * @param {number} n - 32-bit unsigned integer.
 * @returns {number} A float in the range [0, 1].
 */
export const intToFloat = (n: number): number => (n >>> 0) * 2.3283064365386963e-10; // 2^-32
