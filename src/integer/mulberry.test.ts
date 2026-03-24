import { expect, it, describe } from "vitest";
import { mulberry } from "./mulberry.js";

describe("mulberry", () => {
  it("should produce consistent results", () => {
    expect(mulberry(0)).toBe(mulberry(0));
    expect(mulberry(42)).toBe(mulberry(42));
  });

  it("should have reasonable distribution", () => {
    const h1 = mulberry(1);
    const h2 = mulberry(2);
    expect(h1).not.toBe(h2);
  });
});
