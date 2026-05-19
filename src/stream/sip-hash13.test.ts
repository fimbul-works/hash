import { describe, expect, it } from "vitest";
import { sipHash13 } from "./sip-hash13.js";

describe("sipHash13", () => {
  it("should produce consistent results", () => {
    expect(sipHash13("hello")).toBe(sipHash13("hello"));
    expect(sipHash13("hello", 1, 2)).toBe(sipHash13("hello", 1, 2));
    expect(sipHash13("hello", 1, 2)).not.toBe(sipHash13("hello", 2, 1));
  });
});
