.PHONY: test traj c clean

test:
	deno test "$t"

clean:
	rm -f *.png
	rm -f *.ppm

traj: trajectory.png
	ristretto $^

trajectory.ppm: trajectory.ts
	deno run --allow-write="$@" ./$^

trajectory.png: trajectory.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null


c: clock.png
	ristretto $^

clock.ppm: clock.ts
	deno run --allow-write="$@" ./$^

clock.png: clock.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null

