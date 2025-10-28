export const EPSILON = 0.0001

export class Tuple extends Float32Array {

  constructor(x: number, y: number, z: number, w: number) {
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
  get is_a_point() {
    return Math.round(this[3]) == 1;
  }
  get is_a_vector() {
    return Math.round(this[3]) == 0;
  }

  tupleEqual(other: Tuple) {
    return (
      floatEqual(this.x, other.x) &&
        floatEqual(this.y, other.y) &&
        floatEqual(this.z, other.z) &&
        floatEqual(this.w, other.w))
  }

}

export class Point extends Tuple {
  constructor (x: number, y: number, z: number) {
    super(x,y,z,1.0);
  }
}

export class Vector extends Tuple {
  constructor (x: number, y: number, z: number) {
    super(x,y,z,0.0);
  }
}


function floatEqual(a: number, b: number) : boolean {
  return Math.abs(a-b) < EPSILON;
}


// // Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }


