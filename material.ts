import { Color } from "./color.ts";
import { eq, sqrt, sqrt2 } from "./float.ts";
import { PointLight } from "./light.ts";
import { Point, Vector } from "./tuple.ts";
import { assert } from "@std/assert";

export class Material {
  static defaultColor = new Color(1, 1, 1);
  static black = new Color(0, 0, 0);
  constructor(
    public color: Color = Material.defaultColor,
    public ambient = 0.1,
    public diffuse = 0.9,
    public specular = 0.9,
    public shininess = 200.0,
  ) {
  }

  equals(that: Material): boolean {
    return (this.color.equals(that.color) &&
      eq(this.ambient, that.ambient) &&
      eq(this.diffuse, that.diffuse) &&
      eq(this.specular, that.specular) &&
      eq(this.shininess, that.shininess));
  }

  lighting(
    light: PointLight,
    point: Point,
    eyev: Vector,
    normalv: Vector,
  ): Color {
    const effectiveColor: Color = this.color.times(light.intensity);
    const lightv: Vector = light.position.minus(point).normalize() as Vector;
    const ambient: Color = effectiveColor.times(this.ambient);
    const lightDotNormal: number = lightv.dot(normalv);
    let diffuse: Color = Material.black;
    let specular: Color = Material.black;
    if (lightDotNormal < 0) {
      diffuse = Material.black;
      specular = Material.black;
    } else {
      diffuse = effectiveColor.times(this.diffuse).times(lightDotNormal);
      const lightNeg: Vector = (lightv as Vector).negate() as Vector;
      assert(lightNeg instanceof Vector);
      const reflectv: Vector = lightNeg.reflect(normalv as Vector) as Vector;
      const reflectDotEye = reflectv.dot(eyev);
      if (reflectDotEye <= 0) {
        specular = Material.black;
      } else {
        const factor = Math.pow(reflectDotEye, this.shininess);
        specular = light.intensity.times(this.specular).times(factor);
      }
    }
    const res = (ambient.plus(diffuse)).plus(specular);
    return new Color(res[0], res[1], res[2]);
  }
}
