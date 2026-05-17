import { MH3_FINAL_64_1, MH3_FINAL_64_2, U64_MAX } from "../constants.js";
import { getBytes } from "../util/get-bytes.js";

const C1 = 0x87c37b91114253d5n;
const C2 = 0x4cf5ad432745937fn;

const rotl64 = (x: bigint, n: bigint): bigint => ((x << n) | (x >> (64n - n))) & U64_MAX;

/**
 * murmur3Hash128 — 128-bit variant of MurmurHash3.
 *
 * This function uses BigInt internally for 128-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {unknown} data - The input data to hash
 * @param {bigint} [seed=0n] - Optional 128-bit seed (as a bigint, default: 0n)
 * @returns {bigint} The computed 128-bit hash as a bigint
 */
export const murmur3Hash128 = (data: unknown, seed = 0n): bigint => {
  const bytes = getBytes(data);
  const len = BigInt(bytes.length);
  let h1 = seed & U64_MAX;
  let h2 = seed & U64_MAX;

  const bodyLen = bytes.length - (bytes.length % 16);
  for (let i = 0; i < bodyLen; i += 16) {
    let k1 = 0n;
    let k2 = 0n;
    for (let j = 0; j < 8; j++) k1 |= BigInt(bytes[i + j]) << BigInt(j * 8);
    for (let j = 0; j < 8; j++) k2 |= BigInt(bytes[i + 8 + j]) << BigInt(j * 8);

    k1 = (k1 * C1) & U64_MAX;
    k1 = rotl64(k1, 31n);
    k1 = (k1 * C2) & U64_MAX;
    h1 = h1 ^ k1;
    h1 = (rotl64(h1, 27n) + h2) & U64_MAX;
    h1 = (h1 * 5n + 0x52dce729n) & U64_MAX;

    k2 = (k2 * C2) & U64_MAX;
    k2 = rotl64(k2, 33n);
    k2 = (k2 * C1) & U64_MAX;
    h2 = h2 ^ k2;
    h2 = (rotl64(h2, 31n) + h1) & U64_MAX;
    h2 = (h2 * 5n + 0x38495ab5n) & U64_MAX;
  }

  // Tail
  let k1 = 0n;
  let k2 = 0n;
  const rem = bytes.length % 16;
  if (rem >= 15) k2 ^= BigInt(bytes[bodyLen + 14]) << 48n;
  if (rem >= 14) k2 ^= BigInt(bytes[bodyLen + 13]) << 40n;
  if (rem >= 13) k2 ^= BigInt(bytes[bodyLen + 12]) << 32n;
  if (rem >= 12) k2 ^= BigInt(bytes[bodyLen + 11]) << 24n;
  if (rem >= 11) k2 ^= BigInt(bytes[bodyLen + 10]) << 16n;
  if (rem >= 10) k2 ^= BigInt(bytes[bodyLen + 9]) << 8n;
  if (rem >= 9) {
    k2 ^= BigInt(bytes[bodyLen + 8]);
    k2 = (k2 * C2) & U64_MAX;
    k2 = rotl64(k2, 33n);
    k2 = (k2 * C1) & U64_MAX;
    h2 ^= k2;
  }

  if (rem >= 8) k1 ^= BigInt(bytes[bodyLen + 7]) << 56n;
  if (rem >= 7) k1 ^= BigInt(bytes[bodyLen + 6]) << 48n;
  if (rem >= 6) k1 ^= BigInt(bytes[bodyLen + 5]) << 40n;
  if (rem >= 5) k1 ^= BigInt(bytes[bodyLen + 4]) << 32n;
  if (rem >= 4) k1 ^= BigInt(bytes[bodyLen + 3]) << 24n;
  if (rem >= 3) k1 ^= BigInt(bytes[bodyLen + 2]) << 16n;
  if (rem >= 2) k1 ^= BigInt(bytes[bodyLen + 1]) << 8n;
  if (rem >= 1) {
    k1 ^= BigInt(bytes[bodyLen]);
    k1 = (k1 * C1) & U64_MAX;
    k1 = rotl64(k1, 31n);
    k1 = (k1 * C2) & U64_MAX;
    h1 ^= k1;
  }

  // Finalization
  h1 ^= len;
  h2 ^= len;

  h1 = (h1 + h2) & U64_MAX;
  h2 = (h2 + h1) & U64_MAX;

  const fmix64 = (k: bigint): bigint => {
    k ^= k >> 33n;
    k = (k * MH3_FINAL_64_1) & U64_MAX;
    k ^= k >> 33n;
    k = (k * MH3_FINAL_64_2) & U64_MAX;
    k ^= k >> 33n;
    return k;
  };

  h1 = fmix64(h1);
  h2 = fmix64(h2);

  h1 = (h1 + h2) & U64_MAX;
  h2 = (h2 + h1) & U64_MAX;

  return (h2 << 64n) | h1;
};
