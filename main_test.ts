import { describe, it } from "@std/testing/bdd";
import { assert, assertFalse, assertEquals, assertAlmostEquals } from "@std/assert";
import { EPSILON, Tuple, Point, Vector } from "./main.ts";

describe("tuples.feature", () => {

  it("a tuple with w=1.0 is a point", () => {
    //given
    const a = new Tuple(4.3, -4.2, 3.1, 1.0)
    //then
    assertAlmostEquals(a.x, 4.3, EPSILON)
    assertAlmostEquals(a.y,-4.2, EPSILON)
    assertAlmostEquals(a.z, 3.1, EPSILON)
    assertAlmostEquals(a.w, 1.0, EPSILON)
    assert(a.is_a_point)
    assertFalse(a.is_a_vector)
  });

  it("a tuple with w=0.0 is a vector", () => {
    //given
    const a = new Tuple(4.3, -4.2, 3.1, 0.0)
    //then
    assertAlmostEquals(a.x, 4.3, EPSILON)
    assertAlmostEquals(a.y, -4.2, EPSILON)
    assertAlmostEquals(a.z, 3.1, EPSILON)
    assertAlmostEquals(a.w, 0.0, EPSILON)
    assertFalse(a.is_a_point)
    assert(a.is_a_vector)
  });


  it("a Point is a tuple with w=1", () => {
    //given
    const a = new Point(1.1, 2.2, 3.3)
    //then
    assert(a.tupleEqual(new Tuple(1.1, 2.2, 3.3, 1.0)))
  });

  it("a Vector is a tuple with w=0", () => {
    //given
    const a = new Vector(0.1, 0.2, 0.3)
    //then
    assert(a.tupleEqual(new Tuple(0.1, 0.2, 0.3, 0.0)))
  });


  it("a Vector is not equal to a Point with the same coords", () => {
    //given
    const v = new Vector(0.1, 0.2, 0.3)
    const p = new Point(0.1, 0.2, 0.3)
    //then
    assertFalse(v.tupleEqual(p))
  });

  it("two Points are equal if they have the same components", () => {
    //given
    const v1 = new Point(4, 5, 6)
    const v2 = new Point(4, 5, 6)
    //then
    assert(v1.tupleEqual(v2))
  });

  it("two Points are NOT equal if they have differing components", () => {
    //given
    const v1 = new Point(4, 5, 6.1)
    const v2 = new Point(4, 5, 6)
    //then
    assertFalse(v1.tupleEqual(v2))
  });


  it("two Vectors are equal if they have the same components", () => {
    //given
    const v1 = new Vector(4, 5, 6)
    const v2 = new Vector(4, 5, 6)
    //then
    assert(v1.tupleEqual(v2))
  });

  it("two Vectors are NOT equal if they have differing components", () => {
    //given
    const v1 = new Vector(4, 5, 6.1)
    const v2 = new Vector(4, 5, 6)
    //then
    assertFalse(v1.tupleEqual(v2))
  });




});
