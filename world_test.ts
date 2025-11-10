import { assertEquals } from "@std/assert/equals";
import { describe, it } from "@std/testing/bdd";

import { World } from "./world.ts";
import { Sphere } from "./sphere.ts";
import { Color } from "./color.ts";
import { PointLight } from "./light.ts";
import { Point } from "./tuple.ts";
import { Matrix } from "./matrix.ts";

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
});
