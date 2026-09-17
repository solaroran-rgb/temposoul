/**
 * 三层解构档案：事实层 FACT / 民俗层 FOLK / 文化层 CULTURE
 * 每层独立呈现，互不混算；民俗层强制附「文化习俗，非可验证结论」。
 */
import React from 'react';
import type { NameProfile } from '@temposoul/core/onomastics';
import { DimensionCard } from './DimensionCard';
import { useNameI18n } from '../../../i18n/locales/name.zh-CN';

export interface NameProfileDossierProps {
  profile: NameProfile;
}

export function NameProfileDossier({ profile }: NameProfileDossierProps): React.ReactElement {
  const { t } = useNameI18n();
  const { fact, folk, culture } = profile;
  return (
    <div className="name-dossier">
      <section className="name-dossier__layer name-dossier__layer--fact">
        <h2 className="name-dossier__layer-title">{t('layer.fact')}</h2>
        <div className="name-dossier__grid">
          <DimensionCard
            title={t('dim.phonetics')}
            layer="fact"
            status={fact.phonetics.status}
            note={fact.phonetics.note}
            evidence={fact.phonetics.evidence}
          >
            <p className="name-dossier__pinyin">{fact.phonetics.data.pinyin.join(' ') || '—'}</p>
            {fact.phonetics.data.homophoneRisks.length > 0 && (
              <ul className="name-dossier__list">
                {fact.phonetics.data.homophoneRisks.map((r, i) => (
                  <li key={i}>
                    {r.dialect}：{r.word}（{r.note}）
                  </li>
                ))}
              </ul>
            )}
            <p className="name-dossier__muted">
              {t('dim.duplicateRate')}：{t('common.noAuthoritativeData')}
            </p>
          </DimensionCard>
          <DimensionCard
            title={t('dim.glyph')}
            layer="fact"
            status={fact.glyph.status}
            note={fact.glyph.note}
            evidence={fact.glyph.evidence}
          >
            <p>
              {t('dim.strokeTotal')}：{fact.glyph.data.strokeCountTotal ?? '—'}
            </p>
            <p className="name-dossier__muted">
              {t('dim.rareCharLevel')}：{fact.glyph.data.rareCharLevel}
            </p>
          </DimensionCard>
          <DimensionCard
            title={t('dim.semantics')}
            layer="fact"
            status={fact.semantics.status}
            note={fact.semantics.note}
            evidence={fact.semantics.evidence}
          >
            <ul className="name-dossier__list">
              {fact.semantics.data.meanings.map((m, i) => (
                <li key={i}>
                  <strong>{m.char}</strong>：{m.meaning || t('common.dataPending')}
                </li>
              ))}
            </ul>
          </DimensionCard>
          <DimensionCard
            title={t('dim.usage')}
            layer="fact"
            status={fact.usability.status}
            note={fact.usability.note}
            evidence={fact.usability.evidence}
          >
            <ul className="name-dossier__list">
              {fact.usability.data.inputRisk.map((r) => (
                <li key={r.system}>
                  {r.system}：{t(`risk.${r.supported}`)}
                  <span className="name-dossier__muted">（{r.note}）</span>
                </li>
              ))}
            </ul>
          </DimensionCard>
        </div>
      </section>

      <section className="name-dossier__layer name-dossier__layer--folk">
        <h2 className="name-dossier__layer-title">
          {t('layer.folk')}
          <span className="name-dossier__badge">{folk.disclaimer}</span>
        </h2>
        {profile.input.script === 'han' ? (
          <div className="name-dossier__grid">
            <DimensionCard
              title={t('dim.wuge')}
              layer="folk"
              status={folk.wuge.status}
              confidence="legendary"
              note={folk.wuge.note}
              evidence={folk.wuge.evidence}
            >
              <ul className="name-dossier__list">
                <li>
                  {t('wuge.heavenly')}：{folk.wuge.data.heavenly ?? '—'}
                </li>
                <li>
                  {t('wuge.human')}：{folk.wuge.data.human ?? '—'}
                </li>
                <li>
                  {t('wuge.earthly')}：{folk.wuge.data.earthly ?? '—'}
                </li>
                <li>
                  {t('wuge.outer')}：{folk.wuge.data.outer ?? '—'}
                </li>
                <li>
                  {t('wuge.total')}：{folk.wuge.data.total ?? '—'}
                </li>
              </ul>
              <p className="name-dossier__muted">{t('wuge.eightyOnePending')}</p>
            </DimensionCard>
            <DimensionCard
              title={t('dim.sancai')}
              layer="folk"
              status={folk.sancai.status}
              confidence="legendary"
              note={folk.sancai.note}
              evidence={folk.sancai.evidence}
            >
              <p>
                {folk.sancai.data.heavenlyElement ?? '—'} / {folk.sancai.data.humanElement ?? '—'} /{' '}
                {folk.sancai.data.earthlyElement ?? '—'}
              </p>
            </DimensionCard>
            <DimensionCard
              title={t('dim.zodiac')}
              layer="folk"
              status={folk.zodiac.status}
              confidence="legendary"
              note={folk.zodiac.note}
              evidence={folk.zodiac.evidence}
            >
              <p>
                {t('dim.zodiac')}：{folk.zodiac.data.zodiac ?? t('common.needBirthDate')}
              </p>
              {folk.zodiac.data.likedRoots.length > 0 && (
                <p>
                  {t('zodiac.liked')}：{folk.zodiac.data.likedRoots.join('、')}
                </p>
              )}
              {folk.zodiac.data.avoidedRoots.length > 0 && (
                <p>
                  {t('zodiac.avoided')}：{folk.zodiac.data.avoidedRoots.join('、')}
                </p>
              )}
            </DimensionCard>
          </div>
        ) : (
          <p className="name-dossier__muted">{t('folk.latinSkipped')}</p>
        )}
      </section>

      <section className="name-dossier__layer name-dossier__layer--culture">
        <h2 className="name-dossier__layer-title">{t('layer.culture')}</h2>
        <div className="name-dossier__grid">
          <DimensionCard
            title={t('dim.genderTendency')}
            layer="culture"
            status={culture.genderTendency ? 'complete' : 'unavailable'}
          >
            <p>{culture.genderTendency ?? t('common.dataPending')}</p>
          </DimensionCard>
          <DimensionCard
            title={t('dim.taboo')}
            layer="culture"
            status={culture.taboo.status}
            note={culture.taboo.note}
          >
            <p>
              {culture.taboo.data.hits.length
                ? culture.taboo.data.hits.join('、')
                : t('common.dataPending')}
            </p>
          </DimensionCard>
          <DimensionCard
            title={t('dim.generationName')}
            layer="culture"
            status={culture.generationName.status}
            note={culture.generationName.note}
          >
            <p>{culture.generationName.data.matched ?? t('common.dataPending')}</p>
          </DimensionCard>
          <DimensionCard
            title={t('dim.allusions')}
            layer="culture"
            status={culture.allusions.length ? 'complete' : 'unavailable'}
          >
            <p>
              {culture.allusions.length ? culture.allusions.join('；') : t('common.dataPending')}
            </p>
          </DimensionCard>
        </div>
      </section>
    </div>
  );
}

export default NameProfileDossier;
