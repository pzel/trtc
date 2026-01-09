CC := tcc
.PHONY: build clean test unit

test: tracer.o feq.o test.c
	$(CC) $^ -lm -DTEST -o $@ && ./$@

clean:
	rm -f *.o
	rm -f a.out
