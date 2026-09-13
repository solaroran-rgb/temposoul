#!/usr/bin/env node
// scripts/diff-baseline.mjs
// 与 docs/sky/baseline-desktop.png / baseline-mobile.png 做像素级对照。
// 判据：diffRatio <= 0.03 -> pass（近似 token 级差异）
//       diffRatio >  0.03 -> 提示结构性改动，需双签 + 重新生成基线
//
// 运行：npx tsx scripts/diff-baseline.mjs [--current <dir>] [--baseline <dir>]
//
// 依赖（devDependencies）：pngjs, pixelmatch

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// pngjs 是 CJS 包，用默认导入 + 解构更稳
import pngjs from 'pngjs';
const { PNG } = pngjs;

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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
const BASELINE_DIR = args.baseline || join(ROOT, 'docs/sky');
const CURRENT_DIR = args.current || join(ROOT, 'docs/sky/audit');
const OUT_DIR = join(ROOT, 'docs/sky/audit');
const DIFF_THRESHOLD = 0.03;

await mkdir(OUT_DIR, { recursive: true });

// 扫描目录，按 mtime 返回最新的 screenshot-*-<name>.png
async function findLatestScreenshot(dir, name) {
  if (!existsSync(dir)) return null;
  const entries = await readdir(dir);
  const candidates = [];
  for (const f of entries) {
    if (!f.startsWith('screenshot-') || !f.endsWith(`-${name}.png`)) continue;
    const full = join(dir, f);
    try {
      const s = await stat(full);
      candidates.push({ path: full, mtime: s.mtimeMs });
    } catch {
      // 忽略读不到的
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0].path;
}

const targets = [
  { name: 'desktop', baseline: 'baseline-desktop.png' },
  { name: 'mobile', baseline: 'baseline-mobile.png' },
];

const results = [];

for (const t of targets) {
  const baselinePath = join(BASELINE_DIR, t.baseline);

  if (!existsSync(baselinePath)) {
    results.push({ name: t.name, pass: false, reason: `baseline missing: ${baselinePath}` });
    continue;
  }

  const currentPath = await findLatestScreenshot(CURRENT_DIR, t.name);
  if (!currentPath) {
    results.push({ name: t.name, pass: false, reason: `current screenshot missing in ${CURRENT_DIR}` });
    continue;
  }

  try {
    const { default: pixelmatch } = await import('pixelmatch');

    const baselinePng = PNG.sync.read(await readFile(baselinePath));
    const currentPng = PNG.sync.read(await readFile(currentPath));

    if (baselinePng.width !== currentPng.width || baselinePng.height !== currentPng.height) {
      results.push({
        name: t.name,
        pass: false,
        reason: `size mismatch: ${baselinePng.width}x${baselinePng.height} vs ${currentPng.width}x${currentPng.height}`,
      });
      continue;
    }

    const diff = new PNG({ width: baselinePng.width, height: baselinePng.height });
    const diffPixels = pixelmatch(
      baselinePng.data,
      currentPng.data,
      diff.data,
      baselinePng.width,
      baselinePng.height,
      { threshold: 0.15 }
    );

    const total = baselinePng.width * baselinePng.height;
    const diffRatio = diffPixels / total;
    const pass = diffRatio <= DIFF_THRESHOLD;

    await writeFile(
      join(OUT_DIR, `diff-${t.name}.png`),
      PNG.sync.write(diff)
    );

    results.push({
      name: t.name,
      pass,
      currentFile: currentPath,
      diffPixels,
      totalPixels: total,
      diffRatio: diffRatio.toFixed(4),
      reason: pass
        ? `diffRatio ${diffRatio.toFixed(4)} <= ${DIFF_THRESHOLD}, presumed token-level only（仍需人工确认）`
        : `diffRatio ${diffRatio.toFixed(4)} > ${DIFF_THRESHOLD}, structural change requires dual-sign + baseline regeneration`,
    });
  } catch (e) {
    results.push({ name: t.name, pass: false, reason: `diff failed: ${e.message}` });
  }
}

const overall = results.every((r) => r.pass);
console.log('=== diff-baseline ===');
console.log(JSON.stringify(results, null, 2));
console.log('overall:', overall ? 'PASS' : 'FAIL');
console.log('note: pass 仅表示像素差异 <=3%，仍需人工确认差异为 token 级');

await writeFile(
  join(OUT_DIR, `baseline-diff-${new Date().toISOString().slice(0, 10)}.json`),
  JSON.stringify({ overall, results }, null, 2),
  'utf8'
);

process.exit(overall ? 0 : 1);