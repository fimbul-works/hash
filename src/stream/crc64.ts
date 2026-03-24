import { getBytes } from "../util/get-bytes.js";
import { U64_MAX } from "../constants.js";

/** CRC-64 polynomial: 0xC96C5795D7870F42 (ECMA-182) */
const CRC64_POLY = 0xc96c5795d7870f42n;
const CRC_TABLE = new BigUint64Array(256);

for (let i = 0n; i < 256n; i++) {
  let crc = i;
  for (let j = 0; j < 8; j++) {
    crc = crc & 1n ? CRC64_POLY ^ (crc >> 1n) : crc >> 1n;
  }
  CRC_TABLE[Number(i)] = crc;
}

/**
 * Compute the CRC-64 hash of the input data.
 *
 * @param {unknown} data - The input data to hash
 * @returns {bigint} The computed CRC-64 hash as a bigint
 */
export const crc64 = (data: unknown): bigint => {
  const bytes = getBytes(data);
  let crc = U64_MAX;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[Number((crc ^ BigInt(bytes[i])) & 0xffn)] ^ (crc >> 8n);
  }
  return crc ^ U64_MAX;
};
