import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentShell } from '@/components/content/ContentShell';
import { createContentRegistry } from '@/data/content/registry';
import { TAROT_LEXICON, TAROT_FULL_COUNT } from '@/data/tarot';
import { shouldIndex } from '@/data/content/seo';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './tarot-lexicon-page.css';

const registry = createContentRegistry(TAROT_LEXICON);

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'major', label: '大阿卡纳' },
  { key: 'wands', label: '权杖' },
  { key: 'cups', label: '圣杯' },
  { key: 'swords', label: '宝剑' },
  { key: 'pentacles', label: '星币' },
];

export function TarotLexiconCard(props: {
  slug: string;
  title: string;
  ready: boolean;
  completeness: string;
  onOpen: (slug: string) => void;
}): ReactElement {
  const { slug, title, ready, completeness, onOpen } = props;
  return (
    <button
      type="button"
      className={`tarot-lexicon__card${ready ? '' : ' tarot-lexicon__card--stub'}`}
      onClick={() => onOpen(slug)}
    >
      <span className="tarot-lexicon__card-title">{title}</span>
      <span className="tarot-lexicon__card-tag">{completeness === 'full' ? '已详' : '待补'}</span>
    </button>
  );
}

export default function TarotLexiconPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [category, setCategory] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    trackPageView('/tarot/lexicon');
  }, []);

  useEffect(() => {
    setState('loading');
    const timer = window.setTimeout(() => setState('ok'), 0);
    return () => window.clearTimeout(timer);
  }, [category, keyword]);

  const metas = useMemo(
    () =>
      registry.listMeta({
        category: category === 'all' ? undefined : category,
        keyword: keyword || undefined,
      }),
    [category, keyword]
  );

  const indexable = TAROT_LEXICON.filter(shouldIndex).length;

  return (
    <ContentShell
      title="塔罗牌义百科"
      state={metas.length === 0 && state === 'ok' ? 'ok-empty' : state}
      emptyHint="该分类下暂无已就绪条目"
    >
      <div className="tarot-lexicon__toolbar">
        <input
          className="tarot-lexicon__search"
          value={keyword}
          placeholder="搜索牌名"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="tarot-lexicon__tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`tarot-lexicon__tab${category === c.key ? ' tarot-lexicon__tab--active' : ''}`}
              onClick={() => {
                setCategory(c.key);
                trackEvent('tarot_lexicon_filter', { category: c.key });
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="tarot-lexicon__count">
        共 {TAROT_LEXICON.length} 张 · 已详 {TAROT_FULL_COUNT} 张 · 可索引 {indexable} 张
      </p>

      <div className="tarot-lexicon__grid">
        {metas.map((m) => (
          <TarotLexiconCard
            key={m.id}
            slug={m.slug}
            title={m.title}
            ready={m.ready}
            completeness={m.completeness}
            onOpen={(slug) => {
              trackEvent('tarot_lexicon_view', { cardId: slug });
              navigate(`/tarot/lexicon/${slug}`);
            }}
          />
        ))}
      </div>
    </ContentShell>
  );
}
