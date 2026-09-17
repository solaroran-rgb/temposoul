/**
 * 康熙字典查字页 /kangxi
 * 数据：src/data/character-dossier（300 字样例，全量 3500 字解耦生产）
 */
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { searchChar, findByStroke, getDossierReport } from '../../data/character-dossier/loader';
import { useNameI18n } from '../../i18n/locales/name.zh-CN';
import '../../styles/name-dossier.css';

export function KangxiPage(): React.ReactElement {
  const nav = useNavigate();
  const { t } = useNameI18n();
  const [keyword, setKeyword] = useState('');
  const [stroke, setStroke] = useState('');
  const report = getDossierReport();

  const results = useMemo(() => {
    if (stroke.trim()) return findByStroke(Number(stroke));
    return searchChar(keyword, 60);
  }, [keyword, stroke]);

  return (
    <div className="kangxi-page">
      <PageTopbar title={t('kangxi.title')} onBack={() => nav('/')} />
      <main className="kangxi-page__main">
        <h1 className="kangxi-page__title">{t('kangxi.title')}</h1>
        <p className="kangxi-page__lead">
          {t('kangxi.lead')}（{t('page.dataset')}：{report.loaded} / 3500）
        </p>
        <div className="kangxi-page__search">
          <input
            className="kangxi-page__input"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setStroke('');
            }}
            placeholder={t('kangxi.searchPlaceholder')}
            maxLength={8}
          />
          <input
            className="kangxi-page__input kangxi-page__input--stroke"
            value={stroke}
            onChange={(e) => {
              setStroke(e.target.value);
              setKeyword('');
            }}
            placeholder={t('kangxi.strokePlaceholder')}
            maxLength={3}
            inputMode="numeric"
          />
        </div>
        {!keyword && !stroke && <p className="kangxi-page__muted">{t('kangxi.tip')}</p>}
        <ul className="kangxi-page__grid">
          {results.map((d) => (
            <li key={d.char} className="kangxi-page__cell">
              <Link className="kangxi-page__link" to={`/kangxi/${encodeURIComponent(d.char)}`}>
                <span className="kangxi-page__char">{d.char}</span>
                <span className="kangxi-page__meta">
                  {d.pinyin ?? '—'} · {d.kangxiStrokes ?? '—'} {t('kangxi.stroke')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {keyword && results.length === 0 && (
          <p className="kangxi-page__empty">{t('common.dataPending')}</p>
        )}
        <p className="kangxi-page__provenance">{report.provenance}</p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default KangxiPage;
