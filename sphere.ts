import { Ray } from "./ray.ts";
import { Point } from "./tuple.ts";

export class Sphere {
  intersect(r: Ray): Array<number> {
    const sphereToRay = r.origin.minus(new Point(0, 0, 0));
    const a = r.direction.dot(r.direction);
    const b = 2 * r.direction.dot(sphereToRay);
    const c = sphereToRay.dot(sphereToRay) - 1;
    const discriminant = (b * b) - (4 * a * c);
    if (discriminant < 0) {
      return [];
    } else {
      return [
        (-b - Math.sqrt(discriminant)) / (2 * a),
        (-b + Math.sqrt(discriminant)) / (2 * a),
      ];
    }
  }
}
