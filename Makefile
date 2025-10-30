.PHONY: test traj

test:
	deno test

traj: trajectory.png
	feh $^

trajectory.dat: trajectory.ts
	deno run ./$^ > $@

trajectory.png: trajectory.dat
	gnuplot -e 'set term png; set output "$@" ; splot "$^"; show output'

