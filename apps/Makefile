.PHONY: traj
traj: trajectory.png
	ristretto $^

trajectory.ppm: trajectory.ts
	deno run --allow-write="$@" ./$^

trajectory.png: trajectory.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null

.PHONY: c
c: clock.png
	ristretto $^

clock.ppm: clock.ts
	deno run --allow-write="$@" ./$^

clock.png: clock.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null

clean:
	rm -f *.png
	rm -f *.ppm

