import * as Float from "./float.ts";
import { Tuple } from "./tuple.ts";

export class Matrix {
  rows: number;
  columns: number;
  buf: Array<Array<number>>;

  constructor(input: Array<Array<number>>) {
    this.rows = input.length;
    this.columns = input[0].length;
    if (!input.every((row) => row.length == this.columns)) {
      throw new SyntaxError("all rows/columns must have the same cardinality");
    }
    // this.buf = structuredClone(input);
    // IDK which one is more fitting
    this.buf = input;
  }

  at(row: number, col: number): number {
    return this.buf[row][col];
  }

  rowAt(row: number): Tuple {
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

  determinant(): number {
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

  minor(row: number, column: number): number {
    return this.submatrix(row, column).determinant();
  }

  cofactor(row: number, column: number): number {
    const minor = this.minor(row, column);
    return ((row + column) % 2) ? -minor : +minor;
  }

  submatrix(row: number, column: number): Matrix {
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
  ): Array<Array<number>> {
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
