import { describe, expect, it } from "vitest";
import { splitMix } from "./splitmix.js";

describe("splitMix", () => {
  it("should produce consistent results", () => {
    expect(splitMix(0)).toBe(splitMix(0));
    expect(splitMix(12345)).toBe(splitMix(12345));
    expect(splitMix(0xffffffff)).toBe(splitMix(0xffffffff));
  });

  it("should return an unsigned 32-bit integer", () => {
    const inputs = [0, 1, -1, 0x7fffffff, 0xffffffff];
    for (const x of inputs) {
      const result = splitMix(x);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(0xffffffff);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should provide high avalanche / different results for consecutive inputs", () => {
    const r1 = splitMix(0);
    const r2 = splitMix(1);
    const r3 = splitMix(2);

    expect(r1).not.toBe(r2);
    expect(r2).not.toBe(r3);
    expect(r1).not.toBe(r3);

    // Verify significant scrambling between consecutive values
    expect(Math.abs(r1 - r2)).toBeGreaterThan(1000000);
    expect(Math.abs(r2 - r3)).toBeGreaterThan(1000000);
  });
});
