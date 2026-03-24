/**
 * Wang hash — Thomas Wang's classic integer hash function.
 * Pure XOR and shifts (two multiplies for distribution correction).
 * Excellent for seeding PRNGs or hashing integer keys (grid coords, entity IDs).
 *
 * @param {number} n - The integer input
 * @returns {number} A 32-bit unsigned hash
 */
export const wangHash = (n: number): number => {
  n = n ^ 61 ^ (n >>> 16);
  n = Math.imul(n, 9);
  n ^= n >>> 4;
  n = Math.imul(n, 0x27d4eb2d);
  n ^= n >>> 15;
  return n >>> 0;
};
