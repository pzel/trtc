export const EPSILON = 0.0001;

export function eq(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}
