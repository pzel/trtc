#ifndef TRACER
#define TRACER 1

struct tuple {
  float x,y,z,w;
};

struct color {
  float r,g,b;
};

struct canvas {
  int width, height;
  struct color *pixels;
};

struct tuple_pool {
  int max;
  int count;
  struct tuple *next;
};

struct color_pool {
  int max;
  int count;
  struct color *next;
};

struct tuple_pool mk_tuple_pool(struct tuple *arr, int size);
struct color_pool mk_color_pool(struct color *arr, int size);
struct canvas mk_canvas(struct color_pool *p, int width, int height);
int is_vector(struct tuple t);
int is_point(struct tuple t);
void tuple_print(struct tuple t);
void color_print(struct color c);
int tuple_eq(struct tuple t1, struct tuple t2);
int color_eq(struct color c1, struct color c2);
float dot(struct tuple t1, struct tuple t2);
struct tuple * cross(struct tuple_pool *p, struct tuple t1, struct tuple t2);

struct color * pixel_at(struct canvas, int x, int y);

struct color * mk_color(struct color_pool *p, float r, float g, float b);
struct tuple * mk_tuple(struct tuple_pool *p, float x, float y, float z, float w);
struct tuple * mk_point(struct tuple_pool *p, float x, float y, float z);
struct tuple * mk_vector(struct tuple_pool *p, float x, float y, float z);

struct color * color_add(struct color_pool *p, struct color c1, struct color c2);
struct color * color_sub(struct color_pool *p, struct color c1, struct color c2);
struct color * color_mul(struct color_pool *p, struct color c1, float f);
struct color * color_hadamard(struct color_pool *p, struct color c1, struct color c2);

struct tuple * tuple_add(struct tuple_pool *p, struct tuple t1, struct tuple t2);
struct tuple * tuple_sub(struct tuple_pool *p, struct tuple t1, struct tuple t2);
struct tuple * tuple_neg(struct tuple_pool *p, struct tuple t1);
struct tuple * tuple_mul(struct tuple_pool *p, struct tuple t1, float multiplicand);
struct tuple * tuple_div(struct tuple_pool *p, struct tuple t1, float divisor);

float vector_magnitude(struct tuple t);
struct tuple * vector_normalize(struct tuple_pool *p, struct tuple v);

#endif
