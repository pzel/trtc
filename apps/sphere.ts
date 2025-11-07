import { Sphere } from "../sphere.ts";
import { Ray } from "../ray.ts";

import { Point, Vector } from "../tuple.ts";
import { Canvas } from "../canvas.ts";
import { Color } from "../color.ts";
import { Matrix } from "../matrix.ts";

if (import.meta.main) {
  const w = 400, h = 400;
  const c = new Canvas(w, h);
  //  const wallZ = 10;
  const s = 120;

  const sphere = new Sphere();
  sphere.transform = Matrix
    .scaling(s, s, s)
    .shear(0.5, 0, 0, 0, 0, 0)
    .rotateX(Math.PI / 6)
    .translate(w / 2, h / 2, 0);
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      const r = new Ray(new Point(i, j, -10), new Vector(0, 0, 1));
      const hit = sphere.intersect(r).hit();
      if (hit) {
        const gray = (hit.t * 2) / 255;
        c.setAt(i, j, new Color(gray, gray, gray));
      }
    }
  }

  await Deno.writeTextFile("sphere.ppm", c.toPpm());
}
