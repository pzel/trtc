export const EPSILON = 0.0001;
export const sqrt = Math.sqrt;
export const sqrt2 = Math.sqrt(2.0);

export function eq(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}
