import {Vector, Point} from "./tuple.ts";

type Projectile = {position: Point, velocity: Vector};
type Env = {gravity: Vector, wind: Vector};

// calculate new position of Point p
function tick(proj: Projectile, env: Env): Projectile {
  const position = proj.position.plus(proj.velocity);
  const velocity = proj.velocity.plus(env.gravity).plus(env.wind);
  return {position: position, velocity: velocity};
}


if (import.meta.main) {
  const env = {gravity: new Vector(0, -0.1, 0),
             wind: new Vector(-0.005, 0, 0.01)}
  let proj = {position: new Point(0,1,0),
              velocity: new Vector(1,1,0).normalize()}

  while (proj.position.y > 0) {
    proj = tick(proj, env);
    console.log(`${proj.position.x} ${proj.position.z} ${Math.max(0, proj.position.y)} `);
  }
}

