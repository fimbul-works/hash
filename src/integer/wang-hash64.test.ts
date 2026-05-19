import { describe, expect, it } from "vitest";
import { wangHash64 } from "./wang-hash64.js";

describe("wangHash64", () => {
  it("should produce consistent results", () => {
    const key = 0xdeadbeefcafebaben;
    expect(wangHash64(key)).toBe(wangHash64(key));
  });

  it("should show avalanche effect", () => {
    const h1 = wangHash64(1n);
    const h2 = wangHash64(2n);
    expect(h1).not.toBe(h2);
  });
});
