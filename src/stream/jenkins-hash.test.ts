import { describe, expect, it } from "vitest";
import { jenkinsHash } from "./jenkins-hash.js";

describe("jenkinsHash", () => {
  it("should produce consistent results", () => {
    expect(jenkinsHash("hello")).toBe(jenkinsHash("hello"));
    expect(jenkinsHash("hello")).not.toBe(jenkinsHash("world"));
  });

  it("should not have collisions for small set", () => {
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const h = jenkinsHash(i.toString());
      expect(seen.has(h)).toBe(false);
      seen.add(h);
    }
  });
});
