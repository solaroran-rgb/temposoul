#!/usr/bin/env node
/**
 * D23-3 ｜ 批4 合规 CI 扫描脚本（纯 Node，零外部依赖）
 *
 * 用法：node scripts/compliance-audit-batch4.mjs
 * 退出码：0 = 无违规；1 = 存在违规（PR 合并前拦截）。
 *
 * 规则：
 *  ① 新页面文件必须 import PrivacyHint（文件已落盘才检查；未落盘记 info，不算违规）。
 *  ② batch4-routes.ts 中 isPersonalResult:true 的路由必须 requiresNoindex:true。
 *  ③ 文本数据文件必须包含 disclaimer 字段（文件已落盘才检查；未落盘记 info）。
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const srcDir = join(root, 'src');

const violations = [];
const infos = [];

function readSafe(abs) {
  try {
    return readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

// ── 规则 ①：新页面是否 import PrivacyHint ─────────────────────────
const EXPECTED_PAGES = [
  // D23（本轮落盘）
  'pages/names/ManualNamingPage.tsx',
  'pages/names/ExpertListPage.tsx',
  'pages/names/ExpertDetailPage.tsx',
  // A23（并行轮次，可能尚未落盘）
  'pages/divination/gufa/GufaIndexPage.tsx',
  'pages/divination/gufa/GufaSchoolPage.tsx',
  'pages/divination/gufa/GufaCategoryPage.tsx',
  'pages/astrolabe/mansions/MansionsListPage.tsx',
  'pages/astrolabe/mansions/MansionDetailPage.tsx',
  'pages/divination/fengshui-test/FengshuiTestPage.tsx',
  'pages/divination/qinggong/QinggongPage.tsx',
  'pages/tarot/learn/TarotLearnHomePage.tsx',
  'pages/tarot/learn/TarotLearnGroupPage.tsx',
  'pages/tarot/learn/TarotLearnDailyPage.tsx',
];

for (const rel of EXPECTED_PAGES) {
  const abs = join(srcDir, rel);
  if (!existsSync(abs)) {
    infos.push(`[info] 页面尚未落盘，跳过规则①：${rel}`);
    continue;
  }
  const text = readSafe(abs) ?? '';
  if (!/from\s+['"]@\/components\/PrivacyHint['"]/.test(text)) {
    violations.push(`规则① 新页面未 import PrivacyHint：${rel}`);
  }
}

// ── 规则 ②：isPersonalResult:true 必须 requiresNoindex:true ────────
const configPath = join(srcDir, 'config', 'batch4-routes.ts');
if (!existsSync(configPath)) {
  violations.push('规则② 缺少 src/config/batch4-routes.ts，无法做路由合规交叉校验');
} else {
  const cfg = readSafe(configPath) ?? '';
  // 单行对象：{ path: '...', isPersonalResult: bool, requiresNoindex: bool, ... }
  const entryRe = /\{\s*path:\s*'([^']+)',\s*isPersonalResult:\s*(true|false),\s*requiresNoindex:\s*(true|false),/g;
  let m;
  let counted = 0;
  while ((m = entryRe.exec(cfg)) !== null) {
    counted += 1;
    const [, p, isPR, noindex] = m;
    if (isPR === 'true' && noindex !== 'true') {
      violations.push(`规则② 个人结果路由 ${p} 未声明 requiresNoindex:true`);
    }
  }
  if (counted === 0) {
    violations.push('规则② batch4-routes.ts 未解析到任何 RouteComplianceMeta 条目，检查正则是否漂移');
  }
}

// ── 规则 ③：文本数据文件必须含 disclaimer 字段 ──────────────────
const EXPECTED_DATA = [
  'data/divination/gufa/manifest.ts',
  'data/divination/gufa/sanming-tonghui.ts',
  'data/divination/gufa/guiguzi.ts',
  'data/divination/gufa/jiuxing.ts',
  'data/astrolabe/mansions/folk-table.ts',
  'data/astrolabe/mansions/birth-mansion.ts',
  'data/divination/fengshui-test/outcomes.ts',
  'data/divination/qinggong/table.ts',
  'data/knowledge/content/fengshui-home.ts',
  'data/knowledge/content/fengshui-office.ts',
  'data/knowledge/content/fengshui-shop.ts',
  'data/onomastics/english-name-mapping.ts',
  'data/names/popularity-seed.ts',
];

for (const rel of EXPECTED_DATA) {
  const abs = join(srcDir, rel);
  if (!existsSync(abs)) {
    infos.push(`[info] 数据文件尚未落盘，跳过规则③：${rel}`);
    continue;
  }
  const text = readSafe(abs) ?? '';
  if (!/disclaimer/.test(text)) {
    violations.push(`规则③ 文本数据文件缺少 disclaimer 字段：${rel}`);
  }
}

// ── 输出 ─────────────────────────────────────────────────────────
console.log('=== batch4 compliance audit ===');
for (const i of infos) console.log('  ' + i);
if (violations.length === 0) {
  console.log('  ✅ 无违规');
  process.exit(0);
}
console.error(`  ❌ 发现 ${violations.length} 项违规：`);
for (const v of violations) console.error('  - ' + v);
process.exit(1);
