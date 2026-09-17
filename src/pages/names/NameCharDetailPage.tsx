import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentBlocks, ContentShell } from '@/components/content/ContentShell';
import { NAME_CHARS, NAME_STROKE_NOTE, loadNameCharDetail } from '@/data/names';
import { shouldIndex } from '@/data/content/seo';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './name-char-detail-page.css';

export default function NameCharDetailPage(): ReactElement {
  const { char } = useParams<{ char: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');

  const target = useMemo(() => (char ? decodeURIComponent(char) : ''), [char]);

  useEffect(() => {
    trackPageView(`/names/dictionary/${target}`);
    let alive = true;
    setState('loading');
    loadNameCharDetail(target)
      .then(() => {
        if (!alive) return;
        const rec = NAME_CHARS.find((r) => r.slug === target);
        setState(!rec ? 'ok-empty' : rec.completeness === 'full' ? 'ok' : 'degraded');
      })
      .catch(() => {
        if (alive) setState('error');
      });
    return () => {
      alive = false;
    };
  }, [target]);

  const record = NAME_CHARS.find((r) => r.slug === target);

  if (!record) {
    return (
      <ContentShell
        title="名字大全"
        state={state === 'loading' ? 'loading' : 'ok-empty'}
        emptyHint="该字暂未收录"
        onBack={() => navigate('/names/dictionary')}
      />
    );
  }

  const f = record.domainFields as {
    pinyin?: string;
    tone?: number;
    kangxiStrokes?: number;
    radical?: string;
    wuxing?: string;
    rareCharLevel?: string;
    meaning?: string;
    pairSuggestions?: string[];
  };

  return (
    <ContentShell
      title={`${record.title} · 字档案`}
      state={state}
      confidence={record.confidence}
      completeness={record.completeness}
      noIndex={!shouldIndex(record)}
      onBack={() => navigate('/names/dictionary')}
    >
      <div className="name-char__meta">
        <span>拼音 {f.pinyin ?? '-'}</span>
        <span>声调 {f.tone ?? '-'}</span>
        <span>康熙笔画 {f.kangxiStrokes ?? '-'}</span>
        <span>部首 {f.radical ?? '-'}</span>
        <span>五行 {f.wuxing ?? '-'}</span>
      </div>

      {f.meaning ? (
        <section className="name-char__panel">
          <h2 className="name-char__h2">字义</h2>
          <p className="name-char__text">{guardText(f.meaning)}</p>
        </section>
      ) : null}

      {record.blocks.length > 0 && (
        <section className="name-char__panel">
          <h2 className="name-char__h2">起名用法</h2>
          <ContentBlocks blocks={record.blocks} />
        </section>
      )}

      {f.pairSuggestions?.length ? (
        <section className="name-char__panel">
          <h2 className="name-char__h2">常见搭配</h2>
          <p className="name-char__text">{guardText(f.pairSuggestions.join('、'))}</p>
        </section>
      ) : null}

      <button type="button" className="name-char__cta" onClick={() => navigate('/name')}>
        用这个字起名
      </button>

      <p className="name-char__note">{NAME_STROKE_NOTE}</p>
      <p className="name-char__source">来源：{record.sourceRef.join('；')}</p>
    </ContentShell>
  );
}
