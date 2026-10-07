#!/usr/bin/env node
/**
 * L-15 内容导入流水线 · 导入脚本
 *
 * 用法：
 *   node scripts/import-content.mjs --file <path> --batch <batchId> [--dry-run] [--store data/content/lexicon]
 *
 * 行为：
 *   1. 解析 ###TERM_BEGIN/END 块（WP-18 §5 格式）
 *   2. 逐字段校验：缺失 / 字数不足 → 报错到行并中止该条（不中止整批）
 *   3. slug 生成（缺失按 id 兜底，kebab-case，唯一性校验）
 *   4. TDK 生成（缺失按公式补齐）
 *   5. 按 slug upsert 到 store（幂等：同 slug 覆盖并保留首次 createdAt）
 *   6. 输出导入报告：成功 / 失败 / 跳过 + 原因
 *
 * 纪律：
 *   - 真机 PG DDL 未批准前，store 落 JSON 文件（data/content/lexicon/lexicon-terms.json），
 *     字段与 lexicon_terms 表一一对应，批准后可零改造切换 PG；
 *   - --dry-run 只校验不落盘。
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseTermBlocks,
  validateRecord,
  deriveSlug,
  deriveTdk,
  SEGMENT_KEYS,
} from './lib/content-rules.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const filePath = arg('file');
const batchId = arg('batch', `batch-${new Date().toISOString().slice(0, 10)}`);
const dryRun = process.argv.includes('--dry-run');
const storeDir = arg('store', join('data', 'content', 'lexicon'));

if (!filePath) {
  console.error('用法：node scripts/import-content.mjs --file <path> --batch <batchId> [--dry-run]');
  process.exit(2);
}

const absStore = resolve(ROOT, storeDir);
const storeFile = join(absStore, 'lexicon-terms.json');
const plannedFile = join(absStore, 'planned-slugs.txt');
const reportFile = join(absStore, `import-report-${batchId}.json`);

function loadStore() {
  if (!existsSync(storeFile)) return { version: 1, terms: {} };
  try {
    return JSON.parse(readFileSync(storeFile, 'utf8'));
  } catch {
    return { version: 1, terms: {} };
  }
}

function loadPlanned() {
  if (!existsSync(plannedFile)) return new Set();
  return new Set(
    readFileSync(plannedFile, 'utf8')
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean)
      .filter(x => !x.startsWith('#'))
  );
}

const store = loadStore();
const plannedSlugs = loadPlanned();
const knownSlugs = new Set(Object.keys(store.terms));
const existingTdkTitles = new Map();
for (const [slug, t] of Object.entries(store.terms)) {
  if (t?.tdk?.title?.zh) existingTdkTitles.set(t.tdk.title.zh, slug);
}

const text = readFileSync(resolve(ROOT, filePath), 'utf8');
const blocks = parseTermBlocks(text);

const report = {
  batchId,
  source: filePath,
  dryRun,
  generatedAt: new Date().toISOString(),
  total: blocks.length,
  success: [],
  failed: [],
  skipped: [],
};

if (!dryRun) mkdirSync(absStore, { recursive: true });

for (const block of blocks) {
  const { record, startLine, endLine, unclosed } = block;

  if (unclosed) {
    report.failed.push({
      line: startLine,
      slug: record.slug ?? null,
      errors: ['C-PARSE ###TERM_BEGIN 未闭合（缺 ###TERM_END）'],
    });
    continue;
  }

  // slug / TDK 补齐
  const slug = deriveSlug(record);
  if (!slug) {
    report.failed.push({ line: startLine, slug: null, errors: ['C-FIELD 无法从 slug/id 推导有效 slug'] });
    continue;
  }
  const tdk = deriveTdk(record);
  const merged = {
    ...record,
    slug,
    'tdk.title.zh': record['tdk.title.zh'] || tdk.title,
    'tdk.desc.zh': record['tdk.desc.zh'] || tdk.desc,
  };

  const { errors, warnings, normalized, totalChars } = validateRecord(merged, {
    knownSlugs,
    plannedSlugs,
    existingTdkTitles,
  });

  if (errors.length) {
    report.failed.push({ line: startLine, slug, errors });
    continue;
  }

  // 同批内重复 slug → 跳过后者
  if (report.success.some(s => s.slug === slug)) {
    report.skipped.push({ line: startLine, slug, reason: '同批内 slug 重复' });
    continue;
  }

  const now = new Date().toISOString();
  const prev = store.terms[slug];
  const entry = {
    ...normalized,
    batchId,
    version: prev?.version ?? 'v1.0',
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
    totalChars,
    segments: SEGMENT_KEYS.length,
  };

  if (!dryRun) {
    store.terms[slug] = entry;
    knownSlugs.add(slug);
    if (entry.tdk?.title?.zh) existingTdkTitles.set(entry.tdk.title.zh, slug);
  }

  report.success.push({ line: startLine, slug, totalChars, warnings, upsert: Boolean(prev) });
}

if (!dryRun) {
  writeFileSync(storeFile, JSON.stringify(store, null, 2), 'utf8');
  writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf8');
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n[import-content] 批次 ${batchId}${dryRun ? '（dry-run，未落盘）' : ''}`);
console.log(`  源文件：${filePath}`);
console.log(`  解析到 ${report.total} 条：成功 ${report.success.length} / 失败 ${report.failed.length} / 跳过 ${report.skipped.length}`);

if (report.success.length) {
  console.log('\n  成功：');
  for (const s of report.success) {
    console.log(`    L${pad(s.line, 5)} ${pad(s.slug, 28)} ${s.totalChars} 字${s.upsert ? '（upsert）' : ''}`);
    (s.warnings ?? []).forEach(w => console.log(`             ⚠ ${w}`));
  }
}
if (report.skipped.length) {
  console.log('\n  跳过：');
  for (const s of report.skipped) console.log(`    L${pad(s.line, 5)} ${s.slug} — ${s.reason}`);
}
if (report.failed.length) {
  console.log('\n  失败（报错到行，已中止该条）：');
  for (const f of report.failed) {
    console.log(`    L${pad(f.line, 5)} ${f.slug ?? '(无 slug)'} — 行 ${f.line}-${endLineOf(blocks, f.line)}`);
    f.errors.forEach(e => console.log(`             ✗ ${e}`));
  }
}
if (!dryRun) {
  console.log(`\n  store：${storeFile}`);
  console.log(`  报告：${reportFile}`);
}

function endLineOf(list, startLine) {
  const hit = list.find(b => b.startLine === startLine);
  return hit?.endLine ?? startLine;
}

process.exit(report.failed.length ? 1 : 0);
