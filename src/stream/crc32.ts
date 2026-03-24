import { getBytes } from "../util/get-bytes.js";
import { U32_MAX } from "../constants.js";

/** CRC-32 polynomial: 0xEDB88320 (reversed/reflected Ethernet polynomial) */
const CRC32_POLY = 0xedb88320;
const CRC_TABLE = new Uint32Array(256);

for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? CRC32_POLY ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c;
}

/**
 * Compute the CRC-32 hash of the input data.
 *
 * @param {unknown} data - The input data to hash
 * @returns {number} The computed CRC-32 hash
 */
export const crc32 = (data: unknown): number => {
  const bytes = getBytes(data);
  let crc = U32_MAX;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ U32_MAX) >>> 0;
};
