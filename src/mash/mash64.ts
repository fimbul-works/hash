import { getBytes } from "../util/get-bytes.js";
import { U32_2_POW_32, U32_MAX_BIG } from "../constants.js";
import { Mash64 } from "./types.js";
import { MASH_MULT, MASH_SEED } from "./constants.js";

/**
 * Create a new Mash64 instance.
 * Produces 64-bit unsigned hashes as BigInt values.
 *
 * @param {number | bigint} [seed=BigInt(MASH_SEED)] - Starting internal state
 * @returns {Mash64} A stateful hash function returning bigint
 */
export const createMash64 = (seed: number | bigint = BigInt(MASH_SEED)): Mash64 => {
  let n = BigInt(seed) & 0xffffffffffffffffn;

  function mash(data: unknown): bigint {
    const bytes = getBytes(data);
    for (let i = 0; i < bytes.length; i++) {
      // High 32 bits
      let nh = Number(n >> 32n) + bytes[i];
      let h = MASH_MULT * 1.5 * nh;
      let v = h >>> 0;
      h -= v;
      h *= v;
      v = h >>> 0;
      h -= v;
      nh = v + Math.floor(h * U32_2_POW_32);

      // Low 32 bits
      let nl = Number(n & U32_MAX_BIG) + bytes[i];
      h = MASH_MULT * nl;
      v = h >>> 0;
      h -= v;
      h *= v;
      v = h >>> 0;
      h -= v;
      nl = v + Math.floor(h * U32_2_POW_32);

      n = (BigInt(nh) << 32n) | BigInt(nl);
    }
    return n;
  }

  Object.defineProperty(mash, "seed", {
    get: () => n,
    enumerable: true,
  });

  return mash as unknown as Mash64;
};
