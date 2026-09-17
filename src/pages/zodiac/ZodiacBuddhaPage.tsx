// B23-4 src/pages/zodiac/ZodiacBuddhaPage.tsx
/**
 * 本命佛（八大守护神）民俗科普页：生肖选择器 + 本命佛卡 + 全表。
 * 强制"民俗参考"Badge；禁止"佩戴即保佑"功效断言。六态机。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView } from '@/lib/analytics';
import { ZODIAC_BUDDHAS, ALL_ZODIACS, findBuddhaByZodiac } from '@/data/zodiac/buddha';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function ZodiacBuddhaPage() {
  const nav = useNavigate();
  const [zodiac, setZodiac] = useState<string>('');
  const [state, setState] = useState<PageState>('idle');

  useDocumentMeta({ title: '十二生肖本命佛 · 民俗科普 | TempoSoul' });

  useEffect(() => {
    trackPageView('/zodiac/buddha');
    setState('ok');
  }, []);

  const hit = useMemo(() => (zodiac ? findBuddhaByZodiac(zodiac) : undefined), [zodiac]);

  return (
    <main className="page-zodiac-buddha">
      <PageTopbar title="十二生肖本命佛" onBack={() => nav('/')} />

      <div className="folk-badge" role="note" aria-label="民俗参考">民俗参考</div>
      <p className="buddha-intro">
        以下为密宗八大守护神体系在民间流传中的生肖对应说法，仅作文化科普。
      </p>

      <div className="buddha-picker" role="tablist" aria-label="选择生肖">
        {ALL_ZODIACS.map((z) => (
          <button
            key={z}
            type="button"
            role="tab"
            aria-selected={zodiac === z}
            className={`buddha-z${zodiac === z ? ' is-active' : ''}`}
            onClick={() => setZodiac(z)}
          >
            {z}
          </button>
        ))}
      </div>

      {state === 'error' && (
        <div role="alert">
          数据加载失败。<button type="button" onClick={() => setState('ok')}>重试</button>
        </div>
      )}
      {state === 'ok' && zodiac && !hit && <p className="buddha-empty">该生肖未收录。</p>}
      {state === 'ok' && hit && (
        <article className="buddha-card" aria-label="本命佛结果">
          <h2>{hit.zodiac.join('、')} · {hit.buddhaName}</h2>
          <p className="buddha-alias">别称：{hit.alias}</p>
          <p>{guardText(hit.summary)}</p>
          <p className="buddha-origin">来源体系：{hit.culturalOrigin}</p>
          <p className="buddha-disclaimer">{hit.disclaimer}</p>
        </article>
      )}

      <section className="buddha-table">
        <h2>全表</h2>
        <table>
          <thead>
            <tr><th>生肖</th><th>守护神</th><th>来源体系</th></tr>
          </thead>
          <tbody>
            {ZODIAC_BUDDHAS.map((b) => (
              <tr key={b.buddhaName}>
                <td>{b.zodiac.join('、')}</td>
                <td>{b.buddhaName}</td>
                <td>{b.culturalOrigin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <PrivacyHint />
    </main>
  );
}
