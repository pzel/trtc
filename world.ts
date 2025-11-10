import { Color } from "./color.ts";
import { Intersections } from "./intersection.ts";
import { PointLight } from "./light.ts";
import { Matrix } from "./matrix.ts";
import { Ray } from "./ray.ts";
import { Sphere } from "./sphere.ts";
import { Point } from "./tuple.ts";

export class World {
  constructor(
    public objects: Array<Sphere> = [],
    public light: PointLight | null = null,
  ) {
  }

  static default(): World {
    const s1 = new Sphere();
    s1.material.color = new Color(0.8, 0.8, 0.8);
    s1.material.diffuse = 0.7;
    s1.material.specular = 0.2;
    const s2 = new Sphere();
    s2.transform = Matrix.scaling(0.5, 0.5, 0.5);
    const l = new PointLight(new Point(-10, 10, -10));
    const w = new World([s1, s2], l);
    return w;
  }

  intersect(r: Ray): Intersections {
    return this.objects.reduce(
      (acc, obj) => acc.merge(obj.intersect(r)),
      new Intersections([]),
    );
  }
}
