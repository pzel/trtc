.PHONY: test traj

test:
	deno test "$t"

traj: trajectory.png
	ristretto $^

trajectory.ppm: trajectory.ts
	deno run --allow-write="$@" ./$^

trajectory.png: trajectory.ppm
	rm -f "$@"
	ffmpeg -i "$^" "$@" 2>/dev/null

