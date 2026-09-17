// src/pages/ziwei/SihuaPage.tsx
import { useEffect, useState, type ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { ContentBlocks } from '@/components/content/ContentBlocks';
import { trackPageView } from '@/lib/analytics';
import { applyGuard } from '@/lib/guard-utils';
import type { PageState } from '@/types/page-state';
import { sihuaPack, SIWEI_STARS, HUA_KINDS } from '@/data/ziwei/sihua';
import './sihua-page.css';

export default function SihuaPage(): ReactElement {
  const [state, setState] = useState<PageState>('loading');
  useEffect(() => {
    trackPageView('/ziwei/sihua');
    setState(sihuaPack.entries.length === 0 ? 'ok-empty' : 'ok');
  }, []);
  const lookup = (starSlug: string, hua: string) =>
    sihuaPack.entries.find((e) => e.starSlug === starSlug && e.hua === hua);
  return (
    <div className="sihua-page">
      <PageTopbar title="四化专题" onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton sihua-page__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="sihua-page__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="sihua-page__empty">暂无内容。</p>}
      {state === 'ok' && (
        <>
          <p className="sihua-page__intro">四化为紫微斗数中星曜随天干的四种转变：禄、权、科、忌。下表为 14 主星 × 4 化矩阵，首批内容尚在补充。</p>
          <div className="sihua-page__matrix-wrap">
            <table className="sihua-page__matrix">
              <thead>
                <tr>
                  <th scope="col">星曜</th>
                  {HUA_KINDS.map((h) => <th key={h} scope="col">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {SIWEI_STARS.map((s) => (
                  <tr key={s.slug}>
                    <th scope="row">{s.name}</th>
                    {HUA_KINDS.map((h) => {
                      const entry = lookup(s.slug, h);
                      return (
                        <td key={h} className={entry ? 'sihua-page__cell sihua-page__cell--filled' : 'sihua-page__cell'}>
                          {entry ? (
                            <>
                              <span className="sihua-page__cell-title">{entry.title}</span>
                              <ConfidenceBadge confidence={entry.confidence} />
                            </>
                          ) : <span className="sihua-page__cell-empty">待补</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <section className="sihua-page__list">
            {sihuaPack.entries.map((e) => (
              <article key={e.key} className="sihua-page__card">
                <h3 className="sihua-page__card-title">{e.title}</h3>
                <p className="sihua-page__card-meaning">{applyGuard(e.meaning)}</p>
                <ContentBlocks blocks={e.blocks} />
              </article>
            ))}
          </section>
        </>
      )}
      <p className="sihua-page__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </div>
  );
}
