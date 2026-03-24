import { describe, it, expect } from "vitest";
import { clampBits } from "./clamp-bits.js";

describe("clampBits", () => {
  it("should clamp numbers to 2 bits", () => {
    expect(clampBits(0b1111, 2)).toBe(0b11);
  });

  it("should clamp numbers to 8 bits", () => {
    expect(clampBits(0xfff, 8)).toBe(0xff);
    expect(clampBits(0x1234, 8)).toBe(0x34);
  });

  it("should clamp numbers to 16 bits", () => {
    expect(clampBits(0xfffff, 16)).toBe(0xffff);
    expect(clampBits(0x123456, 16)).toBe(0x3456);
  });

  it("should clamp numbers to 32 bits and return unsigned", () => {
    expect(clampBits(0xfffffffff, 32)).toBe(4294967295);
  });

  it("should clamp numbers to 40 bits (safely fits in number)", () => {
    const input = (1n << 45n) | 0x1234567890n;
    expect(clampBits(input, 40)).toBe(0x1234567890);
  });

  it("should clamp numbers to 53 bits (MAX_SAFE_INTEGER bits)", () => {
    const input = (1n << 60n) | 0x1fffffffffffffn;
    expect(clampBits(input, 53)).toBe(9007199254740991);
  });

  it("should clamp to 64 bits (returning bigint)", () => {
    const input = (1n << 70n) | 0xabcdefn;
    expect(clampBits(input, 64)).toBe(0xabcdefn);
  });

  it("should handle bigint input for small bit widths", () => {
    expect(clampBits(0xfffffffffffn, 8)).toBe(0xff);
  });
});
