import { describe, it } from "@std/testing/bdd";
import { assert, assertAlmostEquals, assertEquals } from "@std/assert";
import { Color } from "./color.ts";
import { EPSILON } from "./tuple.ts";

describe("Colors", () => {
  it("colors are (red, green, blue) tuples", () => {
    const c = new Color(-0.5, 0.4, 1.7);
    assertAlmostEquals(c.red, -0.5, EPSILON);
    assertAlmostEquals(c.green, 0.4, EPSILON);
    assertAlmostEquals(c.blue, 1.7, EPSILON);
  });

  it("colors can be added", () => {
    const c1 = new Color(0.9, 0.6, 0.75);
    const c2 = new Color(0.7, 0.1, 0.25);
    assert(c1.plus(c2).tupleEquals(new Color(1.6, 0.7, 1.0)));
  });

  it("colors can be subtracted", () => {
    const c1 = new Color(0.9, 0.6, 0.75);
    const c2 = new Color(0.7, 0.1, 0.25);
    assert(c1.minus(c2).tupleEquals(new Color(0.2, 0.5, 0.5)));
  });

  it("colors can be multiplied by a scalar", () => {
    const c1 = new Color(0.2, 0.3, 0.4);
    assert(c1.times(2).tupleEquals(new Color(0.4, 0.6, 0.8)));
  });

  it("colors can be multiplied by a color", () => {
    const c1 = new Color(1, 0.2, 0.4);
    const c2 = new Color(0.9, 1, 0.1);
    assert(c1.times(c2).tupleEquals(new Color(0.9, 0.2, 0.04)));
  });

  it("can project itself to a tuple of 0-255 values", () => {
    const c = new Color(0, 0.5, 1);
    assertEquals(c.toRgb(), [0, 128, 255]);
  });

  it("can clamps values to the 0-255 range", () => {
    const c = new Color(-0.1, 0.5, 11);
    assertEquals(c.toRgb(), [0, 128, 255]);
  });
});
