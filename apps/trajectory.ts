import { Point, Vector } from "../tuple.ts";
import { Canvas } from "../canvas.ts";
import { Color } from "../color.ts";

type Projectile = { position: Point; velocity: Vector };
type Env = { gravity: Vector; wind: Vector };

// calculate new position of Point p
function tick(proj: Projectile, env: Env): Projectile {
  const position = proj.position.plus(proj.velocity);
  const velocity = proj.velocity.plus(env.gravity).plus(env.wind);
  return { position: position, velocity: velocity };
}

if (import.meta.main) {
  const env = {
    gravity: new Vector(0, -0.1, 0),
    wind: new Vector(-0.01, 0, 0.0),
  };
  let proj = {
    position: new Point(1, 1, 0),
    velocity: new Vector(1, 1, 0).normalize().times(2.5),
  };
  const c = new Canvas(64, 64);
  const point = new Color(1, 1, 1);
  while (proj.position.y > 0) {
    proj = tick(proj, env);
    c.setAt(
      Math.round(proj.position.x),
      Math.round(c.height - proj.position.y),
      point,
    );
  }
  await Deno.writeTextFile("trajectory.ppm", c.toPpm());
}
