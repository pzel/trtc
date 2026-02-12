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

void
color_print(struct color c) {
  printf("color {r: %f, g: %f, b: %f}\n", c.r,c.g, c.b);
}


int
tuple_eq(struct tuple t1, struct tuple t2) {
  return (feq(t1.x, t2.x) &&
          feq(t1.y, t2.y) &&
          feq(t1.z, t2.z) &&
          feq(t1.w, t2.w));
}

int
color_eq(struct color c1, struct color c2) {
  return (feq(c1.r, c2.r) &&
          feq(c1.g, c2.g) &&
          feq(c1.b, c2.b));
}


float
dot(struct tuple t1, struct tuple t2) {
  assert(is_vector(t1) && is_vector(t2));
  return (t1.x * t2.x +
          t1.y * t2.y +
          t1.z * t2.z +
          t1.w * t2.w);
}

struct tuple *
cross(struct tuple_pool *p, struct tuple t1, struct tuple t2) {
  assert(is_vector(t1) && is_vector(t2));
  return mk_vector(p, t1.y * t2.z - t1.z * t2.y,
                   t1.z * t2.x - t1.x * t2.z,
                   t1.x * t2.y - t1.y * t2.x);
}

struct canvas
mk_canvas(struct color_pool *cpool, int width, int height) {
  /* We won't use pools for canvases, since there's usually just one in a
     given program */
  int size = width * height;
  struct color *start = malloc(size);
  struct color *current = start;
  for (int i = 0; i < size; i++) {
    printf("Start %x, Current %x (size: %d)\n", start, current, size);
    *current = *mk_color(cpool, i+1,i+1,i+1);
    color_print(*current);
    current++;
  }
  struct canvas result = {.width = width, .height = height, .pixels = start};
  return result;
}

struct color *
pixel_at(struct canvas canvas, int x, int y) {
  struct color *offset = (canvas.pixels)+(canvas.width*y+x);
  return offset;
}

struct tuple_pool
mk_tuple_pool(struct tuple *arr, int size) {
  struct tuple_pool p = {.max=size, .count=0, .next=arr};
  return p;
}

struct color_pool
mk_color_pool(struct color *arr, int size) {
  struct color_pool p = {.max=size, .count=0, .next=arr};
  return p;
}

struct tuple *
mk_tuple(struct tuple_pool *p, float x, float y, float z, float w) {
  struct tuple *this = p->next;
  this->x = x; this->y = y; this->z = z; this->w = w;
  p->count++;
  p->next++;
  assert(p->count < p->max);
  return this;
}

struct color *
mk_color(struct color_pool *p, float r, float g, float b) {
  struct color *this = p->next;
  this->r = r; this->g = g; this->b = b;
  p->count++;
  p->next++;
  assert(p->count < p->max);
  return this;
}

struct tuple *
mk_point(struct tuple_pool *p, float x, float y, float z) {
  return(mk_tuple(p, x, y, z, 1));
}

struct tuple *
mk_vector(struct tuple_pool *p, float x, float y, float z) {
  return(mk_tuple(p, x, y, z, 0));
}

struct color *
color_add(struct color_pool *p, struct color c1, struct color c2) {
  return mk_color(p, c1.r + c2.r, c1.g + c2.g, c1.b + c2.b);
}

struct color *
color_sub(struct color_pool *p, struct color c1, struct color c2) {
  return mk_color(p, c1.r - c2.r, c1.g - c2.g, c1.b - c2.b);
}

struct color *
color_mul(struct color_pool *p, struct color c1, float f) {
  return mk_color(p, c1.r * f, c1.g *f, c1.b * f);
}

struct color *
color_hadamard(struct color_pool *p, struct color c1, struct color c2){
  return mk_color(p, c1.r * c2.r, c1.g * c2.g, c1.b * c2.b);
}

struct tuple *
tuple_add(struct tuple_pool *p, struct tuple t1, struct tuple t2) {
  return mk_tuple(p, t1.x + t2.x, t1.y + t2.y, t1.z + t2.z, t1.w + t2.w);
}

struct tuple *
tuple_sub(struct tuple_pool *p, struct tuple t1, struct tuple t2) {
  return mk_tuple(p, t1.x - t2.x, t1.y - t2.y, t1.z - t2.z, t1.w - t2.w);
}

struct tuple *
tuple_neg(struct tuple_pool *p, struct tuple t1) {
  return mk_tuple(p, -t1.x, -t1.y, -t1.z, -t1.w);
}

struct tuple *
tuple_mul(struct tuple_pool *p, struct tuple t1, float multiplicand) {
  return mk_tuple(p, t1.x * multiplicand, t1.y * multiplicand, t1.z * multiplicand, t1.w * multiplicand);
}

struct tuple *
tuple_div(struct tuple_pool *p, struct tuple t1, float divisor) {
  return tuple_mul(p, t1, 1 / divisor);
}

float
vector_magnitude(struct tuple v) {
  assert(is_vector(v));
  return sqrtf(pow(v.x, 2) + pow(v.y, 2) + pow(v.z, 2) + pow(v.w, 2));
}

struct tuple *
vector_normalize(struct tuple_pool *p, struct tuple v) {
  assert(is_vector(v));
  float m = vector_magnitude(v);
  return mk_tuple(p, v.x / m, v.y /m , v.z/m , v.w/m);
}

