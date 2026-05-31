const buf = new ArrayBuffer(8);
const view = new DataView(buf);

/**
 * floatToBits32 — Extract the raw IEEE-754 32-bit single-precision float bit pattern as an unsigned integer.
 * Useful for bitwise hashing of fractional floats.
 *
 * @param {number} f - The float value.
 * @returns {number} The 32-bit unsigned integer bit pattern.
 */
export const floatToBits32 = (f: number): number => {
  view.setFloat32(0, f, true);
  return view.getUint32(0, true);
};

/**
 * floatToBits64 — Extract the raw IEEE-754 64-bit double-precision float bit pattern as a 64-bit BigInt.
 *
 * @param {number} f - The float value.
 * @returns {bigint} The 64-bit BigInt bit pattern.
 */
export const floatToBits64 = (f: number): bigint => {
  view.setFloat64(0, f, true);
  return view.getBigUint64(0, true);
};
