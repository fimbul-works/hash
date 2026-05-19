import { describe, expect, it } from "vitest";
import { getBytes } from "./get-bytes.js";

describe("getBytes", () => {
  it("should encode strings to UTF-8", () => {
    const data = "hello";
    const bytes = getBytes(data);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(Array.from(bytes)).toEqual([104, 101, 108, 108, 111]);
  });

  it("should pass through Uint8Array", () => {
    const data = new Uint8Array([1, 2, 3]);
    expect(getBytes(data)).toBe(data);
  });

  it("should encode numbers as 8-byte float64 LE", () => {
    const data = 1.0;
    const bytes = getBytes(data);
    expect(bytes.length).toBe(8);
    // 1.0 in float64 LE: 00 00 00 00 00 00 f0 3f
    expect(Array.from(bytes)).toEqual([0, 0, 0, 0, 0, 0, 240, 63]);
  });

  it("should encode bigints as 8-byte uint64 LE", () => {
    const data = 0x1234567890abcdefn;
    const bytes = getBytes(data);
    expect(bytes.length).toBe(8);
    expect(Array.from(bytes)).toEqual([0xef, 0xcd, 0xab, 0x90, 0x78, 0x56, 0x34, 0x12]);
  });

  it("should JSON stringify objects", () => {
    const data = { a: 1 };
    const bytes = getBytes(data);
    const decoded = new TextDecoder().decode(bytes);
    expect(decoded).toBe('{"a":1}');
  });
});
