import { describe, expect, it } from "vitest";
import { fnv1aHash } from "./fnv1a.js";

describe("fnv1aHash", () => {
  it("should produce consistent results", () => {
    const data = "hello FimbulWorks";
    expect(fnv1aHash(data)).toBe(fnv1aHash(data));
  });

  it("should return an unsigned 32-bit integer", () => {
    const result = fnv1aHash("test");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("should match standard FNV-1a 32-bit test vectors", () => {
    // Official test vectors for FNV-1a 32-bit
    expect(fnv1aHash("")).toBe(2166136261);
    expect(fnv1aHash("a")).toBe(3826002220);
    expect(fnv1aHash("b")).toBe(3876335077);
    expect(fnv1aHash("c")).toBe(3859557458);
    expect(fnv1aHash("abc")).toBe(440920331);
  });

  it("should handle custom seed values", () => {
    const data = "hello";
    const customSeed = 12345678;
    const r1 = fnv1aHash(data, customSeed);
    const r2 = fnv1aHash(data); // default seed 2166136261

    expect(r1).not.toBe(r2);
    expect(r1).toBeGreaterThanOrEqual(0);
    expect(r1).toBeLessThanOrEqual(0xffffffff);
  });

  it("should correctly handle various input types handled by getBytes", () => {
    // Typed arrays
    const arr = new Uint8Array([1, 2, 3]);
    expect(fnv1aHash(arr)).toBe(fnv1aHash(new Uint8Array([1, 2, 3])));

    // Numbers
    expect(fnv1aHash(42)).toBe(fnv1aHash(42));
    expect(fnv1aHash(42)).not.toBe(fnv1aHash("42")); // preserve type distinction

    // Objects
    const obj = { x: 1, y: 2 };
    expect(fnv1aHash(obj)).toBe(fnv1aHash({ x: 1, y: 2 }));
  });
});
