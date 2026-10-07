// scripts/starmark/preprocess-catalog.mjs
// 星刻 StarMark 星表预处理（P0 ①）
//
// 【接入规范】HYG / Bright Star Catalog：
//   - P0 确认版本：d3-celestial stars.6.json（源自 HYG v3 / Yale BSC，BSD-3-Clause）
//   - 许可：BSD-3-Clause（可商用、需保留许可声明）
//   - 上游字段：geometry.coordinates=[ra(deg),dec(deg)]；properties.mag / properties.bv
//   - 本仓现用星表：src/lib/sky/stars.data.ts（5044 星，mag<=6.0，J2000，
//     interleaved Float32Array [ra(rad),dec(rad),mag,ci]），由 scripts/gen-stars.mjs 生成。
//
// 【占位 schema】本脚本定义 StarMark 标准化星表 schema（比 P0 现用多出自行/温度/边界标记）：
//   { id, ra_deg, dec_deg, pm_ra_mas, pm_dec_mas, mag, bv, temp_k, boundary, dupFlag }
//   - 仓库暂无独立 HYG 全量数据文件（现用 A5 同源精简表），扩展字段标【待数据】。
//
// 运行：
//   node scripts/starmark/preprocess-catalog.mjs            # 用内置样例（确定性）
//   node scripts/starmark/preprocess-catalog.mjs in.json out.json
// 对空/样例输入给出确定性输出，不编造真实星表数据。

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const MAG_LIMIT = 6.0;

// 内置样例（3 颗，仅用于 schema 验证与 CI；非真实星表）
const SAMPLE = {
  features: [
    { properties: { mag: 1.46, bv: -0.03 }, geometry: { coordinates: [101.2885, -16.7161] } }, // Sirius-like placeholder
    { properties: { mag: 0.03, bv: 0.68 }, geometry: { coordinates: [255.9604, 14] } },
    { properties: { mag: 0.13, bv: -0.13 }, geometry: { coordinates: [313.7246, 44.9378] } },
  ],
};

// B-V -> 近似有效温度（K），Ballesteros 公式近似；无温度字段时用此推
function bvToTempK(bv) {
  if (bv == null || Number.isNaN(bv)) return null;
  // 近似：bv 0 -> 5800K
  return Math.round(4600 / (0.92 * bv + 1.7) + 4600 / (0.92 * bv + 0.62));
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeStar(f) {
  const mag = num(f?.properties?.mag, NaN);
  if (!Number.isFinite(mag) || mag > MAG_LIMIT) return null;
  const c = f?.geometry?.coordinates;
  if (!Array.isArray(c)) return null;
  const ra_deg = num(c[0], NaN);
  const dec_deg = num(c[1], NaN);
  if (!Number.isFinite(ra_deg) || !Number.isFinite(dec_deg)) return null;
  const bv = f?.properties?.bv == null ? 0.5 : num(f.properties.bv, 0.5);
  return {
    id: null, // 【待数据】HYG 全量接入时给 Henry Draper / HR 编号
    ra_deg: +ra_deg.toFixed(6),
    dec_deg: +dec_deg.toFixed(6),
    pm_ra_mas: null, // 【待数据】自行（HYG 有；现 A5 表无）
    pm_dec_mas: null, // 【待数据】
    mag,
    bv,
    temp_k: bvToTempK(bv),
    boundary: null, // 【待数据】星座边界标记
    dupFlag: false, // 去重标记（同 ra/dec 0.01° 内取最亮）
  };
}

function dedup(stars) {
  const seen = new Map();
  for (const s of stars) {
    const k = `${Math.round(s.ra_deg * 100)}_${Math.round(s.dec_deg * 100)}`;
    const prev = seen.get(k);
    if (!prev) {
      seen.set(k, s);
    } else {
      s.dupFlag = true;
      if (s.mag < prev.mag) seen.set(k, s); // 保留更亮
    }
  }
  return [...seen.values()].sort((a, b) => a.ra_deg - b.ra_deg);
}

function main() {
  const [, , inArg, outArg] = process.argv;
  let raw;
  if (inArg && existsSync(inArg)) {
    raw = JSON.parse(readFileSync(inArg, 'utf8'));
  } else {
    raw = SAMPLE; // 样例确定性输入
  }
  const feats = raw.features ?? [];
  const kept = [];
  for (const f of feats) {
    const s = normalizeStar(f);
    if (s) kept.push(s);
  }
  const out = dedup(kept);
  const report = {
    schema: 'starmark-catalog@v1',
    source: inArg ? inArg : 'SAMPLE(built-in, non-real)',
    license: 'BSD-3-Clause (d3-celestial / HYG v3 / Yale BSC)',
    magLimit: MAG_LIMIT,
    epoch: 'J2000',
    timeScale: 'UTC',
    inputFeatures: feats.length,
    kept: out.length,
    dedupDropped: kept.length - out.length,
    pendingFields: ['id(HenryDraper/HR)', 'pm_ra_mas', 'pm_dec_mas', 'boundary'],
    stars: out,
  };
  const text = JSON.stringify(report, null, 2);
  if (outArg) {
    mkdirSync(dirname(outArg), { recursive: true });
    writeFileSync(outArg, text, 'utf8');
    console.log(`[starmark-preprocess] wrote ${outArg}: kept=${out.length} (sample=${!inArg})`);
  } else {
    console.log(text);
  }
}

main();
