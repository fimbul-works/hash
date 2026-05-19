import { describe, expect, it } from "vitest";
import { intToFloat } from "./int-to-float.js";

describe("intToFloat", () => {
  it("should produce values in [0, 1)", () => {
    expect(intToFloat(0)).toBe(0);
    expect(intToFloat(0xffffffff)).toBeLessThan(1);
    expect(intToFloat(0xffffffff)).toBeGreaterThan(0.99999999);
  });

  it("should maintain relative precision", () => {
    const h1 = intToFloat(1);
    const h2 = intToFloat(2);
    expect(h2).toBe(h1 * 2);
  });
});
