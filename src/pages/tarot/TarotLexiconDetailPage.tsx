import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentBlocks, ContentShell } from '@/components/content/ContentShell';
import { createContentRegistry } from '@/data/content/registry';
import { TAROT_LEXICON } from '@/data/tarot';
import { shouldIndex } from '@/data/content/seo';
import { guardText } from '@/lib/assertions-guard';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './tarot-lexicon-detail-page.css';

const registry = createContentRegistry(TAROT_LEXICON);

/** FAQ 结构化数据：仅可索引条目输出 */
export function TarotFaqJsonLd(props: {
  title: string;
  upright: string;
  reversed: string;
}): ReactElement {
  const { title, upright, reversed } = props;
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${title} 正位含义`,
          acceptedAnswer: { '@type': 'Answer', text: upright },
        },
        {
          '@type': 'Question',
          name: `${title} 逆位含义`,
          acceptedAnswer: { '@type': 'Answer', text: reversed },
        },
      ],
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [title, upright, reversed]);
  return <></>;
}

export default function TarotLexiconDetailPage(): ReactElement {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [tab, setTab] = useState<'upright' | 'reversed'>('upright');

  useEffect(() => {
    trackPageView(`/tarot/lexicon/${cardId ?? ''}`);
  }, [cardId]);

  const record = useMemo(() => (cardId ? registry.loadRecord(cardId) : undefined), [cardId]);

  useEffect(() => {
    if (!record) {
      setState('ok-empty');
      return;
    }
    setState(record.completeness === 'full' ? 'ok' : 'degraded');
  }, [record]);

  if (!record) {
    return (
      <ContentShell
        title="塔罗牌义"
        state="ok-empty"
        emptyHint="未找到该牌"
        onBack={() => navigate('/tarot/lexicon')}
      />
    );
  }

  const f = record.domainFields as {
    keywords?: string[];
    element?: string;
    astrology?: string;
    uprightText?: string;
    reversedText?: string;
    symbolism?: string;
    cardNumber?: number;
    arcana?: string;
    suit?: string | null;
  };

  const upright = f.uprightText ?? '释义待补';
  const reversed = f.reversedText ?? '释义待补';

  return (
    <ContentShell
      title={record.title}
      state={state}
      confidence={record.confidence}
      completeness={record.completeness}
      noIndex={!shouldIndex(record)}
      onBack={() => navigate('/tarot/lexicon')}
    >
      {shouldIndex(record) && (
        <TarotFaqJsonLd title={record.title} upright={upright} reversed={reversed} />
      )}

      <div className="tarot-detail__meta">
        <span>{f.arcana ?? '塔罗'}</span>
        <span>编号 {f.cardNumber ?? '-'}</span>
        {f.suit ? <span>花色 {f.suit}</span> : null}
        {f.element ? <span>元素 {f.element}</span> : null}
        {f.astrology ? <span>星象 {f.astrology}</span> : null}
      </div>

      {f.keywords?.length ? (
        <p className="tarot-detail__keywords">{f.keywords.join(' · ')}</p>
      ) : null}

      <div className="tarot-detail__tabs">
        <button
          type="button"
          className={`tarot-detail__tab${tab === 'upright' ? ' tarot-detail__tab--active' : ''}`}
          onClick={() => setTab('upright')}
        >
          正位
        </button>
        <button
          type="button"
          className={`tarot-detail__tab${tab === 'reversed' ? ' tarot-detail__tab--active' : ''}`}
          onClick={() => {
            setTab('reversed');
            trackEvent('tarot_lexicon_tab', { cardId: record.slug, tab: 'reversed' });
          }}
        >
          逆位
        </button>
      </div>

      <section className="tarot-detail__panel">
        <h2 className="tarot-detail__h2">{tab === 'upright' ? '正位释义' : '逆位释义'}</h2>
        <p className="tarot-detail__text">{guardText(tab === 'upright' ? upright : reversed)}</p>
      </section>

      {record.blocks.length > 0 && (
        <section className="tarot-detail__panel">
          <h2 className="tarot-detail__h2">延伸解读</h2>
          <ContentBlocks blocks={record.blocks} />
        </section>
      )}

      {f.symbolism ? (
        <section className="tarot-detail__panel">
          <h2 className="tarot-detail__h2">牌面象征</h2>
          <p className="tarot-detail__text">{guardText(f.symbolism)}</p>
        </section>
      ) : null}

      <p className="tarot-detail__source">来源：{record.sourceRef.join('；')}</p>
    </ContentShell>
  );
}
