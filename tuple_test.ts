import { describe, it } from "@std/testing/bdd";
import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertFalse,
  assertThrows,
} from "@std/assert";
import { EPSILON, Point, Tuple, Vector } from "./tuple.ts";

const sqrt = Math.sqrt;

describe("tuples.feature", () => {
  it("a tuple with w=1.0 is a point", () => {
    //given
    const a = new Tuple(4.3, -4.2, 3.1, 1.0);
    //then
    assertAlmostEquals(a.x, 4.3, EPSILON);
    assertAlmostEquals(a.y, -4.2, EPSILON);
    assertAlmostEquals(a.z, 3.1, EPSILON);
    assertAlmostEquals(a.w, 1.0, EPSILON);
    assert(a.is_a_point);
    assertFalse(a.is_a_vector);
  });

  it("a tuple with w=0.0 is a vector", () => {
    //given
    const a = new Tuple(4.3, -4.2, 3.1, 0.0);
    //then
    assertAlmostEquals(a.x, 4.3, EPSILON);
    assertAlmostEquals(a.y, -4.2, EPSILON);
    assertAlmostEquals(a.z, 3.1, EPSILON);
    assertAlmostEquals(a.w, 0.0, EPSILON);
    assertFalse(a.is_a_point);
    assert(a.is_a_vector);
  });

  it("a Point is a tuple with w=1", () => {
    //given
    const a = new Point(1.1, 2.2, 3.3);
    //then
    assert(a.tupleEquals(new Tuple(1.1, 2.2, 3.3, 1.0)));
  });

  it("a Vector is a tuple with w=0", () => {
    //given
    const a = new Vector(0.1, 0.2, 0.3);
    //then
    assert(a.tupleEquals(new Tuple(0.1, 0.2, 0.3, 0.0)));
  });

  it("a Vector is not equal to a Point with the same coords", () => {
    //given
    const v = new Vector(0.1, 0.2, 0.3);
    const p = new Point(0.1, 0.2, 0.3);
    //then
    assertFalse(v.tupleEquals(p));
  });

  it("two Points are equal if they have the same components", () => {
    //given
    const v1 = new Point(4, 5, 6);
    const v2 = new Point(4, 5, 6);
    //then
    assert(v1.tupleEquals(v2));
  });

  it("two Points are NOT equal if they have differing components", () => {
    //given
    const v1 = new Point(4, 5, 6.1);
    const v2 = new Point(4, 5, 6);
    //then
    assertFalse(v1.tupleEquals(v2));
  });

  it("two Vectors are equal if they have the same components", () => {
    //given
    const v1 = new Vector(4, 5, 6);
    const v2 = new Vector(4, 5, 6);
    //then
    assert(v1.tupleEquals(v2));
  });

  it("two Vectors are NOT equal if they have differing components", () => {
    //given
    const v1 = new Vector(4, 5, 6.1);
    const v2 = new Vector(4, 5, 6);
    //then
    assertFalse(v1.tupleEquals(v2));
  });

  it("two Tuples can be added", () => {
    //given
    const t1 = new Tuple(1, 2, 3, 0);
    const t2 = new Tuple(4, 5, 6, 0);
    //when
    const t3 = t1.plus(t2);

    //then
    assert(t3.tupleEquals(new Tuple(5, 7, 9, 0)));
  });

  it("a Point can be added to a Vector", () => {
    //given
    const p = new Point(1, 2, 3);
    const v = new Vector(4, 5, 6);
    //when
    const p2 = p.plus(v);

    //then
    assert(p2.tupleEquals(new Point(5, 7, 9)));
  });

  it("Point+Vector addition is commutative", () => {
    //given
    const p = new Point(1, 2, 3);
    const v = new Vector(4, 5, 6);
    //when
    const pv = p.plus(v);
    const vp = v.plus(p);

    //then
    assert(pv.tupleEquals(vp));
  });

  it("adding two Points raises an exception", () => {
    //given
    const p = new Point(1, 2, 3);
    const q = new Point(4, 5, 6);
    //then
    assertThrows(() => p.plus(q), RangeError);
  });

  it("subtracts two points to produce a Vector", () => {
    //given
    const p1 = new Point(3, 2, 1);
    const p2 = new Point(5, 6, 7);
    //when
    const p3 = p1.minus(p2);
    //then
    assert(p3.tupleEquals(new Vector(-2, -4, -6)));
  });

  it("subtracts two Vectors to produce a Vector", () => {
    //given
    const v1 = new Vector(3, 2, 1);
    const v2 = new Vector(5, 6, 7);
    //when
    const v3 = v1.minus(v2);
    //then
    assert(v3.tupleEquals(new Vector(-2, -4, -6)));
  });

  it("subtracts a Vector from a Point to produce a Point", () => {
    //given
    const p = new Point(3, 2, 1);
    const v = new Vector(5, 6, 7);
    //when
    const pv = p.minus(v);
    //then
    assert(pv.tupleEquals(new Point(-2, -4, -6)));
  });

  it("subtracting a Point from a Vector raises an exception", () => {
    //given
    const p = new Point(3, 2, 1);
    const v = new Vector(5, 6, 7);
    //when
    assertThrows(() => v.minus(p), RangeError);
  });

  it("subtracting a Vector from the zero vector gives the negated vector", () => {
    //given
    const zero = new Vector(0, 0, 0);
    const v = new Vector(1, -2, 3);
    //when
    assert(zero.minus(v).tupleEquals(new Tuple(-1, 2, -3, 0)));
  });

  it("negate() is the same as subtracting a Vector from the zero vector", () => {
    //given
    const v = new Vector(1, -2, 3);
    //when
    assert(v.negate().tupleEquals(new Tuple(-1, 2, -3, 0)));
  });

  it("negating a Point raises an exception", () => {
    //given
    const p = new Point(3, 2, 1);
    //when
    assertThrows(() => p.negate(), RangeError);
  });

  it("multiplies a tuple by a scalar", () => {
    //given
    const v = new Tuple(4, 5, -6, 0);
    //when
    const vs = v.times(2.0);

    //then
    assert(vs.tupleEquals(new Tuple(8, 10, -12, 0)));
  });

  it("divides a tuple by a scalar", () => {
    //given
    const v = new Tuple(4, 5, -6, 1);
    //when
    const vs = v.div(2.0);

    //then
    assert(vs.tupleEquals(new Tuple(2, 2.5, -3, 0.5)));
  });

  it("Vectors can tell their magnitude", () => {
    assertEquals(new Vector(1, 0, 0).magnitude, 1);
    assertEquals(new Vector(0, 1, 0).magnitude, 1);
    assertEquals(new Vector(0, 0, 1).magnitude, 1);
    assertAlmostEquals(new Vector(1, 2, 3).magnitude, sqrt(14), EPSILON);
    assertAlmostEquals(new Vector(1, 0, -1).magnitude, sqrt(2), EPSILON);
    assertAlmostEquals(new Vector(-1, -2, -3).magnitude, sqrt(14), EPSILON);
  });

  it("Vectors return normalized form", () => {
    assert(new Vector(4, 0, 0).normalize().tupleEquals(new Vector(1, 0, 0)));
    assert(new Vector(0, -2, 0).normalize().tupleEquals(new Vector(0, -1, 0)));
  });

  it("Vector.normalize() returns correct values", () => {
    //given
    const v = new Vector(1, 2, 3);
    const expected = new Vector(1 / sqrt(14), 2 / sqrt(14), 3 / sqrt(14));
    //when
    const vn = v.normalize();
    //then
    assert(vn.tupleEquals(expected));
  });

  it("dot product is calculated correctly on two tuples", () => {
    //given
    const t1 = new Tuple(1, 2, 3, 1);
    const t2 = new Tuple(4, 5, 6, 1);
    //then
    assertEquals(t1.dot(t2), 33);
  });

  it("cross product of two vectors", () => {
    //given
    const a = new Vector(1, 2, 3);
    const b = new Vector(2, 3, 4);
    //when
    const ab = a.cross(b);
    const ba = b.cross(a);

    //then
    assert(ab.tupleEquals(new Vector(-1, 2, -1)));
    assert(ba.tupleEquals(new Vector(1, -2, 1)));
  });
});
