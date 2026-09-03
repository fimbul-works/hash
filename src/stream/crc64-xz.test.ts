import { describe, expect, it } from "vitest";
import { crc64Xz } from "./crc64-xz.js";

describe("crc64Xz", () => {
  it("should match canonical CRC-64/XZ (Go-ECMA) check vectors", () => {
    // Reflected ECMA polynomial, init ~0, xorout ~0
    expect(crc64Xz("123456789")).toBe(0x995dc9bbdf1939fan);
    expect(crc64Xz("")).toBe(0x0n);
    expect(crc64Xz("hello")).toBe(0x9b1edae5dbb937b1n);
  });

  it("should produce consistent results and return BigInt", () => {
    expect(typeof crc64Xz("hello")).toBe("bigint");
    expect(crc64Xz("hello")).toBe(crc64Xz("hello"));
    expect(crc64Xz("hello")).not.toBe(crc64Xz("world"));
  });

  it("should handle typed arrays and other input types", () => {
    const arr = new Uint8Array([1, 2, 3]);
    expect(crc64Xz(arr)).toBe(crc64Xz(new Uint8Array([1, 2, 3])));
    expect(crc64Xz(42)).toBe(crc64Xz(42));
  });
});
