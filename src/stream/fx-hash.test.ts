import { describe, expect, it } from "vitest";
import { fxHash } from "./fx-hash.js";

describe("fxHash", () => {
  it("should produce consistent results", () => {
    const data = "test data";
    expect(fxHash(data)).toBe(fxHash(data));
  });
});
