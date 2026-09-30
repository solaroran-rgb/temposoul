// F02 · L0 结论卡组件
// 所有结果页首屏统一使用：白话结论 + 建议 + 时间窗
// 数据来源：runSolution 输出（output.pro.sentences / output.meta.atoms）
// 合规：文案统一过禁词过滤，卡片底部常驻三道闸提示与解释边界声明
import { useMemo, useState } from 'react';
import { filterBannedWords, evaluateThreeGates } from '@/lib/client-compliance';

export interface L0SummarySentence {
  text: string;
  polarity?: string;
  modality?: string;
}

export interface L0SummaryAtom {
  atomicId?: string;
  polarity?: string;
  confidence?: number;
  time_scope?: string;
  canonical_factors?: string[];
}

/** 结构化宽松输入：兼容 SolutionOutput / 页面自定义 L0 输出 */
export interface L0SummarySource {
  pro?: {
    sentences?: L0SummarySentence[];
    overallPolarity?: string;
    overallConfidence?: number;
    barnumRatio?: number;
  };
  meta?: {
    atoms?: L0SummaryAtom[];
  };
}

export type L0TimeScale = 'event' | 'current' | 'long_term' | 'general';

export interface L0TimeWindow {
  scale: L0TimeScale;
  label: string;
  detail: string;
  /** 该时间窗在全部结论中的占比（0-1） */
  share: number;
}

export interface L0AdviceItem {
  text: string;
  tone: 'do' | 'watch' | 'avoid';
}

export interface L0SummaryCardProps {
  /** runSolution 输出（三路径任意一路的父对象均可，默认取 pro） */
  output: L0SummarySource | null;
  title?: string;
  /** 首屏一句话结论；不传则自动取首条结论句 */
  headline?: string;
  /** 建议；不传则由结论极性 + 生活领域自动派生 */
  advice?: Array<L0AdviceItem | string>;
  /** 时间窗；不传则由 atoms.time_scope 自动派生；传 null 隐藏时间窗区 */
  timeWindow?: L0TimeWindow | L0TimeWindow[] | null;
  /** 首屏默认展示的结论条数，超出折叠 */
  previewCount?: number;
}

const POLARITY_META: Record<string, { label: string; color: string; bg: string }> = {
  '++': { label: '大吉', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  '+': { label: '吉', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  '0': { label: '平', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  '-': { label: '凶', color: '#fb7185', bg: 'rgba(251,113,133,0.12)' },
  '--': { label: '大凶', color: '#fb7185', bg: 'rgba(251,113,133,0.12)' },
};

const MODALITY_LABEL: Record<string, string> = {
  assert: '显著',
  likely: '较可能',
  tend: '倾向',
  possible: '或许',
  unknown: '未定',
};

const TONE_META: Record<L0AdviceItem['tone'], { icon: string; label: string; color: string }> = {
  do: { icon: '▶', label: '可做', color: '#34d399' },
  watch: { icon: '◉', label: '观察', color: '#94a3b8' },
  avoid: { icon: '■', label: '规避', color: '#fb7185' },
};

const DOMAIN_LABEL: Record<string, string> = {
  career: '事业',
  wealth: '财运',
  relationship: '感情',
  health: '健康',
  family: '家庭',
  study: '学业',
  personality: '性格',
  overall: '整体',
};

const TIME_SCALE_META: Record<L0TimeScale, { label: string; detail: string }> = {
  event: { label: '近期事件窗', detail: '未来 1-3 个月，事件触发最集中' },
  current: { label: '当下运势窗', detail: '未来 12 个月内，能量最活跃' },
  long_term: { label: '长期底色', detail: '10 年以上结构性倾向，不随流年骤变' },
  general: { label: '常态参考', detail: '无明确时限，作长期背景参考' },
};

const TIME_ORDER: L0TimeScale[] = ['event', 'current', 'long_term', 'general'];

const GATE_META: Array<{ key: 'safety' | 'barnum' | 'factual'; label: string }> = [
  { key: 'safety', label: '安全闸' },
  { key: 'barnum', label: '巴纳姆闸' },
  { key: 'factual', label: '事实闸' },
];

function polarityMeta(p: string | undefined) {
  return POLARITY_META[p ?? ''] ?? POLARITY_META['0'];
}

function polarityScore(p: string | undefined): number {
  switch (p) {
    case '++':
      return 2;
    case '+':
      return 1;
    case '-':
      return -1;
    case '--':
      return -2;
    default:
      return 0;
  }
}

function normalizeScale(s: string | undefined): L0TimeScale {
  return TIME_ORDER.includes(s as L0TimeScale) ? (s as L0TimeScale) : 'general';
}

/** 生活领域（canonical_factors 前缀，如 career:authority → career） */
function domainOf(atom: L0SummaryAtom): string {
  const first = atom.canonical_factors?.[0];
  const prefix = first ? first.split(':')[0] : '';
  return DOMAIN_LABEL[prefix] ? prefix : 'overall';
}

/** 建议派生：按生活领域聚合极性，输出最多 3 条（合规过滤后） */
export function deriveAdvice(source: L0SummarySource): L0AdviceItem[] {
  const atoms = source.meta?.atoms ?? [];
  const out: L0AdviceItem[] = [];

  if (atoms.length > 0) {
    const scores = new Map<string, number>();
    for (const atom of atoms) {
      const d = domainOf(atom);
      scores.set(d, (scores.get(d) ?? 0) + polarityScore(atom.polarity));
    }
    const ranked = [...scores.entries()]
      .filter(([d]) => d !== 'overall')
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 2);

    for (const [domain, score] of ranked) {
      const label = DOMAIN_LABEL[domain] ?? '整体';
      if (score > 0) {
        out.push({ tone: 'do', text: `${label}方向信号偏顺，适合把已想清楚的事落到具体动作` });
      } else if (score < 0) {
        out.push({ tone: 'avoid', text: `${label}方向阻力偏大，宜小步验证，避免一次性重押` });
      } else {
        out.push({ tone: 'watch', text: `${label}方向信号中性，先积累信息再决定` });
      }
    }
  }

  // 兜底/补充：按整体极性给一条总建议
  const overall = polarityScore(source.pro?.overallPolarity);
  if (out.length === 0) {
    out.push(
      overall > 0
        ? { tone: 'do', text: '整体势能偏顺，可主动推进已想清楚的事' }
        : overall < 0
          ? { tone: 'avoid', text: '整体阻力偏大，宜守成与复盘，避免重大变更' }
          : { tone: 'watch', text: '整体信号中性，先观察再行动' },
    );
  } else {
    out.push(
      overall < 0
        ? { tone: 'watch', text: '结论含阻力信号，重要决定前多留一个验证环节' }
        : { tone: 'watch', text: '结论为倾向性描述，落地节奏仍以实际反馈为准' },
    );
  }

  return out.map((a) => ({ ...a, text: filterBannedWords(a.text) }));
}

/** 时间窗派生：按 atoms.time_scope 统计占比，取前二 */
export function deriveTimeWindows(source: L0SummarySource): L0TimeWindow[] {
  const atoms = source.meta?.atoms ?? [];
  if (atoms.length === 0) return [];
  const counts = new Map<L0TimeScale, number>();
  for (const atom of atoms) {
    const s = normalizeScale(atom.time_scope);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([scale, n]) => ({
      scale,
      label: TIME_SCALE_META[scale].label,
      detail: TIME_SCALE_META[scale].detail,
      share: atoms.length > 0 ? n / atoms.length : 0,
    }));
}

function toAdviceItems(list: Array<L0AdviceItem | string>): L0AdviceItem[] {
  return list.map((a) =>
    typeof a === 'string'
      ? { text: filterBannedWords(a), tone: 'watch' as const }
      : { ...a, text: filterBannedWords(a.text) },
  );
}

export function L0SummaryCard(props: L0SummaryCardProps) {
  const {
    output,
    title = '一句话结论',
    headline,
    advice,
    timeWindow,
    previewCount = 3,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const sentences = useMemo(() => output?.pro?.sentences ?? [], [output]);
  const atoms = useMemo(() => output?.meta?.atoms ?? [], [output]);
  const confidence = output?.pro?.overallConfidence;
  const barnum = output?.pro?.barnumRatio;

  const allText = useMemo(() => sentences.map((s) => s.text).join(' '), [sentences]);
  const gates = useMemo(
    () =>
      evaluateThreeGates({
        text: allText,
        barnumRatio: barnum,
        confidenceDisclosed: typeof confidence === 'number',
      }),
    [allText, barnum, confidence],
  );

  const summaryText = headline ?? sentences[0]?.text ?? '';
  const adviceItems = useMemo(
    () => (advice ? toAdviceItems(advice) : deriveAdvice(output ?? {})),
    [advice, output],
  );
  const windows = useMemo<L0TimeWindow[]>(() => {
    if (timeWindow === null) return [];
    if (timeWindow === undefined) return deriveTimeWindows(output ?? {});
    return Array.isArray(timeWindow) ? timeWindow : [timeWindow];
  }, [timeWindow, output]);

  const visible = expanded ? sentences : sentences.slice(0, previewCount);
  const hasMore = sentences.length > previewCount;
  const polarity = polarityMeta(output?.pro?.overallPolarity);

  if (!output) return null;

  return (
    <section
      aria-label={title}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 24,
      }}
    >
      {/* 头部：标题 + 极性 + 置信度 */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: '#e2e8f0' }}>{title}</h3>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: polarity.color,
            background: polarity.bg,
            borderRadius: 999,
            padding: '2px 10px',
          }}
        >
          整体{polarity.label}
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#94a3b8',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 999,
            padding: '2px 10px',
          }}
        >
          置信度 {typeof confidence === 'number' && Number.isFinite(confidence) ? `${(confidence * 100).toFixed(0)}%` : '—'}
        </span>
      </div>

      {/* 区一 · 白话结论 */}
      <div
        style={{
          background: 'rgba(99,102,241,0.10)',
          border: '1px solid rgba(99,102,241,0.22)',
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600, marginBottom: 6 }}>结论</div>
        {summaryText ? (
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: '#f1f5f9' }}>
            {filterBannedWords(summaryText)}
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
            本命盘未产生高置信度结论，可参考下方数据或调整出生时间后重试。
          </p>
        )}

        {sentences.length > 1 && (
          <>
            <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none' }}>
              {visible.map((s, i) => {
                const m = polarityMeta(s.polarity);
                const mod = s.modality ? MODALITY_LABEL[s.modality] : undefined;
                return (
                  <li
                    key={`${s.text}-${i}`}
                    style={{
                      display: 'flex',
                      gap: 10,
                      padding: '6px 0',
                      borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      color: '#cbd5e1',
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    <span
                      style={{
                        flex: 'none',
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        background: m.color,
                        marginTop: 7,
                      }}
                    />
                    <span style={{ flex: 1 }}>
                      {filterBannedWords(s.text)}
                      {mod && (
                        <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 12 }}>（{mod}）</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
            {hasMore && (
              <button
                onClick={() => setExpanded((v) => !v)}
                style={{
                  marginTop: 10,
                  background: 'transparent',
                  border: '1px solid rgba(99,102,241,0.5)',
                  color: '#a5b4fc',
                  borderRadius: 8,
                  padding: '5px 12px',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {expanded ? `收起（${sentences.length} 条）` : `展开全部（${sentences.length} 条）`}
              </button>
            )}
          </>
        )}
      </div>

      {/* 区二 · 建议 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600, marginBottom: 8 }}>建议</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {adviceItems.map((a, i) => {
            const t = TONE_META[a.tone];
            return (
              <li
                key={`${a.text}-${i}`}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  background: 'rgba(255,255,255,0.04)',
                  borderLeft: `3px solid ${t.color}`,
                  borderRadius: 6,
                  padding: '8px 12px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                }}
              >
                <span style={{ flex: 'none', color: t.color, fontSize: 12, fontWeight: 700 }}>
                  {t.icon} {t.label}
                </span>
                <span style={{ flex: 1 }}>{a.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 区三 · 时间窗 */}
      {windows.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600, marginBottom: 8 }}>时间窗</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {windows.map((w) => (
              <div
                key={w.scale}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 8,
                  padding: '10px 12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{w.label}</span>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    占比 {(w.share * 100).toFixed(0)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(4, Math.round(w.share * 100))}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1, #fbbf24)',
                    }}
                  />
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{w.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 合规：三道闸 + 解释边界 */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {GATE_META.map((g) => {
          const pass = gates[g.key];
          return (
            <span
              key={g.key}
              style={{
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 999,
                padding: '2px 10px',
                color: pass ? '#34d399' : '#fbbf24',
                background: pass ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.14)',
              }}
            >
              {g.label}：{pass ? '通过' : '预警'}
            </span>
          );
        })}
        {atoms.length > 0 && (
          <span style={{ fontSize: 12, color: '#64748b' }}>依据 {atoms.length} 条原子结论</span>
        )}
      </div>

      <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>
        解释边界：本解读基于传统文化模型，仅供文化研究与自我参照，不构成任何决策依据。
      </p>
    </section>
  );
}

export default L0SummaryCard;
