import { expect, it, describe } from "vitest";
import { hash64ToDouble } from "./hash64-to-double.js";

describe("hash64ToDouble", () => {
  it("should produce values in [0, 1)", () => {
    expect(hash64ToDouble(0n)).toBe(0);
    expect(hash64ToDouble(0xffffffffffffffffn)).toBeGreaterThanOrEqual(0);
    expect(hash64ToDouble(0xffffffffffffffffn)).toBeLessThan(1);
  });

  it("should maintain relative precision", () => {
    const h1 = hash64ToDouble(1n << 11n);
    const h2 = hash64ToDouble(2n << 11n);
    expect(h2).toBe(h1 * 2);
  });
});
