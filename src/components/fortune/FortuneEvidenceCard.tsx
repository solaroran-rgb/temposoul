// 修正：IT-2.2 依据（大运/流年证据卡从 pillarRelations 派生）
import type { ReactNode } from 'react';

export type Confidence = 'verified' | 'probable' | 'disputed' | 'legendary';

export interface EvidenceItem {
  id: string;
  label: string;
  value?: string;
  source?: string;
  note?: string;
  confidence: Confidence;
}

export interface FortuneEvidenceCardProps {
  title?: string;
  items: EvidenceItem[];
  emptyText?: string;
  className?: string;
  footer?: ReactNode;
}

const CONF_LABEL: Record<Confidence, string> = {
  verified: '已验证',
  probable: '较可信',
  disputed: '有争议',
  legendary: '文化习俗',
};

const CONF_ORDER: Confidence[] = ['verified', 'probable', 'disputed', 'legendary'];

function genId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `e_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeConfidence(v: unknown): Confidence {
  return v === 'verified' || v === 'probable' || v === 'disputed' || v === 'legendary'
    ? v
    : 'legendary';
}

export function normalizeEvidence(raw: unknown): EvidenceItem[] {
  if (!Array.isArray(raw)) return [];
  const out: EvidenceItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    if (!r || typeof r !== 'object') continue;
    const o = r as Record<string, unknown>;
    const label = typeof o.label === 'string' && o.label.trim() ? o.label : `证据 ${i + 1}`;
    out.push({
      id: typeof o.id === 'string' && o.id ? o.id : genId(),
      label,
      value: typeof o.value === 'string' ? o.value : undefined,
      source: typeof o.source === 'string' ? o.source : undefined,
      note: typeof o.note === 'string' ? o.note : undefined,
      confidence: normalizeConfidence(o.confidence),
    });
  }
  return out;
}

/**
 * IT-2.2 依据：把 /bazi/calculate 返回的 data.pillarRelations 转为证据条目
 */
export function relationsToEvidence(raw: unknown): EvidenceItem[] {
  if (!raw || typeof raw !== 'object') return [];
  const r = raw as Record<string, unknown>;
  const groups: Array<{ key: string; label: string; confidence: Confidence }> = [
    { key: 'sameStem', label: '同干', confidence: 'verified' },
    { key: 'sameBranch', label: '同支', confidence: 'verified' },
    { key: 'xingChong', label: '刑冲害破', confidence: 'verified' },
    { key: 'fuxin', label: '伏吟', confidence: 'probable' },
    { key: 'fanyin', label: '反吟', confidence: 'probable' },
  ];
  const out: EvidenceItem[] = [];
  for (const g of groups) {
    const arr = r[g.key];
    if (!Array.isArray(arr)) continue;
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      const text = typeof v === 'string' ? v : String(v ?? '');
      if (!text) continue;
      out.push({
        id: `${g.key}-${i}`,
        label: g.label,
        value: text,
        source: '@temposoul/core/bazi',
        note: '四柱关系',
        confidence: g.confidence,
      });
    }
  }
  return out;
}

export function FortuneEvidenceCard(props: FortuneEvidenceCardProps) {
  const { title = '证据', items, emptyText = '暂无证据数据', className, footer } = props;
  const safeItems = Array.isArray(items) ? items : [];
  const grouped = CONF_ORDER.map((c) => ({
    c,
    list: safeItems.filter((i) => i.confidence === c),
  })).filter((g) => g.list.length > 0);

  return (
    <section className={`ts-evidence-card ${className ?? ''}`.trim()} aria-label={title}>
      <header className="ts-evidence-card__head">
        <h3 className="ts-evidence-card__title">{title}</h3>
        <span className="ts-evidence-card__count">{safeItems.length} 条</span>
      </header>
      {safeItems.length === 0 && (
        <div className="ts-empty ts-evidence-card__empty">{emptyText}</div>
      )}
      {grouped.map((g) => (
        <div key={g.c} className={`ts-evidence-card__group ts-evidence-card__group--${g.c}`}>
          <div className={`ts-badge ts-badge--${g.c}`}>{CONF_LABEL[g.c]}</div>
          <ul className="ts-evidence-card__list">
            {g.list.map((it) => (
              <li key={it.id} className="ts-evidence-card__item">
                <div className="ts-evidence-card__label">{it.label}</div>
                {it.value && <div className="ts-evidence-card__value">{it.value}</div>}
                {(it.source || it.note) && (
                  <div className="ts-evidence-card__meta">
                    {it.source && <span>出处：{it.source}</span>}
                    {it.note && <span>口径：{it.note}</span>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {footer && <footer className="ts-evidence-card__footer">{footer}</footer>}
    </section>
  );
}

export default FortuneEvidenceCard;
