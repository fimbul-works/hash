import { getBytes } from "../util/get-bytes.js";
import { U32_2_POW_32 } from "../constants.js";
import { Mash } from "./types.js";
import { MASH_MULT, MASH_SEED } from "./constants.js";

/**
 * Create a new Mash instance.
 * The returned function stores the current state as `seed` so that it can be used to continue
 * hashing from the current state.
 *
 * @param {number} seed - Starting internal state (default: MASH_SEED)
 * @returns {Mash} A stateful hash function with a `seed` property
 */
export const createMash = (seed = MASH_SEED): Mash => {
  let n = seed >>> 0;

  function mash(data: unknown): number {
    const bytes = getBytes(data);
    for (let i = 0; i < bytes.length; i++) {
      n += bytes[i];
      let h = MASH_MULT * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * U32_2_POW_32; // 2^32
    }
    return n >>> 0;
  }

  // Getter — reads live `n` so seed always reflects current state, not creation-time state
  Object.defineProperty(mash, "seed", {
    get: () => n,
    enumerable: true,
    configurable: false,
  });

  return mash as unknown as Mash;
};
