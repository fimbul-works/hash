/**
 * Computes the Cantor pairing function for two non-negative integers.
 * Bijective: maps every unique (x, y) pair to a unique natural number.
 * Output grows quadratically — not suitable as a hash for large inputs.
 *
 * @param {number} x - The first non-negative integer
 * @param {number} y - The second non-negative integer
 * @returns {number} The paired natural number
 */
export const cantorPair = (x: number, y: number): number => {
  if (!Number.isInteger(x) || x < 0 || !Number.isInteger(y) || y < 0) {
    throw new Error("Cantor pairing requires non-negative integers");
  }
  return ((x + y) * (x + y + 1)) / 2 + y;
};

/**
 * Reverses the Cantor pairing function, recovering the original pair.
 *
 * @param {number} z - The result of a previous cantorPair call
 * @returns {[number, number]} The original pair [x, y]
 */
export const reverseCantorPair = (z: number): [number, number] => {
  if (!Number.isInteger(z) || z < 0) {
    throw new Error("Reverse Cantor pairing requires a non-negative integer");
  }
  const t = Math.floor((-1 + Math.sqrt(1 + 8 * z)) / 2);
  return [(t * (t + 3)) / 2 - z, z - (t * (t + 1)) / 2];
};
