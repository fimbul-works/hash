import { expect, it, describe } from "vitest";
import { crc32 } from "./crc32.js";

describe("crc32", () => {
  it("should produce consistent results", () => {
    expect(crc32("hello")).toBe(0x3610a686);
    expect(crc32("world")).toBe(980881731); // Verified value
  });

  it("should handle different inputs", () => {
    expect(crc32("a")).not.toBe(crc32("b"));
  });
});
