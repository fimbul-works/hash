import { expect, it, describe } from "vitest";
import { createMash } from "./mash.js";

describe("createMash", () => {
  it("should produce consistent initial results", () => {
    const m1 = createMash();
    const m2 = createMash();
    expect(m1("hello")).toBe(m2("hello"));
  });

  it("should be stateful", () => {
    const m = createMash();
    const res1 = m("a");
    const res2 = m("b");
    expect(res1).not.toBe(res2);

    const m2 = createMash();
    m2("a");
    expect(m2("b")).toBe(res2);
  });

  it("should support 'slitting' / forking logic", () => {
    const m1 = createMash();
    m1("prologue");
    const checkpoint = m1.seed;

    const m2 = createMash(checkpoint);
    const m3 = createMash(checkpoint);

    // They should diverge from the same point
    expect(m2("path A")).toBe(m1("path A")); // m1 was at checkpoint, so continuing m1 is like m2
    expect(m3("path B")).not.toBe(m2("path A"));
  });
});
