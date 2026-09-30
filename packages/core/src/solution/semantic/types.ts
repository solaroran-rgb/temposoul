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

  // ============================================================
  // CIR v2 新增字段（全部可选，向后兼容 cir_v1）
  // ============================================================

  /** 时间作用域 */
  time_scope?: 'long_term' | 'current' | 'event' | 'general';
  /** 归一化因子（指向 Canonical Factor Ontology，如 ['wealth:structural_wealth','career:authority']） */
  canonical_factors?: string[];
  /** 同源依赖标记（与同一证据链绑定的原子 ID） */
  evidence_dependency_ids?: string[];
  /** CIR schema 版本，如 'cir_v2.0' */
  schema_version?: string;
  /** 规则追溯：命中规则 + 评分卡/决策表版本 + 三道闸结果 */
  rule_trace?: {
    rule_id: string;
    rule_version: string;
    scorecard_version: string;
    decision_table_version: string;
    gate_results: { gate: string; passed: boolean; reason: string }[];
  };
  /** 普通模式隐藏，专业模式可见 */
  suppressible?: boolean;
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

// ============================================================
// 10. CIR v2 · 统一结论中间层共享类型
// ============================================================

/**
 * 结构化事实（snapshot v2 使用）
 * 命盘输入经各体系排盘后沉淀的可追溯事实单元。
 */
export interface Fact {
  /** 事实 ID */
  fact_id: string;
  /** 事实类别（pillar / ten_god / wuxing / palace / star / qimen ...） */
  kind: string;
  /** 中文标签 */
  label: string;
  /** 事实值 */
  value: unknown;
  /** 数据来源（体系/通道） */
  source?: string;
}

/**
 * 证据（规则触发证据）
 * 与原子结论/规则追溯关联，支撑回溯审计。
 */
export interface Evidence {
  /** 证据 ID */
  evidence_id: string;
  /** 证据类别 */
  kind: 'rule' | 'field' | 'combo' | 'kg';
  /** 引用 ID（规则/字段/组合/知识边 ID） */
  ref: string;
  /** 证据明细 */
  detail: Record<string, unknown>;
}

/**
 * 解盘流程事件（process_log 单元）
 * 记录 runSolution 每个关键步骤的引擎、耗时与引用，支撑过程审计。
 *
 * 注：任务卡原定置于 snapshot.ts；此处与 SolutionSnapshotV2 同文件，
 * 以避免 types ↔ snapshot 的循环类型导入（SolutionSnapshotV2 直接引用 ProcessEvent）。
 */
export interface ProcessEvent {
  /** 步骤名：input_validation / time_correction / bazi_chart / disambiguation / ds_fusion / atom_generation / dependency_check / gate_check / factor_mapping */
  step: string;
  /** 执行引擎：chrono / bazi / ziwei / d1 / d2 / core ... */
  engine: string;
  /** 步骤明细 */
  detail: Record<string, unknown>;
  /** 耗时（毫秒，相对上一步） */
  cost_ms: number;
  /** ISO 时间戳 */
  timestamp: string;
  /** 关联引用 ID（原子/事实/证据） */
  ref_ids?: string[];
}

/**
 * CIR v2 统一结论快照
 * 跨体系融合后的确定性中间层，可复现、可审计、可版本解析。
 */
export interface SolutionSnapshotV2 {
  /** 快照 ID（uuid） */
  snapshot_id: string;
  /** 内容指纹：SHA-256(input + school + options + engine_version) 前 16 位 */
  seed: string;
  /** CIR schema 版本，固定 'cir_v2.0' */
  schema_version: 'cir_v2.0';
  /** 输入上下文 */
  input: {
    datetime: string;
    longitude: number;
    latitude: number;
    timezone: string;
    systems: string[];
  };
  /** 启用的命理体系 */
  systems: string[];
  /** 结构化事实 */
  facts: Fact[];
  /** 原子结论 */
  atoms: AtomicConclusion[];
  /** 证据链 */
  evidence: Evidence[];
  /** 解盘流程日志 */
  process_log: ProcessEvent[];
  /** 关联引用 ID */
  ref_ids: string[];
  /** 创建时间（ISO） */
  created_at: string;
  /** 引擎版本 */
  engine_version: string;
}
