import { Sphere } from "../sphere.ts";
import { Ray } from "../ray.ts";

import { Point, Vector } from "../tuple.ts";
import { Canvas } from "../canvas.ts";
import { Color } from "../color.ts";
import { Matrix } from "../matrix.ts";

if (import.meta.main) {
  const canvasPixels = 100;
  const c = new Canvas(canvasPixels, canvasPixels);

  const wallSize = 8;
  const half = wallSize / 2;
  const pixelSize = wallSize / canvasPixels; // 0.08?
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;

  const sphere = new Sphere();
  sphere.transform = Matrix.identity();
  //    .translate(canvasPixels / 2, canvasPixels / 2, 0);

  for (let y = 0; y < canvasPixels - 1; y++) {
    const worldY = half - (pixelSize * y);
    for (let x = 0; x < canvasPixels - 1; x++) {
      const worldX = half - (pixelSize * x);

      const positionOnWall = new Point(worldX, worldY, wallZ);
      const r = new Ray(rayOrigin, positionOnWall.minus(rayOrigin).normalize());
      const hit = sphere.intersect(r).hit();
      if (hit) {
        const gray = 1 - (hit.t / 7.0);
        c.setAt(x, y, new Color(gray, gray, gray));
      }
    }
  }

  await Deno.writeTextFile("sphere.ppm", c.toPpm());
}
