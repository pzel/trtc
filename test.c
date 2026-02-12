#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <math.h>
#include "tracer.h"
#include "feq.h"

#define test(what) (printf("\t%s\n", what));
#define POOL_SIZE 1000

struct tuple tuple_buf[POOL_SIZE];
struct color color_buf[POOL_SIZE];

int main() {
  int offset = 0;
  struct tuple_pool pool = mk_tuple_pool(tuple_buf, POOL_SIZE);
  struct color_pool cpool = mk_color_pool(color_buf, POOL_SIZE);

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

  test("dot product of two tuples") {
    // given
    struct tuple a = {1, 2, 3, 0};
    struct tuple b = {2, 3, 4, 0};
    // then
    assert(feq(dot(a, b), 20.0));
  }

  test("cross product of two tuples") {
    // given
    struct tuple a = {1, 2, 3, 0};
    struct tuple b = {2, 3, 4, 0};
    // when
    struct tuple *res1 = cross(&pool,a,b);
    struct tuple *res2 = cross(&pool,b,a);
    // then
    struct tuple exp1 = {-1, 2, -1, 0};
    struct tuple exp2 = { 1, -2, 1, 0};
    assert(tuple_eq(*res1, exp1));
    assert(tuple_eq(*res2, exp2));
  }

 test("colors can be added") {
   // given
   struct color c1 = {.r = 0.9, .g = 0.6, .b = 0.75 };
   struct color c2 = {.r = 0.7, .g = 0.1, .b = 0.25 };
   // when
   struct color *res = color_add(&cpool, c1, c2);
   // then
   struct color exp = {1.6, 0.7, 1.0};
   assert(color_eq(*res, exp));
 }

 test("colors can be subtracted") {
   // given
   struct color c1 = {.r = 0.9, .g = 0.6, .b = 0.75 };
   struct color c2 = {.r = 0.7, .g = 0.1, .b = 0.25 };
   // when
   struct color *res = color_sub(&cpool, c1, c2);
   // then
   struct color exp = {0.2, 0.5, 0.5};
   assert(color_eq(*res, exp));
 }

 test("colors can be multiplied by a scalar") {
   // given
   struct color c1 = {.r = 0.2, .g = 0.3, .b = 0.4 };
   // when
   struct color *res = color_mul(&cpool, c1, 2);
   // then
   struct color exp = {0.4, 0.6, 0.8};
   assert(color_eq(*res, exp));
 }

 test("colors can be multiplied together") {
   // given
   struct color c1 = {.r = 1, .g = 0.2, .b = 0.4 };
   struct color c2 = {.r = 0.9, .g = 1, .b = 0.1 };
   // when
   struct color *res = color_hadamard(&cpool, c1, c2);
   // then
   struct color exp = {0.9, 0.2, 0.04};
   assert(color_eq(*res, exp));
 }

 test("a canvas can be created") {
   int width, height;
   width = 2;
   height = 2;
   struct color exp = {0.9, 0.2, 0.04};
   struct color *current_pixel;
   // when
   struct canvas res = mk_canvas(&cpool, width, height);
   // then
   assert(res.width == width);
   assert(res.height == height);

   for (int i = 0; i< width; i++) {
     for (int j = 0; j< height; j++) {
       current_pixel = pixel_at(res, i,j);
       printf("%x: %d,%d", current_pixel, i, j);
       color_print(*current_pixel);
     }
   }
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
