#include <math.h>
#include "feq.h"

int feq(float a, float b) {
  return (fabs(a-b) < EPSILON);
}
