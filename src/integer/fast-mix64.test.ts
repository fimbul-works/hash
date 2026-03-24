import { expect, it, describe } from "vitest";
import { fastMix64, fastUnmix64, verifyFastMix64 } from "./fast-mix64.js";

describe("fastMix64", () => {
  it("should be invertible with fastUnmix64 (64-bit)", () => {
    const inputs = [0n, 1n, 42n, 0xdeadbeefcafebaben, 0xffffffffffffffffn];
    for (const x of inputs) {
      const mixed = fastMix64(x);
      const unmixed = fastUnmix64(mixed);
      expect(unmixed).toBe(x);
    }
  });

  it("should verify hierarchical IDs with verifyFastMix64 (64-bit)", () => {
    const a = 123n;
    const b = 456n;
    const mixed = fastMix64(a, b);
    expect(verifyFastMix64(mixed, a, b)).toBe(true);
    expect(verifyFastMix64(mixed, a + 1n, b)).toBe(false);
  });
});
