/**
 * 单维度卡片：状态 / 数据 / 证据可展开溯源
 * 数据缺失时显示「数据准备中」，禁止估算填充。
 */
import React, { useState } from 'react';
import type { Confidence, DataStatus, EvidenceItem } from '@temposoul/core/onomastics';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';

const CONFIDENCE_CLASS: Record<string, string> = {
  verified: 'is-verified',
  probable: 'is-probable',
  disputed: 'is-disputed',
  legendary: 'is-legendary',
  unavailable: 'is-unavailable',
};

export interface DimensionCardProps {
  title: string;
  layer: 'fact' | 'folk' | 'culture';
  status: DataStatus;
  confidence?: Confidence;
  note?: string;
  evidence?: EvidenceItem[];
  children?: React.ReactNode;
}

export function DimensionCard({
  title,
  layer,
  status,
  confidence = 'probable',
  note,
  evidence = [],
  children,
}: DimensionCardProps): React.ReactElement {
  const { t } = useNameI18n();
  const [open, setOpen] = useState(false);
  return (
    <section className={`name-dim-card name-dim-card--${layer}`}>
      <header className="name-dim-card__head">
        <h3 className="name-dim-card__title">{title}</h3>
        <span className={`name-dim-card__status name-dim-card__status--${status}`}>
          {t(`status.${status}`)}
        </span>
        {confidence && (
          <span className={`name-dim-card__tag ${CONFIDENCE_CLASS[confidence] || ''}`}>
            {t(`conf.${confidence}`)}
          </span>
        )}
      </header>
      {status === 'unavailable' ? (
        <p className="name-dim-card__empty">{t('common.dataPending')}</p>
      ) : (
        <div className="name-dim-card__body">{children}</div>
      )}
      {note && <p className="name-dim-card__note">{note}</p>}
      {evidence.length > 0 && (
        <div className="name-dim-card__evidence">
          <button
            type="button"
            className="name-dim-card__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {t('common.evidence')}（{evidence.length}）
          </button>
          {open && (
            <ul className="name-dim-card__evidence-list">
              {evidence.map((e, i) => (
                <li key={`${e.fieldPath}-${i}`} className="name-dim-card__evidence-item">
                  <span className="name-dim-card__evidence-label">{e.label}</span>
                  <span className="name-dim-card__evidence-source">来源：{e.source}</span>
                  {e.note && <span className="name-dim-card__evidence-note">{e.note}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export default DimensionCard;
