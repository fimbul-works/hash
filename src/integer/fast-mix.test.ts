import { expect, it, describe } from "vitest";
import { fastMix, fastUnmix, verifyFastMix } from "./fast-mix.js";

describe("fastMix", () => {
  it("should be invertible with fastUnmix (32-bit)", () => {
    const inputs = [0, 1, 42, 0xdeadbeef >>> 0, 0xffffffff >>> 0];
    for (const x of inputs) {
      const mixed = fastMix(x);
      const unmixed = fastUnmix(mixed);
      expect(unmixed).toBe(x);
    }
  });

  it("should verify hierarchical IDs with verifyFastMix (32-bit)", () => {
    const data = 123;
    const parent = 456;
    const mixed = fastMix(data, parent);
    expect(verifyFastMix(mixed, data, parent)).toBe(true);
    expect(verifyFastMix(mixed, data + 1, parent)).toBe(false);
  });
});
