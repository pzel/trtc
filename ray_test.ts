import { assert, assertAlmostEquals, assertEquals } from "@std/assert";
import { Ray } from "./ray.ts";
import { Sphere } from "./sphere.ts";
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

  it("intersects a sphere at two points", () => {
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs[0], 4.0, 0.0001);
    assertAlmostEquals(xs[1], 6.0, 0.0001);
  });

  it("intersects a sphere at a tangent", () => {
    const r = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs[0], 5.0, 0.0001);
    assertAlmostEquals(xs[1], 5.0, 0.0001);
  });

  it("misses a sphere", () => {
    const r = new Ray(new Point(0, 1.1, -5), new Vector(0, 0, 1));
    const s = new Sphere();
    assertEquals(s.intersect(r).length, 0);
  });

  it("originates inside the sphere", () => {
    const r = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs[0], -1, 0.0001);
    assertAlmostEquals(xs[1], 1, 0.0001);
  });

  it("the sphere is behind the ray", () => {
    const r = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs[0], -6.0, 0.0001);
    assertAlmostEquals(xs[1], -4.0, 0.0001);
  });
});
