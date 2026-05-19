/** biome-ignore-all lint/suspicious/noFallthroughSwitchClause: fallthrough used in hashing */
import { getBytes } from "../util/get-bytes.js";

/**
 * SipHash-1-3 — fast keyed hash.
 *
 * @param {unknown} data - Input data to hash.
 * @param {number} [key1=0] - Optional first 32-bit key part.
 * @param {number} [key2=0] - Optional second 32-bit key part.
 * @returns {bigint} The computed 64-bit hash.
 */
export const sipHash13 = (data: unknown, key1: number = 0, key2: number = 0): bigint => {
  const SIP_V0 = 0x736f6d6570736575n;
  const SIP_V1 = 0x646f72616e646f6dn;
  const SIP_V2 = 0x6c7967656e657261n;
  const SIP_V3 = 0x7465646279746573n;
  const MASK64 = 0xffffffffffffffffn;

  const bytes = getBytes(data);
  const len = bytes.length;
  const k0 = BigInt(key1 >>> 0);
  const k1 = BigInt(key2 >>> 0);

  let v0 = SIP_V0 ^ k0;
  let v1 = SIP_V1 ^ k1;
  let v2 = SIP_V2 ^ k0;
  let v3 = SIP_V3 ^ k1;
  let i = 0;

  const rotl64 = (x: bigint, n: bigint): bigint => ((x << n) | (x >> (64n - n))) & MASK64;

  const sipRound = (v0: bigint, v1: bigint, v2: bigint, v3: bigint): [bigint, bigint, bigint, bigint] => {
    v0 = (v0 + v1) & MASK64;
    v1 = rotl64(v1, 13n);
    v1 ^= v0;
    v0 = rotl64(v0, 32n);
    v2 = (v2 + v3) & MASK64;
    v3 = rotl64(v3, 16n);
    v3 ^= v2;
    v0 = (v0 + v3) & MASK64;
    v3 = rotl64(v3, 21n);
    v3 ^= v0;
    v2 = (v2 + v1) & MASK64;
    v1 = rotl64(v1, 17n);
    v1 ^= v2;
    v2 = rotl64(v2, 32n);
    return [v0, v1, v2, v3];
  };

  while (i + 8 <= len) {
    let m = 0n;
    for (let j = 0; j < 8; j++) m |= BigInt(bytes[i + j]) << BigInt(j * 8);
    v3 ^= m;
    [v0, v1, v2, v3] = sipRound(v0, v1, v2, v3);
    v0 ^= m;
    i += 8;
  }

  let last = BigInt(len & 0xff) << 56n;
  switch (len - i) {
    case 7:
      last |= BigInt(bytes[i + 6]) << 48n; // fallthrough
    case 6:
      last |= BigInt(bytes[i + 5]) << 40n; // fallthrough
    case 5:
      last |= BigInt(bytes[i + 4]) << 32n; // fallthrough
    case 4:
      last |= BigInt(bytes[i + 3]) << 24n; // fallthrough
    case 3:
      last |= BigInt(bytes[i + 2]) << 16n; // fallthrough
    case 2:
      last |= BigInt(bytes[i + 1]) << 8n; // fallthrough
    case 1:
      last |= BigInt(bytes[i]);
  }

  v3 ^= last;
  [v0, v1, v2, v3] = sipRound(v0, v1, v2, v3);
  v0 ^= last;

  v2 ^= 0xffn;
  [v0, v1, v2, v3] = sipRound(v0, v1, v2, v3);
  [v0, v1, v2, v3] = sipRound(v0, v1, v2, v3);
  [v0, v1, v2, v3] = sipRound(v0, v1, v2, v3);

  return v0 ^ v1 ^ v2 ^ v3;
};
