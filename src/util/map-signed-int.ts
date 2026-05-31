/**
 * mapSignedInt — Bijectively map any signed 32-bit integer to a non-negative integer.
 * Maps: 0 -> 0, -1 -> 1, 1 -> 2, -2 -> 3, 2 -> 4, etc.
 *
 * This is crucial for coordinate pairing functions (Cantor/Szudzik) which only
 * accept non-negative integer bounds.
 *
 * @param {number} n - The signed 32-bit integer.
 * @returns {number} A non-negative integer.
 */
export const mapSignedInt = (n: number): number => {
  if (!Number.isInteger(n)) {
    throw new Error("mapSignedInt requires an integer");
  }
  return n >= 0 ? n * 2 : -n * 2 - 1;
};

/**
 * unmapSignedInt — Bijectively restore a non-negative integer back to a signed 32-bit integer.
 *
 * @param {number} n - The non-negative integer.
 * @returns {number} The original signed integer.
 */
export const unmapSignedInt = (n: number): number => {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("unmapSignedInt requires a non-negative integer");
  }
  return n % 2 === 0 ? n / 2 : -((n + 1) / 2);
};
