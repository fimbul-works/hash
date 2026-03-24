/** Unsigned 32-bit maximum: 2³² − 1. Used for masking and CRC init/finalization. */
export const U32_MAX = 0xffffffff;

/** Unsigned 32-bit maximum as BigInt, for mixed number/BigInt operations. */
export const U32_MAX_BIG = 0xffffffffn;

/** Unsigned 64-bit maximum: 2⁶⁴ − 1. Used for 64-bit masking and CRC-64 state. */
export const U64_MAX = 0xffffffffffffffffn;

/** Smallest 32-bit floating point number */
export const FRACT = 2 ** -32;

/**
 * 32-bit Fibonacci / golden-ratio hashing constant: floor(φ × 2³²).
 * Appears in xxHash, FxHash, SplitMix32, and general Knuth multiplicative hashing.
 */
export const GOLDEN_RATIO_32 = 0x9e3779b9;

/** 2^32 as a constant for scaling or large integer operations. */
export const U32_2_POW_32 = 0x100000000;

/** MurmurHash3 / SplitMix32 finalization constants */
export const MH3_FINAL1 = 0x85ebca6b;
export const MH3_FINAL2 = 0xc2b2ae35;
export const MH3_FINAL3 = 0xe6546b64;

/** MurmurHash3 32-bit multipliers */
export const MH3_C1 = 0xcc9e2d51;
export const MH3_C2 = 0x1b873593;

/** MurmurHash3-128 / SplitMix64 finalization constants (64-bit) */
export const MH3_FINAL_64_1 = 0xff51afd7ed558ccdn;
export const MH3_FINAL_64_2 = 0xc4ceb9fe1a85ec53n;

/** FastMix / FastUnmix constants (32-bit) */
export const FAST_MIX_MUL_32 = 0x45d9f3b;
export const FAST_UNMIX_MUL_32 = 0x119de1f3;

/** FastMix / FastUnmix constants (64-bit) */
export const FAST_MIX_MUL_64 = 0xd6e8feb86659fd93n;
export const FAST_UNMIX_MUL_64 = 0xcfee444d8b59a89bn;
