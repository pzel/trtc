import { Color } from "./color.ts";
export class Canvas {
  width: number;
  height: number;
  buf: Array<Array<Color>>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const buf = new Array(width);
    const black = new Color(0, 0, 0);
    for (let i = 0; i < width; i++) {
      const tmp = new Array(height);
      for (let j = 0; j < height; j++) {
        tmp[j] = black;
      }
      buf[i] = tmp;
    }
    this.buf = buf;
  }

  at(x: number, y: number): Color {
    return this.buf[x][y];
  }

  setAt(x: number, y: number, c: Color) {
    this.buf[x][y] = c;
  }

  toPpm(): string {
    const buf: Array<string> = [];
    buf.push("P3");
    buf.push(`${this.width} ${this.height}`);
    buf.push("255");
    for (let j = 0; j < this.height; j++) {
      let row: Array<string> = [];
      for (let i = 0; i < this.width; i++) {
        const [r, g, b] = this.at(i, j).toRgb();
        const nextEntry = `${r} ${g} ${b}`;
        if (row.length * 12 + nextEntry.length > 70) {
          buf.push(row.join(" "));
          row = [];
        }
        row.push(nextEntry);
      }
      buf.push(row.join(" "));
    }
    return buf.join("\n") + "\n";
  }
}
