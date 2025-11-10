import { BinaryHeap } from "@std/data-structures";
import { Sphere } from "./sphere.ts";

export class Intersection {
  constructor(public t: number, public object: Sphere) {
  }
}

export class Intersections {
  negatives: BinaryHeap<Intersection>;
  nonNegatives: BinaryHeap<Intersection>;

  constructor(xs: Array<Intersection>) {
    this.negatives = BinaryHeap.from(
      xs.filter((i) => i.t < 0),
      { compare: (a: Intersection, b: Intersection) => b.t - a.t },
    );
    this.nonNegatives = BinaryHeap.from(
      xs.filter((i) => i.t >= 0),
      { compare: (a: Intersection, b: Intersection) => a.t - b.t },
    );
  }

  get length(): number {
    // As below: this is probably a bad API, but let's wait
    // until we have to actually use the negatives and see.
    return this.negatives.length + this.nonNegatives.length;
  }

  hit(): Intersection | null {
    return this.nonNegatives.isEmpty()
      ? null
      : this.nonNegatives.peek() as Intersection;
  }

  pop(): Intersection | null {
    return this.nonNegatives.isEmpty()
      ? null
      : this.nonNegatives.pop() as Intersection;
  }

  popNegative(): Intersection | null {
    return this.negatives.isEmpty()
      ? null
      : this.negatives.pop() as Intersection;
  }

  merge(that: Intersections): Intersections {
    const res = new Intersections([]);
    const negatives = BinaryHeap.from(this.negatives);
    const nonNegatives = BinaryHeap.from(this.nonNegatives);
    negatives.push(...that.negatives.toArray());
    nonNegatives.push(...that.nonNegatives.toArray());
    res.negatives = negatives;
    res.nonNegatives = nonNegatives;
    return res;
  }
}
