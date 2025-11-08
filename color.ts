import { Tuple } from "./tuple.ts";

export class Color extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 0.0);
  }
  get red(): number {
    return this.x;
  }
  get green(): number {
    return this.y;
  }
  get blue(): number {
    return this.z;
  }
  override times(that: number | Color): Color {
    if (typeof that === "number") {
      return super.times(that) as Color;
    } else {
      // Hadamard product
      return new Color(
        this.red * that.red,
        this.green * that.green,
        this.blue * that.blue,
      );
    }
  }

  toRgb(): [number, number, number] {
    const clamp = (n: number) =>
      Math.round(Math.max(0, Math.min(255, n * 255)));
    return [
      clamp(this.red),
      clamp(this.green),
      clamp(this.blue),
    ];
  }
}
