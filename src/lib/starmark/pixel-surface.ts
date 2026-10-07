/**
 * pixel-surface.ts —— 纯软件 RGBA 像素缓冲（确定性 L1 降级后端）
 *
 * 为什么需要它：@napi-rs/canvas 是 L1 主路径（画 CJK 文字/抗锯齿），
 * 但在无头/CI/未装原生依赖时，用本软件后端也能确定性产出星点+星座线+地平线，
 * 保证「同参数逐像素一致」与测试可离线运行。文字层仅 napi 后端支持。
 *
 * 本类不依赖 DOM，可在 node:test 直接跑。
 */
import { PNG } from 'pngjs';

export class PixelSurface {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }

  /** 不透明填充 */
  fill(r: number, g: number, b: number): void {
    const d = this.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  }

  /** 垂直渐变（顶部 c0 -> 底部 c1） */
  verticalGradient(c0: [number, number, number], c1: [number, number, number]): void {
    for (let y = 0; y < this.height; y++) {
      const t = y / (this.height - 1);
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * t);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * t);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * t);
      for (let x = 0; x < this.width; x++) {
        const o = (y * this.width + x) * 4;
        this.data[o] = r;
        this.data[o + 1] = g;
        this.data[o + 2] = b;
        this.data[o + 3] = 255;
      }
    }
  }

  /** alpha 混合一个像素 */
  private blendPx(x: number, y: number, r: number, g: number, b: number, a: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const o = (y * this.width + x) * 4;
    const ia = 1 - a;
    this.data[o] = Math.round(r * a + this.data[o] * ia);
    this.data[o + 1] = Math.round(g * a + this.data[o + 1] * ia);
    this.data[o + 2] = Math.round(b * a + this.data[o + 2] * ia);
  }

  /** 实心圆点（亮度加权） */
  fillCircle(cx: number, cy: number, radius: number, r: number, g: number, b: number, a: number): void {
    const x0 = Math.max(0, Math.floor(cx - radius));
    const x1 = Math.min(this.width - 1, Math.ceil(cx + radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const y1 = Math.min(this.height - 1, Math.ceil(cy + radius));
    const rr = radius * radius;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= rr) this.blendPx(x, y, r, g, b, a);
      }
    }
  }

  /** 粗线段（星座连线，Bresenham 近似 + 1px 宽） */
  drawLine(x1: number, y1: number, x2: number, y2: number, r: number, g: number, b: number, a: number): void {
    let x = Math.round(x1);
    let y = Math.round(y1);
    const xe = Math.round(x2);
    const ye = Math.round(y2);
    const dx = Math.abs(xe - x);
    const dy = -Math.abs(ye - y);
    const sx = x < xe ? 1 : -1;
    const sy = y < ye ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.blendPx(x, y, r, g, b, a);
      if (x === xe && y === ye) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
  }

  /** 导出 PNG buffer（确定性：同像素缓冲 -> 同字节） */
  toPng(): Buffer {
    const png = new PNG({ width: this.width, height: this.height });
    // 拷贝（pngjs data 是 Buffer）
    for (let i = 0; i < this.data.length; i++) png.data[i] = this.data[i];
    return PNG.sync.write(png) as unknown as Buffer;
  }
}
