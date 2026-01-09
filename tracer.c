#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <math.h>
#include "tracer.h"
#include "feq.h"

int
is_point(struct tuple t) {
  return (feq(t.w, 1.0));
}

int
is_vector(struct tuple t) {
  return (feq(t.w, 0.0));
}

void
tuple_print(struct tuple t) {
  printf("(%f,%f,%f,%f)\n", t.x, t.y,t.z,t.w);
}

int
tuple_eq(struct tuple t1, struct tuple t2) {
  return (feq(t1.x, t2.x) &&
          feq(t1.y, t2.y) &&
          feq(t1.z, t2.z) &&
          feq(t1.w, t2.w));
}

struct pool
mk_pool(struct tuple *arr, int size) {
  struct pool p = {.max=size, .count=0, .next=arr};
  return p;
}

struct tuple *
mk_tuple(struct pool *p, float x, float y, float z, float w) {
  struct tuple *this = p->next;
  this->x = x;
  this->y = y;
  this->z = z;
  this->w = w;
  p->count++;
  p->next++;
  assert(p->count < p->max);
  return this;
}

struct tuple *
mk_point(struct pool *p, float x, float y, float z) {
  return(mk_tuple(p, x, y, z, 1));
}

struct tuple *
mk_vector(struct pool *p, float x, float y, float z) {
  return(mk_tuple(p, x, y, z, 0));
}

struct tuple *
tuple_add(struct pool *p, struct tuple t1, struct tuple t2) {
  return mk_tuple(p, t1.x + t2.x, t1.y + t2.y, t1.z + t2.z, t1.w + t2.w);
}

struct tuple *
tuple_sub(struct pool *p, struct tuple t1, struct tuple t2) {
  return mk_tuple(p, t1.x - t2.x, t1.y - t2.y, t1.z - t2.z, t1.w - t2.w);
}

struct tuple *
tuple_neg(struct pool *p, struct tuple t1) {
  return mk_tuple(p, -t1.x, -t1.y, -t1.z, -t1.w);
}

struct tuple *
tuple_mul(struct pool *p, struct tuple t1, float multiplicand) {
  return mk_tuple(p, t1.x * multiplicand, t1.y * multiplicand, t1.z * multiplicand, t1.w * multiplicand);
}

struct tuple *
tuple_div(struct pool *p, struct tuple t1, float divisor) {
  return tuple_mul(p, t1, 1 / divisor);
}

float
vector_magnitude(struct tuple t) {
  return sqrtf(pow(t.x, 2) + pow(t.y, 2) + pow(t.z, 2) + pow(t.w, 2));
}

struct tuple *
vector_normalize(struct pool *p, struct tuple v) {
  float m = vector_magnitude(v);
  return mk_tuple(p, v.x / m, v.y /m , v.z/m , v.w/m);
}
