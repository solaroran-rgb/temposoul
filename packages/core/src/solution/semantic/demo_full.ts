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

console.log('=== Demo 完成 ===');
console.log('Top50 数据层 ✅ | 消歧引擎 ✅ | D-S 置信度 ✅ | 三道闸 ✅ | KG 边表 ✅');
