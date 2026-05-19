import { getBytes } from "../util/get-bytes.js";

/**
 * xxHash64 — 64-bit variant of xxHash.
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {unknown} data - Input data to hash.
 * @param {bigint} [seed=0n] - Optional seed.
 * @returns {bigint} The computed 64-bit unsigned hash.
 */
export const xxHash64 = (data: unknown, seed: bigint = 0n): bigint => {
  const XXH64_P1 = 11400714785074694791n;
  const XXH64_P2 = 14029467366897019727n;
  const XXH64_P3 = 1609587929392839161n;
  const XXH64_P4 = 9650029242287828579n;
  const XXH64_P5 = 2870177450012600261n;
  const MASK64 = 0xffffffffffffffffn;

  const bytes = getBytes(data);
  const len = bytes.length;

  const rotl64 = (x: bigint, n: bigint): bigint => ((x << n) | (x >> (64n - n))) & MASK64;

  const read = (idx: number, n: number): bigint => {
    let v = 0n;
    for (let j = 0; j < n; j++) v |= BigInt(bytes[idx + j]) << BigInt(j * 8);
    return v;
  };

  const mergeRound = (acc: bigint, val: bigint): bigint => {
    val = (val * XXH64_P2) & MASK64;
    val = (rotl64(val, 31n) * XXH64_P1) & MASK64;
    return (acc ^ val) * XXH64_P1 + XXH64_P4;
  };

  let i = 0;
  let h64: bigint;

  if (len >= 32) {
    let v1 = (seed + XXH64_P1 + XXH64_P2) & MASK64;
    let v2 = (seed + XXH64_P2) & MASK64;
    let v3 = seed & MASK64;
    let v4 = (seed - XXH64_P1) & MASK64;

    do {
      v1 = (v1 + read(i, 8) * XXH64_P2) & MASK64;
      v1 = (rotl64(v1, 31n) * XXH64_P1) & MASK64;
      i += 8;
      v2 = (v2 + read(i, 8) * XXH64_P2) & MASK64;
      v2 = (rotl64(v2, 31n) * XXH64_P1) & MASK64;
      i += 8;
      v3 = (v3 + read(i, 8) * XXH64_P2) & MASK64;
      v3 = (rotl64(v3, 31n) * XXH64_P1) & MASK64;
      i += 8;
      v4 = (v4 + read(i, 8) * XXH64_P2) & MASK64;
      v4 = (rotl64(v4, 31n) * XXH64_P1) & MASK64;
      i += 8;
    } while (i <= len - 32);

    h64 = (rotl64(v1, 1n) + rotl64(v2, 7n) + rotl64(v3, 12n) + rotl64(v4, 18n)) & MASK64;

    h64 = mergeRound(h64, v1) & MASK64;
    h64 = mergeRound(h64, v2) & MASK64;
    h64 = mergeRound(h64, v3) & MASK64;
    h64 = mergeRound(h64, v4) & MASK64;
  } else {
    h64 = (seed + XXH64_P5) & MASK64;
  }

  h64 = (h64 + BigInt(len)) & MASK64;

  while (i + 8 <= len) {
    let k1 = (read(i, 8) * XXH64_P2) & MASK64;
    k1 = (rotl64(k1, 31n) * XXH64_P1) & MASK64;
    h64 = (rotl64(h64 ^ k1, 27n) * XXH64_P1 + XXH64_P4) & MASK64;
    i += 8;
  }

  if (i + 4 <= len) {
    h64 = (h64 ^ (read(i, 4) * XXH64_P1)) & MASK64;
    h64 = (rotl64(h64, 23n) * XXH64_P2 + XXH64_P3) & MASK64;
    i += 4;
  }

  while (i < len) {
    h64 = (h64 ^ (BigInt(bytes[i]) * XXH64_P5)) & MASK64;
    h64 = (rotl64(h64, 11n) * XXH64_P1) & MASK64;
    i++;
  }

  h64 ^= h64 >> 33n;
  h64 = (h64 * XXH64_P2) & MASK64;
  h64 ^= h64 >> 29n;
  h64 = (h64 * XXH64_P3) & MASK64;
  h64 ^= h64 >> 32n;

  return h64;
};
