// B'11-6 src/pages/divination/DailySignPage.tsx
/**
 * 灵签页 (支持 type='lingsign')
 * @module B'11-6
 */
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { loadLingSignData, drawRandomSign, isValidCode, type LingSignModule, type LingSign } from './lib/lingsign-loaders';
import { usePromptCopyShare } from '@/hooks/usePromptCopyShare';
import { djb2 } from '@/lib/hash';
import { PageTopbar } from '@/components/PageTopbar';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';
import PrivacyHint from '@/components/PrivacyHint';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

interface Props { type?: string; }

export default function DailySignPage({ type }: Props) {
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState<PageState>('idle');
  const [mod, setMod] = useState<LingSignModule | null>(null);
  const [current, setCurrent] = useState<LingSign | null>(null);

  useEffect(() => { trackPageView(`/lingsign/${code}`); }, [code]);

  useEffect(() => {
    if (type !== 'lingsign' || !code) return;
    if (!isValidCode(code)) return;
    setState('loading');
    loadLingSignData(code)
      .then((m) => { setMod(m); setState('ok'); })
      .catch(() => setState('error'));
  }, [code, type]);

  if (type === 'lingsign' && code && !isValidCode(code)) {
    return <Navigate to="/lingsign/guanyin" replace />;
  }

  const handleDraw = () => {
    if (!mod) return;
    const seed = djb2(`${code}|${Date.now()}`);
    setCurrent(drawRandomSign(mod.SIGNS, seed));
    trackChartSubmit({ mode: 'ling_sign', trueSolarTime: false });
  };

  const shareText = current ? `【${current.signTitle}】\n${current.poem}\n\n${current.gloss}\n\n来源：${current.source}` : '';
  const { copied, copy } = usePromptCopyShare(shareText);

  return (
    <main className="page-daily-sign">
      <PageTopbar title="灵签" />
      {state === 'loading' && <div className="skeleton" role="status" />}
      {state === 'error' && <div role="alert">签文加载失败</div>}
      {state === 'ok' && (
        <>
          <button type="button" className="btn-primary" onClick={handleDraw} style={{ minHeight: '44px', minWidth: '44px' }}>抽签</button>
          {current && (
            <article className="sign-card" aria-label="签文结果">
              <h3>{guardText(current.signTitle)}</h3>
              <p className="sign-card__poem">{guardText(current.poem)}</p>
              <p className="sign-card__gloss">{guardText(current.gloss)}</p>
              <p className="sign-card__source">{guardText(current.source)}</p>
              <button type="button" onClick={copy} style={{ minHeight: '44px' }}>{copied ? '已复制' : '分享'}</button>
              <PrivacyHint />
            </article>
          )}
        </>
      )}
    </main>
  );
}




