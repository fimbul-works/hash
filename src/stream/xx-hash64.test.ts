import { describe, expect, it } from "vitest";
import { xxHash64 } from "./xx-hash64.js";

describe("xxHash64", () => {
  it("should produce consistent results", () => {
    const seed = 12345n;
    expect(xxHash64("hello", seed)).toBe(xxHash64("hello", seed));
    expect(xxHash64("hello")).not.toBe(xxHash64("world"));
  });

  it("should return a bigint", () => {
    expect(typeof xxHash64("test")).toBe("bigint");
  });

  it("should handle different length inputs", () => {
    const inputs = ["", "a", "abc", "abcd", "abcde", "abcdefghijklmnopqrstuvwxyz"];
    const seen = new Set();
    for (const input of inputs) {
      const h = xxHash64(input);
      expect(seen.has(h)).toBe(false);
      seen.add(h);
    }
  });
});
