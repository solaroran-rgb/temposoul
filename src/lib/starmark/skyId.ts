/**
 * skyId.ts —— 星刻 sky_id 机制（B3 二，已冻结口径）
 *
 * sky_id = 规范化参数(UTC时间+经纬度+方向) 单向哈希 → Base32 8 位。
 *   - 时区统一 UTC（unixMs 即 UTC 毫秒）
 *   - 经纬度保留 6 位小数
 *   - 方向取整数度
 *   - 称谓【不进 sky_id】（情感层非复现参数；同一片星空可送多人）
 *
 * 对外只暴露 sky_id + 证书版本指纹，不暴露经纬度/称谓（P13）。
 * 本文件零依赖、纯函数，可在 node 与浏览器同构运行。
 */
import { buildCertificateContent, type CertificateContent } from './version';

/** RFC4648 Base32 字母表（去掉易混 0/1/8/9 歧义，保留 32 个），人类可读、可口头转述 */
export const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export interface RawSkyParams {
  unixMs: number;
  latDeg: number;
  lngDeg: number;
  dirDeg: number;
}

export interface NormalizedSky {
  unixMs: number;
  lat: string; // 6 位小数字符串
  lng: string; // 6 位小数字符串
  dir: number; // 整数度
}

/** 规范化：经纬度 6 位小数、方向取整。同一星空永远得到同一规范化结果。 */
export function normalizeSkyParams(p: RawSkyParams): NormalizedSky {
  const lat = Math.max(-90, Math.min(90, p.latDeg));
  let lng = p.lngDeg;
  lng = ((((lng + 180) % 360) + 360) % 360) - 180; // wrap to [-180,180)
  return {
    unixMs: Math.round(p.unixMs),
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
    dir: ((Math.round(p.dirDeg) % 360) + 360) % 360,
  };
}

/** canonical 串：参与哈希的全部复现参数（不含称谓） */
export function canonicalString(n: NormalizedSky): string {
  return `${n.unixMs}|${n.lat}|${n.lng}|${n.dir}`;
}

/** FNV-1a 32-bit（确定性、跨平台位级一致） */
function fnv1a32(input: string): number {
  let h = 0x811c9dc5 >>> 0;
  const bytes = new TextEncoder().encode(input);
  for (let i = 0; i < bytes.length; i++) {
    h = h ^ bytes[i];
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** 双段混合：canonical 参数哈希 ⊕ 版本串哈希，摊到 64 bit → 取 Base32 8 位 */
function digest(input: string): [number, number] {
  const a = fnv1a32(input);
  const b = fnv1a32('v2|' + input);
  return [a, b];
}

/** 64 bit（两个 32 位）→ Base32（每 5 bit 一字符），取前 8 字符 = 40 bit */
function toBase32(hi: number, lo: number, outLen: number): string {
  let bits = 0;
  let bitCount = 0;
  let out = '';
  // 依次喂入 hi(4 字节) + lo(4 字节)
  for (const word of [hi, lo]) {
    for (let shift = 24; shift >= 0; shift -= 8) {
      bits = (bits << 8) | ((word >>> shift) & 255);
      bitCount += 8;
      while (bitCount >= 5 && out.length < outLen) {
        const idx = (bits >>> (bitCount - 5)) & 31;
        bitCount -= 5;
        out += BASE32_ALPHABET[idx];
      }
    }
  }
  while (out.length < outLen) out += 'A';
  return out.slice(0, outLen);
}

/** 计算 sky_id（Base32 8 位）。同规范化参数 → 恒同。 */
export function computeSkyId(raw: RawSkyParams): string {
  const norm = normalizeSkyParams(raw);
  const [a, b] = digest(canonicalString(norm));
  return toBase32(a, b, 8);
}

/** 完整 sky_id + 证书（复现参数 + 版本指纹）。证书内容不含称谓/精确坐标明文对外。 */
export interface SkyCertificate {
  skyId: string;
  normalized: NormalizedSky;
  cert: CertificateContent;
}

export function buildCertificate(raw: RawSkyParams, magLimit: number, randomSeed: number): SkyCertificate {
  const normalized = normalizeSkyParams(raw);
  const [a, b] = digest(canonicalString(normalized));
  return {
    skyId: toBase32(a, b, 8),
    normalized,
    cert: buildCertificateContent(magLimit, randomSeed),
  };
}
