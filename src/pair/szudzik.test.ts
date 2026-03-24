import { expect, it, describe } from "vitest";
import { szudzikPair, reverseSzudzikPair } from "./szudzik.js";

describe("szudzikPair", () => {
  it("should produce consistent results", () => {
    expect(szudzikPair(0, 0)).toBe(0);
    expect(szudzikPair(1, 2)).toBe(szudzikPair(1, 2));
  });

  it("should be reversible with reverseSzudzikPair", () => {
    const x = 42,
      y = 7;
    const z = szudzikPair(x, y);
    const [rx, ry] = reverseSzudzikPair(z);
    expect(rx).toBe(x);
    expect(ry).toBe(y);
  });

  it("should throw on invalid input", () => {
    expect(() => szudzikPair(-1, 0)).toThrow();
    expect(() => szudzikPair(0, -2)).toThrow();
    expect(() => szudzikPair(1.1, 0)).toThrow();
    expect(() => reverseSzudzikPair(-1)).toThrow();
    expect(() => reverseSzudzikPair(1.5)).toThrow();
  });

  it("should have unique mapping", () => {
    const seen = new Set<number>();
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const z = szudzikPair(x, y);
        expect(seen.has(z)).toBe(false);
        seen.add(z);
      }
    }
  });
});
