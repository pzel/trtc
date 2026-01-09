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


#ifdef TEST
#define test(what) (printf("\t%s\n", what));
#define POOL_SIZE 1000

struct tuple buf[POOL_SIZE];

int main() {
  int offset = 0;
  struct pool pool = mk_pool(buf, 1000);

  test("a tuple with w=1.0 is a point") {
    // given
    struct tuple a = {4.3, -4.2, 3.1, 1.0};
    // then
    assert(feq(4.3, a.x));
    assert(feq(-4.2, a.y));
    assert(feq(3.1, a.z));
    assert(feq(1.0, a.w));
    assert(is_point(a));
    assert(!is_vector(a));
  }

  test("a tuple with w=0.0 is a vector") {
    // given
    struct tuple a = {4.3, -4.2, 3.1, 0.0};
    // then
    assert(feq(4.3, a.x));
    assert(feq(-4.2, a.y));
    assert(feq(3.1, a.z));
    assert(feq(0.0, a.w));
    assert(is_vector(a));
    assert(!is_point(a));
  }

  test("mk_point() creates a point in a pool") {
    // given
    struct tuple *point = mk_point(&pool, 4, -4, 3);
    // then
    assert(feq(4.0, point->x));
    assert(feq(-4.0, point->y));
    assert(feq(3., point->z));
    assert(is_point(*point));
  }

  test("mk_point() does not clobber other points in the pool") {
    // given
    struct tuple *point1 = mk_point(&pool, 1, 2, 3);
    struct tuple *point2 = mk_point(&pool, 4, 5, 6);

    // then
    assert(feq(1.0, point1->x));
    assert(feq(4.0, point2->x));
  }

  test("mk_vector() creates a vector in a pool") {
    // given
    struct tuple *vector = mk_vector(&pool, 4, -4, 3);
    // then
    assert(feq(4.0, vector->x));
    assert(feq(-4.0, vector->y));
    assert(feq(3., vector->z));
    assert(is_vector(*vector));
  }

  test("adding two tuples") {
    // given
    struct tuple a = {3, -2, 5, 1};
    struct tuple b = {-2, 3, 1, 0};
    // then
    struct tuple *res = tuple_add(&pool, a, b);
    struct tuple expected = {1,1,6,1};
    assert(tuple_eq(*res, expected));
  }

  test("subtracting two points") {
    // given
    struct tuple a = {3, 2, 1, 1};
    struct tuple b = {5, 6, 7, 1};
    // then
    struct tuple *res = tuple_sub(&pool, a, b);
    struct tuple expected = {-2, -4, -6, 0};
    assert(tuple_eq(*res, expected));
  }

  test("negating a tuple") {
    // given
    struct tuple a = {1, -2, 3, -4};
    // then
    struct tuple *res = tuple_neg(&pool, a);
    struct tuple expected = {-1, 2, -3, 4};
    assert(tuple_eq(*res, expected));
  }

  test("multiplying a tuple by a scalar") {
    // given
    struct tuple a = {1, -2, 3, -4};
    // then
    struct tuple *res = tuple_mul(&pool, a, 3.5);
    struct tuple expected = {3.5, -7, 10.5, -14};
    assert(tuple_eq(*res, expected));
  }

  test("dividing a tuple by a scalar") {
    // given
    struct tuple a = {1, -2, 3, -4};
    // then
    struct tuple *res = tuple_div(&pool, a, 2.0);
    struct tuple expected = {0.5, -1, 1.5, -2};
    assert(tuple_eq(*res, expected));
  }

  test("computing the magnitude of a vector") {
    // given
    struct tuple *vec = mk_vector(&pool, 1,2,3);
    // when
    float res = vector_magnitude(*vec);
    // then
    assert(feq(res, sqrtf(14)));
  }

  test("normalizing vector (4,0,0)") {
    // given
    struct tuple *vec = mk_vector(&pool, 4,0,0);
    // when
    struct tuple *res = vector_normalize(&pool, *vec);
    // then
    struct tuple expected = {1,0,0,0};
    assert(tuple_eq(*res, expected));
  }

  test("normalizing vector (1,2,3)") {
    // given
    struct tuple *vec = mk_vector(&pool, 1,2,3);
    // when
    struct tuple *res = vector_normalize(&pool, *vec);
    // then
    struct tuple expected = {0.26726, 0.53452, 0.80178, 0};
    assert(tuple_eq(*res, expected));
  }

  test("magnitude of normalized vector is 1") {
    // given
    struct tuple *vec = mk_vector(&pool, 12,243,33);
    // when
    struct tuple *res = vector_normalize(&pool, *vec);
    // then
    assert(feq(vector_magnitude(*res), 1.0));
  }




  /*
  test("mk_vector() will crash if pool is exhausted") {
    // given
    for (int i = 0; i < POOL_SIZE+1; i++) {
      mk_vector(&pool, 4, -4, 3);
    }
    // then
    // this should never hit
    assert(0);
  }
  */


  printf("All tests passed\n");

}
#else
int main() {
  printf("MAIN\n");
}
#endif
