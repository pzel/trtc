CC := tcc
.PHONY: build clean test unit

test: tracer.c feq.o
	$(CC) $^ -lm -DTEST -o $@ && ./$@

clean:
	rm -f *.o
	rm -f a.out
