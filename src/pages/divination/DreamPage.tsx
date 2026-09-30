import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { ContentShell } from '@/components/content/ContentShell';
import { searchDream } from '@/data/dream/dream-dict';
import { getDreamEntries, getDreamSource } from '@/i18n/body/content';
import { stableRank } from '@/data/content/deterministic';
import { readUx, writeUx, TTL_7D } from '@/data/content/ux-store';
import { guardText } from '@/lib/assertions-guard';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './dream-page.css';

const HOT = ['水', '蛇', '考试', '坠落', '已故之人', '钱', '房屋'];

export function DreamCard(props: {
  keyword: string;
  category: string;
  traditionalText: string;
  onOpen: () => void;
}): ReactElement {
  const { keyword, category, traditionalText, onOpen } = props;
  return (
    <button type="button" className="dream__card" onClick={onOpen}>
      <span className="dream__kw">{keyword}</span>
      <span className="dream__cat">{category}</span>
      <span className="dream__brief">{traditionalText}</span>
    </button>
  );
}

export default function DreamPage(): ReactElement {
  const [state, setState] = useState<PageState>('idle');
  const [keyword, setKeyword] = useState<string>('');
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    trackPageView('/divination/dream');
    const recent = readUx<string[]>('dream', 'recent');
    if (recent?.length) setKeyword(recent[0] ?? '');
  }, []);

  const results = useMemo(() => searchDream(keyword).map((r) => getDreamEntries().find((e) => e.id === r.id) ?? r), [keyword]);
  const related = useMemo(() => {
    if (results.length > 0) return [];
    return stableRank(getDreamEntries(), keyword || 'hot', () => 0).slice(0, 6);
  }, [results.length, keyword]);

  useEffect(() => {
    if (!keyword.trim()) {
      setState('idle');
      return;
    }
    setState(results.length > 0 || related.length > 0 ? 'ok' : 'ok-empty');
  }, [keyword, results.length, related.length]);

  const active = getDreamEntries().find((e) => e.id === activeId);

  function submit(value: string): void {
    setKeyword(value);
    const recent = readUx<string[]>('dream', 'recent') ?? [];
    const next = [value, ...recent.filter((r) => r !== value)].slice(0, 10);
    writeUx<string[]>('dream', next, TTL_7D, 'recent');
    trackEvent('dream_search', { keyword: value });
  }

  return (
    <ContentShell
      title="周公解梦"
      state={state}
      confidence="legendary"
      emptyHint="未找到相关梦境，换个关键词试试"
    >
      <div className="dream__form">
        <input
          className="dream__input"
          value={keyword}
          placeholder="输入梦境关键词，如：蛇、考试、水"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="button" className="dream__submit" onClick={() => submit(keyword)}>
          查询
        </button>
      </div>

      <div className="dream__hot">
        {HOT.map((h) => (
          <button key={h} type="button" className="dream__tag" onClick={() => submit(h)}>
            {h}
          </button>
        ))}
      </div>

      {results.length === 0 && related.length > 0 && (
        <p className="dream__related-tip">未精确匹配，为你推荐相近条目：</p>
      )}

      <div className="dream__list">
        {(results.length > 0 ? results : related).map((e) => (
          <DreamCard
            key={e.id}
            keyword={e.keyword}
            category={e.category}
            traditionalText={e.traditionalText}
            onOpen={() => setActiveId(e.id)}
          />
        ))}
      </div>

      {active && (
        <section className="dream__detail">
          <h2 className="dream__h2">{active.keyword}</h2>
          <p className="dream__text">{guardText(active.traditionalText)}</p>
          <p className="dream__text">{guardText(active.modernText)}</p>
          <p className="dream__caution">{guardText(active.caution)}</p>
        </section>
      )}

      <p className="dream__source">{getDreamSource()}</p>
    </ContentShell>
  );
}
