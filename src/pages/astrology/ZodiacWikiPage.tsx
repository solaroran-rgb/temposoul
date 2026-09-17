// src/pages/astrology/ZodiacWikiPage.tsx
import { useEffect, Fragment } from 'react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ZODIAC_SIGNS, ELEMENTS, MODALITIES, ELEMENT_LABELS, MODALITY_LABELS } from '@/data/astrology/zodiac-matrix';
import { trackPageView } from '@/lib/analytics';
import './zodiac-wiki-page.css';

export default function ZodiacWikiPage(): ReactElement {
  useEffect(() => { trackPageView('/astrology/zodiac'); }, []);

  return (
    <div className="zodiac-wiki-page">
      <PageTopbar title="星座百科" onBack={() => window.history.back()} />
      <section className="zodiac-wiki__matrix">
        <h2 className="zodiac-wiki__section-title">四元素 × 三特质矩阵</h2>
        <div className="zodiac-wiki__matrix-grid">
          <div className="zodiac-wiki__matrix-header" />
          {MODALITIES.map(m => <div key={m} className="zodiac-wiki__matrix-header">{MODALITY_LABELS[m]}</div>)}

          {/* 修复：React 19 严格模式下的 Fragment key 问题 */}
          {ELEMENTS.map(el => (
            <Fragment key={el}>
              <div className="zodiac-wiki__matrix-row-header">{ELEMENT_LABELS[el]}</div>
              {MODALITIES.map(mod => {
                const sign = ZODIAC_SIGNS.find(s => s.element === el && s.modality === mod);
                return (
                  <Link
                    key={`${el}-${mod}`}
                    to={sign ? `/astrology/zodiac/${sign.id}` : '#'}
                    className={`zodiac-wiki__matrix-cell ${!sign?.ready ? 'zodiac-wiki__matrix-cell--stub' : ''}`}
                  >
                    {sign ? (
                      <>
                        <span className="zodiac-wiki__matrix-symbol">{sign.symbol}</span>
                        <span className="zodiac-wiki__matrix-name">{sign.name}</span>
                      </>
                    ) : '--'}
                  </Link>
                );
              })}
            </Fragment>
          ))}
        </div>
      </section>

      <section className="zodiac-wiki__list">
        <h2 className="zodiac-wiki__section-title">十二星座</h2>
        <div className="zodiac-wiki__cards">
          {ZODIAC_SIGNS.map(sign => (
            <Link key={sign.id} to={`/astrology/zodiac/${sign.id}`} className={`zodiac-wiki__card ${!sign.ready ? 'zodiac-wiki__card--stub' : ''}`}>
              <span className="zodiac-wiki__card-symbol">{sign.symbol}</span>
              <div className="zodiac-wiki__card-info">
                <span className="zodiac-wiki__card-name">{sign.name}</span>
                <span className="zodiac-wiki__card-date">{sign.dateRange}</span>
              </div>
              {!sign.ready && <span className="zodiac-wiki__card-badge">即将上线</span>}
            </Link>
          ))}
        </div>
      </section>
      <PrivacyHint />
    </div>
  );
}
