#!/usr/bin/env node
/**
 * L-15 内容导入流水线 · 回滚脚本
 *
 * 用法：
 *   node scripts/rollback-content.mjs --batch <batchId> [--store data/content/lexicon] [--dry-run]
 *   node scripts/rollback-content.mjs --slug <slug>    [--store data/content/lexicon] [--dry-run]
 *
 * 行为：按批次 id（或单 slug）从 store 删除条目，删除前写备份
 *       data/content/lexicon/backup-<batchId>-<timestamp>.json，可反向恢复。
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const batchId = arg('batch');
const slug = arg('slug');
const dryRun = process.argv.includes('--dry-run');
const storeDir = resolve(ROOT, arg('store', join('data', 'content', 'lexicon')));
const storeFile = join(storeDir, 'lexicon-terms.json');

if (!batchId && !slug) {
  console.error('用法：node scripts/rollback-content.mjs --batch <batchId> | --slug <slug> [--dry-run]');
  process.exit(2);
}
if (!existsSync(storeFile)) {
  console.error(`[rollback-content] store 不存在：${storeFile}`);
  process.exit(2);
}

const store = JSON.parse(readFileSync(storeFile, 'utf8'));
const terms = store.terms ?? {};

const targets = Object.entries(terms).filter(([, t]) =>
  batchId ? t.batchId === batchId : t.slug === slug
);

if (!targets.length) {
  console.log(`[rollback-content] 无可回滚条目（${batchId ? `batch=${batchId}` : `slug=${slug}`}）`);
  process.exit(0);
}

if (!dryRun) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = join(storeDir, `backup-${batchId ?? slug}-${stamp}.json`);
  mkdirSync(storeDir, { recursive: true });
  writeFileSync(backupFile, JSON.stringify({ terms: Object.fromEntries(targets) }, null, 2), 'utf8');
  for (const [key] of targets) delete terms[key];
  writeFileSync(storeFile, JSON.stringify(store, null, 2), 'utf8');
  console.log(`[rollback-content] 已删除 ${targets.length} 条，备份：${backupFile}`);
} else {
  console.log(`[rollback-content] dry-run：将删除 ${targets.length} 条`);
}

targets.forEach(([key]) => console.log(`  - ${key}`));
console.log(`[rollback-content] 剩余 ${Object.keys(terms).length} 条`);
process.exit(0);
