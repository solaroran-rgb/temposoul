/**
 * picking.ts —— CPU 拾取：均匀网格空间索引 + 屏幕射线角距最小搜索（B3 L2）
 *
 * 不依赖 three：输入投影后的屏幕星表 + 像素坐标，输出最近星。
 * 阈值随画布尺寸联动（FOV 固定时，容差 px = 屏幕分辨率的固定比例）。
 */
import type { ProjectedStar } from './astro-view';

export interface PickableStar extends ProjectedStar {
  id: number;
}

/** 均匀网格（cellPx 边长），构建一次供多次拾取 */
export class StarPickGrid {
  private cell: number;
  private cols: number;
  private rows: number;
  private buckets: StarPickStar[][] = [];

  constructor(stars: ProjectedStar[], width: number, height: number, cellPx = 28) {
    this.cell = cellPx;
    this.cols = Math.max(1, Math.ceil(width / cellPx));
    this.rows = Math.max(1, Math.ceil(height / cellPx));
    this.buckets = new Array(this.cols * this.rows);
    stars.forEach((s, i) => {
      const c = Math.min(this.cols - 1, Math.max(0, Math.floor(s.x / cellPx)));
      const r = Math.min(this.rows - 1, Math.max(0, Math.floor(s.y / cellPx)));
      const idx = r * this.cols + c;
      if (!this.buckets[idx]) this.buckets[idx] = [];
      this.buckets[idx].push({ ...s, id: i });
    });
  }

  /** 在 (x,y) 像素处找最近星；maxDistPx 为命中阈值 */
  pick(x: number, y: number, maxDistPx: number): StarPickStar | null {
    const cc = Math.floor(x / this.cell);
    const cr = Math.floor(y / this.cell);
    const ring = Math.max(1, Math.ceil(maxDistPx / this.cell));
    let best: StarPickStar | null = null;
    let bestD = maxDistPx;
    for (let dr = -ring; dr <= ring; dr++) {
      for (let dc = -ring; dc <= ring; dc++) {
        const c = cc + dc;
        const r = cr + dr;
        if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) continue;
        const bucket = this.buckets[r * this.cols + c];
        if (!bucket) continue;
        for (const s of bucket) {
          const d = Math.hypot(s.x - x, s.y - y);
          if (d < bestD) {
            bestD = d;
            best = s;
          }
        }
      }
    }
    return best;
  }
}
type StarPickStar = ProjectedStar & { id: number };
