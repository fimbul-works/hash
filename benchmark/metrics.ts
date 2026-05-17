/**
 * Calculates Shannon Entropy of a set of values.
 * H(X) = -Σ P(x) log2(P(x))
 */
export function calculateEntropy(values: (number | bigint)[]): number {
  if (values.length === 0) return 0;

  const counts = new Map<number | bigint, number>();
  for (const v of values) {
    counts.set(v, (counts.get(v) || 0) + 1);
  }

  let entropy = 0;
  const len = values.length;
  for (const count of counts.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Calculates the collision rate (percentage of values that are duplicates).
 */
export function calculateCollisionRate(values: (number | bigint)[]): number {
  if (values.length <= 1) return 0;
  const unique = new Set(values).size;
  return 1 - unique / values.length;
}

/**
 * Simple Chi-squared uniformity test score (lower is more uniform).
 * Compares actual distribution to expected uniform distribution.
 */
export function calculateUniformityScore(values: number[], buckets: number): number {
  const counts = new Array(buckets).fill(0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  for (const v of values) {
    const b = Math.min(buckets - 1, Math.floor(((v - min) / range) * buckets));
    counts[b]++;
  }

  const expected = values.length / buckets;
  let chi2 = 0;
  for (const c of counts) {
    chi2 += (c - expected) ** 2 / expected;
  }
  return chi2;
}
