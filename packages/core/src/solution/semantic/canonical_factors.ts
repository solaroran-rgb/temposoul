/**
 * 命律 · CIR v2 · Canonical Factor Ontology（三层受控词表）
 *
 * 第一层：领域层（12 个生活/命理领域）
 * 第二层：因子层（每个领域 3-5 个核心归一化因子）
 * 第三层：术语→因子映射，见 factor_mapping.ts（TERM_TO_FACTOR）
 *
 * 设计依据：特色论证2 v2.0 共识方案——跨体系（八字/紫微/西占/塔罗…）
 * 结论须收敛到一套稳定、可比对、可聚合的因子空间，而非各体系自有术语。
 */

// ============================================================
// 1. 第一层：领域层（12 个领域）
// ============================================================

export const DOMAINS = [
  'career',      // 事业
  'wealth',      // 财富
  'relationship',// 感情
  'health',      // 健康
  'decision',    // 决策
  'timing',      // 时机
  'direction',   // 方位
  'mind',        // 心态
  'marriage',    // 婚姻
  'children',    // 子女
  'parents',     // 父母
  'travel',      // 迁移
] as const;

/** 领域类型（DOMAINS 的字面量联合） */
export type Domain = (typeof DOMAINS)[number];

// ============================================================
// 2. 第二层：因子层
// ============================================================

/** 归一化因子 */
export interface CanonicalFactor {
  /** 因子 ID：'<domain>:<slug>'，全局唯一 */
  id: string;
  /** 中文标签 */
  label: string;
  /** 标准白话表述（归一化后的中性描述） */
  standard_white: string;
}

/** 各领域的核心因子（每域 3-5 个） */
export const CANONICAL_FACTORS: Record<Domain, CanonicalFactor[]> = {
  career: [
    { id: 'career:promotion_opportunity', label: '晋升机会', standard_white: '有晋升的机会' },
    { id: 'career:authority', label: '职权', standard_white: '掌握一定的权力' },
    { id: 'career:stability', label: '事业稳定', standard_white: '事业比较稳定' },
    { id: 'career:conflict', label: '职场冲突', standard_white: '职场中容易有冲突' },
    { id: 'career:change', label: '事业变动', standard_white: '事业上可能有变动' },
  ],
  wealth: [
    { id: 'wealth:structural_wealth', label: '财富基础', standard_white: '财富基础比较扎实' },
    { id: 'wealth:cash_flow', label: '现金流', standard_white: '现金流比较顺畅' },
    { id: 'wealth:risk', label: '破财风险', standard_white: '有破财的风险' },
    { id: 'wealth:investment', label: '投资运', standard_white: '投资运不错' },
  ],
  relationship: [
    { id: 'relationship:harmony', label: '关系和谐', standard_white: '关系比较和谐' },
    { id: 'relationship:conflict', label: '关系冲突', standard_white: '关系中容易有摩擦' },
    { id: 'relationship:commitment', label: '承诺度', standard_white: '关系的承诺度' },
    { id: 'relationship:attraction', label: '吸引力', standard_white: '互相有吸引力' },
  ],
  health: [
    { id: 'health:vitality', label: '精力状态', standard_white: '精力比较充沛' },
    { id: 'health:constitution', label: '体质根基', standard_white: '体质根基尚可' },
    { id: 'health:illness_risk', label: '病厄风险', standard_white: '要注意健康方面的隐患' },
    { id: 'health:recovery', label: '恢复力', standard_white: '身体恢复能力不错' },
  ],
  decision: [
    { id: 'decision:clarity', label: '判断清晰', standard_white: '做判断时比较清晰' },
    { id: 'decision:hesitation', label: '犹豫拖延', standard_white: '容易犹豫不决' },
    { id: 'decision:opportunity_window', label: '机会窗口', standard_white: '有值得把握的时机' },
    { id: 'decision:risk_assessment', label: '风险研判', standard_white: '对风险有基本判断' },
  ],
  timing: [
    { id: 'timing:auspicious', label: '时机利', standard_white: '当前时机比较有利' },
    { id: 'timing:inauspicious', label: '时机弊', standard_white: '当前时机不太顺' },
    { id: 'timing:transition', label: '变动期', standard_white: '处于变动转换的阶段' },
    { id: 'timing:peak', label: '高峰窗口', standard_white: '处于运势的高位' },
  ],
  direction: [
    { id: 'direction:favorable', label: '有利方位', standard_white: '有相对有利的方位' },
    { id: 'direction:unfavorable', label: '不利方位', standard_white: '有需要避开的方位' },
    { id: 'direction:wealth', label: '财位', standard_white: '财气聚集的方位' },
    { id: 'direction:relocation', label: '迁动方位', standard_white: '适合变动发展的方位' },
  ],
  mind: [
    { id: 'mind:focus', label: '专注力', standard_white: '注意力比较集中' },
    { id: 'mind:anxiety', label: '心绪波动', standard_white: '心绪容易起伏' },
    { id: 'mind:creativity', label: '才思', standard_white: '才思比较活跃' },
    { id: 'mind:peace', label: '心境安稳', standard_white: '心境比较安稳' },
  ],
  marriage: [
    { id: 'marriage:stability', label: '婚姻稳定', standard_white: '婚姻比较稳定' },
    { id: 'marriage:harmony', label: '夫妻和谐', standard_white: '夫妻关系比较和睦' },
    { id: 'marriage:conflict', label: '婚姻冲突', standard_white: '婚姻中容易有矛盾' },
    { id: 'marriage:commitment', label: '婚缘承诺', standard_white: '婚缘的承诺度' },
  ],
  children: [
    { id: 'children:fortune', label: '子女缘', standard_white: '子女缘分不错' },
    { id: 'children:relationship', label: '亲子关係', standard_white: '和孩子的关系尚可' },
    { id: 'children:future', label: '子女前景', standard_white: '子女发展前景尚可' },
    { id: 'children:education', label: '教养运', standard_white: '教养方面比较顺手' },
  ],
  parents: [
    { id: 'parents:support', label: '长辈助力', standard_white: '长辈能提供助力' },
    { id: 'parents:health', label: '长辈健康', standard_white: '要关注长辈健康' },
    { id: 'parents:relationship', label: '亲代关係', standard_white: '和父母关系尚可' },
    { id: 'parents:karma', label: '门荫根基', standard_white: '受家族根基影响' },
  ],
  travel: [
    { id: 'travel:mobility', label: '动象', standard_white: '生活中多有变动出行' },
    { id: 'travel:relocation_luck', label: '迁居运', standard_white: '迁居发展的运势尚可' },
    { id: 'travel:overseas', label: '远行运', standard_white: '远行外出的机会' },
    { id: 'travel:obstacle', label: '行路阻碍', standard_white: '出行要注意阻碍' },
  ],
};

/** 全量因子扁平列表 */
export const ALL_CANONICAL_FACTORS: CanonicalFactor[] = DOMAINS.flatMap(
  (d) => CANONICAL_FACTORS[d]
);

/** 因子 ID → 因子对象 索引 */
export const CANONICAL_FACTOR_INDEX: Record<string, CanonicalFactor> =
  Object.fromEntries(ALL_CANONICAL_FACTORS.map((f) => [f.id, f]));

/** 校验因子 ID 是否合法 */
export function isValidCanonicalFactor(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(CANONICAL_FACTOR_INDEX, id);
}
