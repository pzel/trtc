import * as Float from "./float.ts";
import { Tuple } from "./tuple.ts";

type N = number;

export class Matrix {
  rows: N;
  columns: N;
  buf: Array<Array<N>>;

  constructor(input: Array<Array<N>>) {
    this.rows = input.length;
    this.columns = input[0].length;
    if (!input.every((row) => row.length == this.columns)) {
      throw new SyntaxError("all rows/columns must have the same cardinality");
    }
    // this.buf = structuredClone(input);
    // IDK which one is more fitting
    this.buf = input;
  }

  static identity(): Matrix {
    return new Matrix([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  static translation(x: N, y: N, z: N): Matrix {
    const m = this.identity();
    m.buf[0][3] = x;
    m.buf[1][3] = y;
    m.buf[2][3] = z;
    return m;
  }

  static scaling(x: N, y: N, z: N): Matrix {
    const m = this.identity();
    m.buf[0][0] = x;
    m.buf[1][1] = y;
    m.buf[2][2] = z;
    return m;
  }

  static rotationX(radians: N): Matrix {
    const m = this.identity();
    m.buf[1][1] = Math.cos(radians);
    m.buf[2][2] = m.buf[1][1];
    m.buf[2][1] = Math.sin(radians);
    m.buf[1][2] = -m.buf[2][1];
    return m;
  }

  static rotationY(radians: N): Matrix {
    const m = this.identity();
    m.buf[0][0] = Math.cos(radians);
    m.buf[2][2] = m.buf[0][0];
    m.buf[0][2] = Math.sin(radians);
    m.buf[2][0] = -m.buf[0][2];
    return m;
  }
  static rotationZ(radians: N): Matrix {
    const m = this.identity();
    m.buf[0][0] = Math.cos(radians);
    m.buf[1][1] = m.buf[0][0];
    m.buf[1][0] = Math.sin(radians);
    m.buf[0][1] = -m.buf[1][0];
    return m;
  }

  static shearing(xy: N, xz: N, yx: N, yz: N, zx: N, zy: N): Matrix {
    const m = this.identity();
    m.buf[0][1] = xy;
    m.buf[0][2] = xz;
    m.buf[1][0] = yx;
    m.buf[1][2] = yz;
    m.buf[2][0] = zx;
    m.buf[2][1] = zy;
    return m;
  }

  // FLUENT API
  scale(x: N, y: N, z: N): Matrix {
    return Matrix.scaling(x, y, z).times(this);
  }

  translate(x: N, y: N, z: N): Matrix {
    return Matrix.translation(x, y, z).times(this);
  }

  rotateX(r: N): Matrix {
    return Matrix.rotationX(r).times(this);
  }

  rotateY(r: N): Matrix {
    return Matrix.rotationY(r).times(this);
  }

  rotateZ(r: N): Matrix {
    return Matrix.rotationZ(r).times(this);
  }

  shear(xy: N, xz: N, yx: N, yz: N, zx: N, zy: N): Matrix {
    return Matrix.shearing(xy, xz, yx, yz, zx, zy).times(this);
  }
  // END FLUENT API

  at(row: N, col: N): N {
    return this.buf[row][col];
  }

  rowAt(row: N): Tuple {
    if (!(this.rows == 4)) throw new RangeError("only 4x4 matrices supported");
    const [a, b, c, d] = this.buf[row];
    return new Tuple(a, b, c, d);
  }

  equals(that: Matrix): boolean {
    let res = true;
    if (this.rows != that.rows || this.columns != that.columns) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        res = res && Float.eq(this.at(i, j), that.at(i, j));
      }
    }
    return res;
  }

  transpose(): Matrix {
    const res = this.freshBuffer(this.columns, this.rows);

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.columns; i++) {
        res[i][j] = this.buf[j][i];
      }
    }
    return new Matrix(res);
  }

  times(that: Matrix): Matrix;
  times(that: Tuple): Tuple;
  times(that: Matrix | Tuple): Matrix | Tuple {
    if (that instanceof Matrix) return this.timesMatrix(that);
    if (that instanceof Tuple) return this.timesTuple(that);
    throw new RangeError("Unsupported type");
  }

  invertible(): boolean {
    return this.determinant() != 0;
  }

  inverse(): Matrix {
    if (!this.invertible()) throw new RangeError("matrix not invertible");
    const res = this.freshBuffer();
    const d = this.determinant();
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < res[0].length; j++) {
        const c = this.cofactor(i, j);
        res[j][i] = c / d;
      }
    }
    return new Matrix(res);
  }

  determinant(): N {
    // for 2x2 matrices:
    if (this.rows == 2 && this.columns == 2) {
      return this.buf[0][0] * this.buf[1][1] - this.buf[1][0] * this.buf[0][1];
    }
    const r = this.buf[0];
    let sum = 0;
    for (let col = 0; col < r.length; col++) {
      sum += r[col] * this.cofactor(0, col);
    }
    return sum;
  }

  minor(row: N, column: N): N {
    return this.submatrix(row, column).determinant();
  }

  cofactor(row: N, column: N): N {
    const minor = this.minor(row, column);
    return ((row + column) % 2) ? -minor : +minor;
  }

  submatrix(row: N, column: N): Matrix {
    const res = this.freshBuffer(this.rows - 1, this.columns - 1);
    let jj, ii = 0;
    for (let i = 0; i < this.rows; i++) {
      if (!(i == row)) {
        jj = 0;
        for (let j = 0; j < this.columns; j++) {
          if (!(j == column)) res[ii][jj++] = this.buf[i][j];
        }
        ii++;
      }
    }
    return new Matrix(res);
  }

  private timesTuple(that: Tuple): Tuple {
    const args = [];
    for (let i = 0; i < this.rows; i++) {
      args.push(this.rowAt(i).dot(that));
    }
    const [a, b, c, d] = args;
    return new Tuple(a, b, c, d);
  }

  private timesMatrix(that: Matrix): Matrix {
    if (!(this.rows == that.columns)) {
      throw new RangeError("cannot multiply NxM");
    }
    const input = this.freshBuffer();
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        input[i][j] = (this.at(i, 0) * that.at(0, j)) +
          (this.at(i, 1) * that.at(1, j)) +
          (this.at(i, 2) * that.at(2, j)) +
          (this.at(i, 3) * that.at(3, j));
      }
    }
    return new Matrix(input);
  }

  private freshBuffer(
    rows = this.rows,
    columns = this.columns,
  ): Array<Array<N>> {
    const res = new Array(rows);
    for (let i = 0; i < rows; i++) res[i] = new Array(columns);
    return res;
  }
}

export const IdentityMatrix = new Matrix([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]);
