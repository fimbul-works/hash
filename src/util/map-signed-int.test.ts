import { describe, expect, it } from "vitest";
import { mapSignedInt, unmapSignedInt } from "./map-signed-int.js";

describe("mapSignedInt & unmapSignedInt", () => {
  it("should bijectively map integers", () => {
    const testCases = [0, 1, -1, 42, -42, 2147483647, -2147483648];
    for (const x of testCases) {
      const mapped = mapSignedInt(x);
      expect(mapped).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(mapped)).toBe(true);

      const unmapped = unmapSignedInt(mapped);
      expect(unmapped).toBe(x);
    }
  });

  it("should produce the exact expected mapping sequences", () => {
    expect(mapSignedInt(0)).toBe(0);
    expect(mapSignedInt(-1)).toBe(1);
    expect(mapSignedInt(1)).toBe(2);
    expect(mapSignedInt(-2)).toBe(3);
    expect(mapSignedInt(2)).toBe(4);
  });

  it("should throw on invalid inputs", () => {
    expect(() => mapSignedInt(1.5)).toThrow();
    expect(() => unmapSignedInt(-1)).toThrow();
    expect(() => unmapSignedInt(1.5)).toThrow();
  });
});
