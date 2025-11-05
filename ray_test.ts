import { assert } from "@std/assert";
import { Ray } from "./ray.ts";
import { Point, Vector } from "./tuple.ts";
import { describe, it } from "@std/testing/bdd";

describe("Rays", () => {
  it("can be created and queried", () => {
    const origin = new Point(1, 2, 3);
    const direction = new Vector(4, 5, 6);
    const r = new Ray(origin, direction);
    assert(r.origin.equals(origin));
    assert(r.direction.equals(direction));
  });

  it("can compute a point from a distance", () => {
    const r = new Ray(new Point(2, 3, 4), new Vector(1, 0, 0));
    assert(r.position(0).equals(new Point(2, 3, 4)));
    assert(r.position(1).equals(new Point(3, 3, 4)));
    assert(r.position(-1).equals(new Point(1, 3, 4)));
    assert(r.position(2.5).equals(new Point(4.5, 3, 4)));
  });
});
