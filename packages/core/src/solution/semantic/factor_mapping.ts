/**
 * 命律 · CIR v2 · 第三层受控词表：术语 → 因子映射
 *
 * TERM_TO_FACTOR：各体系术语原文 → canonical factor 的映射规则
 *   - source_system：bazi / ziwei / western / tarot / ...
 *   - source_term：该体系术语原文
 *   - canonical_factor：指向 Canonical Factor Ontology 的 '<domain>:<slug>'
 *   - confidence：该术语在该语义方向上的置信度 [0,1]
 *
 * TERM_ID_TO_CANONICAL：Top50 术语 ID → 因子 ID 列表（运行时原子标注用，
 *   避免按中文名字符串匹配，直接由 termId 索引，零耦合）。
 */

import type { Domain } from './canonical_factors';

// ============================================================
// 1. 映射规则类型
// ============================================================

export interface TermMapping {
  /** 来源体系 */
  source_system: string;
  /** 来源术语原文 */
  source_term: string;
  /** 归一化因子 ID（'<domain>:<slug>'） */
  canonical_factor: string;
  /** 该术语在此语义方向上的置信度 */
  confidence: number;
}

// ============================================================
// 2. TERM_TO_FACTOR（覆盖 Top50 主要语义方向 + 跨体系示例）
// ============================================================

export const TERM_TO_FACTOR: TermMapping[] = [
  // —— 十神（bazi）——
  { source_system: 'bazi', source_term: '正官', canonical_factor: 'career:authority', confidence: 0.85 },
  { source_system: 'bazi', source_term: '正官', canonical_factor: 'career:stability', confidence: 0.8 },
  { source_system: 'bazi', source_term: '七杀', canonical_factor: 'career:change', confidence: 0.8 },
  { source_system: 'bazi', source_term: '七杀', canonical_factor: 'wealth:risk', confidence: 0.75 },
  { source_system: 'bazi', source_term: '七杀', canonical_factor: 'health:illness_risk', confidence: 0.7 },
  { source_system: 'bazi', source_term: '正印', canonical_factor: 'mind:peace', confidence: 0.82 },
  { source_system: 'bazi', source_term: '正印', canonical_factor: 'decision:clarity', confidence: 0.8 },
  { source_system: 'bazi', source_term: '偏印', canonical_factor: 'mind:creativity', confidence: 0.8 },
  { source_system: 'bazi', source_term: '偏印', canonical_factor: 'health:constitution', confidence: 0.72 },
  { source_system: 'bazi', source_term: '比肩', canonical_factor: 'relationship:harmony', confidence: 0.7 },
  { source_system: 'bazi', source_term: '比肩', canonical_factor: 'wealth:cash_flow', confidence: 0.68 },
  { source_system: 'bazi', source_term: '劫财', canonical_factor: 'wealth:risk', confidence: 0.78 },
  { source_system: 'bazi', source_term: '劫财', canonical_factor: 'relationship:conflict', confidence: 0.72 },
  { source_system: 'bazi', source_term: '食神', canonical_factor: 'mind:creativity', confidence: 0.82 },
  { source_system: 'bazi', source_term: '食神', canonical_factor: 'career:stability', confidence: 0.7 },
  { source_system: 'bazi', source_term: '伤官', canonical_factor: 'career:conflict', confidence: 0.78 },
  { source_system: 'bazi', source_term: '伤官', canonical_factor: 'mind:creativity', confidence: 0.76 },
  { source_system: 'bazi', source_term: '正财', canonical_factor: 'wealth:structural_wealth', confidence: 0.88 },
  { source_system: 'bazi', source_term: '正财', canonical_factor: 'wealth:cash_flow', confidence: 0.8 },
  { source_system: 'bazi', source_term: '偏财', canonical_factor: 'wealth:investment', confidence: 0.82 },
  { source_system: 'bazi', source_term: '偏财', canonical_factor: 'wealth:structural_wealth', confidence: 0.75 },

  // —— 宫位（bazi）——
  { source_system: 'bazi', source_term: '年柱宫', canonical_factor: 'parents:support', confidence: 0.78 },
  { source_system: 'bazi', source_term: '年柱宫', canonical_factor: 'parents:karma', confidence: 0.74 },
  { source_system: 'bazi', source_term: '月柱宫', canonical_factor: 'parents:relationship', confidence: 0.76 },
  { source_system: 'bazi', source_term: '月柱宫', canonical_factor: 'career:stability', confidence: 0.72 },
  { source_system: 'bazi', source_term: '日支宫', canonical_factor: 'marriage:harmony', confidence: 0.8 },
  { source_system: 'bazi', source_term: '日支宫', canonical_factor: 'marriage:commitment', confidence: 0.74 },
  { source_system: 'bazi', source_term: '时柱宫', canonical_factor: 'children:fortune', confidence: 0.8 },
  { source_system: 'bazi', source_term: '时柱宫', canonical_factor: 'children:relationship', confidence: 0.74 },
  { source_system: 'bazi', source_term: '命宫', canonical_factor: 'mind:focus', confidence: 0.8 },
  { source_system: 'bazi', source_term: '命宫', canonical_factor: 'decision:clarity', confidence: 0.76 },
  { source_system: 'bazi', source_term: '身宫', canonical_factor: 'health:constitution', confidence: 0.76 },
  { source_system: 'bazi', source_term: '身宫', canonical_factor: 'mind:focus', confidence: 0.72 },

  // —— 五行（bazi）——
  { source_system: 'bazi', source_term: '金', canonical_factor: 'health:constitution', confidence: 0.7 },
  { source_system: 'bazi', source_term: '金', canonical_factor: 'decision:clarity', confidence: 0.66 },
  { source_system: 'bazi', source_term: '木', canonical_factor: 'health:vitality', confidence: 0.7 },
  { source_system: 'bazi', source_term: '木', canonical_factor: 'mind:creativity', confidence: 0.68 },
  { source_system: 'bazi', source_term: '水', canonical_factor: 'mind:peace', confidence: 0.7 },
  { source_system: 'bazi', source_term: '水', canonical_factor: 'travel:mobility', confidence: 0.66 },
  { source_system: 'bazi', source_term: '火', canonical_factor: 'mind:focus', confidence: 0.72 },
  { source_system: 'bazi', source_term: '火', canonical_factor: 'career:promotion_opportunity', confidence: 0.68 },
  { source_system: 'bazi', source_term: '土', canonical_factor: 'wealth:structural_wealth', confidence: 0.74 },
  { source_system: 'bazi', source_term: '土', canonical_factor: 'health:constitution', confidence: 0.7 },

  // —— 关系（bazi）——
  { source_system: 'bazi', source_term: '生', canonical_factor: 'relationship:harmony', confidence: 0.8 },
  { source_system: 'bazi', source_term: '生', canonical_factor: 'mind:peace', confidence: 0.72 },
  { source_system: 'bazi', source_term: '克', canonical_factor: 'career:conflict', confidence: 0.78 },
  { source_system: 'bazi', source_term: '克', canonical_factor: 'wealth:risk', confidence: 0.72 },
  { source_system: 'bazi', source_term: '冲', canonical_factor: 'timing:transition', confidence: 0.8 },
  { source_system: 'bazi', source_term: '冲', canonical_factor: 'travel:obstacle', confidence: 0.74 },
  { source_system: 'bazi', source_term: '合', canonical_factor: 'relationship:harmony', confidence: 0.8 },
  { source_system: 'bazi', source_term: '合', canonical_factor: 'marriage:commitment', confidence: 0.74 },
  { source_system: 'bazi', source_term: '刑', canonical_factor: 'health:illness_risk', confidence: 0.74 },
  { source_system: 'bazi', source_term: '刑', canonical_factor: 'relationship:conflict', confidence: 0.72 },
  { source_system: 'bazi', source_term: '害', canonical_factor: 'wealth:risk', confidence: 0.72 },
  { source_system: 'bazi', source_term: '害', canonical_factor: 'health:illness_risk', confidence: 0.7 },

  // —— 用神（bazi）——
  { source_system: 'bazi', source_term: '用神', canonical_factor: 'decision:clarity', confidence: 0.82 },
  { source_system: 'bazi', source_term: '用神', canonical_factor: 'career:promotion_opportunity', confidence: 0.76 },
  { source_system: 'bazi', source_term: '喜神', canonical_factor: 'timing:auspicious', confidence: 0.8 },
  { source_system: 'bazi', source_term: '喜神', canonical_factor: 'wealth:cash_flow', confidence: 0.74 },
  { source_system: 'bazi', source_term: '忌神', canonical_factor: 'wealth:risk', confidence: 0.8 },
  { source_system: 'bazi', source_term: '忌神', canonical_factor: 'timing:inauspicious', confidence: 0.76 },
  { source_system: 'bazi', source_term: '仇神', canonical_factor: 'health:illness_risk', confidence: 0.74 },
  { source_system: 'bazi', source_term: '仇神', canonical_factor: 'career:conflict', confidence: 0.72 },

  // —— 神煞（bazi）——
  { source_system: 'bazi', source_term: '天乙贵人', canonical_factor: 'career:promotion_opportunity', confidence: 0.82 },
  { source_system: 'bazi', source_term: '天乙贵人', canonical_factor: 'decision:opportunity_window', confidence: 0.78 },
  { source_system: 'bazi', source_term: '文昌', canonical_factor: 'mind:focus', confidence: 0.8 },
  { source_system: 'bazi', source_term: '文昌', canonical_factor: 'decision:clarity', confidence: 0.76 },
  { source_system: 'bazi', source_term: '桃花', canonical_factor: 'relationship:attraction', confidence: 0.8 },
  { source_system: 'bazi', source_term: '桃花', canonical_factor: 'marriage:harmony', confidence: 0.72 },
  { source_system: 'bazi', source_term: '驿马', canonical_factor: 'travel:mobility', confidence: 0.82 },
  { source_system: 'bazi', source_term: '驿马', canonical_factor: 'travel:relocation_luck', confidence: 0.76 },
  { source_system: 'bazi', source_term: '华盖', canonical_factor: 'mind:creativity', confidence: 0.78 },
  { source_system: 'bazi', source_term: '华盖', canonical_factor: 'mind:peace', confidence: 0.72 },
  { source_system: 'bazi', source_term: '空亡', canonical_factor: 'decision:hesitation', confidence: 0.8 },
  { source_system: 'bazi', source_term: '空亡', canonical_factor: 'wealth:risk', confidence: 0.74 },

  // —— 星曜（ziwei）——
  { source_system: 'ziwei', source_term: '紫微', canonical_factor: 'career:authority', confidence: 0.84 },
  { source_system: 'ziwei', source_term: '紫微', canonical_factor: 'wealth:structural_wealth', confidence: 0.78 },
  { source_system: 'ziwei', source_term: '天府', canonical_factor: 'wealth:structural_wealth', confidence: 0.84 },
  { source_system: 'ziwei', source_term: '天府', canonical_factor: 'career:stability', confidence: 0.78 },
  { source_system: 'ziwei', source_term: '太阳', canonical_factor: 'career:promotion_opportunity', confidence: 0.8 },
  { source_system: 'ziwei', source_term: '太阳', canonical_factor: 'mind:focus', confidence: 0.74 },
  { source_system: 'ziwei', source_term: '太阴', canonical_factor: 'wealth:cash_flow', confidence: 0.8 },
  { source_system: 'ziwei', source_term: '太阴', canonical_factor: 'mind:peace', confidence: 0.74 },
  { source_system: 'ziwei', source_term: '武曲', canonical_factor: 'wealth:investment', confidence: 0.82 },
  { source_system: 'ziwei', source_term: '武曲', canonical_factor: 'career:authority', confidence: 0.76 },

  // —— 奇门（qimen）——
  { source_system: 'qimen', source_term: '青龙返首', canonical_factor: 'timing:auspicious', confidence: 0.82 },
  { source_system: 'qimen', source_term: '青龙返首', canonical_factor: 'decision:opportunity_window', confidence: 0.78 },
  { source_system: 'qimen', source_term: '飞鸟跌穴', canonical_factor: 'timing:auspicious', confidence: 0.8 },
  { source_system: 'qimen', source_term: '飞鸟跌穴', canonical_factor: 'career:promotion_opportunity', confidence: 0.76 },
  { source_system: 'qimen', source_term: '白虎猖狂', canonical_factor: 'timing:inauspicious', confidence: 0.8 },
  { source_system: 'qimen', source_term: '白虎猖狂', canonical_factor: 'wealth:risk', confidence: 0.76 },

  // —— 灵签（lottery）——
  { source_system: 'lottery', source_term: '上签', canonical_factor: 'decision:clarity', confidence: 0.78 },
  { source_system: 'lottery', source_term: '上签', canonical_factor: 'timing:auspicious', confidence: 0.8 },
  { source_system: 'lottery', source_term: '中签', canonical_factor: 'decision:hesitation', confidence: 0.74 },
  { source_system: 'lottery', source_term: '中签', canonical_factor: 'timing:transition', confidence: 0.72 },
  { source_system: 'lottery', source_term: '下签', canonical_factor: 'timing:inauspicious', confidence: 0.8 },
  { source_system: 'lottery', source_term: '下签', canonical_factor: 'wealth:risk', confidence: 0.74 },

  // —— 跨体系示例（特色论证2 v2.0）——
  { source_system: 'bazi', source_term: '财星得地', canonical_factor: 'wealth:structural_wealth', confidence: 0.8 },
  { source_system: 'ziwei', source_term: '财帛宫有紫微天府', canonical_factor: 'wealth:structural_wealth', confidence: 0.85 },
  { source_system: 'western', source_term: '二宫木星三分相', canonical_factor: 'wealth:structural_wealth', confidence: 0.7 },
  { source_system: 'tarot', source_term: '星币十正位', canonical_factor: 'wealth:structural_wealth', confidence: 0.75 },
];

// ============================================================
// 3. Top50 术语 ID → 因子 ID（运行时原子标注索引）
// ============================================================

/**
 * 由 termId 直接索引归一化因子，避免中文名字符串匹配的不确定性。
 * 与 TERM_TO_FACTOR 同源设计，但面向引擎内部（runSolution 原子标注）。
 */
export const TERM_ID_TO_CANONICAL: Record<string, string[]> = {
  // 十神
  ZG: ['career:authority', 'career:stability'],
  QS: ['career:change', 'wealth:risk', 'health:illness_risk'],
  ZY: ['mind:peace', 'decision:clarity'],
  PY: ['mind:creativity', 'health:constitution'],
  BJ: ['relationship:harmony', 'wealth:cash_flow'],
  JC: ['wealth:risk', 'relationship:conflict'],
  SS: ['mind:creativity', 'career:stability'],
  SG: ['career:conflict', 'mind:creativity'],
  ZC: ['wealth:structural_wealth', 'wealth:cash_flow'],
  PC: ['wealth:investment', 'wealth:structural_wealth'],
  // 宫位
  NPG: ['parents:support', 'parents:karma'],
  YCG: ['parents:relationship', 'career:stability'],
  RZG: ['marriage:harmony', 'marriage:commitment'],
  SGG: ['children:fortune', 'children:relationship'],
  MG: ['mind:focus', 'decision:clarity'],
  SGS: ['health:constitution', 'mind:focus'],
  // 五行
  J: ['health:constitution', 'decision:clarity'],
  M: ['health:vitality', 'mind:creativity'],
  S: ['mind:peace', 'travel:mobility'],
  H: ['mind:focus', 'career:promotion_opportunity'],
  T: ['wealth:structural_wealth', 'health:constitution'],
  // 关系
  SHENG: ['relationship:harmony', 'mind:peace'],
  KE: ['career:conflict', 'wealth:risk'],
  CHONG: ['timing:transition', 'travel:obstacle'],
  HE: ['relationship:harmony', 'marriage:commitment'],
  XING: ['health:illness_risk', 'relationship:conflict'],
  HAI: ['wealth:risk', 'health:illness_risk'],
  // 用神
  YS: ['decision:clarity', 'career:promotion_opportunity'],
  XS: ['timing:auspicious', 'wealth:cash_flow'],
  JS: ['wealth:risk', 'timing:inauspicious'],
  CS: ['health:illness_risk', 'career:conflict'],
  // 神煞
  TYGR: ['career:promotion_opportunity', 'decision:opportunity_window'],
  WC: ['mind:focus', 'decision:clarity'],
  TH: ['relationship:attraction', 'marriage:harmony'],
  YM: ['travel:mobility', 'travel:relocation_luck'],
  HG: ['mind:creativity', 'mind:peace'],
  KW: ['decision:hesitation', 'wealth:risk'],
  // 星曜
  ZW: ['career:authority', 'wealth:structural_wealth'],
  TF: ['wealth:structural_wealth', 'career:stability'],
  TY: ['career:promotion_opportunity', 'mind:focus'],
  TYI: ['wealth:cash_flow', 'mind:peace'],
  WQ: ['wealth:investment', 'career:authority'],
  // 奇门
  QLSF: ['timing:auspicious', 'decision:opportunity_window'],
  FNDC: ['timing:auspicious', 'career:promotion_opportunity'],
  BHCK: ['timing:inauspicious', 'wealth:risk'],
  // 灵签
  SQ: ['decision:clarity', 'timing:auspicious'],
  ZQ: ['decision:hesitation', 'timing:transition'],
  XQ: ['timing:inauspicious', 'wealth:risk'],
};

/** 取术语 ID 的归一化因子（无映射返回空数组） */
export function canonicalFactorsOfTerm(termId: string): string[] {
  return TERM_ID_TO_CANONICAL[termId] ?? [];
}

/** 因子 ID 的默认时间作用域（按主领域推断） */
export function defaultTimeScopeOfFactor(factorId: string): 'long_term' | 'current' | 'event' | 'general' {
  const domain = factorId.split(':')[0] as Domain;
  switch (domain) {
    case 'timing':
    case 'travel':
      return 'event';
    case 'career':
    case 'wealth':
    case 'relationship':
    case 'marriage':
    case 'children':
    case 'parents':
      return 'long_term';
    case 'health':
    case 'mind':
    case 'decision':
    case 'direction':
    default:
      return 'general';
  }
}
