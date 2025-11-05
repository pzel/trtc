// import { BinaryHeap } from "@std/data-structures";
import { Sphere } from "./sphere.ts";

export class Intersection {
  constructor(public t: number, public object: Sphere) {
  }
}

export class Intersections {
  xs: Array<Intersection>;
  constructor(xs: Array<Intersection>) {
    this.xs = xs;
  }

  get length(): number {
    return this.xs.length;
  }

  at(idx: number): Intersection {
    return this.xs[idx];
  }
}
