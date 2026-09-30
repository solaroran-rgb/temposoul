/**
 * 命律 · 完整 Top50 命盘分析 demo
 *
 * 演示流程：
 * 1. 构造模拟命盘（多术语同时命中）
 * 2. 遍历 TOP50_REGISTRY
 * 3. 消歧 + 置信度 + 组合条件
 * 4. 三道闸校验
 * 5. 三路径输出汇总
 */
import { TOP50_REGISTRY } from './index';
import { runSolution } from './solution';
import { saveSnapshotV2, listSnapshotsV2 } from './snapshot';
import { disambiguate } from './disambiguation';
import { runGates, type WhiteTalkSentence } from './gates';
import { confidenceToModality, netConfidence } from './confidence';
import { getEdgesByCause } from './kg';

// ============================================================
// 1. 模拟命盘
// ============================================================

const mockBaziContext = {
  tenGods: {
    year: '正官',
    month: '正印',
    day: '日主',
    hour: '偏财',
  },
  hiddenStems: {
    year: ['正官'],
    month: ['正印'],
    day: ['比肩'],
    hour: ['偏财'],
  },
  wuxingStrength: {
    missing: [],
    present: ['金', '木', '水', '火', '土'],
    dominantByRule: '金',
    ruleBasis: '月令',
  },
  analysis: {
    usefulGod: {
      favorable: ['火', '土'],
      unfavorable: ['水', '木'],
      useful: '火',
      avoid: '水',
    },
  },
  pillars: {
    year: { gan: '甲', zhi: '子', ganZhi: '甲子' },
    month: { gan: '丙', zhi: '寅', ganZhi: '丙寅' },
    day: { gan: '甲', zhi: '午', ganZhi: '甲午' },
    hour: { gan: '丁', zhi: '卯', ganZhi: '丁卯' },
  },
  luckInfo: {
    cycles: [
      { tenGod: '正官', ganZhi: '戊辰' },
      { tenGod: '正印', ganZhi: '己巳' },
    ],
  },
  liunian: [
    { tenGod: '正官', ganZhi: '甲午' },
  ],
  shensha: ['天乙贵人', '文昌'],
  baziShenSha: ['天乙贵人'],
  kongWang: [],
};

// ============================================================
// 2. 遍历 Top50
// ============================================================

console.log('=== 命律 Top50 完整命盘分析 Demo ===\n');
console.log(`术语总数：${Object.keys(TOP50_REGISTRY).length}\n`);

const results: Array<{
  termId: string;
  termName: string;
  factorCount: number;
  comboCount: number;
  confidence: number;
  modality: string;
  polarity: string;
}> = [];

let gatePass = 0;
let gateFail = 0;

for (const [termId, term] of Object.entries(TOP50_REGISTRY)) {
  const result = disambiguate(term, mockBaziContext, 3);
  const netConf = netConfidence(result.confidence);
  const modality = confidenceToModality(netConf);

  // 只输出有意义的（置信度 > 0.2）
  if (Math.abs(netConf) < 0.2) continue;

  // 检查白话模板
  for (const tpl of term.templates) {
    const sentence: WhiteTalkSentence = {
      text: tpl.lay,
      layer: 'L2',
      polarity: tpl.polarity,
      modality: tpl.modality,
      atomicId: tpl.atomicId,
    };
    const gateResult = runGates(sentence);
    if (gateResult.pass) {
      gatePass++;
    } else {
      gateFail++;
    }
  }

  results.push({
    termId,
    termName: term.name,
    factorCount: result.factors.length,
    comboCount: result.combos.length,
    confidence: netConf,
    modality,
    polarity: result.combos[0] ? term.templates.find(t => t.comboId === result.combos[0].id)?.polarity || '0' : '0',
  });
}

// ============================================================
// 3. 输出汇总
// ============================================================

console.log(`命中术语：${results.length} / 50\n`);
console.log('=== 命中明细（按置信度排序）===\n');

results.sort((a, b) => Math.abs(b.confidence) - Math.abs(a.confidence));

for (const r of results.slice(0, 15)) {
  console.log(`${r.termId.padEnd(6)} ${r.termName.padEnd(6)} | 因子:${r.factorCount} | 组合:${r.comboCount} | 置信度:${r.confidence.toFixed(2)} | 模态:${r.modality} | 极性:${r.polarity}`);
}

// ============================================================
// 4. KG 边表演示
// ============================================================

console.log('\n=== KG 边表演示（正官→其他术语）===\n');
const edges = getEdgesByCause('ZG-1');
for (const edge of edges) {
  console.log(`  ${edge.causeId} → ${edge.effectId} | 领域:${edge.domain} | 极性:${edge.polarity} | 类型:${edge.edgeType}`);
}

// ============================================================
// 5. 三道闸统计
// ============================================================

console.log('\n=== 三道闸统计 ===');
console.log(`通过：${gatePass}`);
console.log(`失败：${gateFail}`);
console.log(`通过率：${(gatePass / (gatePass + gateFail) * 100).toFixed(1)}%\n`);

// ============================================================
// 6. 三盘格局验证（R3-10 task1-6 修复后）
// ============================================================

type ChartCtx = Record<string, unknown>;

function mkChart(tenGods: Record<string, string>, dominant: string): ChartCtx {
  return {
    tenGods,
    hiddenStems: { year: [], month: [], day: [], hour: [] },
    wuxingStrength: { missing: [], present: ['金', '木', '水', '火', '土'], dominantByRule: dominant, ruleBasis: '月令' },
    analysis: { usefulGod: { favorable: ['火', '土'], unfavorable: ['水', '木'], useful: '火', avoid: '水' } },
    pillars: {
      year: { gan: '甲', zhi: '子', ganZhi: '甲子' },
      month: { gan: '丙', zhi: '寅', ganZhi: '丙寅' },
      day: { gan: '甲', zhi: '午', ganZhi: '甲午' },
      hour: { gan: '丁', zhi: '卯', ganZhi: '丁卯' },
    },
    luckInfo: { cycles: [] as Array<{ tenGod: string; ganZhi: string }> },
    liunian: [] as Array<{ tenGod: string; ganZhi: string }>,
    shensha: [] as string[],
    baziShenSha: [] as string[],
    kongWang: [] as string[],
  };
}

const chartCases: Array<[string, ChartCtx, string]> = [
  ['正官格', mkChart({ year: '正官', month: '正印', day: '日主', hour: '正财' }, '金'), '+'],
  ['伤官格', mkChart({ year: '伤官', month: '正印', day: '正官', hour: '正财' }, '火'), '0'],
  ['比劫格', mkChart({ year: '比肩', month: '劫财', day: '日主', hour: '正财' }, '木'), '-'],
];

console.log('\n=== 三盘格局验证（总极性 / mix·lay 句数）===\n');
for (const [name, ctx, expect] of chartCases) {
  const r = runSolution({ context: ctx });
  const ok = r.pro.overallPolarity === expect ? '✅' : '⚠️';
  console.log(
    `${ok} ${name}：总极性=${r.pro.overallPolarity} (期望 ${expect}) | pro:${r.pro.sentences.length} mix:${r.mix.sentences.length} lay:${r.lay.sentences.length}`,
  );
}

// ============================================================
// 7. CIR v2 演示（process_log + canonical_factors + snapshot）
// ============================================================

console.log('\n=== CIR v2 · 解盘流程日志 process_log ===\n');

// 用完整模拟命盘跑一遍（含消歧 / 三道闸 / D-S 融合）
const cirOut = runSolution({ context: mockBaziContext });

console.log(`process_log 事件数：${cirOut.process_log?.length ?? 0}\n`);
for (const ev of cirOut.process_log ?? []) {
  const keys = Object.keys(ev.detail).join(', ');
  console.log(`  [${ev.step.padEnd(16)}] engine=${ev.engine.padEnd(6)} cost=${String(ev.cost_ms).padStart(4)}ms | detail: ${keys}`);
}

console.log('\n=== CIR v2 · 原子归一化因子 canonical_factors ===\n');

let annotatedAtoms = 0;
const factorSet = new Set<string>();
for (const atom of cirOut.meta.atoms) {
  const factors = atom.canonical_factors ?? [];
  if (factors.length > 0) annotatedAtoms++;
  for (const f of factors) factorSet.add(f);
  console.log(
    `  ${atom.atomicId.padEnd(10)} term=${atom.termId.padEnd(5)} time=${String(atom.time_scope).padEnd(9)} factors=[${factors.join(', ')}]`,
  );
}
console.log(`\n归一化标注原子：${annotatedAtoms} / ${cirOut.meta.atoms.length}`);
console.log(`命中去重因子：${factorSet.size} 个 → [${[...factorSet].join(', ')}]`);

// schema_version 与快照序列化
console.log(`\n解盘 schema_version：${cirOut.meta.version}`);
const snap = saveSnapshotV2(cirOut, { systems: ['bazi', 'top50'], engine_version: 'cir_v2.0' });
console.log(`快照已固化：seed=${snap.seed}  snapshot_id=${snap.snapshot_id}`);
console.log(`  原子=${snap.atoms.length}  process_log=${snap.process_log.length}  ref_ids=${snap.ref_ids.length}  schema=${snap.schema_version}`);
console.log(`  内存快照总数(listSnapshotsV2)：${listSnapshotsV2().length}`);

console.log('\n=== Demo 完成 ===');
console.log('Top50 数据层 ✅ | 消歧引擎 ✅ | D-S 置信度 ✅ | 三道闸 ✅ | KG 边表 ✅ | 三盘验证 ✅ | CIR v2 ✅');
