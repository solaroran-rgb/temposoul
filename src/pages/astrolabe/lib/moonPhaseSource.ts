// T-15C · C2 月相双轨统一真值源
// 双轨：core 优先（@temposoul/core/calendar · calculateMoonPhaseEvidence，celestine 星历），
//       core 不可用（动态 import chunk 失败 / 计算抛错 / 年份越界 1900-2200）时显式降级回本地纯前端近似。
// 说明：core 月相能力位底层为 celestine 纯 JS 星历（非 @swisseph WASM），无异步星历加载；
//       “core 不可用”在前端表现为 chunk 加载失败或计算异常，与 S-5 WASM 未加载/加载失败/超时同构——均走同一 fallback 分支。

const SYNODIC = 29.530588853;
const REF_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC 新月参考点

export type MoonTrack = 'core' | 'approx';

export interface MoonPoint {
  /** 朔望相位小数 0..1 */
  frac: number;
  /** 八相索引 0..7（与页面 PHASES 顺序一致） */
  idx: number;
  /** 照度百分比 0..100 */
  illumPct: number;
  /** 真值源轨：core 星历 / 本地近似降级 */
  track: MoonTrack;
}

/** core 月相证据（只取本页需要的两个字段，其余证据链不消费） */
export interface CoreMoonPhaseFn {
  (utcTimestamp: number): {
    phaseAngleDegrees: number;
    illuminationPercent: number;
  };
}

// ---- 本地近似轨（原 MoonPhasePage 自带的纯前端天文近似，精度约 ±1 天） ----

function julianDate(d: Date): number {
  // 以当地正午为基准，规避跨日边界
  const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  return noon.getTime() / 86400000 + 2440587.5;
}

export function phaseFraction(d: Date): number {
  const jd = julianDate(d);
  let p = ((jd - REF_NEW_MOON_JD) % SYNODIC) / SYNODIC;
  if (p < 0) p += 1;
  return p;
}

function illumination(frac: number): number {
  return (1 - Math.cos(2 * Math.PI * frac)) / 2;
}

export function phaseIndexOf(frac: number): number {
  return Math.floor(frac * 8) % 8;
}

/** 本地近似降级点（同步，永不抛错——作为兜底真值源必须稳） */
export function approxPoint(d: Date): MoonPoint {
  const frac = phaseFraction(d);
  return {
    frac,
    idx: phaseIndexOf(frac),
    illumPct: Math.round(illumination(frac) * 100),
    track: 'approx',
  };
}

// ---- core 星历轨（渐进式动态加载，模块级 promise 缓存，失败即作废缓存） ----

let coreModulePromise: Promise<unknown> | null = null;

async function loadCoreModule(): Promise<unknown> {
  if (!coreModulePromise) {
    coreModulePromise = import('@temposoul/core/calendar')
      .then((mod) => mod)
      .catch((err) => {
        coreModulePromise = null; // 失败作废缓存，下次可重试
        throw err;
      });
  }
  return coreModulePromise;
}

/**
 * 加载 core 月相能力位计算函数。
 * 成功返回绑定函数；任何失败（chunk 加载失败 / 模块无此导出 / 运行期异常）返回 null，由调用方走 approx 降级。
 */
export async function loadMoonPhaseCoreFn(): Promise<CoreMoonPhaseFn | null> {
  try {
    const mod = (await loadCoreModule()) as Record<string, unknown>;
    const fn = mod?.calculateMoonPhaseEvidence;
    if (typeof fn !== 'function') return null;
    return fn as CoreMoonPhaseFn;
  } catch {
    return null;
  }
}

/** 用 core 函数计算单点；计算抛错（年份越界/求根失败）时返回 null，触发降级。 */
export function corePointFromFn(fn: CoreMoonPhaseFn, d: Date): MoonPoint | null {
  try {
    const ev = fn(d.getTime());
    if (!ev || !Number.isFinite(ev.phaseAngleDegrees) || !Number.isFinite(ev.illuminationPercent)) {
      return null;
    }
    const angle = ((ev.phaseAngleDegrees % 360) + 360) % 360;
    const frac = angle / 360;
    // 与 core 内部八分相位一致的 22.5° 边界，保证与 core 证据自洽
    const idx = Math.floor(((angle + 22.5) % 360) / 45) % 8;
    return {
      frac,
      idx,
      illumPct: Math.round(ev.illuminationPercent),
      track: 'core',
    };
  } catch {
    return null;
  }
}
