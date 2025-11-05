import { Point, Vector } from "./tuple.ts";

export class Ray {
  constructor(public origin: Point, public direction: Vector) {
  }

  position(t: number) {
    return this.origin.plus(this.direction.times(t));
  }
}
