/**
 * Deterministic random number generator using mulberry32
 * Same seed = same output
 */

export function mulberry32(seed: number): () => number {
  let t = seed | 0;
  return () => {
    t = Math.imul(t + 0x6D2B79F5, 1);
    return (t >>> 0) / 4294967296;
  };
}

/**
 * Generate a random seed based on current timestamp
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}
