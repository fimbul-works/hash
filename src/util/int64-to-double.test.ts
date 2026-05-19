import { describe, expect, it } from "vitest";
import { int64ToDouble } from "./int64-to-double.js";

describe("int64ToDouble", () => {
  it("should produce values in [0, 1)", () => {
    expect(int64ToDouble(0n)).toBe(0);
    expect(int64ToDouble(0xffffffffffffffffn)).toBeGreaterThanOrEqual(0);
    expect(int64ToDouble(0xffffffffffffffffn)).toBeLessThan(1);
  });

  it("should maintain relative precision", () => {
    const h1 = int64ToDouble(1n << 11n);
    const h2 = int64ToDouble(2n << 11n);
    expect(h2).toBe(h1 * 2);
  });
});
