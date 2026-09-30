/**
 * 命律 · AI 回答标准化结构（G03）
 *
 * 所有 AI 输出统一为四段式：
 *   结论 conclusion + 依据 evidence + 置信度 confidence + 建议 suggestions
 *
 * 数据来源：
 * - 解盘引擎 SolutionOutput（runSolution · CIR v2）
 * - 冲突仲裁 ArbitrationResult（arbitrate · R3-14）
 * - 散文诗 ProsePoem（generateProsePoem · R3-13，可选文学化摘要，仅收文本以解耦）
 *
 * 设计约束：
 * - 置信度复用 D-2 五档模态（EpistemicModality），档位与模态一一对应；
 * - 建议不承诺具体结果，遵守合规红线（无绝对化 / 必然性表述）；
 * - 依据可追溯：refs 引用原子 / 规则 / 术语 / 因子 ID；
 * - 空结果与低置信均提供兜底文案，不产生空回答。
 */
import type { SolutionOutput, PathOutput, DisplayVariant } from './semantic/api';
import type { EpistemicModality } from './semantic/types';
import type { ArbitrationResult } from './semantic/arbitration';

// ============================================================
// 1. 基础类型
// ============================================================

/** 置信度档位（与 D-2 五档模态一一对应） */
export type AiConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

/** 建议类型 */
export type AiSuggestionType = 'action' | 'caution' | 'timing' | 'growth' | 'general';

/** 依据来源类型 */
export type AiEvidenceKind =
  | 'rule'       // 规则触发（rule_trace）
  | 'atom'       // 原子结论
  | 'combo'      // 组合条件
  | 'factor'     // 归一化因子
  | 'arbitration' // 仲裁结论（共识 / 张力）
  | 'prose';     // 散文诗意象

/** 单条依据 */
export interface AiEvidence {
  /** 依据 ID（原子 / 规则 / 组合 ID） */
  id: string;
  /** 依据来源类型 */
  kind: AiEvidenceKind;
  /** 白话说明 */
  detail: string;
  /** 溯源引用（原子 / 规则 / 术语 / 因子 ID） */
  refs: string[];
  /** 支撑强度（0-1，派生自原子置信度绝对值） */
  weight?: number;
}

/** 单条建议 */
export interface AiSuggestion {
  /** 建议 ID */
  id: string;
  /** 建议类型 */
  type: AiSuggestionType;
  /** 建议文案（白话，不含绝对化承诺） */
  text: string;
  /** 优先级（1=最高，数字越小越优先） */
  priority: number;
  /** 适用条件（可选，低置信 / 条件层使用） */
  condition?: string;
}

/** 置信度（四段式第三段） */
export interface AiConfidence {
  /** 置信度数值（0-1，取绝对值） */
  value: number;
  /** 档位（high / medium / low / unknown） */
  level: AiConfidenceLevel;
  /** 中文标签（高 / 中 / 低 / 不足以判断） */
  label: string;
  /** D-2 五档模态 */
  modality: EpistemicModality;
}

/** 统一 AI 回答（四段式） */
export interface AiResponse {
  /** 回答 ID（派生自快照 ID 或时间戳） */
  id: string;
  /** schema 版本 */
  schema_version: 'ai_response_v1';
  /** 结论（核心判断，一句到两句） */
  conclusion: string;
  /** 依据（支撑结论的证据链） */
  evidence: AiEvidence[];
  /** 置信度 */
  confidence: AiConfidence;
  /** 建议（可执行方向） */
  suggestions: AiSuggestion[];
  /** 来源快照（可追溯） */
  source?: {
    snapshotId?: string;
    systems?: string[];
    barnumRatio?: number;
    arbitration?: {
      consensus: number;
      tension: number;
      condition: number;
    };
  };
  /** 创建时间（ISO） */
  created_at: string;
}

/** buildAiResponse 选项 */
export interface BuildAiResponseOptions {
  /** 展示路径偏好（默认 lay 纯白话；pro 保留术语） */
  variant?: DisplayVariant;
  /** 依据条数上限（默认 5） */
  maxEvidence?: number;
  /** 建议条数上限（默认 4） */
  maxSuggestions?: number;
  /** 散文诗文本（可选，作结论的文学化收尾，来自 G02） */
  prose?: string;
}

// ============================================================
// 2. 置信度档位映射（与 D-2 五档对齐）
// ============================================================

/**
 * 置信度 → 档位
 * high↔assert(≥0.75) / medium↔likely·tend(≥0.45) / low↔possible(≥0.25) / unknown(<0.25)
 */
export function confidenceToLevel(confidence: number): AiConfidenceLevel {
  const abs = Math.abs(confidence);
  if (abs >= 0.75) return 'high';
  if (abs >= 0.45) return 'medium';
  if (abs >= 0.25) return 'low';
  return 'unknown';
}

/** 置信度 → 中文标签 */
export function confidenceLabel(confidence: number): string {
  switch (confidenceToLevel(confidence)) {
    case 'high':
      return '高';
    case 'medium':
      return '中';
    case 'low':
      return '低';
    default:
      return '不足以判断';
  }
}

/** 置信度 → 完整 AiConfidence */
export function toAiConfidence(confidence: number): AiConfidence {
  const value = Math.min(1, Math.max(0, Math.abs(confidence)));
  const modality: EpistemicModality =
    value >= 0.75
      ? 'assert'
      : value >= 0.6
        ? 'likely'
        : value >= 0.45
          ? 'tend'
          : value >= 0.25
            ? 'possible'
            : 'unknown';
  return {
    value,
    level: confidenceToLevel(value),
    label: confidenceLabel(value),
    modality,
  };
}

// ============================================================
// 3. 结论生成（第一段）
// ============================================================

/** 极性 → 结论前缀短语 */
const POLARITY_PREFIX: Record<string, string> = {
  '++': '整体走势积极有力',
  '+': '整体走势稳中向好',
  '0': '整体走势平稳、各有所长',
  '-': '整体走势偏于保守',
  '--': '整体走势存在较多压力',
};

/** 空结果兜底结论 */
const EMPTY_CONCLUSION =
  '当前信息不足以形成明确判断，建议补充更完整的出生信息或从多个角度观察后再作参考。';

/**
 * 从路径输出抽取主句：优先取 L2 白话句（按模态强度），
 * 无句子时用极性前缀 + 兜底。
 */
function extractLeadSentence(path: PathOutput): string | undefined {
  const ranked = [...path.sentences].sort((a, b) => {
    const rank: Record<EpistemicModality, number> = {
      assert: 4,
      likely: 3,
      tend: 2,
      possible: 1,
      unknown: 0,
    };
    return rank[b.modality] - rank[a.modality];
  });
  const lead = ranked.find((s) => s.layer === 'L2' || s.layer === 'L1');
  return lead?.text;
}

/** 结论文案：主句 + 极性前缀 + 可选散文诗收尾 */
function buildConclusion(
  path: PathOutput | undefined,
  options: { prose?: string },
): string {
  if (!path || path.sentences.length === 0) return EMPTY_CONCLUSION;

  const prefix = POLARITY_PREFIX[path.overallPolarity] ?? '';
  const lead = extractLeadSentence(path);
  if (!lead) return EMPTY_CONCLUSION;

  const parts: string[] = [];
  if (prefix && !lead.includes(prefix.slice(0, 4))) parts.push(`${prefix}。`);
  parts.push(lead.replace(/[。；;]+$/, '') + '。');
  if (options.prose) parts.push(`此间气象，${options.prose.replace(/[。；;]+$/, '')}。`);
  return parts.join('');
}

// ============================================================
// 4. 依据生成（第二段）
// ============================================================

/** 依据条数默认上限 */
const DEFAULT_MAX_EVIDENCE = 5;

/** 依据 ID 去重 */
function uniqueRefs(refs: Array<string | undefined>): string[] {
  return [...new Set(refs.filter((r): r is string => Boolean(r)))];
}

/**
 * 从 meta.atoms 构建依据链：
 * 按置信度绝对值降序取 top N，合并 rule_trace / canonical_factors / 术语信息。
 */
function buildEvidence(
  output: SolutionOutput,
  path: PathOutput,
  max: number,
): AiEvidence[] {
  const atoms = [...output.meta.atoms].sort(
    (a, b) => Math.abs(b.confidence) - Math.abs(a.confidence),
  );
  const leadAtomicIds = new Set(
    path.sentences
      .filter((s) => s.atomicId && s.layer !== 'L0')
      .map((s) => s.atomicId as string),
  );

  const out: AiEvidence[] = [];
  for (const atom of atoms) {
    if (out.length >= max) break;
    const refs = uniqueRefs([
      atom.atomicId,
      atom.termId,
      atom.comboId,
      atom.rule_trace?.rule_id,
      ...(atom.canonical_factors ?? []),
    ]);
    const isLead = leadAtomicIds.has(atom.atomicId);
    out.push({
      id: atom.atomicId,
      kind: atom.rule_trace ? 'rule' : 'atom',
      detail: isLead
        ? `核心判断来自${atom.termId}（${atom.canonical_factors?.[0] ?? atom.comboId ?? '综合盘面'}），多因子互证。`
        : `${atom.termId}呈现${atom.polarity === '+' ? '正向' : atom.polarity === '-' ? '收敛' : '中性'}信号，与盘面整体方向一致。`,
      refs,
      weight: Math.abs(atom.confidence),
    });
  }

  // 无原子时兜底：引用路径句子的层与巴纳姆比例
  if (out.length === 0) {
    out.push({
      id: 'evidence-fallback',
      kind: 'atom',
      detail: '当前盘面信号较少，依据主要来自整体结构与少量关键因子。',
      refs: [],
    });
  }
  return out;
}

// ============================================================
// 5. 建议生成（第四段）
// ============================================================

/** 建议条数默认上限 */
const DEFAULT_MAX_SUGGESTIONS = 4;

/**
 * 规则化建议生成：
 * - 正极性高置信 → 行动类（顺势推进）
 * - 负极性 → 谨慎类（稳扎稳打）
 * - 低置信 / 未知 → 观察 + 咨询类（附条件）
 * - 巴纳姆比例高 → 增加情境判断警示
 * - 仲裁存在张力 → 增加综合权衡建议
 */
function buildSuggestions(
  path: PathOutput | undefined,
  options: {
    max: number;
    arbitration?: ArbitrationResult;
  },
): AiSuggestion[] {
  const out: AiSuggestion[] = [];
  const push = (
    type: AiSuggestionType,
    text: string,
    priority: number,
    condition?: string,
  ) => {
    if (out.length >= options.max) return;
    out.push({
      id: `sug-${type}-${out.length + 1}`,
      type,
      text,
      priority,
      ...(condition ? { condition } : {}),
    });
  };

  const confidence = path?.overallConfidence ?? 0;
  const level = confidenceToLevel(confidence);
  const polarity = path?.overallPolarity ?? '0';

  if (level === 'high' || level === 'medium') {
    if (polarity === '+' || polarity === '++') {
      push('action', '当前势能向上，适合主动推进计划、争取机会，并顺势巩固已有优势。', 1);
      push('timing', '重要事项可安排在自身状态与外部条件都较配合的阶段着手。', 3);
    } else if (polarity === '-' || polarity === '--') {
      push('caution', '当前势能偏于收敛，宜稳扎稳打、控制节奏，避免在状态不佳时做重大决定。', 1);
      push('timing', '可先处理基础与准备工作，待势能转好时再推进关键事项。', 3);
    } else {
      push('general', '整体走势平稳，适合按既有节奏推进，同时留意变化带来的机会。', 2);
    }
  } else if (level === 'low') {
    push('caution', '信号指向不够集中，建议结合实际情况谨慎判断，不以单一信号作依据。', 1);
    push('growth', '可先补充信息或从更长周期观察，再逐步形成判断。', 2, '当资料更完整时');
  } else {
    push('general', '当前信息不足以支撑明确建议，建议先补充资料，或咨询更全面的解读。', 1);
  }

  // 巴纳姆警示
  if (path && path.barnumRatio >= 0.4) {
    push('caution', '部分表述较为通用，请结合自身实际情境分辨哪些真正适用于你。', 2);
  }

  // 仲裁张力 → 综合权衡建议
  if (options.arbitration && options.arbitration.tension.length > 0) {
    push('general', '不同体系对同一领域说法不一，建议综合多方意见权衡，不急于定论。', 1);
  }

  return out.slice(0, options.max).map((s, i) => ({ ...s, priority: i + 1 }));
}

// ============================================================
// 6. 主入口：统一构建
// ============================================================

/**
 * 从解盘引擎输出（+ 可选仲裁 / 散文诗）构建统一四段式回答。
 *
 * @param input.output 解盘引擎输出（runSolution 产物）
 * @param input.arbitration 冲突仲裁结果（可选，R3-14）
 * @param options.variant 展示路径（默认 lay）
 * @param options.maxEvidence 依据条数上限（默认 5）
 * @param options.maxSuggestions 建议条数上限（默认 4）
 * @param options.prose 散文诗文本（可选，作结论文学化收尾）
 */
export function buildAiResponse(
  input: {
    output?: SolutionOutput;
    arbitration?: ArbitrationResult;
  },
  options: BuildAiResponseOptions = {},
): AiResponse {
  const variant = options.variant ?? 'lay';
  const output = input.output;
  const path: PathOutput | undefined = output?.[variant];
  const maxEvidence = options.maxEvidence ?? DEFAULT_MAX_EVIDENCE;
  const maxSuggestions = options.maxSuggestions ?? DEFAULT_MAX_SUGGESTIONS;
  const ts = Date.now();
  const id = output?.snapshotId ?? `ai-${ts}`;

  const evidence = output && path
    ? buildEvidence(output, path, maxEvidence)
    : [
        {
          id: 'evidence-fallback',
          kind: 'atom' as const,
          detail: '暂无可用的结构化依据，结论来自基础盘面信息。',
          refs: [] as string[],
        },
      ];

  const suggestions = buildSuggestions(path, {
    max: maxSuggestions,
    arbitration: input.arbitration,
  });

  const response: AiResponse = {
    id,
    schema_version: 'ai_response_v1',
    conclusion: buildConclusion(path, { prose: options.prose }),
    evidence,
    confidence: toAiConfidence(path?.overallConfidence ?? 0),
    suggestions,
    source: output
      ? {
          snapshotId: output.snapshotId,
          barnumRatio: path?.barnumRatio,
          arbitration: input.arbitration
            ? {
                consensus: input.arbitration.consensus.length,
                tension: input.arbitration.tension.length,
                condition: input.arbitration.condition.length,
              }
            : undefined,
        }
      : undefined,
    created_at: new Date(ts).toISOString(),
  };

  // 移除空字段（保持结构干净）
  if (response.source) {
    const src = response.source;
    if (!src.snapshotId) delete src.snapshotId;
    if (!src.barnumRatio) delete src.barnumRatio;
    if (!src.arbitration) delete src.arbitration;
  }
  return response;
}

// ============================================================
// 7. 文本渲染（四段式 markdown）
// ============================================================

/** 将统一回答渲染为可读四段式文本（供 AI 直接输出 / 前端展示） */
export function formatAiResponse(response: AiResponse): string {
  const lines: string[] = [];
  lines.push('【结论】', response.conclusion, '');

  if (response.evidence.length > 0) {
    lines.push('【依据】');
    response.evidence.forEach((e, i) => {
      lines.push(`${i + 1}. ${e.detail}${e.refs.length ? `（${e.refs.slice(0, 3).join('、')}）` : ''}`);
    });
    lines.push('');
  }

  const c = response.confidence;
  lines.push(`【置信度】${c.label}（${c.value.toFixed(2)}）`, '');

  if (response.suggestions.length > 0) {
    lines.push('【建议】');
    response.suggestions.forEach((s) => {
      const cond = s.condition ? `（${s.condition}）` : '';
      lines.push(`- ${s.text}${cond}`);
    });
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
