import { describe, expect, it } from "vitest";
import { pcgMix } from "./pcg.js";

describe("pcgMix", () => {
  it("should produce consistent results", () => {
    expect(pcgMix(0)).toBe(pcgMix(0));
    expect(pcgMix(0xffffffff)).toBe(pcgMix(0xffffffff));
  });

  it("should show avalanche effect", () => {
    const h1 = pcgMix(1);
    const h2 = pcgMix(2);
    expect(h1).not.toBe(h2);
  });
});
