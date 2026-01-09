#ifndef TRACER
#define TRACER 1

struct tuple {
  float x,y,z,w;
};

struct pool {
  int max;
  int count;
  struct tuple *next;
};

int is_vector(struct tuple t);
int is_point(struct tuple t);
void tuple_print(struct tuple t);
int tuple_eq(struct tuple t1, struct tuple t2);
struct pool mk_pool(struct tuple *arr, int size);
struct tuple * mk_tuple(struct pool *p, float x, float y, float z, float w);
struct tuple * mk_point(struct pool *p, float x, float y, float z);
struct tuple * mk_vector(struct pool *p, float x, float y, float z);
struct tuple *  tuple_add(struct pool *p, struct tuple t1, struct tuple t2);
struct tuple *  tuple_sub(struct pool *p, struct tuple t1, struct tuple t2);
struct tuple * tuple_neg(struct pool *p, struct tuple t1);
struct tuple * tuple_mul(struct pool *p, struct tuple t1, float multiplicand);
struct tuple * tuple_div(struct pool *p, struct tuple t1, float divisor);
float vector_magnitude(struct tuple t);
struct tuple * vector_normalize(struct pool *p, struct tuple v);
#endif
