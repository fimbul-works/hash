import { getBytes } from "../util/get-bytes.js";

/**
 * A bit-width variant of Mash that produces 64-bit bigint results.
 */
export interface Mash64 {
  (data: unknown): bigint;

  /** Current internal state. Pass to `createMash64` to fork from this point. */
  readonly state: bigint;
}

/**
 * Create a new 64-bit Mash instance.
 *
 * The returned function stores the current state so that it can be used to continue
 * hashing from the current state.
 *
 * @param {number | bigint} [seed=0xefc8249d] - Optional starting internal state.
 * @returns {Mash64} A hash function with a state property that produces 64-bit hashes.
 */
export const createMash64 = (seed: number | bigint = 0xefc8249d): Mash64 => {
  let s = BigInt(seed) & 0xffffffffffffffffn;

  function mash(data: unknown): bigint {
    const bytes = getBytes(data);
    for (let i = 0; i < bytes.length; i++) {
      // High 32 bits
      let nh = Number(s >> 32n) + bytes[i];
      let h = 0.02519603282416938 * 1.5 * nh;
      let v = h >>> 0;
      h -= v;
      h *= v;
      v = h >>> 0;
      h -= v;
      nh = v + Math.floor(h * 0x100000000);

      // Low 32 bits
      let nl = Number(s & 0xffffffffn) + bytes[i];
      h = 0.02519603282416938 * nl;
      v = h >>> 0;
      h -= v;
      h *= v;
      v = h >>> 0;
      h -= v;
      nl = v + Math.floor(h * 0x100000000);

      s = (BigInt(nh) << 32n) | BigInt(nl);
    }
    return s;
  }

  Object.defineProperty(mash, "state", {
    get: () => s,
    enumerable: true,
  });

  return mash as unknown as Mash64;
};
