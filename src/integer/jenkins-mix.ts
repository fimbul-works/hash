/**
 * Scrambles 3 numbers into one using Bob Jenkins' avalanche mixer.
 * Nine rounds of subtract-and-XOR across the three words; each input bit
 * affects all bits of the output. For a byte-consuming version see `mixHash`.
 *
 * @param {number} a - First 32-bit unsigned number.
 * @param {number} b - Second 32-bit unsigned number.
 * @param {number} c - Third 32-bit unsigned number.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const jenkinsMix = (a: number, b: number, c: number): number => {
  a -= b;
  a -= c;
  a ^= c >>> 13;
  b -= c;
  b -= a;
  b ^= a << 8;
  c -= a;
  c -= b;
  c ^= b >>> 13;
  a -= b;
  a -= c;
  a ^= c >>> 12;
  b -= c;
  b -= a;
  b ^= a << 16;
  c -= a;
  c -= b;
  c ^= b >>> 5;
  a -= b;
  a -= c;
  a ^= c >>> 3;
  b -= c;
  b -= a;
  b ^= a << 10;
  c -= a;
  c -= b;
  c ^= b >>> 15;
  return c >>> 0;
};
