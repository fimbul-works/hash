/**
 * szudzikPair — Szudzik's "Elegant Pairing" function.
 * Maps two non-negative integers to a single non-negative integer.
 * It is often more efficient and has slower growth than Cantor Pairing.
 *
 * @param {number} x - First non-negative integer.
 * @param {number} y - Second non-negative integer.
 * @returns {number} The paired unique integer.
 * @throws {Error} Will throw an error if either x or y is not a non-negative integer.
 */
export const szudzikPair = (x: number, y: number): number => {
  if (!Number.isInteger(x) || x < 0 || !Number.isInteger(y) || y < 0) {
    throw new Error("Szudzik pairing requires non-negative integers");
  }
  return x >= y ? x * x + x + y : y * y + x;
};

/**
 * szudzikUnpair — Reverses Szudzik's Elegant Pairing.
 *
 * @param {number} z - The paired integer.
 * @returns {[number, number]} An array containing the original pair [x, y].
 * @throws {Error} Will throw an error if z is not a non-negative integer.
 */
export const reverseSzudzikPair = (z: number): [number, number] => {
  if (!Number.isInteger(z) || z < 0) {
    throw new Error("Reverse Szudzik pairing requires a non-negative integer");
  }
  const sqrtZ = Math.floor(Math.sqrt(z));
  const sq = sqrtZ * sqrtZ;
  return z - sq < sqrtZ ? [z - sq, sqrtZ] : [sqrtZ, z - sq - sqrtZ];
};
