import { describe, expect, it } from "vitest";
import { crc32 } from "./crc32.js";

describe("crc32", () => {
  it("should produce consistent results", () => {
    expect(crc32("hello")).toBe(0x3610a686);
    expect(crc32("world")).toBe(0x3a771143);
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
