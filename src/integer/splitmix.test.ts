import { describe, expect, it } from "vitest";
import { splitMix } from "./splitmix.js";

describe("splitMix", () => {
  it("should produce consistent results", () => {
    expect(splitMix(0)).toBe(splitMix(0));
    expect(splitMix(12345)).toBe(splitMix(12345));
  });
});
