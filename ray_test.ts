import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertStrictEquals,
  fail,
} from "@std/assert";
import { Ray } from "./ray.ts";
import { Sphere } from "./sphere.ts";
import { Matrix } from "./matrix.ts";
import { Intersection, Intersections } from "./intersection.ts";
import { Point, Vector } from "./tuple.ts";
import { describe, it } from "@std/testing/bdd";

function assertFloatEquals(actual: number | undefined, expected: number) {
  if (typeof actual === "number") {
    assertAlmostEquals(actual, expected, 0.00001);
  } else {
    fail(`Actual value was not present, expected: ${expected}`);
  }
}

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
    assertFloatEquals(xs.at(0)?.t, 4.0);
    assertFloatEquals(xs.at(1)?.t, 6.0);
    assertStrictEquals(xs.at(0)?.object, s);
    assertStrictEquals(xs.at(1)?.object, s);
  });

  it("intersects a sphere at a tangent", () => {
    const r = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    assertFloatEquals(xs.at(0)?.t, 5.0);
    assertFloatEquals(xs.at(1)?.t, 5.0);
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
    assertFloatEquals(xs.at(-1)?.t, -1);
    assertFloatEquals(xs.at(0)?.t, 1);
  });

  it("the sphere is behind the ray", () => {
    const r = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
    const s = new Sphere();
    const xs = s.intersect(r);
    assertEquals(xs.length, 2);
    // these are ordered from closest->furthest miss, mirroring the positives
    assertFloatEquals(xs.at(-2)?.t, -6.0);
    assertFloatEquals(xs.at(-1)?.t, -4.0);
  });

  it("an Intersection encapsulates the t and the object intersected", () => {
    const s = new Sphere();
    const i = new Intersection(3.5, s);
    assertFloatEquals(i.t, 3.5);
    assertStrictEquals(i.object, s);
  });

  it("aggregating intersections", () => {
    const s = new Sphere();
    const i1 = new Intersection(3, s);
    const i2 = new Intersection(4, s);
    const is = new Intersections([i1, i2]);
    assertEquals(is.length, 2);
    assertEquals(is.at(0)?.t, 3);
    assertEquals(is.at(1)?.t, 4);
  });

  it("hit, when all intersections have positive t", () => {
    const s = new Sphere();
    const i1 = new Intersection(1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections([i1, i2]);
    assertStrictEquals(xs.hit(), i1);
  });

  it("hit, when some intersections have negative t", () => {
    const s = new Sphere();
    const i1 = new Intersection(-1, s);
    const i2 = new Intersection(2, s);
    const xs = new Intersections([i1, i2]);
    assertStrictEquals(xs.hit(), i2);
  });

  it("hit, when all intersections have negative t", () => {
    const s = new Sphere();
    const i1 = new Intersection(-1, s);
    const i2 = new Intersection(-2, s);
    const xs = new Intersections([i1, i2]);
    assertEquals(xs.hit(), null);
  });

  it("the hit is always the lowest nonnegative intersection", () => {
    const s = new Sphere();
    const i1 = new Intersection(5, s);
    const i2 = new Intersection(7, s);
    const i3 = new Intersection(-3, s);
    const i4 = new Intersection(2, s);
    const xs = new Intersections([i1, i2, i3, i4]);
    assertStrictEquals(xs.hit(), i4);
  });

  it("translates a ray", () => {
    const r = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
    const r2 = r.transform(Matrix.translation(3, 4, 5));
    assert(r2.origin.equals(new Point(4, 6, 8)));
    assert(r2.direction.equals(new Vector(0, 1, 0)));
  });

  it("scales a ray", () => {
    const r = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
    const r2 = r.transform(Matrix.scaling(2, 3, 4));
    assert(r2.direction.equals(new Vector(0, 3, 0)), `${r2.direction}`);
  });
});
