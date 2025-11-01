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

  it("can generate its PPM header", () => {
    const c = new Canvas(33, 22);
    const ppm = c.toPpm();
    assertEquals(ppm.split("\n").splice(0, 3), ["P3", "33 22", "255"]);
  });

  it("can generate serialize PPM pixel data", () => {
    //given
    const c = new Canvas(5, 3);
    //when
    c.setPixelAt(0, 0, new Color(1.5, 0, 0)); //R will get clamped to 1
    c.setPixelAt(2, 1, new Color(0, 0.5, 0));
    c.setPixelAt(4, 2, new Color(-0.5, 0, 1)); //R clamped to 0
    const ppm = c.toPpm();
    //then
    assertEquals(ppm.split("\n").splice(3, 3), [
      "255 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
      "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0",
      "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255",
    ]);
  });

  it("can split long lines in ppm files", () => {
    const c = new Canvas(10, 2);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 2; j++) {
        c.setPixelAt(i, j, new Color(1, 1, 1));
      }
    }
    const ppm = c.toPpm();
    // then
    assertEquals(ppm.split("\n").splice(3, 4), [
      "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255",
      "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255",
      "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255",
      "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255",
    ]);
  });

  it("ppm output contains final newline", () => {
    const c = new Canvas(10, 2);
    const ppm = c.toPpm();

    assertEquals(ppm.charAt(ppm.length - 1), "\n");
  });
});
