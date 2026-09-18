/**
 * 命律 · 八字模板端到端 demo
 *
 * 演示流程：
 * 1. 构造模拟命盘数据
 * 2. 消歧十神（正官）
 * 3. 生成三路径白话（pro/mix/lay）
 * 4. 三道闸校验
 */
import { TEN_GOD_REGISTRY } from './index';
import { disambiguate } from './disambiguation';
import { runGates, type WhiteTalkSentence } from './gates';
import { confidenceToModality, netConfidence } from './confidence';

// ============================================================
// 1. 模拟命盘数据
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
    day: ['日主'],
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
    cycles: [],
  },
  liunian: [],
};

// ============================================================
// 2. 消歧十神（正官）
// ============================================================

console.log('=== 命律解盘 Demo ===\n');

const zhengGuan = TEN_GOD_REGISTRY['ZG'];
console.log(`术语：${zhengGuan.name}（${zhengGuan.id}）`);
console.log(`因子数：${zhengGuan.factors.length}`);
console.log(`组合数：${zhengGuan.combos.length}\n`);

const result = disambiguate(zhengGuan, mockBaziContext, 3);
console.log('消歧结果：');
console.log(`  命中因子：${result.factors.map((f) => f.name).join(', ')}`);
console.log(`  命中组合：${result.combos.map((c) => c.name).join(', ') || '无'}`);
console.log(`  置信度：support=${result.confidence.support.toFixed(2)}, oppose=${result.confidence.oppose.toFixed(2)}, uncertain=${result.confidence.uncertain.toFixed(2)}`);
console.log(`  净置信度：${netConfidence(result.confidence).toFixed(2)}`);
console.log(`  模态：${confidenceToModality(netConfidence(result.confidence))}\n`);

// ============================================================
// 3. 生成三路径白话
// ============================================================

const template = zhengGuan.templates[0]; // 官印相生
console.log('=== 三路径输出（官印相生）===\n');

const sentences: WhiteTalkSentence[] = [
  {
    text: template.pro,
    layer: 'L0',
    polarity: template.polarity,
    modality: template.modality,
    atomicId: template.atomicId,
  },
  {
    text: template.mix,
    layer: 'L2',
    polarity: template.polarity,
    modality: 'likely',
    atomicId: template.atomicId,
  },
  {
    text: template.lay,
    layer: 'L2',
    polarity: template.polarity,
    modality: 'tend',
    atomicId: template.atomicId,
  },
];

// ============================================================
// 4. 三道闸校验
// ============================================================

console.log('=== 三道闸校验 ===\n');
for (const s of sentences) {
  const gateResult = runGates(s);
  console.log(`[${s.layer}] ${s.text}`);
  console.log(`  极性: ${s.polarity}, 模态: ${s.modality}`);
  console.log(`  通过: ${gateResult.pass ? '✅' : '❌'}`);
  if (!gateResult.pass) {
    console.log(`  错误: ${gateResult.errors.join('; ')}`);
  }
  console.log('');
}

// ============================================================
// 5. 输出汇总
// ============================================================

console.log('=== Demo 完成 ===');
console.log('流程：排盘 → 消歧 → 置信度 → 模板渲染 → 三道闸 → 三路径输出');
console.log('Top50 术语：十神 10/10 ✅，其余 40 条待 R3-3 填充');
