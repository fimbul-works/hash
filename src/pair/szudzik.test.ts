import { describe, expect, it } from "vitest";
import { reverseSzudzikPair, szudzikPair, szudzikPair3D, reverseSzudzikPair3D } from "./szudzik.js";

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

describe("szudzikPair3D", () => {
  it("should produce consistent results", () => {
    expect(szudzikPair3D(0, 0, 0)).toBe(0);
    expect(szudzikPair3D(1, 2, 3)).toBe(szudzikPair3D(1, 2, 3));
  });

  it("should be reversible with reverseSzudzikPair3D", () => {
    const x = 5,
      y = 12,
      z = 9;
    const z3 = szudzikPair3D(x, y, z);
    const [rx, ry, rz] = reverseSzudzikPair3D(z3);
    expect(rx).toBe(x);
    expect(ry).toBe(y);
    expect(rz).toBe(z);
  });

  it("should have unique mapping for 3D coordinates", () => {
    const seen = new Set<number>();
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        for (let z = 0; z < 6; z++) {
          const z3 = szudzikPair3D(x, y, z);
          expect(seen.has(z3)).toBe(false);
          seen.add(z3);
        }
      }
    }
  });

  it("should throw on invalid inputs", () => {
    expect(() => szudzikPair3D(-1, 0, 0)).toThrow();
    expect(() => szudzikPair3D(0, -1, 0)).toThrow();
    expect(() => szudzikPair3D(0, 0, -1)).toThrow();
    expect(() => reverseSzudzikPair3D(-1)).toThrow();
  });
});
