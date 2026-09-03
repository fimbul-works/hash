import { describe, expect, it } from "vitest";
import { pcgMix } from "./integer/pcg.js";
import { wangHash } from "./integer/wang-hash.js";
import { createSponge } from "./sponge.js";

describe("createSponge", () => {
  describe("initialization & configuration", () => {
    it("should create a sponge with default parameters", () => {
      const sponge = createSponge("world-seed");
      expect(sponge).toBeDefined();
      expect(typeof sponge.next).toBe("function");
      expect(typeof sponge.absorb).toBe("function");
      expect(typeof sponge.fork).toBe("function");
      expect(typeof sponge.getState).toBe("function");
      expect(typeof sponge.setState).toBe("function");
    });

    it("should accept custom number of registers", () => {
      const sponge4 = createSponge("seed", 4);
      const sponge32 = createSponge("seed", 32);

      expect(sponge4.getState().length).toBe(5); // idx + 4 registers
      expect(sponge32.getState().length).toBe(33); // idx + 32 registers
      expect(sponge4.next()).not.toBe(sponge32.next());
    });

    it("should accept a custom hasher function", () => {
      const defaultSponge = createSponge("test-seed", 16);
      const wangSponge = createSponge("test-seed", 16, wangHash);
      const pcgSponge = createSponge("test-seed", 16, pcgMix);

      expect(wangSponge.next()).not.toBe(defaultSponge.next());
      expect(pcgSponge.next()).not.toBe(wangSponge.next());
    });

    it("should throw RangeError for non-positive numRegisters", () => {
      expect(() => createSponge("seed", 0)).toThrow(RangeError);
      expect(() => createSponge("seed", -5)).toThrow(RangeError);
    });

    it("should handle null, undefined, empty string, or numbers as initial seed", () => {
      expect(() => createSponge(null)).not.toThrow();
      expect(() => createSponge(undefined)).not.toThrow();
      expect(() => createSponge("")).not.toThrow();
      expect(() => createSponge(12345)).not.toThrow();
      expect(() => createSponge({ foo: "bar" })).not.toThrow();
    });

    it("should not initialize with all-zero registers even with empty seed", () => {
      const sponge = createSponge(null);
      const state = sponge.getState();
      // Verify at least one register is non-zero
      const nonZero = Array.from(state.subarray(1)).some((v) => v !== 0);
      expect(nonZero).toBe(true);
      expect(sponge.next()).not.toBe(0);
    });
  });

  describe("determinism & seed sensitivity", () => {
    it("should produce identical sequences for identical initial seeds", () => {
      const s1 = createSponge("procedural-seed-42");
      const s2 = createSponge("procedural-seed-42");

      for (let i = 0; i < 50; i++) {
        expect(s1.next()).toBe(s2.next());
      }
    });

    it("should produce divergent sequences for different initial seeds", () => {
      const s1 = createSponge("seed-alpha");
      const s2 = createSponge("seed-beta");

      const seq1 = Array.from({ length: 10 }, () => s1.next());
      const seq2 = Array.from({ length: 10 }, () => s2.next());

      expect(seq1).not.toEqual(seq2);
    });

    it("should support diverse seed input data types", () => {
      const sNum = createSponge(42);
      const sObj = createSponge({ x: 10, y: 20 });
      const sBytes = createSponge(new Uint8Array([1, 2, 3, 4]));

      expect(Number.isInteger(sNum.next())).toBe(true);
      expect(Number.isInteger(sObj.next())).toBe(true);
      expect(Number.isInteger(sBytes.next())).toBe(true);
    });
  });

  describe("output streams", () => {
    it("should generate valid 32-bit unsigned integers from next()", () => {
      const sponge = createSponge("seed");
      for (let i = 0; i < 100; i++) {
        const val = sponge.next();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(0xffffffff);
        expect(Number.isInteger(val)).toBe(true);
      }
    });

    it("should not repeat outputs in short cycles (exceeds numRegisters period)", () => {
      const numRegisters = 8;
      const sponge = createSponge("cycle-test", numRegisters);

      const generated = new Set<number>();
      const totalSamples = 200;

      for (let i = 0; i < totalSamples; i++) {
        generated.add(sponge.next());
      }

      // Check that we have high uniqueness and did not collapse into a small <= 8 period cycle
      expect(generated.size).toBeGreaterThan(totalSamples * 0.95);
    });
  });

  describe("data ingestion (absorb)", () => {
    it("should return the sponge instance to support method chaining", () => {
      const sponge = createSponge("initial");
      const chained = sponge.absorb("step-1").absorb("step-2");
      expect(chained).toBe(sponge);
    });

    it("should alter subsequent outputs after absorbing new data", () => {
      const s1 = createSponge("base-seed");
      const s2 = createSponge("base-seed");

      // Generate some values in sync
      expect(s1.next()).toBe(s2.next());
      expect(s1.next()).toBe(s2.next());

      // Absorb event data into s2 only
      s2.absorb("player_picked_item");

      // Streams should now diverge
      expect(s1.next()).not.toBe(s2.next());
    });

    it("should distinguish different ingestion orders", () => {
      const s1 = createSponge("base").absorb("A").absorb("B");
      const s2 = createSponge("base").absorb("B").absorb("A");

      expect(s1.next()).not.toBe(s2.next());
    });

    it("should gracefully handle null, undefined, or empty string ingestions as no-ops", () => {
      const s1 = createSponge("base");
      const s2 = createSponge("base");

      s2.absorb(null).absorb(undefined).absorb("");

      expect(s1.next()).toBe(s2.next());
      expect(s1.next()).toBe(s2.next());
    });

    it("should absorb large byte buffers and long strings without error", () => {
      const sponge = createSponge("base");
      const largeBuffer = new Uint8Array(2048).fill(42);
      const longString = "A".repeat(5000);

      expect(() => sponge.absorb(largeBuffer)).not.toThrow();
      expect(() => sponge.absorb(longString)).not.toThrow();
      expect(Number.isInteger(sponge.next())).toBe(true);
    });
  });

  describe("state management (getState & setState)", () => {
    it("should capture and restore state accurately", () => {
      const sponge = createSponge("state-test");

      // Advance a few steps
      sponge.next();
      sponge.next();

      // Checkpoint state
      const checkpoint = sponge.getState();

      // Generate next 10 numbers
      const expected = Array.from({ length: 10 }, () => sponge.next());

      // Restore state to checkpoint
      sponge.setState(checkpoint);

      // Verify sequence repeats identically
      const replay = Array.from({ length: 10 }, () => sponge.next());
      expect(replay).toEqual(expected);
    });

    it("should allow transferring state to another sponge instance", () => {
      const s1 = createSponge("seed-1");
      const s2 = createSponge("different-seed");

      s1.next();
      s1.next();

      const snapshot = s1.getState();
      s2.setState(snapshot);

      for (let i = 0; i < 10; i++) {
        expect(s2.next()).toBe(s1.next());
      }
    });

    it("should return a clone of the internal registers, ensuring isolation", () => {
      const sponge = createSponge("snapshot");
      const state1 = sponge.getState();

      // Modify the returned array directly
      state1[1] = 0xdeadbeef;

      // Ensure internal state was not corrupted
      const state2 = sponge.getState();
      expect(state2[1]).not.toBe(0xdeadbeef);
    });
  });

  describe("forking & hierarchical branching", () => {
    it("should fork without arguments to create an isolated duplicate", () => {
      const parent = createSponge("parent-seed");
      parent.next();

      const child = parent.fork();

      // Both should produce identical next values
      const valParent = parent.next();
      const valChild = child.next();
      expect(valChild).toBe(valParent);

      // Advancing parent should not affect child
      parent.next();
      parent.next();
      expect(child.next()).not.toBe(parent.next());
    });

    it("should fork with branch data to immediately diverge", () => {
      const galaxy = createSponge("milky-way");

      const solarSystemA = galaxy.fork("sol");
      const solarSystemB = galaxy.fork("alpha-centauri");

      expect(solarSystemA.next()).not.toBe(solarSystemB.next());
    });

    it("should support deep multi-tier hierarchical procedural generation", () => {
      const universe = createSponge("universe-42");
      const galaxy = universe.fork("galaxy-andromeda");
      const planet = galaxy.fork("planet-prime");
      const biome1 = planet.fork("biome-forest");
      const biome2 = planet.fork("biome-desert");

      // Verify all sub-branches are active and independent
      const forestSamples = [biome1.next(), biome1.next(), biome1.next()];
      const desertSamples = [biome2.next(), biome2.next(), biome2.next()];

      expect(forestSamples).not.toEqual(desertSamples);

      // Recreating from root yields exact same sub-branch
      const universeReplay = createSponge("universe-42");
      const forestReplay = universeReplay.fork("galaxy-andromeda").fork("planet-prime").fork("biome-forest");

      const replaySamples = [forestReplay.next(), forestReplay.next(), forestReplay.next()];
      expect(replaySamples).toEqual(forestSamples);
    });
  });

  describe("statistical quality & uniformity sanity checks", () => {
    it("should produce varied bit patterns across registers", () => {
      const sponge = createSponge("bit-variance");
      let bitOr = 0;
      let bitAnd = 0xffffffff;

      for (let i = 0; i < 64; i++) {
        const val = sponge.next();
        bitOr |= val;
        bitAnd &= val;
      }

      // Ensure not all bits are stuck at 0 or 1
      expect(bitOr >>> 0).toBe(0xffffffff);
      expect(bitAnd >>> 0).not.toBe(0xffffffff);
    });
  });
});
