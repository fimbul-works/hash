import { describe, expect, it } from "vitest";
import { murmur3Hash128 } from "./murmur3-128.js";

describe("murmur3Hash128", () => {
  it("should produce consistent results and support seeding", () => {
    const data = "The quick brown fox jumps over the lazy dog";
    expect(murmur3Hash128(data)).toBe(murmur3Hash128(data));
    expect(murmur3Hash128(data, 1n)).not.toBe(murmur3Hash128(data, 0n));
  });

  it("should handle various input lengths", () => {
    const seen = new Set<bigint>();
    for (let i = 0; i < 100; i++) {
      const h = murmur3Hash128("a".repeat(i));
      expect(seen.has(h)).toBe(false);
      seen.add(h);
    }
  });
});
