import { describe, expect, it } from "vitest";
import { wyHash } from "./wyhash.js";

describe("wyHash", () => {
  it("should produce consistent results", () => {
    const seed = 12345n;
    expect(wyHash("hello", seed)).toBe(wyHash("hello", seed));
    expect(wyHash("hello")).not.toBe(wyHash("world"));
  });

  it("should handle different length inputs", () => {
    const inputs = ["", "a", "abc", "abcd", "abcde", "abcdefghijklmnopqrstuvwxyz"];
    for (const input of inputs) {
      expect(typeof wyHash(input)).toBe("bigint");
    }
  });

  it("should not have collisions for small strings", () => {
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      const h = wyHash(i.toString());
      expect(seen.has(h)).toBe(false);
      seen.add(h);
    }
  });

  it("should not crash for inputs of length 0 to 16", () => {
    for (let len = 0; len <= 16; len++) {
      const data = new Uint8Array(len);
      for (let i = 0; i < len; i++) data[i] = i + 1;

      expect(() => wyHash(data)).not.toThrow();

      const h = wyHash(data);
      expect(typeof h).toBe("bigint");
    }
  });

  it("should handle 4-8 byte inputs correctly", () => {
    // Specifically test the branch reported by the user
    for (let len = 4; len <= 8; len++) {
      const data = new Uint8Array(len).fill(0xff);
      expect(() => wyHash(data)).not.toThrow();
    }
  });
});
