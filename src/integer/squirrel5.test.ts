import { describe, expect, it } from "vitest";
import { squirrel5 } from "./squirrel5.js";

describe("squirrel5", () => {
  it("should produce consistent results", () => {
    expect(squirrel5(0)).toBe(squirrel5(0));
    expect(squirrel5(42, 123)).toBe(squirrel5(42, 123));
    expect(squirrel5(0)).not.toBe(squirrel5(1));
  });

  it("should have basic distribution qualities", () => {
    const results = new Set();
    for (let i = 0; i < 100; i++) {
      results.add(squirrel5(i));
    }
    expect(results.size).toBe(100);
  });
});
