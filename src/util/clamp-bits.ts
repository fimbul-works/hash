import { U32_MAX, U32_MAX_BIG, U64_MAX } from "../constants.js";

/**
 * Supported bit widths for hash output clamping.
 * Note: 53 is Number.MAX_SAFE_INTEGER's bit length — the largest value that fits
 * in a JS number without precision loss. 64 requires bigint.
 */
export type BitWidth = number;

// Fast lookup tables — precalculated for all bits from 2 to 64
const NUM_MASKS = new Uint32Array(33);
const BIG_MASKS = new BigUint64Array(65);

for (let i = 2; i <= 32; i++) {
  NUM_MASKS[i] = i === 32 ? U32_MAX : (1 << i) - 1;
}

for (let i = 2; i <= 64; i++) {
  BIG_MASKS[i] = (1n << BigInt(i)) - 1n;
}

/**
 * Clamp a hash output to the specified number of bits (2 to 64).
 *
 * - 2 to 32 → returns `number` (unsigned 32-bit internal)
 * - 33 to 53 → returns `number` (safe integer, fits without precision loss)
 * - 54 to 64 → returns `bigint`
 *
 * For reducing 64→32 bits, XOR-folding is preferable to masking when you care
 * about entropy, since it mixes both halves. Use this when you just want the
 * lower N bits of an already-good hash.
 *
 * @param {number | bigint} hash - The hash value to clamp (number or bigint).
 * @param {BitWidth} bits - The target bit width (2-64).
 * @returns {number | bigint} The clamped value.
 */
export const clampBits = (hash: number | bigint, bits: BitWidth): number | bigint => {
  if (bits < 2 || bits > 64) {
    throw new Error(`clampBits: bit width must be between 2 and 64 (got ${bits})`);
  }

  if (bits <= 32) {
    // Stay in number-land — no BigInt allocation
    const n = typeof hash === "bigint" ? Number(hash & U32_MAX_BIG) : hash >>> 0;
    return (n & NUM_MASKS[bits]) >>> 0; // Force unsigned
  }

  // 33 to 64: need BigInt arithmetic
  const big = typeof hash === "bigint" ? hash : BigInt(hash >>> 0);
  const masked = big & BIG_MASKS[bits];

  // Return as number if it fits safely in JS double (up to 53 bits)
  return bits <= 53 ? Number(masked) : masked;
};
