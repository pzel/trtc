import { describe, it } from "@std/testing/bdd";
import {
  assert,
  assertAlmostEquals,
  assertEquals,
  assertFalse,
  assertThrows,
} from "@std/assert";
import { Matrix } from "./matrix.ts";
import { Point, Tuple, Vector } from "./tuple.ts";
import { sqrt2 } from "./float.ts";

describe("Matrices", () => {
  it("can construct and inspect a 4x4 matrix", () => {
    const m = new Matrix([
      [1, 2, 3, 4],
      [5.5, 6.5, 7.5, 8.5],
      [9, 10, 11, 12],
      [13.5, 14.5, 15.5, 16.6],
    ]);
    assertEquals(m.at(0, 0), 1);
    assertEquals(m.at(0, 3), 4);
    assertEquals(m.at(1, 0), 5.5);
    assertEquals(m.at(1, 2), 7.5);
    assertEquals(m.at(2, 2), 11);
    assertEquals(m.at(3, 0), 13.5);
    assertEquals(m.at(3, 2), 15.5);
  });

  it("can construct and inspect a 3x3 matrix", () => {
    const m = new Matrix([
      [-3, 5, 0],
      [1, -2, -7],
      [0, 1, 1],
    ]);
    assertEquals(m.at(0, 0), -3);
    assertEquals(m.at(1, 1), -2);
    assertEquals(m.at(2, 2), 1);
  });

  it("can construct and inspect a 2x2 matrix", () => {
    const m = new Matrix([
      [-3, 5],
      [1, -2],
    ]);
    assertEquals(m.at(0, 1), 5);
    assertEquals(m.at(1, 0), 1);
  });

  it("irregularly-shaped matrix constuctors are a SyntaxError", () => {
    assertThrows(() => new Matrix([[1, 2, 3], [4, 5], [6, 7, 8]]), SyntaxError);
  });

  it("can compare matrices for equality (positive)", () => {
    const a = new Matrix([
      [1, 2, 3, 0.20 + 0.10],
      [5, 6, 7, 8],
      [9, 8, 7, 6],
      [5, 4, 3, 2],
    ]);

    const b = new Matrix([
      [1, 2, 3, 0.15 + 0.15],
      [5, 6, 7, 8],
      [9, 8, 7, 6],
      [5, 4, 3, 2],
    ]);

    assert(a.equals(b));
    assert(b.equals(a));
  });

  it("can compare matrices for equality (negative;size mismatch)", () => {
    const a = new Matrix([
      [1, 2],
      [5, 6],
    ]);

    const b = new Matrix([
      [1, 2, 3],
      [5, 6, 7],
      [9, 8, 7],
    ]);

    assertFalse(a.equals(b));
    assertFalse(b.equals(a));
  });

  it("can compare matrices for equality (negative;value mismatch)", () => {
    const a = new Matrix([
      [1, 2],
      [5, 6],
    ]);

    const b = new Matrix([
      [1, 2],
      [5, 6.1],
    ]);

    assertFalse(a.equals(b));
    assertFalse(b.equals(a));
  });

  it("can multiply 4x4 matrices", () => {
    const a = new Matrix([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 8, 7, 6],
      [5, 4, 3, 2],
    ]);
    const b = new Matrix([
      [-2, 1, 2, 3],
      [3, 2, 1, -1],
      [4, 3, 6, 5],
      [1, 2, 7, 8],
    ]);
    const res: Matrix = a.times(b);
    assert(res.equals(
      new Matrix([
        [20, 22, 50, 48],
        [44, 54, 114, 108],
        [40, 58, 110, 102],
        [16, 26, 46, 42],
      ]),
    ));
  });

  it("can't multiply incompatible matrices", () => {
    const a = new Matrix([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 8, 7, 6],
      [5, 4, 3, 2],
    ]);
    const b = new Matrix([
      [-2, 1],
      [3, 2],
    ]);
    assertThrows(() => a.times(b), RangeError);
  });

  it("can multiply a 4x4 matrix by a 4-tuple", () => {
    const a = new Matrix([
      [1, 2, 3, 4],
      [2, 4, 4, 2],
      [8, 6, 4, 1],
      [0, 0, 0, 1],
    ]);
    const res = a.times(new Tuple(1, 2, 3, 1));
    assert(res.equals(new Tuple(18, 24, 33, 1)));
  });

  it("multiplying M by the identity matrix is M", () => {
    const m = new Matrix([
      [0, 1, 2, 3],
      [1, 2, 4, 8],
      [2, 4, 8, 16],
      [4, 8, 16, 32],
    ]);
    assert(m.times(Matrix.identity()).equals(m));
  });

  it("multiplying identity matrix by tuple T is T", () => {
    const t = new Tuple(1, -2, 3, -4);
    assert(Matrix.identity().times(t).equals(t));
  });

  it("transposing a matrix", () => {
    const a = new Matrix([
      [0, 9, 3, 0],
      [9, 8, 0, 8],
      [1, 8, 5, 3],
      [0, 0, 5, 8],
    ]);
    const expected = new Matrix([
      [0, 9, 1, 0],
      [9, 8, 8, 0],
      [3, 0, 5, 5],
      [0, 8, 3, 8],
    ]);

    assert(a.transpose().equals(expected));
  });

  it("transposing id matrix is id matrix", () => {
    assert(Matrix.identity().transpose().equals(Matrix.identity()));
  });

  it("transposing works on 2x2 matrices", () => {
    const m = new Matrix([
      [0, 1],
      [2, 3],
    ]);
    const expected = new Matrix([
      [0, 2],
      [1, 3],
    ]);
    assert(m.transpose().equals(expected));
  });

  it("transposing works on non-square matrices", () => {
    const m = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
    ]);
    const expected = new Matrix([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
    assert(m.transpose().equals(expected));
  });

  it("can calculate the determinant of a 2x2 matrix", () => {
    const m = new Matrix([
      [1, 5],
      [-3, 2],
    ]);
    assertEquals(m.determinant(), 17);
  });

  it("a submatrix of a 3x3 matrix is a 2x2 matrix", () => {
    const m = new Matrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
    const expected = new Matrix([
      [4, 5],
      [7, 8],
    ]);
    assert(m.submatrix(0, 2).equals(expected));
  });

  it("a submatrix of a 4x4 matrix is a 3x3 matrix", () => {
    const m = new Matrix([
      [21, 22, 23, 24],
      [25, 26, 27, 28],
      [11, 12, 13, 14],
      [15, 16, 17, 18],
    ]);
    const expected = new Matrix([
      [21, 23, 24],
      [25, 27, 28],
      [15, 17, 18],
    ]);
    assert(m.submatrix(2, 1).equals(expected));
  });

  it("calculating a minor of a 3x3 matrix", () => {
    const a = new Matrix([
      [3, 5, 0],
      [2, -1, -7],
      [6, -1, 5],
    ]);
    const b = a.submatrix(1, 0);
    assertEquals(b.determinant(), 25);
    assertEquals(a.minor(1, 0), 25);
  });

  it("calculating a cofactor of a 3x3 matrix", () => {
    const a = new Matrix([
      [3, 5, 0],
      [2, -1, -7],
      [6, -1, 5],
    ]);
    assertEquals(a.minor(0, 0), -12);
    assertEquals(a.cofactor(0, 0), -12);
    assertEquals(a.minor(1, 0), 25);
    assertEquals(a.cofactor(1, 0), -25);
  });

  it("calculating the determinant of a 3x3 matrix", () => {
    const a = new Matrix([
      [1, 2, 6],
      [-5, 8, -4],
      [2, 6, 4],
    ]);
    assertEquals(a.cofactor(0, 0), 56);
    assertEquals(a.cofactor(0, 1), 12);
    assertEquals(a.cofactor(0, 2), -46);
    assertEquals(a.determinant(), -196);
  });

  it("calculating the determinant of a 4x4 matrix", () => {
    const a = new Matrix([
      [-2, -8, 3, 5],
      [-3, 1, 7, 3],
      [1, 2, -9, 6],
      [-6, 7, 7, -9],
    ]);
    assertEquals(a.cofactor(0, 0), 690);
    assertEquals(a.cofactor(0, 1), 447);
    assertEquals(a.cofactor(0, 2), 210);
    assertEquals(a.cofactor(0, 3), 51);
    assertEquals(a.determinant(), -4071);
  });

  it("testing an invertible matrix for invertibility", () => {
    const a = new Matrix([
      [6, 4, 4, 4],
      [5, 5, 7, 6],
      [4, -9, 3, -7],
      [9, 1, 7, -6],
    ]);
    assertEquals(a.determinant(), -2120);
    assert(a.invertible());
  });

  it("testing an invertible matrix for invertibility", () => {
    const a = new Matrix([
      [-4, 2, -2, -3],
      [9, 6, 2, 6],
      [0, -5, 1, -5],
      [0, 0, 0, 0],
    ]);
    assertEquals(a.determinant(), 0);
    assertFalse(a.invertible());
  });

  it("calculating the inverse of a matrix", () => {
    const a = new Matrix([
      [-5, 2, 6, -8],
      [1, -5, 1, 8],
      [7, 7, -6, -7],
      [1, -3, 7, 4],
    ]);
    const b = a.inverse();
    assertEquals(a.determinant(), 532);
    assertEquals(a.cofactor(2, 3), -160);
    assertAlmostEquals(b.buf[3][2], -160 / 532, 0.00001);
    assertEquals(a.cofactor(3, 2), 105);
    assertAlmostEquals(b.buf[2][3], 105 / 532, 0.00001);
    assert(b.equals(
      new Matrix([
        [0.21805, 0.45113, 0.24060, -0.04511],
        [-0.80827, -1.45677, -0.44361, 0.52068],
        [-0.07895, -0.22368, -0.05263, 0.19737],
        [-0.52256, -0.81391, -0.30075, 0.30639],
      ]),
    ));
  });

  it("calculating the inverse of another matrix", () => {
    const a = new Matrix([
      [8, -5, 9, 2],
      [7, 5, 6, 1],
      [-6, 0, 9, 6],
      [-3, 0, -9, -4],
    ]);
    const expected = new Matrix([
      [-0.15385, -0.15385, -0.28205, -0.53846],
      [-0.07692, 0.12308, 0.02564, 0.03077],
      [0.35897, 0.35897, 0.43590, 0.92308],
      [-0.69231, -0.69231, -0.76923, -1.92308],
    ]);
    assert(a.inverse().equals(expected));
  });

  it("multiplying a product by its inverse", () => {
    const a = new Matrix([
      [3, -9, 7, 3],
      [3, -8, 2, -9],
      [-4, 4, 4, 1],
      [-6, 5, -1, 1],
    ]);
    const b = new Matrix([
      [8, 2, 2, 2],
      [3, -1, 7, 0],
      [7, 0, 5, 4],
      [6, -2, 0, 5],
    ]);
    const product = a.times(b);
    assert(product.times(b.inverse()).equals(a));
  });

  it("multiplying a point by a translation matrix", () => {
    const transform = Matrix.translation(5, -3, 2);
    const p = new Point(-3, 4, 5);
    assert(transform.times(p).equals(new Point(2, 1, 7)));
  });

  it("multiplying a point by the inverse of a translation matrix", () => {
    const transform = Matrix.translation(5, -3, 2).inverse();
    const p = new Point(-3, 4, 5);
    assert(transform.times(p).equals(new Point(-8, 7, 3)));
  });

  it("translation does not affect vectors", () => {
    const transform = Matrix.translation(5, -3, 2);
    const v = new Vector(-3, 4, 5);
    assert(transform.times(v).equals(v));
  });

  it("scaling a point", () => {
    const transform = Matrix.scaling(2, 3, 4);
    const p = new Point(-1, 2, 3);
    assert(transform.times(p).equals(new Point(-2, 6, 12)));
  });

  it("scaling a vector", () => {
    const transform = Matrix.scaling(2, 3, 4);
    const p = new Vector(-1, 2, 3);
    assert(transform.times(p).equals(new Vector(-2, 6, 12)));
  });

  it("inverse scaling", () => {
    const transform = Matrix.scaling(2, 3, 4).inverse();
    const p = new Vector(-4, 6, -8);
    assert(transform.times(p).equals(new Vector(-2, 2, -2)));
  });

  it("scaling by -1 is reflection", () => {
    const transform = Matrix.scaling(-1, 1, 1);
    const p = new Point(-4, 2, 2);
    assert(transform.times(p).equals(new Point(4, 2, 2)));
  });

  it("rotates a point around the X axis", () => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Matrix.rotationX(Math.PI / 4); // 45 deg
    const fullQuarter = Matrix.rotationX(Math.PI / 2); // 90 deg
    assert(halfQuarter.times(p).equals(new Point(0, sqrt2 / 2, sqrt2 / 2)));
    assert(fullQuarter.times(p).equals(new Point(0, 0, 1)));
    assert(fullQuarter.times(fullQuarter).times(p).equals(new Point(0, -1, 0)));
  });

  it("inverse rotation on the X axis", () => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Matrix.rotationX(Math.PI / 4).inverse(); // -45 deg
    assert(halfQuarter.times(p).equals(new Point(0, sqrt2 / 2, -sqrt2 / 2)));
  });

  it("rotates a point around the Y axis", () => {
    const p = new Point(0, 0, 1);
    const halfQuarter = Matrix.rotationY(Math.PI / 4);
    const fullQuarter = Matrix.rotationY(Math.PI / 2);
    assert(halfQuarter.times(p).equals(new Point(sqrt2 / 2, 0, sqrt2 / 2)));
    assert(fullQuarter.times(p).equals(new Point(1, 0, 0)));
  });

  it("inverse rotation on the Y axis", () => {
    const p = new Point(0, 0, 1);
    const halfQuarter = Matrix.rotationY(Math.PI / 4).inverse();
    assert(halfQuarter.times(p).equals(new Point(-sqrt2 / 2, 0, sqrt2 / 2)));
  });

  it("rotates a point around the Z axis", () => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Matrix.rotationZ(Math.PI / 4);
    const fullQuarter = Matrix.rotationZ(Math.PI / 2);
    assert(halfQuarter.times(p).equals(new Point(-sqrt2 / 2, sqrt2 / 2, 0)));
    assert(fullQuarter.times(p).equals(new Point(-1, 0, 0)));
  });

  it("inverse rotation around the Z axis", () => {
    const p = new Point(0, 1, 0);
    const halfQuarter = Matrix.rotationZ(Math.PI / 4).inverse();
    assert(halfQuarter.times(p).equals(new Point(sqrt2 / 2, sqrt2 / 2, 0)));
  });

  it("sharing moves x in proportion to y", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(1, 0, 0, 0, 0, 0);
    assert(shearing.times(p).equals(new Point(2 + 3, 3, 4)));
  });

  it("sharing moves x in proportion to z", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(0, 1, 0, 0, 0, 0);
    assert(shearing.times(p).equals(new Point(2 + 4, 3, 4)));
  });

  it("sharing moves y in proportion to x", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(0, 0, 1, 0, 0, 0);
    assert(shearing.times(p).equals(new Point(2, 3 + 2, 4)));
  });

  it("sharing moves y in proportion to z", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(0, 0, 0, 1, 0, 0);
    assert(shearing.times(p).equals(new Point(2, 3 + 4, 4)));
  });

  it("sharing moves z in proportion to x", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(0, 0, 0, 0, 1, 0);
    assert(shearing.times(p).equals(new Point(2, 3, 4 + 2)));
  });

  it("sharing moves z in proportion to y", () => {
    const p = new Point(2, 3, 4);
    const shearing = Matrix.shearing(0, 0, 0, 0, 0, 1);
    assert(shearing.times(p).equals(new Point(2, 3, 4 + 3)));
  });

  it("individual transformations applied in sequence", () => {
    const p = new Point(1, 0, 1);
    const a = Matrix.rotationX(Math.PI / 2);
    const b = Matrix.scaling(5, 5, 5);
    const c = Matrix.translation(10, 5, 7);
    // when
    const p2 = a.times(p);
    assert(p2.equals(new Point(1, -1, 0)));
    // when
    const p3 = b.times(p2);
    assert(p3.equals(new Point(5, -5, 0)));
    // when
    const p4 = c.times(p3);
    assert(p4.equals(new Point(15, 0, 7)));
  });

  it("composed transformations applied", () => {
    const p = new Point(1, 0, 1);
    const a = Matrix.rotationX(Math.PI / 2);
    const b = Matrix.scaling(5, 5, 5);
    const c = Matrix.translation(10, 5, 7);
    // when (composition requires 'reverse' order of application)
    const t = c.times(b).times(a);
    // then
    assert(t.times(p).equals(new Point(15, 0, 7)));
  });

  it("fluent API for composing transformations", () => {
    const p = new Point(1, 0, 1);
    const t = Matrix.identity()
      .rotateX(Math.PI / 2)
      .scale(5, 5, 5)
      .translate(10, 5, 7);
    // when
    const res = t.times(p);
    // then
    assert(res.equals(new Point(15, 0, 7)));
  });

  it("fluent API for composing transformations (the rest of the ops)", () => {
    const p = new Point(1, 0, 1);
    const t = Matrix.identity()
      .rotateY(Math.PI / 2)
      .rotateZ(Math.PI / 2)
      .shear(1, 0, 0, 0, 0, 1);
    // when
    const res = t.times(p);
    // then
    assert(res.equals(new Point(1, 1, 0)));
  });
});
