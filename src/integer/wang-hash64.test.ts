import { describe, expect, it } from "vitest";
import { wangHash64 } from "./wang-hash64.js";

describe("wangHash64", () => {
  it("should produce consistent results", () => {
    const key = 0xdeadbeefcafebaben;
    expect(wangHash64(key)).toBe(wangHash64(key));
    expect(wangHash64(0n)).toBe(wangHash64(0n));
    expect(wangHash64(0xffffffffffffffffn)).toBe(wangHash64(0xffffffffffffffffn));
  });

  it("should return a bigint in 64-bit range", () => {
    const inputs = [0n, 1n, 0xdeadbeefcafebaben, 0xffffffffffffffffn];
    for (const x of inputs) {
      const result = wangHash64(x);
      expect(typeof result).toBe("bigint");
      expect(result).toBeGreaterThanOrEqual(0n);
      expect(result).toBeLessThanOrEqual(0xffffffffffffffffn);
    }
  });

  it("should show high avalanche effect when single bits change", () => {
    const r1 = wangHash64(1n);
    const r2 = wangHash64(2n);
    const r3 = wangHash64(3n);

    expect(r1).not.toBe(r2);
    expect(r2).not.toBe(r3);
    expect(r1).not.toBe(r3);

    // Verify significant scrambling
    const diff = r1 > r2 ? r1 - r2 : r2 - r1;
    expect(diff).toBeGreaterThan(1000000000n);
  });
});
