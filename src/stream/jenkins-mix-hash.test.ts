import { expect, it, describe } from "vitest";
import { jenkinsMixHash } from "./jenkins-mix-hash.js";

describe("jenkinsMixHash", () => {
  it("should produce consistent results", () => {
    expect(jenkinsMixHash("hello")).toBe(jenkinsMixHash("hello"));
    expect(jenkinsMixHash("hello", 1)).not.toBe(jenkinsMixHash("hello", 2));
  });

  it("should handle different lengths", () => {
    const inputs = ["", "a", "abc", "abcd", "abcde", "abcdefghijklmnopqrstuvwxyz"];
    for (const input of inputs) {
      expect(typeof jenkinsMixHash(input)).toBe("number");
    }
  });
});
