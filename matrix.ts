import * as Float from "./float.ts";
import { Tuple } from "./tuple.ts";

export class Matrix {
  _type = "Matrix";
  rows: number;
  columns: number;
  buf: Array<Array<number>>;

  constructor(input: Array<Array<number>>) {
    this.rows = input.length;
    this.columns = input[0].length;
    if (!input.every((row) => row.length == this.columns)) {
      throw new SyntaxError("all rows/columns must have the same cardinality");
    }
    this.buf = structuredClone(input);
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

  times(that: Matrix): Matrix;
  times(that: Tuple): Tuple;
  times(that: Matrix | Tuple): Matrix | Tuple {
    if (that instanceof Matrix) return this._timesMatrix(that);
    if (that instanceof Tuple) return this._timesTuple(that);
    throw new RangeError("Unsupported type");
  }
  _timesTuple(that: Tuple): Tuple {
    const args = [];
    for (let i = 0; i < this.rows; i++) {
      args.push(this.rowAt(i).dot(that));
    }
    const [a, b, c, d] = args;
    return new Tuple(a, b, c, d);
  }

  _timesMatrix(that: Matrix): Matrix {
    if (!(this.rows == that.columns)) {
      throw new RangeError("cannot multiply NxM");
    }
    const input = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      const row = new Array(this.columns);
      for (let j = 0; j < this.columns; j++) {
        row[j] = (this.at(i, 0) * that.at(0, j)) +
          (this.at(i, 1) * that.at(1, j)) +
          (this.at(i, 2) * that.at(2, j)) +
          (this.at(i, 3) * that.at(3, j));
      }
      input[i] = row;
    }
    return new Matrix(input);
  }
}

export const IdentityMatrix = new Matrix([
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]);
