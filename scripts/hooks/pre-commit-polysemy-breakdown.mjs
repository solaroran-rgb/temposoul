#!/usr/bin/env node
/**
 * T-15C · C3 · L3 pre-commit 计价熔断钩子（B-4 区间计价）
 * ------------------------------------------------------------------
 * 规则来源（冻结口径，勿擅改）：
 *   - E-04 裁决补充《B-4 计价口径统一 20261008》：R2 区间制（冲突数决定整批处理成本，单位=每批 wave 级）
 *       0 冲突   → L1 ¥0.5（机器直出 + 抽检）
 *       1–2 冲突 → L2 ¥15（人工单条译审，本钩子仅告警、不阻断）
 *       ≥3 冲突  → L3 ¥150（人工全批译审 + 返工）
 *       L3 熔断  → ≥3 冲突在 CI pre-commit 拦截：无效人工成本 → 有效计价 ¥0
 *   - 「冲突」= key 库同一 term 的多义 sense 冲突（B-3 17 条消解决策树判定）。
 *   - 计价只用于成本核算/预算门禁，不向用户收费；R1 分级单价 ¥30/150/500 已作废。
 *   - 真值定价模块见 packages/core/src/vedic/cost.ts（estimateVedicCost / VEDIC_L3_BREAKDOWN_THRESHOLD=3）。
 *
 * 本钩子可自动判定的部分（结构性信号）：
 *   统计本次暂存（staged）改动里，key 库（src/data/mappings/ 等）中「新增多义 sense 行」所触及的
 *   去重基础术语数 = 冲突数。≥3 → 拦截(exit 1)；否则放行(exit 0)。
 *
 * 局限（如实登记）：
 *   B-3 决策树的最终语义判定——某个 term 该落到哪个 namespace 的 sense——属专家人工消歧，
 *   本钩子不做语义裁决，只做预算门禁/熔断：它计数结构性冲突并在 ≥3 时拦下，转人工按 B-3 树消解。
 *   非 key 库改动（页面/脚本/样式等）一律冲突数=0，直接放行，不破坏既有提交流。
 *
 * 失败策略：脚本自身任何异常 → 打印告警并放行(exit 0)（fail-open，钩子 bug 不阻断提交）；
 *           仅当“正面数出 ≥3 冲突”时才 fail-closed(exit 1)。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// ---- 冻结计价常量（与 packages/core/src/vedic/cost.ts 对齐，E-04 裁决补充） ----
const PRICE = { L1: 0.5, L2: 15, L3: 150 };
const L3_THRESHOLD = 3;

// key 库（多义/映射/词典）路径白名单：只有这些文件的暂存改动才计入冲突。
const KEY_LIB_RE = /(^|\/)src\/data\/(mappings\/|lexicon[^/]*\.ts)/;

// 新增 sense 行：a8-polysemy.ts 里的 R('<ns>', '<term>', '<senseId>' ...)
const ROW_RE = /R\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"][^'"]+['"]/;

function gitDiffCached() {
  return execFileSync('git', ['diff', '--cached'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

/** 解析 unified diff，统计暂存新增的多义 sense 行触及的去重基础术语数。 */
function countConflictsFromDiff(diffText) {
  const terms = new Set();
  let currentFile = '';
  for (const rawLine of diffText.split(/\r?\n/)) {
    const hdr = rawLine.match(/^\+\+\+ b\/(.*)$/);
    if (hdr) {
      currentFile = hdr[1];
      continue;
    }
    // 只统计 key 库文件里“新增”的行
    if (!rawLine.startsWith('+') || rawLine.startsWith('+++')) continue;
    if (!KEY_LIB_RE.test(currentFile)) continue;
    const m = rawLine.slice(1).match(ROW_RE);
    if (m && m[1]) terms.add(m[1]);
  }
  return { conflictCount: terms.size, terms: [...terms] };
}

function tierFor(n) {
  if (n === 0) return 'L1';
  if (n <= 2) return 'L2';
  return 'L3';
}

function main() {
  // 支持 --diff-file=<path> 喂入固定 diff（用于两态自测，不触碰真实 git 索引）
  const diffFileArg = process.argv.find((a) => a.startsWith('--diff-file='));
  let diffText;
  if (diffFileArg) {
    diffText = readFileSync(diffFileArg.split('=')[1], 'utf8');
  } else {
    try {
      diffText = gitDiffCached();
    } catch {
      // 非 git 仓 / 无暂存区：钩子不干预
      console.log('[polysemy-breakdown] 非 git 暂存上下文，跳过（放行）。');
      return 0;
    }
  }

  const { conflictCount, terms } = countConflictsFromDiff(diffText);
  const tier = tierFor(conflictCount);

  console.log(`[polysemy-breakdown] 冲突数=${conflictCount}（去重基础术语${terms.length ? '：' + terms.join('、') : '：本次暂存未触及 key 库多义行'}）`);

  if (conflictCount >= L3_THRESHOLD) {
    console.error('[polysemy-breakdown] ❌ L3 熔断触发：' + conflictCount + ' 冲突 ≥ ' + L3_THRESHOLD + '（B-4 区间计价 · E-04 裁决补充）');
    console.error('[polysemy-breakdown]    → 已在 CI pre-commit 拦截：无效人工成本不计入，有效计价 ¥0（名义 L3 ¥150 作废）');
    console.error('[polysemy-breakdown]    → 处置：先按 B-3 17 条消解决策树在 key 库人工消解多义 sense，再重新提交。');
    return 1;
  }

  if (tier === 'L2') {
    console.log(`[polysemy-breakdown] ⚠ L2 告警：${conflictCount} 冲突（1–2）→ 人工单条译审，计价 ¥${PRICE.L2}/批；不阻断提交。`);
    return 0;
  }

  console.log(`[polysemy-breakdown] ✅ L1：0 冲突 → 机器直出 + 抽检，计价 ¥${PRICE.L1}/批；放行。`);
  return 0;
}

try {
  process.exit(main());
} catch (err) {
  // fail-open：钩子自身异常绝不阻断提交流
  console.error('[polysemy-breakdown] 预检异常（放行，不阻断提交流）：' + (err && err.message ? err.message : String(err)));
  process.exit(0);
}
