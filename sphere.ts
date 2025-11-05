import { Ray } from "./ray.ts";
import { Point } from "./tuple.ts";
import { Intersection, Intersections } from "./intersection.ts";

export class Sphere {
  intersect(r: Ray): Intersections {
    const sphereToRay = r.origin.minus(new Point(0, 0, 0));
    const a = r.direction.dot(r.direction);
    const b = 2 * r.direction.dot(sphereToRay);
    const c = sphereToRay.dot(sphereToRay) - 1;
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
      return new Intersections([]);
    } else {
      return new Intersections([
        new Intersection((-b - Math.sqrt(discriminant)) / (2 * a), this),
        new Intersection((-b + Math.sqrt(discriminant)) / (2 * a), this),
      ]);
    }
  }
}
