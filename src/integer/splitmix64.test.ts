import { describe, expect, it } from "vitest";
import { splitMix64 } from "./splitmix64.js";

describe("splitMix64", () => {
  it("should produce consistent results", () => {
    const key = 1234567890123456789n;
    expect(splitMix64(key)).toBe(splitMix64(key));
    expect(splitMix64(0n)).toBe(splitMix64(0n));
    expect(splitMix64(0xffffffffffffffffn)).toBe(splitMix64(0xffffffffffffffffn));
  });

  it("should handle 0 and return a bigint in 64-bit range", () => {
    const inputs = [0n, 1n, 123456789n, 0xffffffffffffffffn];
    for (const x of inputs) {
      const result = splitMix64(x);
      expect(typeof result).toBe("bigint");
      expect(result).toBeGreaterThanOrEqual(0n);
      expect(result).toBeLessThanOrEqual(0xffffffffffffffffn);
    }
  });

  it("should show high avalanche effect when single bits change", () => {
    const r1 = splitMix64(0n);
    const r2 = splitMix64(1n);
    const r3 = splitMix64(2n);

    expect(r1).not.toBe(r2);
    expect(r2).not.toBe(r3);
    expect(r1).not.toBe(r3);

    // Verify significant scrambling between sequential values
    const diff = r1 > r2 ? r1 - r2 : r2 - r1;
    expect(diff).toBeGreaterThan(1000000000n);
  });
});
