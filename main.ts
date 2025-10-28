export const EPSILON = 0.0001;

export class Tuple extends Float32Array {
  constructor(x: number, y: number, z: number, w: number) {
    if (!((0.0 <= w) && (w <= 1.0))) {
      throw new RangeError("W must be must be between 0 and 1.");
    }
    super([x, y, z, w]);
  }

  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
  get is_a_point(): boolean {
    return Math.round(this[3]) == 1;
  }
  get is_a_vector(): boolean {
    return Math.round(this[3]) == 0;
  }

  tupleEqual(that: Tuple): boolean {
    return (
      floatEqual(this.x, that.x) &&
      floatEqual(this.y, that.y) &&
      floatEqual(this.z, that.z) &&
      floatEqual(this.w, that.w)
    );
  }

  plus(that: Tuple): Tuple {
    return new Tuple(
      this.x + that.x,
      this.y + that.y,
      this.z + that.z,
      this.w + that.w,
    );
  }

  minus(that: Tuple): Tuple {
    return new Tuple(
      this.x - that.x,
      this.y - that.y,
      this.z - that.z,
      this.w - that.w,
    );
  }

  negate(): Tuple {
    return new Tuple(
      -this.x,
      -this.y,
      -this.z,
      -this.w,
    );
  }
}

export class Point extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 1.0);
  }
}

export class Vector extends Tuple {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, 0.0);
  }
}

function floatEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < EPSILON;
}

// // Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }
