import { describe, expect, it } from "vitest";
import { crc64 } from "./crc64.js";

describe("crc64", () => {
  it("should match canonical ECMA-182 check vectors", () => {
    // Canonical standard test vector (MSB-first, init 0, poly 0x42F0E1EBA9EA3693)
    expect(crc64("123456789")).toBe(0x6c40df5f0b497347n);
    expect(crc64("")).toBe(0x0n);
    expect(crc64("hello")).toBe(0x40544a306137b6ecn);
    expect(crc64("world")).toBe(0x96c579863c05b963n);
    expect(crc64("The quick brown fox jumps over the lazy dog")).toBe(0x41e05242ffa9883bn);
  });

  it("should produce consistent results and return BigInt", () => {
    expect(typeof crc64("hello")).toBe("bigint");
    expect(crc64("hello")).toBe(crc64("hello"));
    expect(crc64("hello")).not.toBe(crc64("world"));
  });

  it("should handle typed arrays and other input types", () => {
    const arr = new Uint8Array([1, 2, 3]);
    expect(crc64(arr)).toBe(crc64(new Uint8Array([1, 2, 3])));
    expect(crc64(42)).toBe(crc64(42));
  });
});
