/**
 * route-audit3.mjs — E-12 导航矩阵 143 项审计重跑（_route_audit3 同口径）
 * 口径：NAVIGATION_MATRIX（src/lib/navigation-matrix.ts）每条 path 必须命中
 *       执行仓已注册路由（App.tsx 显式 + src/router/* + src/routes/* 的 path 提取）；
 *       REAL_MISSING = 矩阵 path 未注册数，期望 0。
 * 零依赖 node 直跑：node scripts/route-audit3.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MATRIX_FILE = path.join(ROOT, 'src', 'lib', 'navigation-matrix.ts');
const SCAN_FILES = ['src/App.tsx'];
const SCAN_DIRS = ['src/router', 'src/routes'];

function readAll(p) {
  const out = [];
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const child of fs.readdirSync(p)) {
      const cp = path.join(p, child);
      if (fs.statSync(cp).isDirectory()) out.push(...readAll(cp));
      else if (/\.(tsx?|jsx?)$/.test(cp)) out.push(cp);
    }
  } else if (/\.(tsx?|jsx?)$/.test(p)) out.push(p);
  return out;
}

// 1) 矩阵 path 提取（严格限定 NAVIGATION_MATRIX 常量定义区间，口径 143 项）
const matrixSrc = fs.readFileSync(MATRIX_FILE, 'utf8');
const start = matrixSrc.indexOf('export const NAVIGATION_MATRIX');
const end = matrixSrc.indexOf('] as const;', start);
const matrixBody = start >= 0 && end > start ? matrixSrc.slice(start, end) : matrixSrc;
const matrixPaths = [...matrixBody.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);

// 2) 注册路由提取（path="..." 与 path={'...'} 两种写法）
const registered = new Set();
const files = [...SCAN_FILES, ...SCAN_DIRS.flatMap((d) => readAll(path.join(ROOT, d)))];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/path=\{?["']([^"'{}]+)["']\}?/g)) registered.add(m[1]);
}

// 3) 模板归一比较：:param 段视为占位，双向通配
function norm(p) {
  return p.replace(/:[A-Za-z0-9_]+/g, '*').replace(/\/+$/, '');
}
const regNorms = new Set([...registered].map(norm));

const missing = matrixPaths.filter((p) => !regNorms.has(norm(p)));
const total = matrixPaths.length;
console.log(`导航矩阵条目: ${total}（NAVIGATION_MATRIX path 提取）`);
console.log(`已注册路由模板: ${regNorms.size}（App.tsx + src/router + src/routes 提取）`);
if (missing.length) {
  console.log(`❌ REAL_MISSING=${missing.length}`);
  missing.forEach((p) => console.log(`  缺: ${p}`));
} else {
  console.log(`✅ REAL_MISSING=0（全部命中）`);
}
process.exit(missing.length ? 1 : 0);
