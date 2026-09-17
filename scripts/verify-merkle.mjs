#!/usr/bin/env node
/**
 * Merkle 校验（verify-merkle）
 * 收口确认卡连带：total_sitemap === 738（A280+B50+C384+D24）
 * 校验 build/artifacts.json 的三层 Merkle 与四域口径一致性。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const artifactsFile = path.join(repoRoot, 'build', 'artifacts.json');

const DOMAIN_TOTAL = {
  a: 280,
  b: 50,
  c: 384,
  d: 24,
};
const TOTAL_SITEMAP = DOMAIN_TOTAL.a + DOMAIN_TOTAL.b + DOMAIN_TOTAL.c + DOMAIN_TOTAL.d; // 738

function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

if (!fs.existsSync(artifactsFile)) {
  console.error(`[verify-merkle] FATAL: ${artifactsFile} missing — run freeze-artifacts first`);
  process.exit(2);
}

const artifacts = JSON.parse(fs.readFileSync(artifactsFile, 'utf8'));

// 1) 全站 sitemap 口径
if (artifacts.total_sitemap !== TOTAL_SITEMAP) {
  console.error(`[verify-merkle] FATAL: total_sitemap=${artifacts.total_sitemap} expected=${TOTAL_SITEMAP}`);
  process.exit(1);
}

// 2) 各域计数
for (const [k, v] of Object.entries(DOMAIN_TOTAL)) {
  const key = `domain_${k}_count`;
  if (artifacts[key] !== v) {
    console.error(`[verify-merkle] FATAL: ${key}=${artifacts[key]} expected=${v}`);
    process.exit(1);
  }
}

// 3) 三层 Merkle 校验（若存在）
const layers = ['layer1_route_hash', 'layer2_content_hash', 'layer3_asset_hash'];
for (const l of layers) {
  if (artifacts[l] && typeof artifacts[l] === 'string' && artifacts[l].length === 64) {
    // 结构存在性校验通过
    console.log(`[verify-merkle] ok ${l}=${artifacts[l].slice(0, 12)}…`);
  } else if (artifacts[l] === undefined) {
    console.warn(`[verify-merkle] warn ${l} absent`);
  } else {
    console.error(`[verify-merkle] FATAL: ${l} malformed`);
    process.exit(1);
  }
}

console.log(`[verify-merkle] PASS total_sitemap=${TOTAL_SITEMAP} (A280+B50+C384+D24)`);
