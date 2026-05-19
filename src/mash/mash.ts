import { getBytes } from "../util/get-bytes.js";

/**
 * A stateful hash function that accumulates internal state across calls.
 */
export interface Mash {
  (data: unknown): number;

  /** Current internal state. Pass to `createMash` to fork from this point. */
  readonly state: number;
}

/**
 * Create a new Mash instance.
 *
 * The returned function stores the current state so that it can be used to continue
 * hashing from the current state.
 *
 * @param {number} [seed=0xefc8249d] - Optional starting internal state.
 * @returns {Mash} A hash function with a state property.
 */
export const createMash = (seed: number = 0xefc8249d): Mash => {
  let s = seed >>> 0;

  function mash(data: unknown): number {
    const bytes = getBytes(data);
    for (let i = 0; i < bytes.length; i++) {
      s += bytes[i];
      let h = 0.02519603282416938 * s;
      s = h >>> 0;
      h -= s;
      h *= s;
      s = h >>> 0;
      h -= s;
      s += h * 0x100000000;
    }
    return s >>> 0;
  }

  Object.defineProperty(mash, "state", {
    get: () => s,
    enumerable: true,
  });

  return mash as unknown as Mash;
};
