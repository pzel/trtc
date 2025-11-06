import { Point, Vector } from "./tuple.ts";
import { Matrix } from "./matrix.ts";

export class Ray {
  constructor(public origin: Point, public direction: Vector) {
  }

  position(t: number) {
    return this.origin.plus(this.direction.times(t));
  }
  transform(m: Matrix): Ray {
    return new Ray(m.times(this.origin), m.times(this.direction));
  }
}
