import { getBytes } from "../util/get-bytes.js";
import { MH3_FINAL1, MH3_FINAL2 } from "../constants.js";

const MH3_C1 = 0xcc9e2d51;
const MH3_C2 = 0x1b873593;
const MH3_FINAL3 = 0xe6546b64;

/**
 * MurmurHash3 32-bit — fast, well-distributed non-cryptographic hash.
 *
 * @param {unknown} data - The input data to hash
 * @param {number} [seed=0] - Optional seed value (default: 0)
 * @returns {number} The computed 32-bit hash
 */
export function murmur3Hash(data: unknown, seed = 0): number {
  const bytes = getBytes(data);
  let h1 = seed;
  const chunks = Math.floor(bytes.length / 4);

  for (let i = 0; i < chunks; i++) {
    let k1 =
      (bytes[i * 4] & 0xff) |
      ((bytes[i * 4 + 1] & 0xff) << 8) |
      ((bytes[i * 4 + 2] & 0xff) << 16) |
      ((bytes[i * 4 + 3] & 0xff) << 24);
    k1 = Math.imul(k1, MH3_C1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, MH3_C2);
    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + MH3_FINAL3) >>> 0;
  }

  const chunksEnd = chunks * 4;
  let k1 = 0;
  const tail = bytes.length & 3;

  if (tail >= 3) k1 ^= (bytes[chunksEnd + 2] & 0xff) << 16;
  if (tail >= 2) k1 ^= (bytes[chunksEnd + 1] & 0xff) << 8;
  if (tail >= 1) {
    k1 ^= bytes[chunksEnd] & 0xff;
    k1 = Math.imul(k1, MH3_C1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, MH3_C2);
    h1 ^= k1;
  }

  h1 ^= bytes.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, MH3_FINAL1) >>> 0;
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, MH3_FINAL2) >>> 0;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}
