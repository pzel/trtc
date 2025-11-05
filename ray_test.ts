import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertStrictEquals,
} from "@std/assert";
import { Ray } from "./ray.ts";
import { Sphere } from "./sphere.ts";
import { Intersection, Intersections } from "./intersection.ts";
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
    assertAlmostEquals(xs.at(0).t, 4.0, 0.0001);
    assertAlmostEquals(xs.at(1).t, 6.0, 0.0001);
    assertStrictEquals(xs.at(0).object, s);
    assertStrictEquals(xs.at(1).object, s);
  });

  it("intersects a sphere at a tangent", () => {
    const r = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs.at(0).t, 5.0, 0.0001);
    assertAlmostEquals(xs.at(1).t, 5.0, 0.0001);
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
    assertAlmostEquals(xs.at(0).t, -1, 0.0001);
    assertAlmostEquals(xs.at(1).t, 1, 0.0001);
  });

  it("the sphere is behind the ray", () => {
    const r = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertAlmostEquals(xs.at(0).t, -6.0, 0.0001);
    assertAlmostEquals(xs.at(1).t, -4.0, 0.0001);
  });

  it("an Intersection encapsulates the t and the object intersected", () => {
    const s = new Sphere();
    const i = new Intersection(3.5, s);
    assertAlmostEquals(i.t, 3.5);
    assertStrictEquals(i.object, s);
  });

  it("aggregating intersections", () => {
    const s = new Sphere();
    const i1 = new Intersection(3, s);
    const i2 = new Intersection(4, s);
    const is = new Intersections([i1, i2]);
    assertEquals(is.length, 2);
    assertEquals(is.at(0).t, 3);
    assertEquals(is.at(1).t, 4);
  });
});
