import { assert } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { Color } from "./color.ts";
import { Point } from "./tuple.ts";
import { PointLight } from "./light.ts";

describe("lights", () => {
  it("a point light has a position and intensity", () => {
    const intensity = new Color(1, 1, 1);
    const position = new Point(0, 0, 0);
    const res = new PointLight(position, intensity);
    assert(res.position.equals(new Point(0, 0, 0)));
    assert(res.intensity.equals(new Color(1, 1, 1)));
  });
});
