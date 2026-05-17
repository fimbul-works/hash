import { U64_MAX } from "../constants.js";
import { getBytes } from "../util/get-bytes.js";

const WY_P1 = 0xa0761d6478bd642fn;
const WY_P2 = 0xe7037ed1a0b428dbn;
const WY_P3 = 0x8ebc6af09c88c6e3n;
const WY_P4 = 0x589965cc75374cc3n;

/**
 * WyHash — extremely fast, high-quality 64-bit hash (v3).
 *
 * This function uses BigInt internally for 64-bit precision, which has
 * higher overhead than 32-bit integer arithmetic.
 *
 * @param {unknown} data - The input data to hash
 * @param {bigint} [seed=0n] - Optional 64-bit seed (default: 0n)
 * @returns {bigint} The computed 64-bit unsigned hash as a bigint
 */
export const wyHash = (data: unknown, seed = 0n): bigint => {
  const bytes = getBytes(data);
  const len = BigInt(bytes.length);

  const read = (idx: number, n: number): bigint => {
    let v = 0n;
    for (let j = 0; j < n; j++) v |= BigInt(bytes[idx + j]) << BigInt(j * 8);
    return v;
  };

  const mum = (a: bigint, b: bigint): bigint => {
    const r = a * b;
    return (r >> 64n) ^ (r & U64_MAX);
  };

  let a = 0n;
  let b = 0n;
  let s = seed ^ WY_P1;

  const byteLen = bytes.length;

  if (byteLen <= 16) {
    if (byteLen >= 4) {
      a = (read(0, 4) << 32n) | read(byteLen - 4, 4);
      b = (read((byteLen >> 3) << 2, 4) << 32n) | read(byteLen - 4 - ((byteLen >> 3) << 2), 4);
    } else if (byteLen > 0) {
      a = (BigInt(bytes[0]) << 16n) | (BigInt(bytes[byteLen >> 1]) << 8n) | BigInt(bytes[byteLen - 1]);
      b = 0n;
    } else {
      a = 0n;
      b = 0n;
    }
  } else {
    let i = 0;
    let l = len;
    if (l > 48n) {
      let see1 = s;
      let see2 = s;
      do {
        see1 = mum(read(i, 8) ^ WY_P2, read(i + 8, 8) ^ see1);
        see2 = mum(read(i + 16, 8) ^ WY_P3, read(i + 24, 8) ^ see2);
        see1 = mum(read(i + 32, 8) ^ WY_P4, read(i + 40, 8) ^ see1);
        i += 48;
        l -= 48n;
      } while (l > 48n);
      s = see1 ^ see2;
    }
    while (l > 16n) {
      s = mum(read(i, 8) ^ WY_P2, read(i + 8, 8) ^ s);
      i += 16;
      l -= 16n;
    }
    a = read(byteLen - 16, 8);
    b = read(byteLen - 8, 8);
  }

  return mum(s ^ len, mum(a ^ WY_P2, b ^ s));
};
