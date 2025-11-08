import { Point } from "./tuple.ts";
import { Color } from "./color.ts";
export class PointLight {
  static defaultColor = new Color(1, 1, 1);
  constructor(
    public position: Point,
    public intensity: Color = PointLight.defaultColor,
  ) {
  }
}
