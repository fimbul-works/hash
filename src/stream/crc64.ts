import { getBytes } from "../util/get-bytes.js";

let CRC64_TABLE: BigUint64Array;

/**
 * Initialize the CRC-64/ECMA-182 lookup table (normal / MSB-first).
 */
const initCRC64 = () => {
  CRC64_TABLE = new BigUint64Array(256);
  const POLY = 0x42f0e1eba9ea3693n;
  for (let i = 0n; i < 256n; i++) {
    let crc = i << 56n;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000000000000000n) !== 0n ? (crc << 1n) ^ POLY : crc << 1n;
    }
    CRC64_TABLE[Number(i)] = crc & 0xffffffffffffffffn;
  }
};

/**
 * Compute the CRC-64 hash of the input data adhering to the canonical ECMA-182 standard.
 *
 * Parameters:
 * - Polynomial: 0x42F0E1EBA9EA3693
 * - Initial value: 0x0000000000000000
 * - RefIn: false (MSB-first)
 * - RefOut: false (MSB-first)
 * - XorOut: 0x0000000000000000
 * - Check value ("123456789"): 0x6C40DF5F0B497347
 *
 * @param {unknown} data - The input data to hash.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const crc64 = (data: unknown): bigint => {
  if (!CRC64_TABLE) {
    initCRC64();
  }
  const bytes = getBytes(data);
  let crc = 0n;
  for (let i = 0; i < bytes.length; i++) {
    const tableIndex = Number(((crc >> 56n) ^ BigInt(bytes[i])) & 0xffn);
    crc = CRC64_TABLE[tableIndex] ^ ((crc << 8n) & 0xffffffffffffffffn);
  }
  return crc;
};
