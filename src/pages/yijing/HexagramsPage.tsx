import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentShell } from '@/components/content/ContentShell';
import { createContentRegistry } from '@/data/content/registry';
import { HEXAGRAMS, HEXAGRAM_FULL_COUNT } from '@/data/yijing';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './hexagrams-page.css';

const registry = createContentRegistry(HEXAGRAMS);

export function HexagramCard(props: {
  slug: string;
  title: string;
  symbol: string;
  number: number;
  ready: boolean;
  onOpen: (slug: string) => void;
}): ReactElement {
  const { slug, title, symbol, number, ready, onOpen } = props;
  return (
    <button
      type="button"
      className={`hexagrams__cell${ready ? '' : ' hexagrams__cell--stub'}`}
      onClick={() => onOpen(slug)}
    >
      <span className="hexagrams__no">{String(number).padStart(2, '0')}</span>
      <span className="hexagrams__symbol">{symbol}</span>
      <span className="hexagrams__name">{title}</span>
    </button>
  );
}

export default function HexagramsPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');

  useEffect(() => {
    trackPageView('/yijing/hexagrams');
    const timer = window.setTimeout(() => setState('ok'), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const metas = registry.listMeta({});

  return (
    <ContentShell title="64 卦详解" state={metas.length === 0 ? 'ok-empty' : state}>
      <p className="hexagrams__count">
        共 {HEXAGRAMS.length} 卦 · 已详 {HEXAGRAM_FULL_COUNT} 卦
      </p>
      <div className="hexagrams__grid">
        {metas.map((m) => {
          const rec = registry.loadRecordById(m.id);
          const f = (rec?.domainFields ?? {}) as { symbol?: string; hexagramNumber?: number };
          return (
            <HexagramCard
              key={m.id}
              slug={m.slug}
              title={m.title}
              symbol={f.symbol ?? ''}
              number={f.hexagramNumber ?? 0}
              ready={m.ready}
              onOpen={(slug) => {
                trackEvent('hexagram_view', { slug });
                navigate(`/yijing/hexagrams/${slug}`);
              }}
            />
          );
        })}
      </div>
    </ContentShell>
  );
}
