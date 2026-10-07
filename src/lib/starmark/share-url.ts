/**
 * share-url.ts —— URL 复现 / 参数快照（B3 2.4 参数化复现 + P13 隐私对外链接）
 *
 * 双口径（B3 P13 冻结）：
 *  - 复现参数路径 `/starmark/sky/{utc}/{lat}/{lng}/{dir}`：同 URL 任何人打开复现同一片星空
 *    （参数可复现 = 硬性验收）。紧凑 UTC = YYYYMMDDTHHmmssZ，与基础版深链口径一致。
 *  - 对外分享链接 `/starmark/sky/{certId}`：P13 隐私，只放 certId，不入经纬度/称谓。
 *
 * 纯函数；经纬度复用 skyId.normalizeSkyParams 的 6 位小数规范化，保证与 sky_id 同口径。
 */
import type { ObservationPoint } from './presets';
import { normalizeSkyParams } from './skyId';

const COMPACT_UTC_RE = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/;

/** unixMs → 紧凑 UTC 串 YYYYMMDDTHHmmssZ */
export function formatCompactUtc(unixMs: number): string {
  const d = new Date(unixMs);
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

/** 紧凑 UTC 串 → unixMs；格式非法抛错（不静默回退，防参数被悄悄改错） */
export function parseCompactUtc(s: string): number {
  const m = COMPACT_UTC_RE.exec(s);
  if (!m) throw new Error(`bad compact utc: ${s}`);
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

/**
 * 复现参数路径（含经纬度；用于「URL 复现 / 参数快照」验收）。
 * 经纬度取规范化 6 位小数，方向取整，与 sky_id 同源。
 */
export function encodeObservationToParamPath(obs: ObservationPoint): string {
  const norm = normalizeSkyParams(obs);
  return `/starmark/sky/${formatCompactUtc(obs.unixMs)}/${norm.lat}/${norm.lng}/${norm.dir}`;
}

/**
 * 解析 `/starmark/sky/{utc}/{lat}/{lng}/{dir}` → 观测点。
 * 非参数路径（如只带 certId 的隐私链接）返回 null。
 */
export function parseParamPath(pathname: string): ObservationPoint | null {
  const parts = pathname.split('/').filter(Boolean); // ['starmark','sky',utc,lat,lng,dir]
  if (parts.length < 6 || parts[0] !== 'starmark' || parts[1] !== 'sky') return null;
  const [, , utc, lat, lng, dir] = parts;
  if (!COMPACT_UTC_RE.test(utc)) return null;
  const latDeg = Number.parseFloat(lat);
  const lngDeg = Number.parseFloat(lng);
  const dirDeg = Number.parseInt(dir, 10);
  if (!Number.isFinite(latDeg) || !Number.isFinite(lngDeg) || !Number.isFinite(dirDeg)) return null;
  return { unixMs: parseCompactUtc(utc), latDeg, lngDeg, dirDeg };
}

/** 对外分享链接（P13：只放 certId，不入经纬度/称谓） */
export function buildPublicShareUrl(certId: string): string {
  return `/starmark/sky/${certId}`;
}
