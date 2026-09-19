/**
 * 命律 · 原型系统共享类型（R3-12）
 *
 * 领域词表与 R3-11 Canonical Factor Ontology 第一层 DOMAINS 严格对齐（12 域），
 * 禁止在本层另造领域名，避免与 CIR v2 的 canonical factor 命名空间冲突。
 */

// ============================================================
// 1. 领域层（对齐 R3-11 · DOMAINS）
// ============================================================

export const ARCHETYPE_DOMAINS = [
  'career', // 事业
  'wealth', // 财富
  'relationship', // 感情
  'health', // 健康
  'decision', // 决策
  'timing', // 时机
  'direction', // 方位
  'mind', // 心态（含「自我」语义）
  'marriage', // 婚姻
  'children', // 子女
  'parents', // 父母
  'travel', // 迁移
] as const;

export type ArchetypeDomain = (typeof ARCHETYPE_DOMAINS)[number];

/** 领域中文标签（展示层用，与 DOMAINS 同源） */
export const DOMAIN_LABELS: Record<ArchetypeDomain, string> = {
  career: '事业',
  wealth: '财富',
  relationship: '感情',
  health: '健康',
  decision: '决策',
  timing: '时机',
  direction: '方位',
  mind: '心态',
  marriage: '婚姻',
  children: '子女',
  parents: '父母',
  travel: '迁移',
};

// ============================================================
// 2. 禁忌语境（红线过滤输入）
// ============================================================

export const FORBIDDEN_CONTEXTS = [
  'health_crisis', // 重疾 / 危急病情
  'grief', // 丧亲 / 哀伤期
  'legal_dispute', // 诉讼 / 纠纷进行中
  'financial_ruin', // 破产 / 债务危机
  'pregnancy', // 孕期
  'acute_crisis', // 急性心理危机
] as const;

export type ForbiddenContext = (typeof FORBIDDEN_CONTEXTS)[number];

/** 禁忌语境中文标签 */
export const FORBIDDEN_CONTEXT_LABELS: Record<ForbiddenContext, string> = {
  health_crisis: '重疾危急',
  grief: '丧亲哀伤',
  legal_dispute: '诉讼纠纷',
  financial_ruin: '破产负债',
  pregnancy: '孕期',
  acute_crisis: '心理危机',
};

// ============================================================
// 3. 文化安全分级
// ============================================================

/**
 * 意象文化安全分级：
 * - safe：可直接进散文诗
 * - caution：可用但须配降级措辞（共识：高负极性只转写为「需注意、可借力」）
 * - forbidden：任何语境不得输出（见 imagery.ts FORBIDDEN_IMAGERY）
 */
export type CulturalSafety = 'safe' | 'caution' | 'forbidden';
