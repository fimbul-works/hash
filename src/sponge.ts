import { PHI_FRACTION } from "./constants.js";
import { fastMix } from "./integer/fast-mix.js";
import { getBytes } from "./util/get-bytes.js";

/**
 * Interface for a stateful sponge hasher.
 *
 * Absorbs arbitrary data into internal registers and squeezes out deterministic
 * 32-bit integers or child sponges for hierarchical procedural generation.
 */
export interface Sponge {
  /** The number of registers used for hashing */
  readonly size: number;

  /**
   * Squeezes the next deterministic unsigned 32-bit integer.
   */
  next(): number;

  /**
   * Absorbs data into internal registers, mutating the state in-place.
   *
   * @param data - Primitive, object, or buffer to mix into state.
   * @returns The sponge instance for method chaining.
   */
  absorb(data: unknown): Sponge;

  /**
   * Creates an independent sponge initialized with the current state,
   * optionally absorbing additional child data.
   *
   * @param data - Optional data to mix into the child state.
   * @returns A new, independent Sponge instance.
   */
  fork(data?: unknown): Sponge;

  /**
   * Exports the current internal state index and register values.
   *
   * @returns A Uint32Array of length `numRegisters + 1`,
   *          where the first element is the current index and the rest are register values.
   */
  getState(): Uint32Array;

  /**
   * Restores internal state from a previously exported array.
   *
   * @param state - Uint32Array of length `numRegisters + 1`.
   * @returns The sponge instance for method chaining.
   */
  setState(state: Uint32Array): Sponge;
}

/**
 * Create a new Sponge hasher object.
 *
 * @param {unknown} data - Initial data to ingest.
 * @param {number} [size=16] - Number of registers to use. Default: 16
 * @param {(x: number, y: number) => number} [mix=fastMix] - Mixing function to use. Default: `fastMix`
 * @return {Sponge}
 */
export const createSponge = (
  data: unknown,
  size: number = 16,
  mix: (x: number, y: number) => number = fastMix,
): Sponge => {
  if (size <= 1) throw new RangeError("Sponge size must be greater than 1");

  // Internal registry and registry index
  const reg = new Uint32Array(size).map((_, i) => Math.imul(i + 1, PHI_FRACTION) >>> 0);
  let idx = 0;

  const diffuse = () => {
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < size; i++) {
        const prev = reg[(idx - 1 + size) % size];
        reg[idx] = mix(reg[idx], prev);
        idx = (idx + 1) % size;
      }
    }
  };

  const sponge: Sponge = {
    get size(): number {
      return size;
    },
    next(): number {
      const val = reg[idx];
      reg[idx] = mix(val, (PHI_FRACTION + idx) >>> 0);
      idx = (idx + 1) % size;
      if (idx === 0) {
        diffuse();
      }
      return val >>> 0;
    },
    absorb(data: unknown): Sponge {
      if (data === undefined || data === null || data === "") {
        return sponge;
      }

      const bytes = getBytes(data);
      for (let i = 0; i < bytes.length; i++) {
        reg[idx] = mix(reg[idx], bytes[i]);
        idx = (idx + 1) % size;
      }

      diffuse();
      return sponge;
    },
    fork(data?: unknown) {
      const child = createSponge(null, size, mix);
      child.setState(sponge.getState());
      return child.absorb(data);
    },
    getState(): Uint32Array {
      const state = new Uint32Array(size + 1);
      state[0] = idx;
      state.set(reg, 1);
      return state;
    },
    setState(state: Uint32Array): Sponge {
      if (state.length !== size + 1) {
        throw new RangeError("Sponge state array must have length size + 1");
      }

      idx = state[0] >>> 0;
      if (idx >= size) {
        throw new RangeError("Sponge index out of range");
      }

      for (let i = 0; i < size; i++) {
        reg[i] = state[i + 1] >>> 0;
      }

      return sponge;
    },
  };

  return sponge.absorb(data);
};
