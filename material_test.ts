import { assert } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { Color } from "./color.ts";
import { Material } from "./material.ts";
import { Point, Vector } from "./tuple.ts";
import { PointLight } from "./light.ts";
import { eq, sqrt2 } from "./float.ts";

describe("Materials", () => {
  it("there is a default material", () => {
    const m = new Material();

    assert(m.color.equals(new Color(1, 1, 1)));
    assert(eq(m.ambient, 0.1));
    assert(eq(m.diffuse, 0.9));
    assert(eq(m.specular, 0.9));
    assert(eq(m.shininess, 200.0));
  });

  it("lighting with eye between the light and the surface", () => {
    const m = new Material();
    const position = new Point(0, 0, 0);
    const eyev = new Vector(0, 0, -1);
    const normalv = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10));
    const res: Color = m.lighting(light, position, eyev, normalv);
    assert(res.equals(new Color(1.9, 1.9, 1.9)), `${res}`);
  });

  it("lighting with eye between the light and the surface, eye offset 45°", () => {
    const m = new Material();
    const position = new Point(0, 0, 0);
    const eyev = new Vector(0, sqrt2 / 2, -sqrt2 / 2);
    const normalv = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, -10));
    const res: Color = m.lighting(light, position, eyev, normalv);
    assert(res.equals(new Color(1, 1, 1)), `${res}`);
  });

  it("lighting with eye opposite surface, light offset 45°", () => {
    const m = new Material();
    const position = new Point(0, 0, 0);
    const eyev = new Vector(0, 0, -1);
    const normalv = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 10, -10));
    const res: Color = m.lighting(light, position, eyev, normalv);
    assert(res.equals(new Color(0.7364, 0.7364, 0.7364)), `${res}`);
  });

  it("lighting with eye in the path of reflection vector", () => {
    const m = new Material();
    const position = new Point(0, 0, 0);
    const eyev = new Vector(0, -sqrt2 / 2, -sqrt2 / 2);
    const normalv = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 10, -10));
    const res: Color = m.lighting(light, position, eyev, normalv);
    assert(res.equals(new Color(1.6364, 1.6364, 1.6364)), `${res}`);
  });

  it("lighting with the light behind the surface vector", () => {
    const m = new Material();
    const position = new Point(0, 0, 0);
    const eyev = new Vector(0, 0, -1);
    const normalv = new Vector(0, 0, -1);
    const light = new PointLight(new Point(0, 0, +10));
    const res: Color = m.lighting(light, position, eyev, normalv);
    assert(res.equals(new Color(0.1, 0.1, 0.1)), `${res}`);
  });
});
