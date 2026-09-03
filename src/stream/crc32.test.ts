import { describe, expect, it } from "vitest";
import { crc32 } from "./crc32.js";

describe("crc32", () => {
  it("should match canonical CRC-32 (IEEE 802.3 / ISO 3309) check vectors", () => {
    // Canonical standard test vector
    expect(crc32("123456789")).toBe(0xcbf43926);
    expect(crc32("")).toBe(0x00000000);
    expect(crc32("hello")).toBe(0x3610a686);
    expect(crc32("world")).toBe(0x3a771143);
    expect(crc32("The quick brown fox jumps over the lazy dog")).toBe(0x414fa339);
  });

  it("should handle different inputs", () => {
    expect(crc32("a")).not.toBe(crc32("b"));
  });

  it("should correctly handle various input types handled by getBytes", () => {
    // Typed arrays
    const arr = new Uint8Array([1, 2, 3]);
    expect(crc32(arr)).toBe(crc32(new Uint8Array([1, 2, 3])));

    // Numbers
    expect(crc32(42)).toBe(crc32(42));
    expect(crc32(42)).not.toBe(crc32("42"));

    // Objects
    const obj = { x: 1, y: 2 };
    expect(crc32(obj)).toBe(crc32({ x: 1, y: 2 }));
  });
});
