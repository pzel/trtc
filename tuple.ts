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
  get magnitude(): number {
    return Math.sqrt(
      this.x ** 2 +
        this.y ** 2 +
        this.z ** 2 +
        this.w ** 2,
    );
  }

  tupleEquals(that: Tuple): boolean {
    const eq = (a: number, b: number): boolean => Math.abs(a - b) < EPSILON;

    return (
      eq(this.x, that.x) &&
      eq(this.y, that.y) &&
      eq(this.z, that.z) &&
      eq(this.w, that.w)
    );
  }

  dot(that: Tuple): number {
    return (this.x * that.x + this.y * that.y + this.z * that.z +
      this.w * that.w);
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

  times(that: number | Tuple): Tuple {
    // by default only scalar multiplication is defined
    if (typeof that === "number") {
      return new Tuple(
        this.x * that,
        this.y * that,
        this.z * that,
        this.w * that,
      );
    } else {
      throw new RangeError("N/A");
    }
  }

  div(scalar: number): Tuple {
    return this.times(1 / scalar);
  }

  normalize(): Tuple {
    const m = this.magnitude;
    return new Tuple(this.x / m, this.y / m, this.z / m, this.w / m);
  }

  cross(_: Tuple): Tuple {
    throw new RangeError("N/A");
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
  override cross(that: Vector): Vector {
    return new Vector(
      this.y * that.z - this.z * that.y,
      this.z * that.x - this.x * that.z,
      this.x * that.y - this.y * that.x,
    );
  }
}
