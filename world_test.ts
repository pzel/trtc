import {
  assert,
  assertEquals,
  assertFloatEquals,
  assertStrictEquals,
  describe,
  it,
} from "./testing.ts";

import { World } from "./world.ts";
import { Sphere } from "./sphere.ts";
import { Color } from "./color.ts";
import { PointLight } from "./light.ts";
import { Point, Vector } from "./tuple.ts";
import { Ray } from "./ray.ts";
import { Matrix } from "./matrix.ts";
import { Intersections } from "./intersection.ts";

describe("World", () => {
  it("can be created", () => {
    const w = new World();
    assertEquals(w.objects, []);
    assertEquals(w.light, null);
  });
  it("can instantiate the 'default world'", () => {
    const w = World.default();
    const l = new PointLight(new Point(-10, 10, -10));
    const s1 = new Sphere();
    s1.material.color = new Color(0.8, 1.0, 0.6);
    s1.material.diffuse = 0.7;
    s1.material.specular = 0.2;
    const s2 = new Sphere();
    s2.transform = Matrix.scaling(0.5, 0.5, 0.5);
  });

  it("can intersect a world with a ray", () => {
    const w = World.default();
    const r = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
    const xs: Intersections = w.intersect(r);
    assertEquals(xs.length, 4);
    assertFloatEquals(xs.pop()?.t, 4);
    assertFloatEquals(xs.pop()?.t, 4.5);
    assertFloatEquals(xs.pop()?.t, 5.5);
    assertFloatEquals(xs.pop()?.t, 6);
  });
});
