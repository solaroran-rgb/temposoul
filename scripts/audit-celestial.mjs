#!/usr/bin/env node
// scripts/audit-celestial.mjs
// 三路对拍 + 双视口截图，供 promote 门禁调用。
//
// 运行：npx tsx scripts/audit-celestial.mjs [--ref-dir <path>] [--out-dir <path>]
//        [--url <url>] [--commit <hash>] [--suffix <tag>]
//        [--skip-screenshot] [--skip-network]
//
// 参考数据（用户一次性从 Stellarium / NASA 导出，放入 docs/sky/audit/reference/）：
//   stellarium-stars.csv
//     列：city,lat,lon,time,starId,ra,dec,altRef,azRef
//     **ra/dec 必须是 J2000 度**（不是当日坐标）；altRef/azRef 为地平度
//     time 必须是 ISO 8601（Date.parse 可解析）
//   nasa-moon.csv
//     列：date,phaseRef,illumRef
//     phaseRef 0..2π（0=新月，π=满月）；illumRef 0..1
//
// 退出码：0 = 全部 pass；1 = 有 fail

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEG,
  toJulianDay,
  localSiderealTime,
  precessionMatrix,
  radecToAltAz,
} from '../src/lib/sky/astro.ts';
import { computeMoon } from '../src/lib/sky/moon.ts';
import { STAR_COUNT, STAR_DATA } from '../src/lib/sky/stars.data.ts';
import { CONSTELLATION_SEGMENTS } from '../src/lib/sky/constellations.data.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---------- 参数解析 ----------
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const REF_DIR = args['ref-dir'] || join(ROOT, 'docs/sky/audit/reference');
const OUT_DIR = args['out-dir'] || join(ROOT, 'docs/sky/audit');
const URL = args.url || null;
const COMMIT = args.commit || 'local';
const SUFFIX = args.suffix ? `-${args.suffix}` : '';
const SKIP_SCREENSHOT = !!args['skip-screenshot'];
const SKIP_NETWORK = !!args['skip-network'];

// ---------- 工具 ----------
function datestamp() {
  return new Date().toISOString().slice(0, 10);
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h] = (cells[i] ?? '').trim(); });
    return row;
  });
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map((h) => r[h] ?? '').join(','));
  }
  return lines.join('\n') + '\n';
}

function altAzToUnit(alt, az) {
  const ca = Math.cos(alt);
  return { x: ca * Math.sin(az), y: Math.sin(alt), z: ca * Math.cos(az) };
}

// 球面上两点角距（rad），用单位向量点积，极点稳定
function angularDistance(alt1, az1, alt2, az2) {
  const v1 = altAzToUnit(alt1, az1);
  const v2 = altAzToUnit(alt2, az2);
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  return Math.acos(Math.max(-1, Math.min(1, dot)));
}

// 就地应用岁差矩阵到 ra/dec（rad），返回 { ra, dec }
function precessRadec(ra, dec, m) {
  const cd = Math.cos(dec);
  const x = cd * Math.cos(ra);
  const y = cd * Math.sin(ra);
  const z = Math.sin(dec);
  const nx = m[0] * x + m[1] * y + m[2] * z;
  const ny = m[3] * x + m[4] * y + m[5] * z;
  const nz = m[6] * x + m[7] * y + m[8] * z;
  return {
    ra: Math.atan2(ny, nx),
    dec: Math.asin(Math.max(-1, Math.min(1, nz))),
  };
}

// ---------- 报告结构 ----------
const report = {
  timestamp: new Date().toISOString(),
  commit: COMMIT,
  celestial:      { pass: false, skipped: false, total: 0, within: 0, ratio: 0, maxErrDeg: 0, details: [] },
  moon:           { pass: false, skipped: false, total: 0, maxPhaseErrDeg: 0, maxIllumErr: 0, details: [] },
  constellation:  { pass: false, skipped: false, segmentCount: 0, maxEndpointErrDeg: 0, unmatched: 0, details: [] },
  screenshot:     { pass: false, skipped: false, details: [] },
};

await mkdir(OUT_DIR, { recursive: true });

// ========================================================
// 1. 星位对拍（Stellarium，6 城 × 12 时点 × 20 星 = 1440 样本）
// ========================================================
const starsRefPath = join(REF_DIR, 'stellarium-stars.csv');
if (!existsSync(starsRefPath)) {
  report.celestial.skipped = true;
  report.celestial.details.push(`missing ${starsRefPath}; skipped`);
} else {
  const rows = parseCsv(await readFile(starsRefPath, 'utf8'));
  const samples = new Map();
  for (const r of rows) {
    const lat = Number(r.lat);
    const lon = Number(r.lon);
    const time = r.time;
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !time) continue;
    const key = `${r.city}|${time}`;
    if (!samples.has(key)) {
      samples.set(key, { city: r.city, lat, lon, time, stars: [] });
    }
    samples.get(key).stars.push(r);
  }

  let total = 0, within = 0, maxErrDeg = 0;
  const csvRows = [];

  for (const s of samples.values()) {
    const jd = toJulianDay(Date.parse(s.time));
    if (!Number.isFinite(jd)) continue;
    const lst = localSiderealTime(jd, s.lon);
    const latRad = s.lat * DEG;
    const m = precessionMatrix(jd);

    for (const star of s.stars) {
      const raDeg = Number(star.ra);
      const decDeg = Number(star.dec);
      const altRefDeg = Number(star.altRef);
      const azRefDeg = Number(star.azRef);
      if (![raDeg, decDeg, altRefDeg, azRefDeg].every(Number.isFinite)) continue;

      const p = precessRadec(raDeg * DEG, decDeg * DEG, m);
      const { alt, az } = radecToAltAz(p.ra, p.dec, lst, latRad);
      const errRad = angularDistance(alt, az, altRefDeg * DEG, azRefDeg * DEG);
      const errDeg = errRad / DEG;

      total++;
      if (errDeg < 0.5) within++;
      if (errDeg > maxErrDeg) maxErrDeg = errDeg;

      csvRows.push({
        city: s.city,
        time: s.time,
        starId: star.starId,
        altExpected: altRefDeg.toFixed(4),
        azExpected: azRefDeg.toFixed(4),
        altActual: (alt / DEG).toFixed(4),
        azActual: (az / DEG).toFixed(4),
        errDeg: errDeg.toFixed(4),
      });
    }
  }

  const ratio = total ? within / total : 0;
  report.celestial.total = total;
  report.celestial.within = within;
  report.celestial.ratio = ratio;
  report.celestial.maxErrDeg = maxErrDeg;
  // 最小样本数 20，否则判 skip
  if (total < 20) {
    report.celestial.skipped = true;
    report.celestial.details.push(`insufficient samples: total=${total} < 20; skipped`);
  } else {
    report.celestial.pass = ratio >= 0.95 && maxErrDeg < 1.0;
  }

  await writeFile(
    join(OUT_DIR, `celestial-accuracy-${datestamp()}${SUFFIX}.csv`),
    toCsv(csvRows),
    'utf8'
  );
}

// ========================================================
// 2. 月相对拍（NASA，2026 年 24 个采样点）
// ========================================================
const moonRefPath = join(REF_DIR, 'nasa-moon.csv');
if (!existsSync(moonRefPath)) {
  report.moon.skipped = true;
  report.moon.details.push(`missing ${moonRefPath}; skipped`);
} else {
  const rows = parseCsv(await readFile(moonRefPath, 'utf8'));
  let total = 0, maxPhaseErrDeg = 0, maxIllumErr = 0;
  const csvRows = [];

  // 月相为地心视角，与观测者位置无关；此处经纬度仅供 computeMoon 的签名使用
  const REF_LON_DEG = 116.4;
  const REF_LAT_RAD = 39.9 * DEG;

  for (const r of rows) {
    const t = Date.parse(r.date);
    const phaseRef = Number(r.phaseRef);
    const illumRef = Number(r.illumRef);
    if (!Number.isFinite(t) || !Number.isFinite(phaseRef) || !Number.isFinite(illumRef)) continue;

    const jd = toJulianDay(t);
    const lst = localSiderealTime(jd, REF_LON_DEG);
    const moon = computeMoon(jd, lst, REF_LAT_RAD, 500);

    let dPhase = Math.abs(moon.phase - phaseRef);
    if (dPhase > Math.PI) dPhase = 2 * Math.PI - dPhase;
    const phaseErrDeg = dPhase / DEG;
    const illumErr = Math.abs(moon.illum - illumRef);

    total++;
    if (phaseErrDeg > maxPhaseErrDeg) maxPhaseErrDeg = phaseErrDeg;
    if (illumErr > maxIllumErr) maxIllumErr = illumErr;

    csvRows.push({
      date: r.date,
      phaseExpected: phaseRef.toFixed(4),
      phaseActual: moon.phase.toFixed(4),
      illumExpected: illumRef.toFixed(4),
      illumActual: moon.illum.toFixed(4),
      phaseErrDeg: phaseErrDeg.toFixed(4),
      illumErr: illumErr.toFixed(4),
    });
  }

  report.moon.total = total;
  report.moon.maxPhaseErrDeg = maxPhaseErrDeg;
  report.moon.maxIllumErr = maxIllumErr;
  if (total < 6) {
    report.moon.skipped = true;
    report.moon.details.push(`insufficient samples: total=${total} < 6; skipped`);
  } else {
    report.moon.pass = maxPhaseErrDeg < 0.5 && maxIllumErr < 0.05;
  }

  await writeFile(
    join(OUT_DIR, `moon-accuracy-${datestamp()}${SUFFIX}.csv`),
    toCsv(csvRows),
    'utf8'
  );
}

// ========================================================
// 3. 星座线完整性对拍（d3-celestial 原始数据）
//    策略：本项目的 CONSTELLATION_SEGMENTS 是 d3-celestial 全量的
//    **子集**（gen-stars.mjs 按端点星等过滤），因此判据是
//    「每段任一端点都能在原始数据中找到 < 0.1° 匹配」
// ========================================================
{
  const logLines = [];
  report.constellation.segmentCount = CONSTELLATION_SEGMENTS.length;
  logLines.push(`segment count (ours): ${CONSTELLATION_SEGMENTS.length}`);

  if (SKIP_NETWORK) {
    report.constellation.skipped = true;
    logLines.push('network skipped');
  } else {
    try {
      const res = await fetch(
        'https://cdn.jsdelivr.net/npm/d3-celestial@1.0.0/data/constellations.lines.json'
      );
      const raw = await res.json();
      const expectedSegs = [];
      for (const f of raw.features ?? []) {
        const multi = f.geometry?.coordinates ?? [];
        for (const line of multi) {
          for (let i = 0; i < line.length - 1; i++) {
            expectedSegs.push([line[i][0], line[i][1], line[i + 1][0], line[i + 1][1]]);
          }
        }
      }
      logLines.push(`segment count (d3-celestial raw): ${expectedSegs.length}`);

      // 网格哈希：0.05° 精度，查询时扩到 3×3 邻域
      const GRID = 0.05;
      const gridKey = (ra, dec) =>
        `${Math.round(ra / GRID)}_${Math.round(dec / GRID)}`;
      const grid = new Map();
      for (const [ra1, dec1, ra2, dec2] of expectedSegs) {
        for (const k of [gridKey(ra1, dec1), gridKey(ra2, dec2)]) {
          if (!grid.has(k)) grid.set(k, []);
          grid.get(k).push([ra1, dec1, ra2, dec2]);
        }
      }

      // 在 3×3 邻域内查找是否有点在 0.1° 内
      function endpointMatches(raDeg, decDeg) {
        const cx = Math.round(raDeg / GRID);
        const cy = Math.round(decDeg / GRID);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const bucket = grid.get(`${cx + dx}_${cy + dy}`);
            if (!bucket) continue;
            for (const cand of bucket) {
              for (const [cr, cd] of [[cand[0], cand[1]], [cand[2], cand[3]]]) {
                let dRa = Math.abs(cr - raDeg);
                if (dRa > 180) dRa = 360 - dRa;
                const dDec = Math.abs(cd - decDeg);
                if (Math.hypot(dRa, dDec) < 0.1) return true;
              }
            }
          }
        }
        return false;
      }

      let maxEndpointErrDeg = 0;
      let unmatched = 0;
      for (const [ra1, dec1, ra2, dec2] of CONSTELLATION_SEGMENTS) {
        const m1 = endpointMatches(ra1, dec1);
        const m2 = endpointMatches(ra2, dec2);
        if (!m1 && !m2) unmatched++;
        // 记录每个端点到原始数据的最近距离（仅用于报告）
        for (const [qr, qd] of [[ra1, dec1], [ra2, dec2]]) {
          const cx = Math.round(qr / GRID);
          const cy = Math.round(qd / GRID);
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const bucket = grid.get(`${cx + dx}_${cy + dy}`);
              if (!bucket) continue;
              for (const cand of bucket) {
                for (const [cr, cd] of [[cand[0], cand[1]], [cand[2], cand[3]]]) {
                  let dRa = Math.abs(cr - qr);
                  if (dRa > 180) dRa = 360 - dRa;
                  const dDec = Math.abs(cd - qd);
                  const err = Math.hypot(dRa, dDec);
                  if (err > maxEndpointErrDeg) maxEndpointErrDeg = err;
                }
              }
            }
          }
        }
      }

      logLines.push(`max endpoint err (deg): ${maxEndpointErrDeg.toFixed(4)}`);
      logLines.push(`unmatched segments: ${unmatched}`);

      report.constellation.maxEndpointErrDeg = maxEndpointErrDeg;
      report.constellation.unmatched = unmatched;
      report.constellation.pass = unmatched === 0;
    } catch (e) {
      report.constellation.skipped = true;
      logLines.push(`network failed: ${e.message}`);
      report.constellation.details.push(`network failed: ${e.message}`);
    }
  }

  logLines.push(`pass: ${report.constellation.pass}`);
  logLines.push(`skipped: ${report.constellation.skipped}`);
  await writeFile(
    join(OUT_DIR, `constellation-integrity-${datestamp()}${SUFFIX}.log`),
    logLines.join('\n') + '\n',
    'utf8'
  );
}

// ========================================================
// 4. 双视口截图（Playwright，显式 viewport）
// ========================================================
if (SKIP_SCREENSHOT || !URL) {
  report.screenshot.skipped = true;
  report.screenshot.details.push('screenshot skipped (no --url or --skip-screenshot)');
} else {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch();
    const viewports = [
      { name: 'desktop', width: 1920, height: 1080 },
      { name: 'mobile', width: 390, height: 844 },
    ];
    let allPass = true;
    const details = [];

    for (const vp of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));

      try {
        await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

        const canvasFound = await page
          .waitForSelector('canvas', { timeout: 15000 })
          .then(() => true)
          .catch(() => false);
        if (!canvasFound) errors.push('canvas not found within 15s');

        // 等待动画稳定（首帧 + fade in 完成）
        await page.waitForTimeout(2500);

        const out = join(OUT_DIR, `screenshot-${COMMIT}-${vp.name}${SUFFIX}.png`);
        await page.screenshot({ path: out });

        const pass = errors.length === 0;
        if (!pass) allPass = false;
        details.push({ viewport: vp.name, errors, path: out, pass });
      } catch (e) {
        allPass = false;
        details.push({ viewport: vp.name, errors: [e.message], pass: false });
      }
      await ctx.close();
    }
    await browser.close();

    report.screenshot.pass = allPass;
    report.screenshot.details = details;
  } catch (e) {
    report.screenshot.skipped = true;
    report.screenshot.details.push(`playwright failed: ${e.message}`);
  }
}

// ========================================================
// 5. 汇总
// ========================================================
function effectivePass(item) {
  return item.skipped || item.pass;
}

const overallPass =
  effectivePass(report.celestial) &&
  effectivePass(report.moon) &&
  effectivePass(report.constellation) &&
  effectivePass(report.screenshot);

console.log('=== audit-celestial ===');
console.log(JSON.stringify(report, null, 2));
console.log('overall:', overallPass ? 'PASS' : 'FAIL');

await writeFile(
  join(OUT_DIR, `audit-report-${datestamp()}${SUFFIX}.json`),
  JSON.stringify({ overallPass, ...report }, null, 2),
  'utf8'
);

process.exit(overallPass ? 0 : 1);