.PHONY: t c

t: trajectory.png
	@ristretto $^ 2>/dev/null

c: clock.png
	@ristretto $^ 2>/dev/null

%.ppm: %.ts
	rm -f "$@"
	deno run --allow-write="$@" ./$^

%.png: %.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null

clean:
	rm -f *.png
	rm -f *.ppm

