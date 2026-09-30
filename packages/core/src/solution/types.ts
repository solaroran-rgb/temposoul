/**
 * G01 · L0-L4 五层输出结构统一 schema
 *
 * 权威定义：所有结果页 / 组件 / 引擎输出均对齐本文件的层级结构。
 *
 * 五层语义（与 F01 深度游标、F02 L0 结论卡、G02 散文诗、G03 AI 回答标准化对齐）：
 * - L0 事实层：命理术语原文（pro 句，带术语+公式+证据链）
 * - L1 术语层：十神 × 宫位（术语解释）
 * - L2 白话层：通俗解读（纯白话 + 吉凶 + 建议）
 * - L3 散文层：意象化表达（散文诗）
 * - L4 决策层：行动建议（do / watch / avoid）
 *
 * 设计约束：
 * - 类型只引用 ./semantic 下的基础类型（FactPolarity / EpistemicModality / AtomicConclusion），不产生运行时循环依赖
 * - 与 ./semantic/api 的 SolutionOutput（pro/mix/lay 三路径）正交：路径=语言风格，层级=内容深度
 * - L3 复用 ./semantic/prose_generator 的 ProsePoem；L4 复用 L0SummaryCard 的建议三元组口径
 */
import type { FactPolarity, EpistemicModality, AtomicConclusion } from './semantic/types';
import type { ProsePoem } from './semantic/prose_generator';

// ============================================================
// 1. 层级枚举与元信息
// ============================================================

/** 五层深度枚举（唯一权威来源） */
export type DepthLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

/** 层级有序列表 */
export const DEPTH_LEVELS: readonly DepthLevel[] = ['L0', 'L1', 'L2', 'L3', 'L4'];

/** 单层元信息（用于深度游标 / 面板标题 / 徽标） */
export interface DepthLayerMeta {
  level: DepthLevel;
  label: string;
  desc: string;
}

/** 五层元信息表（与 src/components/DepthSelector.tsx 的 DEPTH_MARKERS 对齐） */
export const DEPTH_MARKERS: readonly DepthLayerMeta[] = [
  { level: 'L0', label: '事实层', desc: '命理术语原文' },
  { level: 'L1', label: '术语层', desc: '十神×宫位' },
  { level: 'L2', label: '白话层', desc: '通俗解读' },
  { level: 'L3', label: '散文层', desc: '意象化表达' },
  { level: 'L4', label: '决策层', desc: '行动建议' },
];

/** 类型守卫：未知值是否为合法层级 */
export function isDepthLevel(v: unknown): v is DepthLevel {
  return typeof v === 'string' && (DEPTH_LEVELS as readonly string[]).includes(v);
}

/** 层级标题（面板用；组件侧可按需取 label） */
export function depthPanelTitle(level: DepthLevel): string {
  const m = DEPTH_MARKERS.find((x) => x.level === level);
  return m ? `${level} · ${m.label}` : level;
}

// ============================================================
// 2. 统一层句
// ============================================================

/** 建议条目（L4 决策层；tone 口径与 L0SummaryCard 的 L0AdviceItem 一致） */
export interface LayerAdvice {
  text: string;
  tone: 'do' | 'watch' | 'avoid';
}

/**
 * 统一层句：五层共用同一句结构。
 * 与 ./semantic/gates 的 WhiteTalkSentence 兼容（text/layer/polarity/modality/atomicId 同名同义），
 * 额外扩展 L0 证据、L4 建议等按层可选的字段。
 */
export interface LayerSentence {
  /** 句子文本 */
  text: string;
  /** 所属层级 */
  layer: DepthLevel;
  /** 事实极性（D-4：构造性不可变） */
  polarity?: FactPolarity;
  /** 认知模态（D-4：随置信度变） */
  modality?: EpistemicModality;
  /** 原子结论 ID（L3 必挂，L0/L2 建议挂） */
  atomicId?: string;
  /** 术语 ID（L0/L1 建议挂，如 ZG） */
  termId?: string;
  /** 时间作用域（L0/L2 可挂） */
  time_scope?: 'long_term' | 'current' | 'event' | 'general';
  /** 单句置信度 [0,1] */
  confidence?: number;
  /** 触发字段快照（L0 事实句可挂，可追溯） */
  evidence?: Record<string, unknown>;
  /** 行动建议（仅 L4 决策层句携带） */
  advice?: LayerAdvice;
}

// ============================================================
// 3. 单层输出
// ============================================================

/** 单层输出结构（L0-L4 每层一个实例） */
export interface LayerOutput {
  /** 层级 */
  level: DepthLevel;
  /** 该层句子列表 */
  sentences: LayerSentence[];
  /** 吉凶等级（汇总极性，可选：单层可无汇总） */
  overallPolarity?: FactPolarity;
  /** 整体置信度 [0,1] */
  overallConfidence?: number;
  /** 整体模态 */
  overallModality?: EpistemicModality;
  /** 巴纳姆比例（(L1+L2)/总句数，可选） */
  barnumRatio?: number;
  /** 散文诗（仅 L3 散文层） */
  prose?: ProsePoem;
  /** 行动建议列表（仅 L4 决策层） */
  advice?: LayerAdvice[];
}

// ============================================================
// 4. 五层统一输出容器
// ============================================================

/** 五层输出元数据（与 SolutionOutput.meta 兼容的子集） */
export interface L0L4Meta {
  termIds?: string[];
  comboIds?: string[];
  atoms?: AtomicConclusion[];
  version?: string;
}

/**
 * L0-L4 五层统一输出容器：
 * 页面按 layers[level] 渲染对应深度，深度游标切换只换 key、不重算。
 */
export interface L0L4Output {
  /** 命盘快照 ID（同 snapshot 切换不重算） */
  snapshotId: string;
  /** 时间戳 */
  timestamp: number;
  /** 五层输出（key = DepthLevel） */
  layers: Record<DepthLevel, LayerOutput>;
  /** 元数据（术语/组合/原子/版本） */
  meta?: L0L4Meta;
}

// ============================================================
// 5. 构造辅助
// ============================================================

/** 空层输出（缺层时的安全兜底，保证页面渲染不崩） */
export function emptyLayer(level: DepthLevel): LayerOutput {
  return { level, sentences: [] };
}

/** 空五层容器 */
export function emptyL0L4Output(snapshotId = 'snap-empty', timestamp = Date.now()): L0L4Output {
  const layers = {} as Record<DepthLevel, LayerOutput>;
  for (const l of DEPTH_LEVELS) layers[l] = emptyLayer(l);
  return { snapshotId, timestamp, layers };
}
