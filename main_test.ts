import { describe, it } from "@std/testing/bdd";
import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertFalse,
  assertThrows,
} from "@std/assert";
import { EPSILON, Point, Tuple, Vector } from "./main.ts";

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
    assert(a.tupleEqual(new Tuple(1.1, 2.2, 3.3, 1.0)));
  });

  it("a Vector is a tuple with w=0", () => {
    //given
    const a = new Vector(0.1, 0.2, 0.3);
    //then
    assert(a.tupleEqual(new Tuple(0.1, 0.2, 0.3, 0.0)));
  });

  it("a Vector is not equal to a Point with the same coords", () => {
    //given
    const v = new Vector(0.1, 0.2, 0.3);
    const p = new Point(0.1, 0.2, 0.3);
    //then
    assertFalse(v.tupleEqual(p));
  });

  it("two Points are equal if they have the same components", () => {
    //given
    const v1 = new Point(4, 5, 6);
    const v2 = new Point(4, 5, 6);
    //then
    assert(v1.tupleEqual(v2));
  });

  it("two Points are NOT equal if they have differing components", () => {
    //given
    const v1 = new Point(4, 5, 6.1);
    const v2 = new Point(4, 5, 6);
    //then
    assertFalse(v1.tupleEqual(v2));
  });

  it("two Vectors are equal if they have the same components", () => {
    //given
    const v1 = new Vector(4, 5, 6);
    const v2 = new Vector(4, 5, 6);
    //then
    assert(v1.tupleEqual(v2));
  });

  it("two Vectors are NOT equal if they have differing components", () => {
    //given
    const v1 = new Vector(4, 5, 6.1);
    const v2 = new Vector(4, 5, 6);
    //then
    assertFalse(v1.tupleEqual(v2));
  });

  it("two Tuples can be added", () => {
    //given
    const t1 = new Tuple(1, 2, 3, 0);
    const t2 = new Tuple(4, 5, 6, 0);
    //when
    const t3 = t1.plus(t2);

    //then
    assert(t3.tupleEqual(new Tuple(5, 7, 9, 0)));
  });

  it("a Point can be added to a Vector", () => {
    //given
    const p = new Point(1, 2, 3);
    const v = new Vector(4, 5, 6);
    //when
    const p2 = p.plus(v);

    //then
    assert(p2.tupleEqual(new Point(5, 7, 9)));
  });

  it("Point+Vector addition is commutative", () => {
    //given
    const p = new Point(1, 2, 3);
    const v = new Vector(4, 5, 6);
    //when
    const pv = p.plus(v);
    const vp = v.plus(p);

    //then
    assert(pv.tupleEqual(vp));
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
    assert(p3.tupleEqual(new Vector(-2, -4, -6)));
  });

  it("subtracts two Vectors to produce a Vector", () => {
    //given
    const v1 = new Vector(3, 2, 1);
    const v2 = new Vector(5, 6, 7);
    //when
    const v3 = v1.minus(v2);
    //then
    assert(v3.tupleEqual(new Vector(-2, -4, -6)));
  });

  it("subtracts a Vector from a Point to produce a Point", () => {
    //given
    const p = new Point(3, 2, 1);
    const v = new Vector(5, 6, 7);
    //when
    const pv = p.minus(v);
    //then
    assert(pv.tupleEqual(new Point(-2, -4, -6)));
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
    assert(zero.minus(v).tupleEqual(new Tuple(-1, 2, -3, 0)));
  });

  it("negate() is the same as subtracting a Vector from the zero vector", () => {
    //given
    const v = new Vector(1, -2, 3);
    //when
    assert(v.negate().tupleEqual(new Tuple(-1, 2, -3, 0)));
  });

  it("negating a Point raises an exception", () => {
    //given
    const p = new Point(3, 2, 1);
    //when
    assertThrows(() => p.negate(), RangeError);
  });
});
