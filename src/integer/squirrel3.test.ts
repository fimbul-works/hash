import { expect, it, describe } from "vitest";
import { squirrel3 } from "./squirrel3.js";

describe("squirrel3", () => {
  it("should produce consistent results", () => {
    expect(squirrel3(0)).toBe(squirrel3(0));
    expect(squirrel3(42, 123)).toBe(squirrel3(42, 123));
    expect(squirrel3(0)).not.toBe(squirrel3(1));
  });

  it("should have basic distribution qualities", () => {
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(squirrel3(i));
    }
    expect(results.size).toBe(100);
  });
});
