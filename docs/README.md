# @fimbul-works/hash

## Interfaces

### Mash()

Defined in: [mash/mash.ts:6](https://github.com/fimbul-works/hash/blob/main/src/mash/mash.ts#L6)

A stateful hash function that accumulates internal state across calls.

```ts
Mash(data): number;
```

Defined in: [mash/mash.ts:7](https://github.com/fimbul-works/hash/blob/main/src/mash/mash.ts#L7)

A stateful hash function that accumulates internal state across calls.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`number`

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-state"></a> `state` | `readonly` | `number` | Current internal state. Pass to `createMash` to fork from this point. | [mash/mash.ts:10](https://github.com/fimbul-works/hash/blob/main/src/mash/mash.ts#L10) |

***

### Mash64()

Defined in: [mash/mash64.ts:6](https://github.com/fimbul-works/hash/blob/main/src/mash/mash64.ts#L6)

A bit-width variant of Mash that produces 64-bit bigint results.

```ts
Mash64(data): bigint;
```

Defined in: [mash/mash64.ts:7](https://github.com/fimbul-works/hash/blob/main/src/mash/mash64.ts#L7)

A bit-width variant of Mash that produces 64-bit bigint results.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `unknown` |

#### Returns

`bigint`

#### Properties

| Property | Modifier | Type | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-state-1"></a> `state` | `readonly` | `bigint` | Current internal state. Pass to `createMash64` to fork from this point. | [mash/mash64.ts:10](https://github.com/fimbul-works/hash/blob/main/src/mash/mash64.ts#L10) |

## Type Aliases

### BitWidth

```ts
type BitWidth = number;
```

Defined in: [util/clamp-bits.ts:6](https://github.com/fimbul-works/hash/blob/main/src/util/clamp-bits.ts#L6)

Supported bit widths for hash output clamping.
Note: 53 is Number.MAX_SAFE_INTEGER's bit length — the largest value that fits
in a JS number without precision loss. 64 requires bigint.

## Functions

### cantorPair()

```ts
function cantorPair(x, y): number;
```

Defined in: [pair/cantor-pair.ts:11](https://github.com/fimbul-works/hash/blob/main/src/pair/cantor-pair.ts#L11)

Computes the Cantor pairing function for two non-negative integers.
Bijective: maps every unique (x, y) pair to a unique natural number.
Output grows quadratically — not suitable as a hash for large inputs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | The first non-negative integer. |
| `y` | `number` | The second non-negative integer. |

#### Returns

`number`

The paired natural number.

#### Throws

Will throw an error if either x or y is not a non-negative integer.

***

### clampBits()

```ts
function clampBits(hash, bits): number | bigint;
```

Defined in: [util/clamp-bits.ts:38](https://github.com/fimbul-works/hash/blob/main/src/util/clamp-bits.ts#L38)

Clamp a hash output to the specified number of bits (2 to 64).

- 2 to 32 → returns `number` (unsigned 32-bit internal)
- 33 to 53 → returns `number` (safe integer, fits without precision loss)
- 54 to 64 → returns `bigint`

For reducing 64→32 bits, XOR-folding is preferable to masking when you care
about entropy, since it mixes both halves. Use this when you just want the
lower N bits of an already-good hash.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hash` | `number` \| `bigint` | The hash value to clamp (number or bigint). |
| `bits` | `number` | The target bit width (2-64). |

#### Returns

`number` \| `bigint`

The clamped value.

***

### crc32()

```ts
function crc32(data): number;
```

Defined in: [stream/crc32.ts:25](https://github.com/fimbul-works/hash/blob/main/src/stream/crc32.ts#L25)

Compute the CRC-32 hash of the input data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `unknown` | Input data to hash. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### crc64()

```ts
function crc64(data): bigint;
```

Defined in: [stream/crc64.ts:25](https://github.com/fimbul-works/hash/blob/main/src/stream/crc64.ts#L25)

Compute the CRC-64 hash of the input data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `unknown` | The input data to hash. |

#### Returns

`bigint`

The computed 64-bit unsigned hash.

***

### createMash()

```ts
function createMash(seed?): Mash;
```

Defined in: [mash/mash.ts:22](https://github.com/fimbul-works/hash/blob/main/src/mash/mash.ts#L22)

Create a new Mash instance.

The returned function stores the current state so that it can be used to continue
hashing from the current state.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `seed?` | `number` | `0xefc8249d` | Optional starting internal state. |

#### Returns

[`Mash`](#mash)

A hash function with a state property.

***

### createMash64()

```ts
function createMash64(seed?): Mash64;
```

Defined in: [mash/mash64.ts:22](https://github.com/fimbul-works/hash/blob/main/src/mash/mash64.ts#L22)

Create a new 64-bit Mash instance.

The returned function stores the current state so that it can be used to continue
hashing from the current state.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `seed?` | `number` \| `bigint` | `0xefc8249d` | Optional starting internal state. |

#### Returns

[`Mash64`](#mash64)

A hash function with a state property that produces 64-bit hashes.

***

### fastHash()

```ts
function fastHash(data, seed?): number;
```

Defined in: [stream/fast-hash.ts:11](https://github.com/fimbul-works/hash/blob/main/src/stream/fast-hash.ts#L11)

fastHash — a simple and fast non-cryptographic hash function.
Adaptation of the FastHash algorithm by Zilong Tan.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### fastMix()

```ts
function fastMix(a, b?): number;
```

Defined in: [integer/fast-mix.ts:9](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix.ts#L9)

fastMix — High-speed symmetric 32-bit integer mixer.
Scrambles one or two numbers into one using multiply-xorshift.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `a` | `number` | `undefined` | First 32-bit integer to mix. |
| `b?` | `number` | `0` | Optional second 32-bit integer. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### fastMix64()

```ts
function fastMix64(a, b?): bigint;
```

Defined in: [integer/fast-mix64.ts:12](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix64.ts#L12)

fastMix64 — High-speed symmetric 64-bit integer mixer.
Scrambles one or two bigints into one using 64-bit multiply-xorshift.

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `a` | `bigint` | `undefined` | First 64-bit integer to mix. |
| `b?` | `bigint` | `0n` | Optional second 64-bit integer to mix. |

#### Returns

`bigint`

The computed 64-bit unsigned hash.

***

### fastMixHash()

```ts
function fastMixHash(data, seed?): number;
```

Defined in: [stream/fast-mix-hash.ts:14](https://github.com/fimbul-works/hash/blob/main/src/stream/fast-mix-hash.ts#L14)

fastMixHash — fast, non-cryptographic streaming hash.
Streaming hash built on fastMix, consuming arbitrary data 8 bytes at a time.
Each 8-byte chunk is read as two 32-bit little-endian words and folded into
running state via fastMix. Total length is mixed in at the end for domain separation.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### fastUnmix()

```ts
function fastUnmix(hash): number;
```

Defined in: [integer/fast-mix.ts:22](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix.ts#L22)

fastUnmix — Reverses the fastMix 32-bit transformation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hash` | `number` | The mixed 32-bit integer. |

#### Returns

`number`

The original unmixed 32-bit integer.

***

### fastUnmix64()

```ts
function fastUnmix64(h): bigint;
```

Defined in: [integer/fast-mix64.ts:26](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix64.ts#L26)

fastUnmix64 — Reverses the fastMix64 transformation.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `h` | `bigint` | The mixed 64-bit integer. |

#### Returns

`bigint`

The original unmixed 64-bit integer.

***

### floatToBits32()

```ts
function floatToBits32(f): number;
```

Defined in: [util/float-to-bits.ts:11](https://github.com/fimbul-works/hash/blob/main/src/util/float-to-bits.ts#L11)

floatToBits32 — Extract the raw IEEE-754 32-bit single-precision float bit pattern as an unsigned integer.
Useful for bitwise hashing of fractional floats.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `f` | `number` | The float value. |

#### Returns

`number`

The 32-bit unsigned integer bit pattern.

***

### floatToBits64()

```ts
function floatToBits64(f): bigint;
```

Defined in: [util/float-to-bits.ts:22](https://github.com/fimbul-works/hash/blob/main/src/util/float-to-bits.ts#L22)

floatToBits64 — Extract the raw IEEE-754 64-bit double-precision float bit pattern as a 64-bit BigInt.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `f` | `number` | The float value. |

#### Returns

`bigint`

The 64-bit BigInt bit pattern.

***

### fnv1a64Hash()

```ts
function fnv1a64Hash(data, seed?): bigint;
```

Defined in: [stream/fnv1a64.ts:13](https://github.com/fimbul-works/hash/blob/main/src/stream/fnv1a64.ts#L13)

fnv1a64Hash — 64-bit variant of the Fowler–Noll–Vo hash.

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `bigint` | `14695981039346656037n` | Optional seed. |

#### Returns

`bigint`

The computed 64-bit hash as a bigint

***

### fnv1aHash()

```ts
function fnv1aHash(data, seed?): number;
```

Defined in: [stream/fnv1a.ts:13](https://github.com/fimbul-works/hash/blob/main/src/stream/fnv1a.ts#L13)

Compute the Fowler–Noll–Vo 1a 32-bit hash of the input data.

This function uses BigInt internally for intermediate calculations
to handle 32-bit overflow correctly, which has higher overhead than imul-based hashes.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash |
| `seed?` | `number` | `2166136261` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### fold64To32()

```ts
function fold64To32(n): number;
```

Defined in: [util/fold64-to-32.ts:8](https://github.com/fimbul-works/hash/blob/main/src/util/fold64-to-32.ts#L8)

fold64To32 — Bijectively fold an unsigned 64-bit BigInt into a 32-bit unsigned integer.
Blends entropy from the upper and lower 32 bits.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `bigint` | The 64-bit BigInt to fold. |

#### Returns

`number`

An unsigned 32-bit integer.

***

### fxHash()

```ts
function fxHash(data, seed?): number;
```

Defined in: [stream/fx-hash.ts:12](https://github.com/fimbul-works/hash/blob/main/src/stream/fx-hash.ts#L12)

FxHash32 — streaming variant of the FxHasher used in Firefox's Rust codebase.
Processes 4 bytes per iteration: rotate-left 5, XOR word, multiply by golden ratio.
Extremely cache-friendly; competes with xxHash32 on short inputs.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### getBytes()

```ts
function getBytes(data, littleEndian?): Uint8Array;
```

Defined in: [util/get-bytes.ts:16](https://github.com/fimbul-works/hash/blob/main/src/util/get-bytes.ts#L16)

Convert arbitrary data into a byte representation for use with hashing functions.

Encoding rules (in order):
- `string`      → UTF-8 bytes via TextEncoder
- `number`      → 8 bytes, little-endian IEEE 754 float64
- `bigint`      → 8 bytes, little-endian uint64 (truncated to 64 bits)
- `Uint8Array`  → passed through as-is
- `Buffer`      → passed through as-is (Node.js)
- anything else → UTF-8 bytes of `JSON.stringify(data)`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data. |
| `littleEndian?` | `boolean` | `true` | Whether to use little-endian byte order. |

#### Returns

`Uint8Array`

The data byte representation as Uint8Array.

***

### int64ToDouble()

```ts
function int64ToDouble(n): number;
```

Defined in: [util/int64-to-double.ts:8](https://github.com/fimbul-works/hash/blob/main/src/util/int64-to-double.ts#L8)

int64ToDouble - Converts a 64-bit hash (bigint) to a [0, 1] range double-precision float.
Uses the upper 53 bits of the hash to ensure uniform distribution.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `bigint` | The 64-bit integer. |

#### Returns

`number`

A double-precision float in the range [0, 1].

***

### intToFloat()

```ts
function intToFloat(n): number;
```

Defined in: [util/int-to-float.ts:7](https://github.com/fimbul-works/hash/blob/main/src/util/int-to-float.ts#L7)

Convert a 32-bit unsigned integer to a float in range [0, 1].

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | 32-bit unsigned integer. |

#### Returns

`number`

A float in the range [0, 1].

***

### jenkinsHash()

```ts
function jenkinsHash(data, seed?): number;
```

Defined in: [stream/jenkins-hash.ts:10](https://github.com/fimbul-works/hash/blob/main/src/stream/jenkins-hash.ts#L10)

Jenkins one-at-a-time hash.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash |
| `seed?` | `number` | `0` | Optional seed value. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### jenkinsMix()

```ts
function jenkinsMix(
   a, 
   b, 
   c): number;
```

Defined in: [integer/jenkins-mix.ts:11](https://github.com/fimbul-works/hash/blob/main/src/integer/jenkins-mix.ts#L11)

Scrambles 3 numbers into one using Bob Jenkins' avalanche mixer.
Nine rounds of subtract-and-XOR across the three words; each input bit
affects all bits of the output. For a byte-consuming version see `mixHash`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `a` | `number` | First 32-bit unsigned number. |
| `b` | `number` | Second 32-bit unsigned number. |
| `c` | `number` | Third 32-bit unsigned number. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### jenkinsMixHash()

```ts
function jenkinsMixHash(data, seed?): number;
```

Defined in: [stream/jenkins-mix-hash.ts:14](https://github.com/fimbul-works/hash/blob/main/src/stream/jenkins-mix-hash.ts#L14)

Byte-consuming hash built on the Jenkins lookup3 mixer (the same three-word
avalanche used by `jenkinsMix`). Processes 12 bytes at a time into three 32-bit
accumulators a/b/c, mixing after each block. Accepts an optional seed.

This is the streaming sibling of `jenkinsMix` — they share the same mixing kernel.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### mapSignedInt()

```ts
function mapSignedInt(n): number;
```

Defined in: [util/map-signed-int.ts:11](https://github.com/fimbul-works/hash/blob/main/src/util/map-signed-int.ts#L11)

mapSignedInt — Bijectively map any signed 32-bit integer to a non-negative integer.
Maps: 0 -> 0, -1 -> 1, 1 -> 2, -2 -> 3, 2 -> 4, etc.

This is crucial for coordinate pairing functions (Cantor/Szudzik) which only
accept non-negative integer bounds.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | The signed 32-bit integer. |

#### Returns

`number`

A non-negative integer.

***

### mulberry()

```ts
function mulberry(n): number;
```

Defined in: [integer/mulberry.ts:8](https://github.com/fimbul-works/hash/blob/main/src/integer/mulberry.ts#L8)

mulberry — A very fast and simple 32-bit integer mixer.
Great for generating a stream of randomness from a single seed.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | 32-bit integer to hash. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### murmur3Hash()

```ts
function murmur3Hash(data, seed?): number;
```

Defined in: [stream/murmur3.ts:10](https://github.com/fimbul-works/hash/blob/main/src/stream/murmur3.ts#L10)

MurmurHash3 32-bit — fast, well-distributed non-cryptographic hash.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### murmur3Hash128()

```ts
function murmur3Hash128(data, seed?): bigint;
```

Defined in: [stream/murmur3-128.ts:15](https://github.com/fimbul-works/hash/blob/main/src/stream/murmur3-128.ts#L15)

murmur3Hash128 — 128-bit variant of MurmurHash3.

This function uses BigInt internally for 128-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `bigint` | `0n` | Optional seed. |

#### Returns

`bigint`

The computed 128-bit hash.

***

### pcgMix()

```ts
function pcgMix(n): number;
```

Defined in: [integer/pcg.ts:7](https://github.com/fimbul-works/hash/blob/main/src/integer/pcg.ts#L7)

pcgMix — A high-quality 32-bit integer mixer based on Permuted Congruential Generator.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | 32-bit integer to hash. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### reverseCantorPair()

```ts
function reverseCantorPair(z): [number, number];
```

Defined in: [pair/cantor-pair.ts:25](https://github.com/fimbul-works/hash/blob/main/src/pair/cantor-pair.ts#L25)

Reverses the Cantor pairing function, recovering the original pair.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `z` | `number` | The result of a previous cantorPair call. |

#### Returns

\[`number`, `number`\]

Array containing the original pair [x, y].

#### Throws

Will throw an error if z is not a non-negative integer.

***

### reverseSzudzikPair()

```ts
function reverseSzudzikPair(z): [number, number];
```

Defined in: [pair/szudzik.ts:25](https://github.com/fimbul-works/hash/blob/main/src/pair/szudzik.ts#L25)

szudzikUnpair — Reverses Szudzik's Elegant Pairing.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `z` | `number` | The paired integer. |

#### Returns

\[`number`, `number`\]

An array containing the original pair [x, y].

#### Throws

Will throw an error if z is not a non-negative integer.

***

### reverseSzudzikPair3D()

```ts
function reverseSzudzikPair3D(z3): [number, number, number];
```

Defined in: [pair/szudzik.ts:53](https://github.com/fimbul-works/hash/blob/main/src/pair/szudzik.ts#L53)

reverseSzudzikPair3D — Reverses the 3D Szudzik pairing function.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `z3` | `number` | The paired 3D integer. |

#### Returns

\[`number`, `number`, `number`\]

An array containing the original [x, y, z] coordinates.

***

### sipHash13()

```ts
function sipHash13(
   data, 
   key1?, 
   key2?): bigint;
```

Defined in: [stream/sip-hash13.ts:12](https://github.com/fimbul-works/hash/blob/main/src/stream/sip-hash13.ts#L12)

SipHash-1-3 — fast keyed hash.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `key1?` | `number` | `0` | Optional first 32-bit key part. |
| `key2?` | `number` | `0` | Optional second 32-bit key part. |

#### Returns

`bigint`

The computed 64-bit hash.

***

### splitMix()

```ts
function splitMix(n): number;
```

Defined in: [integer/splitmix.ts:10](https://github.com/fimbul-works/hash/blob/main/src/integer/splitmix.ts#L10)

SplitMix — 32-bit port of splitmix64.
Applies a golden-ratio increment then MurmurHash3-style finalization.
Outstanding distribution for sequential inputs; one of the fastest options
for integer-keyed procgen (terrain, noise, entity spawning).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | 32-bit integer to hash. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### splitMix64()

```ts
function splitMix64(n): bigint;
```

Defined in: [integer/splitmix64.ts:11](https://github.com/fimbul-works/hash/blob/main/src/integer/splitmix64.ts#L11)

splitMix64 — A high-quality 64-bit integer mixer.
Often used to initialize PRNGs or as a fast hash for 64-bit keys.

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `bigint` | 64-bit integer to hash. |

#### Returns

`bigint`

The computed 64-bit unsigned hash.

***

### squirrel3()

```ts
function squirrel3(n, seed?): number;
```

Defined in: [integer/squirrel3.ts:10](https://github.com/fimbul-works/hash/blob/main/src/integer/squirrel3.ts#L10)

Squirrel3 — by Squirrel Eiserloh (GDC 2017).
Fast, high-quality integer hash designed for procedural generation.
Maps any (position, seed) pair to a well-distributed 32-bit value.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `n` | `number` | `undefined` | 32-bit integer to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### squirrel5()

```ts
function squirrel5(n, seed?): number;
```

Defined in: [integer/squirrel5.ts:10](https://github.com/fimbul-works/hash/blob/main/src/integer/squirrel5.ts#L10)

Squirrel5 — improved successor to Squirrel3 with better avalanche characteristics.
Five noise constants, five mix stages; significantly better distribution for
correlated inputs (e.g. sequential coordinates in a 2D/3D grid).

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `n` | `number` | `undefined` | 32-bit integer to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### szudzikPair()

```ts
function szudzikPair(x, y): number;
```

Defined in: [pair/szudzik.ts:11](https://github.com/fimbul-works/hash/blob/main/src/pair/szudzik.ts#L11)

szudzikPair — Szudzik's "Elegant Pairing" function.
Maps two non-negative integers to a single non-negative integer.
It is often more efficient and has slower growth than Cantor Pairing.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | First non-negative integer. |
| `y` | `number` | Second non-negative integer. |

#### Returns

`number`

The paired unique integer.

#### Throws

Will throw an error if either x or y is not a non-negative integer.

***

### szudzikPair3D()

```ts
function szudzikPair3D(
   x, 
   y, 
   z): number;
```

Defined in: [pair/szudzik.ts:43](https://github.com/fimbul-works/hash/blob/main/src/pair/szudzik.ts#L43)

szudzikPair3D — Map three non-negative integers to a single unique non-negative integer.
Perfect for 3D coordinate mapping.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | First non-negative integer. |
| `y` | `number` | Second non-negative integer. |
| `z` | `number` | Third non-negative integer. |

#### Returns

`number`

The paired unique integer.

***

### unmapSignedInt()

```ts
function unmapSignedInt(n): number;
```

Defined in: [util/map-signed-int.ts:24](https://github.com/fimbul-works/hash/blob/main/src/util/map-signed-int.ts#L24)

unmapSignedInt — Bijectively restore a non-negative integer back to a signed 32-bit integer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | The non-negative integer. |

#### Returns

`number`

The original signed integer.

***

### verifyFastMix()

```ts
function verifyFastMix(
   mixed, 
   a, 
   b?): boolean;
```

Defined in: [integer/fast-mix.ts:37](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix.ts#L37)

Verifies that a mixed hash was produced from the given data and parent.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mixed` | `number` | `undefined` | The mixed hash to verify. |
| `a` | `number` | `undefined` | The original first 32-bit integer (a). |
| `b?` | `number` | `0` | The original second 32-bit integer (b). Default: 0 |

#### Returns

`boolean`

`true` if the hash matches the data and parent.

***

### verifyFastMix64()

```ts
function verifyFastMix64(
   mixed, 
   data, 
   parent?): boolean;
```

Defined in: [integer/fast-mix64.ts:42](https://github.com/fimbul-works/hash/blob/main/src/integer/fast-mix64.ts#L42)

Verifies that a 64-bit mixed hash was produced from the given data and parent.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mixed` | `bigint` | `undefined` | The mixed 64-bit hash to verify. |
| `data` | `bigint` | `undefined` | The original 64-bit integer (a). |
| `parent?` | `bigint` | `0n` | The parent 64-bit integer (b). Default: 0n |

#### Returns

`boolean`

`true` if the hash matches the data and parent.

***

### wangHash()

```ts
function wangHash(n): number;
```

Defined in: [integer/wang-hash.ts:9](https://github.com/fimbul-works/hash/blob/main/src/integer/wang-hash.ts#L9)

Wang hash — Thomas Wang's classic integer hash function.
Pure XOR and shifts (two multiplies for distribution correction).
Excellent for seeding PRNGs or hashing integer keys (grid coords, entity IDs).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `number` | 32-bit integer to hash. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### wangHash64()

```ts
function wangHash64(n): bigint;
```

Defined in: [integer/wang-hash64.ts:11](https://github.com/fimbul-works/hash/blob/main/src/integer/wang-hash64.ts#L11)

wangHash64 — A 64-bit integer mixer that provides high avalanche.
This is based on Thomas Wang's 64-bit mix function.

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `n` | `bigint` | The 64-bit integer to hash. |

#### Returns

`bigint`

The mixed 64-bit integer.

***

### wyHash()

```ts
function wyHash(data, seed?): bigint;
```

Defined in: [stream/wyhash.ts:13](https://github.com/fimbul-works/hash/blob/main/src/stream/wyhash.ts#L13)

WyHash — extremely fast, high-quality 64-bit hash (v3).

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `bigint` | `0n` | Optional seed. |

#### Returns

`bigint`

The computed 64-bit unsigned hash.

***

### xxHash()

```ts
function xxHash(data, seed?): number;
```

Defined in: [stream/xx-hash.ts:10](https://github.com/fimbul-works/hash/blob/main/src/stream/xx-hash.ts#L10)

xxHash — extremely fast non-cryptographic hash.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `number` | `0` | Optional seed. |

#### Returns

`number`

The computed 32-bit unsigned hash.

***

### xxHash64()

```ts
function xxHash64(data, seed?): bigint;
```

Defined in: [stream/xx-hash64.ts:13](https://github.com/fimbul-works/hash/blob/main/src/stream/xx-hash64.ts#L13)

xxHash64 — 64-bit variant of xxHash.

This function uses BigInt internally for 64-bit precision, which has
higher overhead than 32-bit integer arithmetic.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `unknown` | `undefined` | Input data to hash. |
| `seed?` | `bigint` | `0n` | Optional seed. |

#### Returns

`bigint`

The computed 64-bit unsigned hash.
