import { describe, expect, it } from "vitest";
import { floatToBits32, floatToBits64 } from "./float-to-bits.js";

describe("floatToBits32 & floatToBits64", () => {
  it("should extract 32-bit float bit patterns correctly", () => {
    // 0.0f is all zeros
    expect(floatToBits32(0.0)).toBe(0);

    // 1.0f in IEEE-754 single-precision:
    // Sign: 0, Exponent: 127 (0x7f), Mantissa: 0 -> 0x3f800000 = 1065353216
    expect(floatToBits32(1.0)).toBe(1065353216);

    // -1.0f -> 0xbf800000 = 3212836864
    expect(floatToBits32(-1.0)).toBe(3212836864);
  });

  it("should extract 64-bit double bit patterns correctly", () => {
    expect(floatToBits64(0.0)).toBe(0n);

    // 1.0 in IEEE-754 double-precision:
    // Sign: 0, Exponent: 1023 (0x3ff), Mantissa: 0 -> 0x3ff0000000000000n = 4607182418800017408n
    expect(floatToBits64(1.0)).toBe(4607182418800017408n);
  });

  it("should differentiate 0.0 and -0.0 raw bitwise representations", () => {
    expect(floatToBits32(0.0)).not.toBe(floatToBits32(-0.0));
    expect(floatToBits64(0.0)).not.toBe(floatToBits64(-0.0));
  });
});
