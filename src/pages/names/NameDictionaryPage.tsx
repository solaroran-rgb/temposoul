import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentShell } from '@/components/content/ContentShell';
import { NAME_INDEX, NAME_STROKE_NOTE } from '@/data/names';
import { stableRank } from '@/data/content/deterministic';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './name-dictionary-page.css';

const WUXING = ['全部', '金', '木', '水', '火', '土'];

export function NameCharCard(props: {
  char: string;
  pinyin: string;
  strokes: number;
  wuxing: string;
  ready: boolean;
  onOpen: (char: string) => void;
}): ReactElement {
  const { char, pinyin, strokes, wuxing, ready, onOpen } = props;
  return (
    <button
      type="button"
      className={`name-dict__cell${ready ? '' : ' name-dict__cell--stub'}`}
      onClick={() => onOpen(char)}
    >
      <span className="name-dict__char">{char}</span>
      <span className="name-dict__meta">
        {pinyin} · {strokes}画 · {wuxing}
      </span>
    </button>
  );
}

export default function NameDictionaryPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [wuxing, setWuxing] = useState<string>('全部');
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    trackPageView('/names/dictionary');
    const timer = window.setTimeout(() => setState('ok'), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const list = useMemo(() => {
    const k = keyword.trim();
    const filtered = NAME_INDEX.filter((it) => {
      if (wuxing !== '全部' && it.wuxing !== wuxing) return false;
      if (!k) return true;
      return it.char.includes(k) || it.pinyin.includes(k.toLowerCase()) || it.radical.includes(k);
    });
    return stableRank(filtered, `${wuxing}:${k}`, (it) => (it.ready ? 1 : 0));
  }, [wuxing, keyword]);

  return (
    <ContentShell
      title="名字大全"
      state={list.length === 0 && state === 'ok' ? 'ok-empty' : state}
      emptyHint="没有匹配的字，试试放宽笔画或五行条件"
    >
      <div className="name-dict__toolbar">
        <input
          className="name-dict__search"
          value={keyword}
          placeholder="按字 / 拼音 / 部首搜索"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="name-dict__tabs">
          {WUXING.map((w) => (
            <button
              key={w}
              type="button"
              className={`name-dict__tab${wuxing === w ? ' name-dict__tab--active' : ''}`}
              onClick={() => {
                setWuxing(w);
                trackEvent('name_dict_filter', { wuxing: w });
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <p className="name-dict__note">{NAME_STROKE_NOTE}</p>

      <div className="name-dict__grid">
        {list.map((it) => (
          <NameCharCard
            key={it.char}
            char={it.char}
            pinyin={it.pinyin}
            strokes={it.kangxiStrokes}
            wuxing={it.wuxing}
            ready={it.ready}
            onOpen={(char) => {
              trackEvent('name_char_view', { char });
              navigate(`/names/dictionary/${encodeURIComponent(char)}`);
            }}
          />
        ))}
      </div>
    </ContentShell>
  );
}
