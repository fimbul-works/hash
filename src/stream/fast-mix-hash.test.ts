import { expect, it, describe } from "vitest";
import { fastMixHash } from "./fast-mix-hash.js";

describe("fastMixHash", () => {
  it("should produce consistent results", () => {
    expect(fastMixHash("hello")).toBe(fastMixHash("hello"));
    expect(fastMixHash("hello", 123)).toBe(fastMixHash("hello", 123));
    expect(fastMixHash("hello")).not.toBe(fastMixHash("world"));
  });

  it("should handle different lengths", () => {
    const inputs = ["", "a", "abc", "abcd", "abcde", "abcdefghijklmnopqrstuvwxyz"];
    for (const input of inputs) {
      expect(typeof fastMixHash(input)).toBe("number");
    }
  });
});
