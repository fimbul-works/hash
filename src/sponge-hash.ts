import { fastMix } from "./integer/fast-mix.js";
import { getBytes } from "./util/get-bytes.js";

/**
 * Interface for a sponge hasher object.
 *
 * It allows absorbing an arbitrary amount of data, and then generating
 * random-like values from the internal state. The state is spread across
 * several 32-bit registers, and the larger the number of registers, the more
 * entropy is stored in the sponge, but it also takes longer to mix.
 */
export interface SpongeHash {
    /**
     * Produce the next 32-bit integer hash
     */
    next(): number;

    /**
     * Produce the next 32-bit integer hash as a float in range [0, 1]
     */
    nextFloat(): number;

    /**
     * Ingest new data into the sponge, updating the internal state.
     * This method is useful for incorporating additional data into the sponge
     * after it has been initialized.
     *
     * @param data - Data to ingest.
     */
    ingest(data: unknown): SpongeHash;

    /**
     * Fork the sponge, mixing in new data to the current state.
     * The returned sponge will have its own independent state.
     * 
     * @param data - Optional data to mix into the new sponge's state.
     */
    fork(data?: unknown): SpongeHash;

    /**
     * Get the current sponge state.
     */
    getState(): Uint32Array;

    /**
     * Set the current sponge state.
     * 
     * @param state - State array to set.
     */
    setState(state: Uint32Array): void;
}

/**
 * Create a new sponge hash.
 *
 * @param {unknown} data - Initial data to ingest.
 * @param {number} [numRegisters=16] - Number of registers to use. Default: 16
 * @param {(x: number, seed: number) => number} [hasher=fastMix] - Hasher function to use. Default: `fastMix`
 */
export const createSpongeHash = (
    data: unknown,
    numRegisters: number = 16,
    hasher: (x: number, seed: number) => number = fastMix,
): SpongeHash => {
    if (numRegisters <= 0) throw new RangeError("numRegisters must be greater than 0");

    // Standard golden ratio / fractional constants to prevent all-zero states
    const PHI_FRACTION = 0x9e3779b9;

    // Internal registry and registry index
    const reg = new Uint32Array(numRegisters).map((_, i) => Math.imul(i + 1, PHI_FRACTION) >>> 0);
    let idx = 0;

    const diffuse = () => {
        for (let i = 0; i < numRegisters; i++) {
            const prev = reg[(idx - 1 + numRegisters) % numRegisters];
            reg[idx] = hasher(reg[idx], prev);
            idx = (idx + 1) % numRegisters;
        }
    };

    const ingest = (input: unknown) => {
        if (input === undefined || input === null || input === "") {
            return sponge;
        }

        const bytes = getBytes(input);
        for (let i = 0; i < bytes.length; i++) {
            reg[idx] = hasher(reg[idx], bytes[i]);
            idx = (idx + 1) % numRegisters;
        }

        diffuse();
        return sponge;
    };

    const next = (): number => {
        let hash = reg[idx];
        for (let i = 1; i < numRegisters; i++) {
            hash = hasher(hash, reg[(idx + i) % numRegisters]);
        }

        reg[idx] = hasher(reg[idx], hash ^ PHI_FRACTION);
        idx = (idx + 1) % numRegisters;
        return hash >>> 0;
    };

    const nextFloat = (): number => next() / 0x100000000;

    const fork = (forkData?: unknown) => {
        const child = createSpongeHash(null, numRegisters, hasher);
        child.setState(getState());
        return child.ingest(forkData);
    };

    const getState = (): Uint32Array => {
        const state = new Uint32Array(numRegisters + 1);
        state[0] = idx;
        state.set(reg, 1);
        return state;
    };

    const setState = (state: Uint32Array) => {
        if (state.length !== numRegisters + 1) {
            throw new RangeError("State array must have length numRegisters + 1");
        }

        idx = state[0] >>> 0;
        if (idx >= numRegisters) {
            throw new RangeError("Index out of range");
        }

        for (let i = 0; i < numRegisters; i++) {
            reg[i] = state[i + 1] >>> 0;
        }
    };

    const sponge: SpongeHash = {
        next,
        nextFloat,
        ingest,
        fork,
        getState,
        setState,
    };

    ingest(data);

    return sponge;
};
