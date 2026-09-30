/**
 * 命律 · 跨术语组合层（KG 边表）
 *
 * N-5：GBNF+AST 双重受限解码 + KG 硬校验
 * 静态边表 O(1) 查询，禁图推理
 */
import type { FactPolarity } from './types';

// ============================================================
// 1. KG 边定义
// ============================================================

export interface KgEdge {
  /** 原因子 ID（如 ZG-1） */
  causeId: string;
  /** 效果因子 ID（如 ZY-1） */
  effectId: string;
  /** 领域标签 */
  domain: string;
  /** 极性影响 */
  polarity: FactPolarity;
  /** 来源规则 ID */
  sourceRuleId: string;
  /** 边类型 */
  edgeType: 'mitigate' | 'amplify' | 'transform' | 'neutralize';
  /** 版本 */
  version: string;
}

// ============================================================
// 2. 静态边表（15 基础边 + 5 条件边）
// ============================================================

export const KG_EDGES: KgEdge[] = [
  // === 基础边（十神间组合） ===
  { causeId: 'SG-5', effectId: 'ZG-1', domain: '事业', polarity: '-', sourceRuleId: 'RULE-SG-ZG', edgeType: 'transform', version: '1.0' }, // 伤官见官
  { causeId: 'ZG-1', effectId: 'ZY-1', domain: '事业', polarity: '+', sourceRuleId: 'RULE-ZG-ZY', edgeType: 'amplify', version: '1.0' }, // 官印相生
  { causeId: 'SS-1', effectId: 'QS-1', domain: '事业', polarity: '+', sourceRuleId: 'RULE-SS-QS', edgeType: 'mitigate', version: '1.0' }, // 食神制杀
  { causeId: 'QS-1', effectId: 'ZY-1', domain: '事业', polarity: '+', sourceRuleId: 'RULE-QS-ZY', edgeType: 'transform', version: '1.0' }, // 杀印相生
  { causeId: 'BJ-4', effectId: 'ZC-1', domain: '财富', polarity: '-', sourceRuleId: 'RULE-BJ-ZC', edgeType: 'mitigate', version: '1.0' }, // 比肩夺财
  { causeId: 'JC-2', effectId: 'ZC-1', domain: '财富', polarity: '-', sourceRuleId: 'RULE-JC-ZC', edgeType: 'mitigate', version: '1.0' }, // 劫财夺财
  { causeId: 'SS-5', effectId: 'ZC-1', domain: '财富', polarity: '+', sourceRuleId: 'RULE-SS-ZC', edgeType: 'amplify', version: '1.0' }, // 食神生财
  { causeId: 'PC-1', effectId: 'ZG-1', domain: '事业', polarity: '+', sourceRuleId: 'RULE-PC-ZG', edgeType: 'amplify', version: '1.0' }, // 偏财生官
  { causeId: 'PY-1', effectId: 'SS-1', domain: '才华', polarity: '-', sourceRuleId: 'RULE-PY-SS', edgeType: 'mitigate', version: '1.0' }, // 枭神夺食
  { causeId: 'PY-3', effectId: 'SG-1', domain: '才华', polarity: '+', sourceRuleId: 'RULE-PY-SG', edgeType: 'amplify', version: '1.0' }, // 偏印配伤官
  { causeId: 'ZG-1', effectId: 'QS-1', domain: '事业', polarity: '0', sourceRuleId: 'RULE-ZG-QS', edgeType: 'neutralize', version: '1.0' }, // 官杀混杂
  { causeId: 'ZY-1', effectId: 'PY-1', domain: '学业', polarity: '0', sourceRuleId: 'RULE-ZY-PY', edgeType: 'neutralize', version: '1.0' }, // 正偏印混杂
  { causeId: 'BJ-1', effectId: 'JC-1', domain: '竞争', polarity: '0', sourceRuleId: 'RULE-BJ-JC', edgeType: 'neutralize', version: '1.0' }, // 比劫混杂
  { causeId: 'ZC-1', effectId: 'PC-1', domain: '财富', polarity: '0', sourceRuleId: 'RULE-ZC-PC', edgeType: 'neutralize', version: '1.0' }, // 财星混杂
  { causeId: 'SG-5', effectId: 'PY-1', domain: '规则', polarity: '+', sourceRuleId: 'RULE-SG-PY', edgeType: 'mitigate', version: '1.0' }, // 伤官配印

  // === 条件边（5 个） ===
  { causeId: 'QS-5', effectId: 'SS-1', domain: '健康', polarity: '-', sourceRuleId: 'RULE-QS-HEALTH', edgeType: 'mitigate', version: '1.0' }, // 七杀攻身→需食神制
  { causeId: 'ZG-1', effectId: 'BJ-1', domain: '规则', polarity: '-', sourceRuleId: 'RULE-ZG-BJ', edgeType: 'amplify', version: '1.0' }, // 正官制比劫
  { causeId: 'PC-1', effectId: 'QS-1', domain: '事业', polarity: '-', sourceRuleId: 'RULE-PC-QS', edgeType: 'amplify', version: '1.0' }, // 财生杀党
  { causeId: 'ZY-1', effectId: 'SG-1', domain: '才华', polarity: '-', sourceRuleId: 'RULE-ZY-SG', edgeType: 'mitigate', version: '1.0' }, // 正印制伤官
  { causeId: 'WC-1', effectId: 'SS-1', domain: '学业', polarity: '+', sourceRuleId: 'RULE-WC-SS', edgeType: 'amplify', version: '1.0' }, // 文昌配食神
];

// ============================================================
// 3. 边查询（O(1)）
// ============================================================

/** 按 causeId 查边 */
export function getEdgesByCause(causeId: string): KgEdge[] {
  return KG_EDGES.filter((e) => e.causeId === causeId);
}

/** 按 effectId 查边 */
export function getEdgesByEffect(effectId: string): KgEdge[] {
  return KG_EDGES.filter((e) => e.effectId === effectId);
}

/** 按领域查边 */
export function getEdgesByDomain(domain: string): KgEdge[] {
  return KG_EDGES.filter((e) => e.domain === domain);
}

// ============================================================
// 4. 极性合成
// ============================================================

/**
 * 合成极性：多个边的极性影响
 * --/-/0/+/++ 映射到数值 -2/-1/0/+1/+2
 */
const POLARITY_VALUE: Record<FactPolarity, number> = {
  '--': -2,
  '-': -1,
  '0': 0,
  '+': 1,
  '++': 2,
};

/**
 * 合成极性：聚合一组命中 atom 的自身极性（template.polarity）
 *
 * 设计校正（R3-10 / task1）：
 * 原实现按 atomicId 反查 KG 边表做图遍历，因「正官→比劫(-)」「正印→伤官(-)」
 * 等边在任意盘局都会命中，正负相消导致总极性恒为 '0'（无法区分盘局）。
 * 原子极性（template.polarity）才是该 COMBO 的真实结论极性，直接聚合即可
 * 正确反映盘局整体倾向：正官格→+ / 比劫格→- / 伤官格→混合。
 * KG 边表（getEdgesByCause 等）保留供单条关系解释使用，不再参与总极性合成。
 */
export function compositePolarity(polarities: FactPolarity[]): FactPolarity {
  if (polarities.length === 0) return '0';

  let sum = 0;
  for (const p of polarities) {
    sum += POLARITY_VALUE[p];
  }

  const avg = sum / polarities.length;
  if (avg <= -1.5) return '--';
  if (avg <= -0.5) return '-';
  if (avg < 0.5) return '0';
  if (avg < 1.5) return '+';
  return '++';
}
