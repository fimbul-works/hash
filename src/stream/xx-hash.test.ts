import { describe, expect, it } from "vitest";
import { xxHash } from "./xx-hash.js";

describe("xxHash", () => {
  it("should produce consistent results", () => {
    const seed = 12345;
    expect(xxHash("hello", seed)).toBe(xxHash("hello", seed));
    expect(xxHash("hello")).not.toBe(xxHash("world"));
  });

  it("should handle different length inputs", () => {
    const inputs = ["", "a", "abc", "abcd", "abcde", "abcdefghijklmnopqrstuvwxyz"];
    const seen = new Set();
    for (const input of inputs) {
      const h = xxHash(input);
      expect(seen.has(h)).toBe(false);
      seen.add(h);
    }
  });
});
