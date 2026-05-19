import { getBytes } from "../util/get-bytes.js";

/**
 * Byte-consuming hash built on the Jenkins lookup3 mixer (the same three-word
 * avalanche used by `jenkinsMix`). Processes 12 bytes at a time into three 32-bit
 * accumulators a/b/c, mixing after each block. Accepts an optional seed.
 *
 * This is the streaming sibling of `jenkinsMix` — they share the same mixing kernel.
 *
 * @param {unknown} data - Input data to hash.
 * @param {number} [seed=0] - Optional seed.
 * @returns {number} The computed 32-bit unsigned hash.
 */
export const jenkinsMixHash = (data: unknown, seed: number = 0): number => {
  const bytes = getBytes(data);
  const len = bytes.length;

  // Jenkins lookup3 initialization: all three words start from the same base
  const init = (0xdeadbeef + len + (seed >>> 0)) >>> 0;
  let a = init,
    b = init,
    c = init;
  let i = 0;

  // Main loop: consume 12 bytes per round, fold into a/b/c, avalanche via mix
  while (i + 12 <= len) {
    a = (a + ((bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0)) >>> 0;
    b = (b + ((bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24)) >>> 0)) >>> 0;
    c = (c + ((bytes[i + 8] | (bytes[i + 9] << 8) | (bytes[i + 10] << 16) | (bytes[i + 11] << 24)) >>> 0)) >>> 0;
    // Inline mix(a, b, c) — updates all three (mix() only returns c)
    a -= b;
    a -= c;
    a ^= c >>> 13;
    b -= c;
    b -= a;
    b ^= a << 8;
    c -= a;
    c -= b;
    c ^= b >>> 13;
    a -= b;
    a -= c;
    a ^= c >>> 12;
    b -= c;
    b -= a;
    b ^= a << 16;
    c -= a;
    c -= b;
    c ^= b >>> 5;
    a -= b;
    a -= c;
    a ^= c >>> 3;
    b -= c;
    b -= a;
    b ^= a << 10;
    c -= a;
    c -= b;
    c ^= b >>> 15;
    i += 12;
  }

  // Pack remaining bytes (0–11) into a/b/c, little-endian
  const rem = len - i;
  if (rem >= 1) a = (a + bytes[i]) >>> 0;
  if (rem >= 2) a = (a + (bytes[i + 1] << 8)) >>> 0;
  if (rem >= 3) a = (a + (bytes[i + 2] << 16)) >>> 0;
  if (rem >= 4) a = (a + (bytes[i + 3] << 24)) >>> 0;
  if (rem >= 5) b = (b + bytes[i + 4]) >>> 0;
  if (rem >= 6) b = (b + (bytes[i + 5] << 8)) >>> 0;
  if (rem >= 7) b = (b + (bytes[i + 6] << 16)) >>> 0;
  if (rem >= 8) b = (b + (bytes[i + 7] << 24)) >>> 0;
  if (rem >= 9) c = (c + bytes[i + 8]) >>> 0;
  if (rem >= 10) c = (c + (bytes[i + 9] << 8)) >>> 0;
  if (rem >= 11) c = (c + (bytes[i + 10] << 16)) >>> 0;

  // Final mix
  a -= b;
  a -= c;
  a ^= c >>> 13;
  b -= c;
  b -= a;
  b ^= a << 8;
  c -= a;
  c -= b;
  c ^= b >>> 13;
  a -= b;
  a -= c;
  a ^= c >>> 12;
  b -= c;
  b -= a;
  b ^= a << 16;
  c -= a;
  c -= b;
  c ^= b >>> 5;
  a -= b;
  a -= c;
  a ^= c >>> 3;
  b -= c;
  b -= a;
  b ^= a << 10;
  c -= a;
  c -= b;
  c ^= b >>> 15;

  return c >>> 0;
};
