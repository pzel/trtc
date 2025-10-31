import { describe, it } from "@std/testing/bdd";
import { assert, assertEquals } from "@std/assert";
import { Color } from "./color.ts";
import { Canvas } from "./canvas.ts";

describe("Canvas", () => {
  it("can be created with width and height", () => {
    const c = new Canvas(10, 20);
    assertEquals(c.width, 10);
    assertEquals(c.height, 20);
  });

  it("all pixels are black upon creation", () => {
    const c = new Canvas(3, 3);
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        assert(c.pixelAt(x, y).tupleEquals(new Color(0, 0, 0)));
      }
    }
  });
  it("a pixel can be set and gotten", () => {
    const c = new Canvas(3, 3);
    const red = new Color(1, 0, 0);
    //when
    c.setPixelAt(2, 3, red);
    //then
    assert(c.pixelAt(2, 3).tupleEquals(red));
  });
});
