import { assert, assertAlmostEquals, assertEquals } from "@std/assert";
import { Ray } from "./ray.ts";
import { Sphere } from "./sphere.ts";
import { Matrix } from "./matrix.ts";
//import { Intersection, Intersections } from "./intersection.ts";
import { Point, Vector } from "./tuple.ts";
import { describe, it } from "@std/testing/bdd";

describe("Spheres", () => {
  it("has a default transformation", () => {
    const s = new Sphere();
    assert(s.transform.equals(Matrix.identity()));
  });

  it("can have its trasformation set to another one", () => {
    const s = new Sphere();
    const m = Matrix.translation(4, 5, 6);
    s.transform = m;
    assert(s.transform.equals(m));
  });

  it("intersects a translated sphere with a Ray", () => {
    const s = new Sphere();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    s.transform = Matrix.translation(5, 0, 0);
    const xs = s.intersect(r);
    assert(xs.length == 0, `${xs}`);
  });

  it("has a normal at a point on the x axis", () => {
    const s = new Sphere();
    const n = s.normalAt(new Point(1, 0, 0));
    assert(n.equals(new Vector(1, 0, 0)));
  });
  it("has a normal at a point on the y axis", () => {
    const s = new Sphere();
    const n = s.normalAt(new Point(0, 1, 0));
    assert(n.equals(new Vector(0, 1, 0)));
  });
  it("has a normal at a point on the z axis", () => {
    const s = new Sphere();
    const n = s.normalAt(new Point(0, 0, 1));
    assert(n.equals(new Vector(0, 0, 1)));
  });
  it("has a normal at a nonaxial point", () => {
    const x = Math.sqrt(3.0) / 3.0;
    const s = new Sphere();
    const n = s.normalAt(new Point(x, x, x));
    assert(n.equals(new Vector(x, x, x)));
  });
  it("normals are always normalized", () => {
    const x = Math.sqrt(3.0) / 3.0;
    const s = new Sphere();
    const n = s.normalAt(new Point(x, x, x));
    assert(n.equals(new Vector(x, x, x).normalize()));
  });
  it("computing the normal on a translated sphere", () => {
    const s = new Sphere();
    s.transform = Matrix.translation(0, 1, 0);
    const n = s.normalAt(new Point(0, 1.70711, -0.70711));
    assert(n.equals(new Vector(0, 0.70711, -0.70711)), `${n}`);
  });
  it("computing the normal on a transformed sphere", () => {
    const s = new Sphere();
    s.transform = Matrix.rotationZ(Math.PI / 5).scale(1, 0.5, 1);
    const n = s.normalAt(new Point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
    assert(n.equals(new Vector(0, 0.97014, -0.24254)), `${n}`);
  });
});
