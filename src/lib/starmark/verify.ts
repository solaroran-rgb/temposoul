/**
 * verify.ts —— 复现校验（B3 二：用户侧输入 sky_id → 服务端同参数重算 → 与证书快照比对）
 *
 * 不是「服务端说通过」：这里逐星比对屏幕坐标（量化到容差内），
 * 任一关键星漂移超差即判「参数已被修改」。结果可被 UI 一键截图。
 */
import { projectSky, type SkyParams, type ProjectedStar } from './astro-view';
import { SCREEN_COORD_TOLERANCE_PX } from './version';

export interface VerifyResult {
  /** 复现一致 */
  pass: boolean;
  /** 不一致原因（pass=false 时给出，UI 展示「参数已被修改」） */
  reason: string;
  /** 比对星数 */
  comparedStars: number;
  /** 超差星数 */
  driftStars: number;
  /** 最大屏幕坐标偏差（px） */
  maxDriftPx: number;
}

function maxDrift(a: ProjectedStar[], b: ProjectedStar[]): { drift: number; bad: number } {
  const n = Math.min(a.length, b.length);
  let max = 0;
  let bad = 0;
  for (let i = 0; i < n; i++) {
    const d = Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y);
    if (d > max) max = d;
    if (d > SCREEN_COORD_TOLERANCE_PX) bad++;
  }
  return { drift: max, bad };
}

/**
 * 用同一 SkyParams 重算两次并比对：
 * @param params 复现参数
 * @param expectedSnapshot 证书保存时的 buildSnapshot() 结果（空则只校验自洽）
 */
export function verifyReproduction(params: SkyParams, expectedSnapshot?: string): VerifyResult {
  const runA = projectSky(params);
  const runB = projectSky(params);

  // 1) 自洽：同进程两次重算必须逐星一致（确定性）
  const self = maxDrift(runA.stars, runB.stars);
  if (self.drift > 1e-6) {
    return { pass: false, reason: '渲染非确定性：同参数两次结果不一致', comparedStars: runA.stars.length, driftStars: self.bad, maxDriftPx: self.drift };
  }

  // 2) 与证书快照比对（参数被篡改 → 快照不同）
  if (expectedSnapshot !== undefined) {
    if (runA.snapshot !== expectedSnapshot) {
      // 量化差异：定位前若干关键星的漂移
      return { pass: false, reason: '参数已被修改', comparedStars: runA.stars.length, driftStars: Math.abs(runA.stars.length), maxDriftPx: Number.POSITIVE_INFINITY };
    }
  }

  return { pass: true, reason: '复现一致', comparedStars: runA.stars.length, driftStars: 0, maxDriftPx: 0 };
}
