import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentBlocks, ContentShell } from '@/components/content/ContentShell';
import { createContentRegistry } from '@/data/content/registry';
import { HEXAGRAMS } from '@/data/yijing';
import { shouldIndex } from '@/data/content/seo';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './hexagram-detail-page.css';

const registry = createContentRegistry(HEXAGRAMS);

export default function HexagramDetailPage(): ReactElement {
  const { hexagramId } = useParams<{ hexagramId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');

  useEffect(() => {
    trackPageView(`/yijing/hexagrams/${hexagramId ?? ''}`);
  }, [hexagramId]);

  const record = useMemo(() => (hexagramId ? registry.loadRecord(hexagramId) : undefined), [hexagramId]);

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
        title="64 卦详解"
        state="ok-empty"
        emptyHint="未找到该卦"
        onBack={() => navigate('/yijing/hexagrams')}
      />
    );
  }

  const f = record.domainFields as {
    hexagramNumber?: number;
    symbol?: string;
    upperTrigram?: { name?: string; symbol?: string } | null;
    lowerTrigram?: { name?: string; symbol?: string } | null;
    modernText?: string;
    usageScenarios?: string[];
  };

  // CG-C16: hexagramsData not exported; engineHex unavailable until core export confirmed
  const engineHex: any = undefined;

  return (
    <ContentShell
      title={`${record.title}卦`}
      state={state}
      confidence={record.confidence}
      completeness={record.completeness}
      noIndex={!shouldIndex(record)}
      onBack={() => navigate('/yijing/hexagrams')}
    >
      <div className="hexagram-detail__symbol">
        <span className="hexagram-detail__glyph">{f.symbol ?? ''}</span>
        <span className="hexagram-detail__trigram">
          上{f.upperTrigram?.name ?? '—'} 下{f.lowerTrigram?.name ?? '—'}
        </span>
      </div>

      {engineHex?.description ? (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">卦意（引擎原文）</h2>
          <p className="hexagram-detail__text">{guardText(engineHex.description)}</p>
        </section>
      ) : null}

      {engineHex?.yaoCi?.length ? (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">爻辞</h2>
          <ol className="hexagram-detail__yao">
            {engineHex.yaoCi.map((line: string, i: number) => (
              <li key={i}>{guardText(line)}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {engineHex?.yongCi ? (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">用爻</h2>
          <p className="hexagram-detail__text">{guardText(engineHex.yongCi)}</p>
        </section>
      ) : null}

      {f.modernText ? (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">白话释义</h2>
          <p className="hexagram-detail__text">{guardText(f.modernText)}</p>
        </section>
      ) : null}

      {record.blocks.length > 0 && (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">解读延伸</h2>
          <ContentBlocks blocks={record.blocks} />
        </section>
      )}

      {f.usageScenarios?.length ? (
        <section className="hexagram-detail__panel">
          <h2 className="hexagram-detail__h2">常见应用场景</h2>
          <ul className="hexagram-detail__list">
            {f.usageScenarios.map((s, i) => (
              <li key={i}>{guardText(s)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="hexagram-detail__source">来源：{record.sourceRef.join('；')}</p>
    </ContentShell>
  );
}
