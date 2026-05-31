import { describe, expect, it } from "vitest";
import { fold64To32 } from "./fold64-to-32.js";

describe("fold64To32", () => {
  it("should produce consistent results", () => {
    expect(fold64To32(0n)).toBe(fold64To32(0n));
    expect(fold64To32(0xdeadbeefcafebaben)).toBe(fold64To32(0xdeadbeefcafebaben));
  });

  it("should return an unsigned 32-bit integer", () => {
    const inputs = [0n, 1n, 0xffffffffn, 0xffffffffffffffffn, 0x1234567890abcdefn];
    for (const x of inputs) {
      const result = fold64To32(x);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(0xffffffff);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should fold upper and lower halves correctly", () => {
    // Upper bits: 0x11111111, Lower bits: 0x22222222
    // XOR should be 0x33333333 = 858993459
    const val = 0x1111111122222222n;
    expect(fold64To32(val)).toBe(0x11111111 ^ 0x22222222);
  });
});
