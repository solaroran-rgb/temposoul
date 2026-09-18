/**
 * 命律 · 三级结论白话转译系统 · 语义本体层类型定义
 *
 * 本文件定义 Top50 术语的结构化数据契约。
 * 所有术语（十神/宫位/五行/关系/用神/神煞/星曜/奇门/灵签）均为 TermSchema 的实例。
 *
 * 设计依据：
 * - D-1 消歧三件套：规则树 + 评分卡 + 决策表
 * - D-2 D-S 置信度：五档模态
 * - D-3 画像不进置信度/极性/规则
 * - D-4 fact_polarity 不可变；epistemic_modality 可变
 * - D-5 三路径同 snapshot 切换不重算
 */

// ============================================================
// 1. 基础枚举
// ============================================================

/** 事实极性（D-4：构造性不可变） */
export type FactPolarity = '--' | '-' | '0' | '+' | '++';

/** 认知模态（D-4：随置信度变） */
export type EpistemicModality =
  | 'assert'    // ≥0.75 显著呈现
  | 'likely'    // 0.60-0.75 容易呈现
  | 'tend'      // 0.45-0.60 倾向于
  | 'possible'  // 0.25-0.45 或许存在
  | 'unknown';  // <0.25 理论上可能

/** 用户路径（D-5：三路径同 snapshot 不重算） */
export type DisplayPath = 'pro' | 'mix' | 'lay';

/** 术语分组（GroupCode） */
export type TermGroup =
  | 'SHEN'  // 十神
  | 'GW'    // 宫位
  | 'WX'    // 五行
  | 'GX'    // 关系
  | 'YS'    // 用神
  | 'SS'    // 神煞
  | 'XY'    // 星曜
  | 'QM'    // 奇门
  | 'LQ'    // 灵签
  | 'TR'    // 塔罗
  | 'LN';   // 雷诺曼

/** 命理流派权重 */
export interface SchoolWeights {
  ziping: number;   // 子平
  mangpai: number;   // 盲派
  xinpai: number;    // 新派
}

// ============================================================
// 2. 语义因子
// ============================================================

/** 语义因子触发条件（形式化表达式） */
export interface FactorTrigger {
  /** 操作符：And / Or / Not / has / in_pillar / in_luck / contains / equals */
  op: string;
  /** 参数列表（字段路径或常量） */
  args: string[];
}

/** 语义因子 */
export interface SemanticFactor {
  /** 因子 ID，如 ZG-1 */
  id: string;
  /** 因子中文名，如"规则秩序" */
  name: string;
  /** 形式化触发条件 */
  trigger: FactorTrigger[];
  /** 字段绑定（R3 核验后真实键名） */
  fieldBinding: string[];
  /** 默认权重（加总=1.0） */
  defaultWeight: number;
  /** 三派权重（每列加总=1.0） */
  schools: SchoolWeights;
}

// ============================================================
// 3. 组合条件
// ============================================================

/** 组合条件 */
export interface ComboCondition {
  /** 组合 ID，如 COMBO-ZG-JSG */
  id: string;
  /** 组合中文名，如"正官见伤官" */
  name: string;
  /** 形式化触发条件 */
  trigger: FactorTrigger[];
  /** 优先级（数字越小越高） */
  priority: number;
  /** 互斥组合 ID 列表 */
  mutex: string[];
}

// ============================================================
// 4. 三层白话模板
// ============================================================

/** 三层白话示例 */
export interface WhiteTalkTemplate {
  /** 关联组合 ID */
  comboId: string;
  /** 专业层（带术语） */
  pro: string;
  /** 混合层（白话+术语） */
  mix: string;
  /** 普通层（纯白话） */
  lay: string;
  /** 事实极性（D-4：不可变） */
  polarity: FactPolarity;
  /** 认知模态（D-4：随置信度变，默认 assert） */
  modality: EpistemicModality;
  /** 原子结论 ID，如 ATOM-ZG-JSG-001 */
  atomicId: string;
}

// ============================================================
// 5. 术语本体
// ============================================================

/** 术语本体（Top50 每条术语的完整结构） */
export interface TermSchema {
  /** 术语 ID，如 ZG（正官） */
  id: string;
  /** 术语中文名，如"正官" */
  name: string;
  /** 分组 */
  group: TermGroup;
  /** 语义因子列表（3-6 个，权重加总=1.0） */
  factors: SemanticFactor[];
  /** 组合条件列表（2-4 个） */
  combos: ComboCondition[];
  /** 三层白话模板（至少 1 个组合 × 3 层） */
  templates: WhiteTalkTemplate[];
  /** DIM 维度标签（跨体系复用） */
  dimTags?: string[];
}

// ============================================================
// 6. 原子结论（B-1 输出）
// ============================================================

/** 原子结论（规则引擎输出） */
export interface AtomicConclusion {
  /** 原子结论 ID */
  atomicId: string;
  /** 术语 ID */
  termId: string;
  /** 组合 ID（如命中） */
  comboId?: string;
  /** 事实极性（D-4：不可变） */
  polarity: FactPolarity;
  /** 置信度（D-S belief，0-1） */
  confidence: number;
  /** 认知模态（由 confidence 映射） */
  modality: EpistemicModality;
  /** 触发字段快照（可追溯） */
  evidence: Record<string, unknown>;
}

// ============================================================
// 7. 模态映射工具
// ============================================================

/**
 * 置信度 → 模态映射（D-2 五档）
 * @param confidence D-S belief [0,1]
 * @returns 认知模态
 */
export function confidenceToModality(confidence: number): EpistemicModality {
  if (confidence >= 0.75) return 'assert';
  if (confidence >= 0.60) return 'likely';
  if (confidence >= 0.45) return 'tend';
  if (confidence >= 0.25) return 'possible';
  return 'unknown';
}

// ============================================================
// 8. 原子 ID 命名规范
// ============================================================

/**
 * 原子 ID 格式：ATOM-{Group}-{Term}-{Seq}
 * 如 ATOM-ZG-JSG-001 = 十神-正官-正官见伤官-第1条
 */
export type AtomicId = string;

// ============================================================
// 9. 错误码
// ============================================================

export const SOLUTION_ERRORS = {
  FIELD_MISSING: 'E_2001_FIELD_MISSING',
  POLARITY_CONFLICT: 'E_2002_POLARITY_CONFLICT',
  SLOT_UNFILLED: 'E_2003_SLOT_UNFILLED',
  COMPLIANCE_BLOCK: 'E_2004_COMPLIANCE_BLOCK',
  KG_PATH_BROKEN: 'E_2005_KG_PATH_BROKEN',
  EMPTY_REPORT: 'E_3001_EMPTY_REPORT',
} as const;

export type SolutionError = typeof SOLUTION_ERRORS[keyof typeof SOLUTION_ERRORS];
