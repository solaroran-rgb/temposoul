/**
 * AI 解读区（解盘引擎 · L0 白话结论）· 任务包 2.1/2.2/2.3 验收件
 *
 * 纯本地计算：对每个来源调用 runSolution（同步纯函数），
 * 汇总去重后渲染 L0 事实句；0 命中自动不渲染。
 */
import { useMemo } from 'react';
import { runSolution } from '@core/solution/semantic';
import type { SolutionOutput } from '@core/solution/semantic';
import type { WhiteTalkSentence } from '@core/solution/semantic/gates';
import './solution-panel.css';

export interface SolutionSource {
  /** 展示名（如「命盘」「紫微·贪狼（命宫）」） */
  label: string;
  /** 引擎上下文（命盘数据子集） */
  context: Record<string, unknown>;
  /** 限定术语（如紫微逐星）；缺省 = 全量 Top50 */
  termIds?: string[];
}

interface HitSentence {
  text: string;
  polarity: WhiteTalkSentence['polarity'];
  modality: WhiteTalkSentence['modality'];
  sourceLabel: string;
}

const POLARITY_CLASS: Record<string, string> = {
  '++': 'ts-sol__tag--good2',
  '+': 'ts-sol__tag--good',
  '0': 'ts-sol__tag--flat',
  '-': 'ts-sol__tag--bad',
  '--': 'ts-sol__tag--bad2',
};

const POLARITY_LABEL: Record<string, string> = {
  '++': '大吉',
  '+': '吉',
  '0': '平',
  '-': '注意',
  '--': '需谨慎',
};

const MODALITY_LABEL: Record<string, string> = {
  assert: '显著',
  likely: '较易',
  tend: '倾向',
  possible: '或许',
  unknown: '待核验',
};

function collectHits(sources: SolutionSource[]): {
  hits: HitSentence[];
  outputs: SolutionOutput[];
} {
  const hits: HitSentence[] = [];
  const outputs: SolutionOutput[] = [];
  const seen = new Set<string>();
  for (const src of sources) {
    if (!src.context || Object.keys(src.context).length === 0) continue;
    let output: SolutionOutput;
    try {
      output = runSolution({ context: src.context, termIds: src.termIds });
    } catch {
      continue; // 单源异常不阻塞整区
    }
    outputs.push(output);
    for (const s of output.pro.sentences) {
      if (seen.has(s.text)) continue;
      seen.add(s.text);
      hits.push({
        text: s.text,
        polarity: s.polarity,
        modality: s.modality,
        sourceLabel: src.label,
      });
    }
  }
  return { hits, outputs };
}

function summarize(outputs: SolutionOutput[]): string | null {
  if (outputs.length === 0) return null;
  const conf = outputs.reduce((m, o) => Math.max(m, o.pro.overallConfidence), 0);
  const terms = new Set(outputs.flatMap((o) => o.meta.termIds)).size;
  if (terms === 0) return null;
  return `命中 ${terms} 个术语 · 最高置信度 ${Math.round(conf * 100)}%`;
}

/**
 * 解盘引擎解读区。无任何 L0 命中时不渲染（返回 null），页面布局不受影响。
 */
export function SolutionPanel({
  sources,
  title = 'AI 解读 · 解盘引擎',
  boundary,
}: {
  sources: SolutionSource[];
  title?: string;
  boundary: string;
}) {
  const { hits, outputs } = useMemo(() => collectHits(sources), [sources]);
  const summary = useMemo(() => summarize(outputs), [outputs]);
  if (hits.length === 0) return null;

  return (
    <section className="ts-card ts-sol">
      <h2 className="ts-card__title">{title}</h2>
      {summary && <p className="ts-page__note">{summary}</p>}
      <ol className="ts-sol__list">
        {hits.map((h) => (
          <li key={`${h.sourceLabel}-${h.text}`} className="ts-sol__item">
            <span className={`ts-sol__tag ${POLARITY_CLASS[h.polarity] ?? ''}`}>
              {POLARITY_LABEL[h.polarity] ?? h.polarity}
            </span>
            <span className="ts-sol__text">{h.text}</span>
            <span className="ts-sol__meta">
              {MODALITY_LABEL[h.modality] ?? h.modality}｜{h.sourceLabel}
            </span>
          </li>
        ))}
      </ol>
      <div className="ts-ai-panel__boundary">{boundary}</div>
    </section>
  );
}

export default SolutionPanel;
