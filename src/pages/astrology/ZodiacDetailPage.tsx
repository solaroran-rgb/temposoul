// src/pages/astrology/ZodiacDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { ZODIAC_SIGNS, ELEMENT_LABELS, MODALITY_LABELS } from '@/data/astrology/zodiac-matrix';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import { useDocumentMeta } from '@/lib/use-document-meta';
import type { PageState } from '@/types/page-state';
import './zodiac-wiki-page.css';

export default function ZodiacDetailPage(): ReactElement {
  const { signId } = useParams<{ signId: string }>();
  const sign = ZODIAC_SIGNS.find(s => s.id === signId);

  useEffect(() => { trackPageView(`/astrology/zodiac/${signId}`); }, [signId]);

  const pageState: PageState = !sign ? 'ok-empty' : sign.ready ? 'ok' : 'degraded';

  // 声明式 noindex：stub/degraded 页面禁止索引
  useDocumentMeta({
    title: sign ? `${sign.name} - 星座百科` : '星座详情',
    noIndex: pageState !== 'ok'
  });

  if (!sign) {
    return (
      <div className="zodiac-wiki-page">
        <PageTopbar title="星座详情" onBack={() => window.history.back()} />
        <div className="zodiac-wiki__empty">未找到该星座信息</div>
        <PrivacyHint />
      </div>
    );
  }

  return (
    <div className="zodiac-wiki-page">
      <PageTopbar title={sign.name} onBack={() => window.history.back()} />

      <div className="zodiac-wiki__hero">
        <span className="zodiac-wiki__hero-symbol">{sign.symbol}</span>
        <h1 className="zodiac-wiki__hero-name">{sign.name} ({sign.enName})</h1>
        <div className="zodiac-wiki__hero-meta">
          <span>{sign.dateRange}</span>
          <span>{ELEMENT_LABELS[sign.element]}</span>
          <span>{MODALITY_LABELS[sign.modality]}</span>
          <span>守护星: {sign.ruler}</span>
        </div>
        <ConfidenceBadge confidence={sign.completeness === 'full' ? 'verified' : 'probable'} />
      </div>

      {pageState === 'ok' && (
        <section className="zodiac-wiki__content">
          <h2>基本特质</h2>
          <p>{sign.description}</p>
        </section>
      )}

      {pageState === 'degraded' && (
        <div className="zodiac-wiki__stub">
          <p>该星座详细内容正在编写中，敬请期待。</p>
          <p>基础信息: {ELEMENT_LABELS[sign.element]} · {MODALITY_LABELS[sign.modality]} · 守护星 {sign.ruler}</p>
        </div>
      )}

      <div className="zodiac-wiki__guard">
        {guardText('星座百科内容基于西方占星学传统理论整理，仅供文化研究与个人兴趣参考，不构成对个体性格、命运的确定性判断。')}
      </div>

      <PrivacyHint />
    </div>
  );
}
