import { getBytes } from "../util/get-bytes.js";

/**
 * xxHash — extremely fast non-cryptographic hash.
 *
 * @param {unknown} data - Input data to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const xxHash = (data: unknown, seed: number = 0): number => {
  const XXH32_P1 = 0x9e3779b1;
  const XXH32_P2 = 0x85ebca77;
  const XXH32_P3 = 0xc2b2ae3d;
  const XXH32_P4 = 0x27d4eb2f;
  const XXH32_P5 = 0x165667b1;

  const bytes = getBytes(data);
  const len = bytes.length;

  const rotl = (x: number, n: number): number => ((x << n) | (x >>> (32 - n))) >>> 0;

  const u32 = (pos: number): number =>
    (bytes[pos] | (bytes[pos + 1] << 8) | (bytes[pos + 2] << 16) | (bytes[pos + 3] << 24)) >>> 0;

  const round = (acc: number, input: number): number => {
    acc = (acc + Math.imul(input, XXH32_P2)) >>> 0;
    acc = ((acc << 13) | (acc >>> 19)) >>> 0;
    return Math.imul(acc, XXH32_P1) >>> 0;
  };

  let i = 0;
  let h32: number;

  if (len >= 16) {
    let v1 = (seed + XXH32_P1 + XXH32_P2) >>> 0;
    let v2 = (seed + XXH32_P2) >>> 0;
    let v3 = seed >>> 0;
    let v4 = (seed - XXH32_P1) >>> 0;
    do {
      v1 = round(v1, u32(i));
      i += 4;
      v2 = round(v2, u32(i));
      i += 4;
      v3 = round(v3, u32(i));
      i += 4;
      v4 = round(v4, u32(i));
      i += 4;
    } while (i <= len - 16);
    h32 = (rotl(v1, 1) + rotl(v2, 7) + rotl(v3, 12) + rotl(v4, 18)) >>> 0;
  } else {
    h32 = (seed + XXH32_P5) >>> 0;
  }

  h32 = (h32 + len) >>> 0;

  while (i + 4 <= len) {
    h32 = (h32 + Math.imul(u32(i), XXH32_P3)) >>> 0;
    h32 = Math.imul(rotl(h32, 17), XXH32_P4) >>> 0;
    i += 4;
  }

  while (i < len) {
    h32 = (h32 + Math.imul(bytes[i], XXH32_P5)) >>> 0;
    h32 = Math.imul(rotl(h32, 11), XXH32_P1) >>> 0;
    i++;
  }

  h32 ^= h32 >>> 15;
  h32 = Math.imul(h32, XXH32_P2) >>> 0;
  h32 ^= h32 >>> 13;
  h32 = Math.imul(h32, XXH32_P3) >>> 0;
  h32 ^= h32 >>> 16;

  return h32 >>> 0;
};
