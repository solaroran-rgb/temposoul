// B'11-6 src/pages/divination/DailySignPage.tsx
/**
 * 灵签页 (支持 type='lingsign')
 * @module B'11-6
 */
import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  loadLingSignData,
  isValidCode,
  type LingSignModule,
  type LingSign,
} from './lib/lingsign-loaders';
import { usePromptCopyShare } from '@/hooks/usePromptCopyShare';
import { djb2 } from '@/lib/hash';
import { PageTopbar } from '@/components/PageTopbar';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';
import { guardText } from '@/lib/assertions-guard';
import { PrivacyHint } from '@/components/PrivacyHint';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

interface Props {
  type?: string;
}

export default function DailySignPage({ type }: Props) {
  const nav = useNavigate();
  const { code } = useParams<{ code: string }>();
  const [state, setState] = useState<PageState>('idle');
  const [mod, setMod] = useState<LingSignModule | null>(null);
  const [current, setCurrent] = useState<LingSign | null>(null);

  // 分享文案：hook 必须在所有条件 return 之前无条件调用（rules-of-hooks）
  const shareText = current
    ? `【${current.signTitle}】\n${current.poem}\n\n${current.gloss}\n\n来源：${current.source}`
    : '';
  const { copyState, handleCopy } = usePromptCopyShare(shareText);

  useEffect(() => {
    trackPageView(`/lingsign/${code}`);
  }, [code]);

  useEffect(() => {
    if (type !== 'lingsign' || !code) return;
    if (!isValidCode(code)) return;
    setState('loading');
    loadLingSignData(code)
      .then((m) => {
        setMod(m);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, [code, type]);

  if (type === 'lingsign' && code && !isValidCode(code)) {
    return <Navigate to="/lingsign/guanyin" replace />;
  }

  const handleDraw = () => {
    if (!mod) return;
    const seed = djb2(`${code}|${Date.now()}`);
    const idx = Math.abs(parseInt(seed, 36)) % mod.SIGNS.length;
    setCurrent(mod.SIGNS[idx]);
    trackChartSubmit({ mode: 'ling_sign', trueSolarTime: false });
  };

  return (
    <main className="page-daily-sign">
      <PageTopbar title="灵签" onBack={() => nav("/")} />
      {state === 'loading' && <div className="skeleton" role="status" />}
      {state === 'error' && <div role="alert">签文加载失败</div>}
      {state === 'ok' && (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={handleDraw}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            抽签
          </button>
          {current && (
            <article className="sign-card" aria-label="签文结果">
              <h3>{guardText(current.signTitle)}</h3>
              <p className="sign-card__poem">{guardText(current.poem)}</p>
              <p className="sign-card__gloss">{guardText(current.gloss)}</p>
              <p className="sign-card__source">{guardText(current.source)}</p>
              <button type="button" onClick={() => void handleCopy()} style={{ minHeight: '44px' }}>
                {copyState === '复制' ? '分享' : copyState}
              </button>
              <PrivacyHint />
            </article>
          )}
        </>
      )}
    </main>
  );
}
