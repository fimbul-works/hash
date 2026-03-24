import { expect, it, describe } from "vitest";
import { murmur3Hash } from "./murmur3.js";

describe("murmur3Hash", () => {
  it("should produce consistent results and support seeding", () => {
    const data = "hello world";
    expect(murmur3Hash(data)).toBe(murmur3Hash(data));
    expect(murmur3Hash(data, 1)).not.toBe(murmur3Hash(data, 0));
    expect(murmur3Hash("a")).not.toBe(murmur3Hash("b"));
  });

  it("should handle various data types", () => {
    expect(typeof murmur3Hash({ foo: "bar" })).toBe("number");
    expect(typeof murmur3Hash([1, 2, 3])).toBe("number");
  });
});
