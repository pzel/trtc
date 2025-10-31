import { Color } from "./color.ts";
export class Canvas {
  width: number;
  height: number;
  buf: Array<Array<Color>>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const buf = new Array(width);
    for (let i = 0; i < width; i++) {
      const tmp = new Array(height);
      for (let j = 0; j < height; j++) {
        tmp[j] = new Color(0, 0, 0);
      }
      buf[i] = tmp;
    }
    this.buf = buf;
  }

  pixelAt(x: number, y: number): Color {
    return this.buf[x][y];
  }

  setPixelAt(x: number, y: number, c: Color) {
    this.buf[x][y] = c;
  }
}
