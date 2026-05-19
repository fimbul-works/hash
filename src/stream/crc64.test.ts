import { describe, expect, it } from "vitest";
import { crc64 } from "./crc64.js";

describe("crc64", () => {
  it("should produce consistent results", () => {
    expect(typeof crc64("hello")).toBe("bigint");
    expect(crc64("hello")).toBe(crc64("hello"));
  });

  it("should handle different inputs", () => {
    expect(crc64("hello")).not.toBe(crc64("world"));
  });
});
