export { assert, assertEquals, assertStrictEquals } from "@std/assert";
export { describe, it } from "@std/testing/bdd";

import { EPSILON } from "./float.ts";
import { assert, assertAlmostEquals } from "@std/assert";

export function assertFloatEquals(
  a: number | undefined,
  b: number | undefined,
) {
  assert(a);
  assert(b);
  assertAlmostEquals(a, b, EPSILON);
}
