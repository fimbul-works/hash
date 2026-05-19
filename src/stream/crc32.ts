import { getBytes } from "../util/get-bytes.js";

let CRC32_TABLE: Uint32Array;

/**
 * Initialize the CRC-32 table.
 */
const initCRC32 = () => {
  CRC32_TABLE = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    CRC32_TABLE[i] = c;
  }
};

/**
 * Compute the CRC-32 hash of the input data.
 *
 * @param {unknown} data - Input data to hash.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const crc32 = (data: unknown): number => {
  if (!CRC32_TABLE) {
    initCRC32();
  }
  const bytes = getBytes(data);
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};
