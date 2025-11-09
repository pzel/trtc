import { Sphere } from "../sphere.ts";
import { Ray } from "../ray.ts";

import { Point, Vector } from "../tuple.ts";
import { Canvas } from "../canvas.ts";
import { Color } from "../color.ts";
import { PointLight } from "../light.ts";

if (import.meta.main) {
  const canvasPixels = 100;
  const c = new Canvas(canvasPixels, canvasPixels);

  const wallSize = 8;
  const half = wallSize / 2;
  const pixelSize = wallSize / canvasPixels; // 0.08?
  const rayOrigin = new Point(0, 0, -5);
  const wallZ = 10;

  const sphere = new Sphere();
  sphere.material.color = new Color(0.2, 0.7, 0.9);

  const light = new PointLight(new Point(-10, 10, -10));

  for (let y = 0; y < canvasPixels; y++) {
    const worldY = half - (pixelSize * y);
    for (let x = 0; x < canvasPixels; x++) {
      const worldX = half - (pixelSize * x);

      const positionOnWall = new Point(worldX, worldY, wallZ);
      const r = new Ray(rayOrigin, positionOnWall.minus(rayOrigin).normalize());
      const hit = sphere.intersect(r).hit();
      if (hit) {
        const hitPoint: Point = r.position(hit.t);
        const normalv: Vector = hit.object.normalAt(hitPoint);
        const eyev: Vector = r.direction.negate();
        const color = hit.object.material.lighting(
          light,
          hitPoint,
          eyev,
          normalv,
        );
        c.setAt(x, y, color);
      }
    }
  }
  await Deno.writeTextFile("sphere.ppm", c.toPpm());
}
