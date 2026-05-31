import { describe, expect, it } from "vitest";
import { wangHash } from "./wang-hash.js";

describe("wangHash", () => {
  it("should produce consistent results", () => {
    expect(wangHash(0)).toBe(wangHash(0));
    expect(wangHash(12345)).toBe(wangHash(12345));
    expect(wangHash(0xffffffff)).toBe(wangHash(0xffffffff));
  });

  it("should handle boundary conditions and negative inputs", () => {
    const hZero = wangHash(0);
    const hNegOne = wangHash(-1);
    const hMax = wangHash(0xffffffff);

    expect(hZero).toBeGreaterThanOrEqual(0);
    expect(hNegOne).toBeGreaterThanOrEqual(0);
    expect(hMax).toBeGreaterThanOrEqual(0);

    expect(hZero).not.toBe(hNegOne);
    expect(hNegOne).toBe(wangHash(0xffffffff)); // -1 >>> 0 is 0xffffffff
  });

  it("should return an unsigned 32-bit integer", () => {
    const inputs = [0, 42, -9999, 0x7fffffff, 0xffffffff];
    for (const x of inputs) {
      const result = wangHash(x);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(0xffffffff);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should show high avalanche effect when single bits change", () => {
    const r1 = wangHash(0x1000);
    const r2 = wangHash(0x1001);
    const r3 = wangHash(0x2000);

    expect(r1).not.toBe(r2);
    expect(r1).not.toBe(r3);

    // Verify bit differences are substantial and not just off by 1
    expect(Math.abs(r1 - r2)).toBeGreaterThan(1000000);
    expect(Math.abs(r1 - r3)).toBeGreaterThan(1000000);
  });
});
