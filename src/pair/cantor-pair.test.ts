import { describe, expect, it } from "vitest";
import { cantorPair, reverseCantorPair } from "./cantor-pair.js";

describe("cantorPair", () => {
  it("should produce consistent results", () => {
    expect(cantorPair(0, 0)).toBe(0);
    expect(cantorPair(1, 2)).toBe(8);
    expect(cantorPair(2, 1)).toBe(7);
  });

  it("should be reversible with reverseCantorPair", () => {
    const pairs: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 2],
      [10, 20],
      [100, 100],
    ];
    for (const [x, y] of pairs) {
      const z = cantorPair(x, y);
      const [rx, ry] = reverseCantorPair(z);
      expect(rx).toBe(x);
      expect(ry).toBe(y);
    }
  });

  it("should throw on invalid input", () => {
    expect(() => cantorPair(-1, 0)).toThrow();
    expect(() => cantorPair(0, -1)).toThrow();
    expect(() => cantorPair(1.5, 0)).toThrow();
    expect(() => reverseCantorPair(-1)).toThrow();
    expect(() => reverseCantorPair(1.5)).toThrow();
  });
});
