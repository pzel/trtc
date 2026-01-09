
struct tuple {
  float x,y,z,w;
};

struct pool {
  int max;
  int count;
  struct tuple *next;
};
