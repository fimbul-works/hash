import { describe, expect, it } from "vitest";
import { fnv1a64Hash } from "./fnv1a64.js";

describe("fnv1a64Hash", () => {
  it("should produce consistent results", () => {
    const data = "hello world";
    expect(fnv1a64Hash(data)).toBe(fnv1a64Hash(data));
  });

  it("should return a bigint", () => {
    expect(typeof fnv1a64Hash("test")).toBe("bigint");
  });

  it("should not have collisions for small set", () => {
    const h1 = fnv1a64Hash("test1");
    const h2 = fnv1a64Hash("test2");
    expect(h1).not.toBe(h2);
  });
});
