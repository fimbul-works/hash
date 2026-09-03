import { getBytes } from "../util/get-bytes.js";

let CRC64_XZ_TABLE: BigUint64Array;

/**
 * Initialize the CRC-64/XZ lookup table (reflected).
 */
const initCRC64Xz = () => {
  CRC64_XZ_TABLE = new BigUint64Array(256);
  for (let i = 0n; i < 256n; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1n ? 0xc96c5795d7870f42n ^ (crc >> 1n) : crc >> 1n;
    }
    CRC64_XZ_TABLE[Number(i)] = crc;
  }
};

/**
 * Compute the CRC-64/XZ (also known as CRC-64/GO-ECMA) hash of the input data.
 *
 * Parameters:
 * - Polynomial: 0x42F0E1EBA9EA3693 (reflected: 0xC96C5795D7870F42)
 * - Initial value: 0xFFFFFFFFFFFFFFFF
 * - RefIn: true (LSB-first)
 * - RefOut: true (LSB-first)
 * - XorOut: 0xFFFFFFFFFFFFFFFF
 * - Check value ("123456789"): 0x995DC9BBDF1939FA
 *
 * @param {unknown} data - The input data to hash.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const crc64Xz = (data: unknown): bigint => {
  if (!CRC64_XZ_TABLE) {
    initCRC64Xz();
  }
  const MASK64 = 0xffffffffffffffffn;
  const bytes = getBytes(data);
  let crc = MASK64;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC64_XZ_TABLE[Number((crc ^ BigInt(bytes[i])) & 0xffn)] ^ (crc >> 8n);
  }
  return crc ^ MASK64;
};
