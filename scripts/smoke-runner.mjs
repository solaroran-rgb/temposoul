#!/usr/bin/env node
/**
 * 冒烟执行器（smoke-runner）
 * 收口确认卡修复④：expectations 缺失时先 pnpm build:smoke-exp 现场生成，生成失败才 exit 2
 * 读取 build/smoke-expectations.json（280 条），对每条期望 URL 执行并发 GET 断言。
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const expFile = path.join(repoRoot, 'build', 'smoke-expectations.json');
const BASE = process.env.SMOKE_BASE ?? 'http://localhost:8788';

/** 修复④：expectations 缺失 → 现场生成；生成失败 → exit 2（硬失败，不静默降级） */
function loadExpectations() {
  if (fs.existsSync(expFile)) {
    try {
      return JSON.parse(fs.readFileSync(expFile, 'utf8'));
    } catch (e) {
      console.warn(`[smoke] expectations parse failed: ${e.message} — regenerating`);
    }
  }
  console.log('[smoke] expectations missing — running build:smoke-exp');
  const r = spawnSync('pnpm', ['build:smoke-exp'], { cwd: repoRoot, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`[smoke] FATAL: build:smoke-exp failed (exit ${r.status}) — cannot run smoke without expectations`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(expFile, 'utf8'));
}

const exp = loadExpectations();
const list = exp.expectations ?? [];
console.log(`[smoke] loaded ${list.length} expectations (base=${BASE})`);

let pass = 0;
const failures = [];
for (const e of list) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(BASE + e.slug, { signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const text = await res.text();
    const hasTitle = e.title ? text.includes(e.title) : true;
    const ok = res.status === 200 && hasTitle;
    if (ok) {
      pass++;
    } else {
      failures.push({ slug: e.slug, status: res.status, hasTitle });
    }
  } catch (err) {
    failures.push({ slug: e.slug, error: String(err) });
  }
}

console.log(`[smoke] PASS ${pass}/${list.length}`);
if (failures.length > 0) {
  console.error('[smoke] FAILURES:');
  for (const f of failures.slice(0, 20)) console.error(`  ${f.slug}: status=${f.status ?? 'ERR'} hasTitle=${f.hasTitle ?? '-'} ${f.error ?? ''}`);
  console.error(`[smoke] FATAL: ${failures.length} expectations failed`);
  process.exit(1);
}
