/**
 * A stateful hash function that accumulates internal state across calls.
 */
export interface Mash {
  (data: unknown): number;
  /** Current internal state. Pass to `createMash` to fork from this point. */
  readonly seed: number;
}

/**
 * A bit-width variant of Mash that produces 64-bit bigint results.
 */
export interface Mash64 {
  (data: unknown): bigint;
  /** Current internal state as a bigint. */
  readonly seed: bigint;
}
