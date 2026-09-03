import { fastMix } from "./integer/fast-mix.js";
import { getBytes } from "./util/get-bytes.js";

/**
 * Interface for a stateful sponge hasher.
 *
 * Absorbs arbitrary data into internal registers and squeezes out deterministic
 * 32-bit integers or child sponges for hierarchical procedural generation.
 */
export interface Sponge {
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
 * @param {number} [numRegisters=16] - Number of registers to use. Default: 16
 * @param {(x: number, y: number) => number} [mix=fastMix] - Mixing function to use. Default: `fastMix`
 * @return {Sponge}
 */
export const createSponge = (
  data: unknown,
  numRegisters: number = 16,
  mix: (x: number, y: number) => number = fastMix,
): Sponge => {
  if (numRegisters <= 1) throw new RangeError("numRegisters must be greater than 1");

  // Standard golden ratio / fractional constants to prevent all-zero states
  const PHI_FRACTION = 0x9e3779b9;

  // Internal registry and registry index
  const reg = new Uint32Array(numRegisters).map((_, i) => Math.imul(i + 1, PHI_FRACTION) >>> 0);
  let idx = 0;

  const sponge: Sponge = {
    next(): number {
      let hash = reg[idx];
      for (let i = 1; i < numRegisters; i++) {
        hash = mix(hash, reg[(idx + i) % numRegisters]);
      }

      reg[idx] = mix(reg[idx], hash ^ PHI_FRACTION);
      idx = (idx + 1) % numRegisters;
      return hash >>> 0;
    },
    absorb(data: unknown): Sponge {
      if (data === undefined || data === null || data === "") {
        return sponge;
      }

      const bytes = getBytes(data);
      for (let i = 0; i < bytes.length; i++) {
        reg[idx] = mix(reg[idx], bytes[i]);
        idx = (idx + 1) % numRegisters;
      }

      // Diffuse
      for (let i = 0; i < numRegisters; i++) {
        const prev = reg[(idx - 1 + numRegisters) % numRegisters];
        reg[idx] = mix(reg[idx], prev);
        idx = (idx + 1) % numRegisters;
      }

      return sponge;
    },
    fork(data?: unknown) {
      const child = createSponge(null, numRegisters, mix);
      child.setState(sponge.getState());
      return child.absorb(data);
    },
    getState(): Uint32Array {
      const state = new Uint32Array(numRegisters + 1);
      state[0] = idx;
      state.set(reg, 1);
      return state;
    },
    setState(state: Uint32Array): Sponge {
      if (state.length !== numRegisters + 1) {
        throw new RangeError("State array must have length numRegisters + 1");
      }

      idx = state[0] >>> 0;
      if (idx >= numRegisters) {
        throw new RangeError("Index out of range");
      }

      for (let i = 0; i < numRegisters; i++) {
        reg[i] = state[i + 1] >>> 0;
      }

      return sponge;
    },
  };

  return sponge.absorb(data);
};
