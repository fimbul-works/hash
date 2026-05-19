import { describe, expect, it } from "vitest";
import { fastHash } from "./fast-hash.js";

describe("fastHash", () => {
  it("should produce consistent results", () => {
    expect(fastHash("hello")).toBe(fastHash("hello"));
    expect(fastHash("hello", 1)).not.toBe(fastHash("hello", 2));
    expect(fastHash("hello")).not.toBe(fastHash("world"));
  });
});
