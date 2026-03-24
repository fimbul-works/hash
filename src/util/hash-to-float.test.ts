import { expect, it, describe } from "vitest";
import { hashToFloat } from "./hash-to-float.js";

describe("hashToFloat", () => {
  it("should produce values in [0, 1)", () => {
    expect(hashToFloat(0)).toBe(0);
    expect(hashToFloat(0xffffffff)).toBeLessThan(1);
    expect(hashToFloat(0xffffffff)).toBeGreaterThan(0.99999999);
  });

  it("should maintain relative precision", () => {
    const h1 = hashToFloat(1);
    const h2 = hashToFloat(2);
    expect(h2).toBe(h1 * 2);
  });
});
