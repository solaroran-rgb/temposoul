/**
 * 字档案字卡：康熙笔画（含部首异计）/ 拼音 / 五行民俗 / 生肖字根 / 字义 / 录入风险，全部带出处。
 */
import React from 'react';
import type { CharacterDossier } from '../../../data/character-dossier/schemas';
import { RADICAL_VARIANT_RULES } from '@temposoul/core/onomastics';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';

export interface CharDossierCardProps {
  dossier: CharacterDossier;
}

export function CharDossierCard({ dossier }: CharDossierCardProps): React.ReactElement {
  const { t } = useNameI18n();
  const rule = dossier.radicalVariantRule
    ?.split('+')
    .map((id) => RADICAL_VARIANT_RULES[id])
    .find(Boolean);
  return (
    <article className="char-card">
      <header className="char-card__head">
        <span className="char-card__char">{dossier.char}</span>
        <div className="char-card__head-meta">
          <span className="char-card__pinyin">{dossier.pinyin ?? '—'}</span>
          <span className="char-card__tone">
            {dossier.tone ? `${dossier.tone} ${t('kangxi.tone')}` : ''}
          </span>
        </div>
      </header>
      <dl className="char-card__list">
        <div className="char-card__item">
          <dt>{t('kangxi.kangxiStroke')}</dt>
          <dd>
            {dossier.kangxiStrokes ?? '—'}
            {dossier.dictionaryStrokes != null && (
              <span className="char-card__muted">
                （{t('kangxi.dictStroke')} {dossier.dictionaryStrokes}）
              </span>
            )}
          </dd>
        </div>
        {rule && (
          <div className="char-card__item">
            <dt>{t('kangxi.radicalRule')}</dt>
            <dd>
              {rule.as}（按 {rule.strokes} 画计）
            </dd>
          </div>
        )}
        {dossier.traditional && dossier.traditional !== dossier.char && (
          <div className="char-card__item">
            <dt>{t('kangxi.traditional')}</dt>
            <dd>{dossier.traditional}</dd>
          </div>
        )}
        <div className="char-card__item">
          <dt>{t('kangxi.meaning')}</dt>
          <dd>{dossier.meaning || t('common.dataPending')}</dd>
        </div>
        <div className="char-card__item">
          <dt>{t('kangxi.rareLevel')}</dt>
          <dd>{dossier.rareCharLevel ?? t('common.dataPending')}</dd>
        </div>
      </dl>
      <footer className="char-card__foot">
        <p className="char-card__source">
          {t('common.source')}：{dossier.source || '—'}
        </p>
        <p className="char-card__note">{dossier.note}</p>
        <p className="char-card__reviewer">
          {t('common.reviewer')}：{dossier.reviewer || '—'} · {dossier.updatedAt || '—'}
        </p>
      </footer>
    </article>
  );
}

export default CharDossierCard;
