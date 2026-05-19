import { describe, expect, it } from "vitest";
import { createMash64 } from "./mash64.js";

describe("createMash64", () => {
  it("should produce consistent initial results", () => {
    const m1 = createMash64();
    const m2 = createMash64();
    expect(m1("hello")).toBe(m2("hello"));
  });

  it("should be stateful", () => {
    const m = createMash64();
    const res1 = m("a");
    const res2 = m("b");
    expect(res1).not.toBe(res2);

    const m2 = createMash64();
    m2("a");
    expect(m2("b")).toBe(res2);
  });

  it("should support forking logic", () => {
    const m1 = createMash64();
    m1("prologue");
    const checkpoint = m1.state;

    const m2 = createMash64(checkpoint);
    const m3 = createMash64(checkpoint);

    // They should diverge from the same point
    expect(m2("path A")).toBe(m1("path A")); // m1 was at checkpoint, so continuing m1 is like m2
    expect(m3("path B")).not.toBe(m2("path A"));
  });
});
