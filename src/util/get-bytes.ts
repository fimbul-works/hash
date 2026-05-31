/**
 * Convert arbitrary data into a byte representation for use with hashing functions.
 *
 * Encoding rules (in order):
 * - `string`      → UTF-8 bytes via TextEncoder
 * - `number`      → 8 bytes, little-endian IEEE 754 float64
 * - `bigint`      → 8 bytes, little-endian uint64 (truncated to 64 bits)
 * - `Uint8Array`  → passed through as-is
 * - `Buffer`      → passed through as-is (Node.js)
 * - anything else → UTF-8 bytes of `JSON.stringify(data)`
 *
 * @param {unknown} data - Input data.
 * @param {boolean} [littleEndian=true] - Whether to use little-endian byte order.
 * @returns {Uint8Array} The data byte representation as Uint8Array.
 */
export const getBytes = (data: unknown, littleEndian: boolean = true): Uint8Array => {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }

  if (typeof data === "number") {
    const buf = new ArrayBuffer(8);
    const normalized = Object.is(data, -0) ? 0 : data;
    new DataView(buf).setFloat64(0, normalized, littleEndian);
    return new Uint8Array(buf);
  }

  if (typeof data === "bigint") {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setUint32(0, Number(data & 0xffffffffn) >>> 0, littleEndian);
    view.setUint32(4, Number((data >> 32n) & 0xffffffffn) >>> 0, littleEndian);
    return new Uint8Array(buf);
  }

  if (data instanceof Uint8Array) {
    return data;
  }

  if (typeof Buffer !== "undefined" && data instanceof Buffer) {
    return new Uint8Array(data);
  }

  return new TextEncoder().encode(JSON.stringify(data));
};
