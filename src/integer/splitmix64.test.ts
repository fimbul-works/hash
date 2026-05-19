import { describe, expect, it } from "vitest";
import { splitMix64 } from "./splitmix64.js";

describe("splitMix64", () => {
  it("should produce consistent results", () => {
    const key = 1234567890123456789n;
    expect(splitMix64(key)).toBe(splitMix64(key));
  });

  it("should handle 0 and return a bigint", () => {
    expect(typeof splitMix64(0n)).toBe("bigint");
  });
});
