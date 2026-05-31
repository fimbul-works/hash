import { describe, expect, it } from "vitest";
import { jenkinsMix } from "./jenkins-mix.js";

describe("jenkinsMix", () => {
  it("should produce consistent results", () => {
    expect(jenkinsMix(1, 2, 3)).toBe(jenkinsMix(1, 2, 3));
    expect(jenkinsMix(0, 0, 0)).toBe(jenkinsMix(0, 0, 0));
    expect(jenkinsMix(0xffffffff, 0xffffffff, 0xffffffff)).toBe(jenkinsMix(0xffffffff, 0xffffffff, 0xffffffff));
  });

  it("should return an unsigned 32-bit integer", () => {
    const result = jenkinsMix(0x12345678, 0x9abcdef0, 0xabcdef12);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
    expect(Number.isInteger(result)).toBe(true);
  });

  it("should show high avalanche effect when single bits change", () => {
    const r1 = jenkinsMix(100, 200, 300);
    // Change only 1 bit in a
    const r2 = jenkinsMix(101, 200, 300);
    // Change only 1 bit in b
    const r3 = jenkinsMix(100, 201, 300);
    // Change only 1 bit in c
    const r4 = jenkinsMix(100, 200, 301);

    expect(r1).not.toBe(r2);
    expect(r1).not.toBe(r3);
    expect(r1).not.toBe(r4);

    // Verify bit differences are substantial and not just off by 1
    expect(Math.abs(r1 - r2)).toBeGreaterThan(1000);
    expect(Math.abs(r1 - r3)).toBeGreaterThan(1000);
    expect(Math.abs(r1 - r4)).toBeGreaterThan(1000);
  });
});
