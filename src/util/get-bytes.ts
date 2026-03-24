import { U32_MAX_BIG } from "../constants";

const encoder = new TextEncoder();

/**
 * Convert arbitrary data into a byte representation for use with hashing functions.
 *
 * Encoding rules (in order):
 * - `string`     → UTF-8 bytes via TextEncoder
 * - `Uint8Array` → passed through as-is
 * - `Buffer`     → passed through as-is (Node.js)
 * - `number`     → 8 bytes, little-endian IEEE 754 float64
 * - `bigint`     → 8 bytes, little-endian uint64 (truncated to 64 bits)
 * - anything else → UTF-8 bytes of `JSON.stringify(data)`
 *
 * Numbers and bigints are encoded as their raw binary representation rather than
 * stringified, avoiding JSON overhead and preserving type distinction
 * (`42 !== "42"` will produce different hashes).
 *
 * @param {unknown} data - The input data.
 * @returns {Uint8Array} A Uint8Array containing the data's byte representation.
 */
export const getBytes = (data: unknown): Uint8Array => {
  if (typeof data === "string") return encoder.encode(data);

  if (data instanceof Uint8Array) return data;
  if (typeof Buffer !== "undefined" && data instanceof Buffer) return new Uint8Array(data);

  if (typeof data === "number") {
    const buf = new ArrayBuffer(8);
    // IEEE 754 float64 handles negative and floating point numbers natively.
    // We normalize -0 to 0 to ensure they produce identical hashes.
    const normalized = Object.is(data, -0) ? 0 : data;
    new DataView(buf).setFloat64(0, normalized, /* littleEndian */ true);
    return new Uint8Array(buf);
  }

  if (typeof data === "bigint") {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    // Split into two 32-bit halves to avoid BigInt64 DataView requirement
    view.setUint32(0, Number(data & U32_MAX_BIG) >>> 0, /* littleEndian */ true);
    view.setUint32(4, Number((data >> 32n) & U32_MAX_BIG) >>> 0, /* littleEndian */ true);
    return new Uint8Array(buf);
  }

  return encoder.encode(JSON.stringify(data));
};
