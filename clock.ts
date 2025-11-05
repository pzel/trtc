import { Point } from "./tuple.ts";
import { Canvas } from "./canvas.ts";
import { Color } from "./color.ts";
import { Matrix } from "./matrix.ts";

if (import.meta.main) {
  const w = 400, h = 400;
  const c = new Canvas(w, h);
  const white = new Color(1, 1, 1);
  const hourAngle = Math.PI / 6;
  const shift = Matrix.identity()
    .scale(w / 4, h / 4, 0)
    .translate(w / 2, h / 2, 0);
  let rotation = Matrix.identity();

  for (let hour = 0; hour < 12; hour++) {
    const p = shift.times(rotation.times(new Point(0, -1, 0)));
    c.setAt(Math.round(p.x), Math.round(p.y), white);
    rotation = rotation.rotateZ(hourAngle);
  }

  await Deno.writeTextFile("clock.ppm", c.toPpm());
}
