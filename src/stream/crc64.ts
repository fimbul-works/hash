import { getBytes } from "../util/get-bytes.js";

let CRC64_TABLE: BigUint64Array;

/**
 * Initialize the CRC-64 table.
 */
const initCRC64 = () => {
  CRC64_TABLE = new BigUint64Array(256);
  for (let i = 0n; i < 256n; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1n ? 0xc96c5795d7870f42n ^ (crc >> 1n) : crc >> 1n;
    }
    CRC64_TABLE[Number(i)] = crc;
  }
};

/**
 * Compute the CRC-64 hash of the input data.
 *
 * @param {unknown} data - The input data to hash.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const crc64 = (data: unknown): bigint => {
  if (!CRC64_TABLE) {
    initCRC64();
  }
  const MASK64 = 0xffffffffffffffffn;
  const bytes = getBytes(data);
  let crc = MASK64;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC64_TABLE[Number((crc ^ BigInt(bytes[i])) & 0xffn)] ^ (crc >> 8n);
  }
  return crc ^ MASK64;
};
