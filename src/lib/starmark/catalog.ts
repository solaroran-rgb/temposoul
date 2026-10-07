/**
 * catalog.ts —— 星表/星座线的类型化访问层（对齐 A5 src/lib/sky 既有资产，不复制数据）
 *
 * 一致性锚定：L1 与 L2 必须 import 这里，而不是各自再读 stars.data，
 *           保证「同一星表版本」这一条成立（B3 三、数据层）。
 *
 * 数据实形（见 src/lib/sky/stars.data.ts 头注释）：
 *   STAR_DATA: interleaved Float32Array，每星 [ra(rad), dec(rad), mag, ci(B-V)]，J2000
 *   CONSTELLATION_SEGMENTS: number[][]，每段 [ra1(deg),dec1(deg),ra2(deg),dec2(deg)]，J2000
 *
 * 注意单位不一致（星表是弧度、星座线是度）在本层统一处理。
 */
import { STAR_DATA, STAR_COUNT } from '../sky/stars.data';
import { CONSTELLATION_SEGMENTS } from '../sky/constellations.data';
import { DEG } from '../sky/astro';

export interface StarRec {
  /** J2000 赤经（弧度） */
  ra: number;
  /** J2000 赤纬（弧度） */
  dec: number;
  /** V 星等（越小越亮） */
  mag: number;
  /** B-V 色指数 */
  ci: number;
}

/** 遍历全部星（只读，不拷贝）。上层需要就地岁差时自行 slice()。 */
export function iterStars(cb: (s: StarRec, i: number) => void): void {
  for (let i = 0; i < STAR_COUNT; i++) {
    const o = i * 4;
    cb(
      { ra: STAR_DATA[o], dec: STAR_DATA[o + 1], mag: STAR_DATA[o + 2], ci: STAR_DATA[o + 3] },
      i,
    );
  }
}

/** 拷贝一份 interleaved 数据（供岁差就地变换；避免污染源数据保证可复现） */
export function copyStarData(): Float32Array {
  return STAR_DATA.slice();
}

export function starCount(): number {
  return STAR_COUNT;
}

/** 星座线（统一转弧度后返回）。每段 {ra1,dec1,ra2,dec2} 弧度 J2000 */
export interface ConstellSeg {
  ra1: number;
  dec1: number;
  ra2: number;
  dec2: number;
}
export function constellationSegmentsRad(): ConstellSeg[] {
  const out: ConstellSeg[] = [];
  for (const seg of CONSTELLATION_SEGMENTS) {
    out.push({
      ra1: seg[0] * DEG,
      dec1: seg[1] * DEG,
      ra2: seg[2] * DEG,
      dec2: seg[3] * DEG,
    });
  }
  return out;
}

/** 最亮的 n 颗星（用于 BrightStarFlares / 关键星校验基准） */
export function brightestStars(n: number): StarRec[] {
  const all: StarRec[] = [];
  iterStars((s) => all.push({ ...s }));
  all.sort((a, b) => a.mag - b.mag);
  return all.slice(0, n);
}
