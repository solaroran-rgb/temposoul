// B'11-5 src/pages/fortune/FortuneRhythmPage.tsx
/**
 * 每日节律独立页
 * @module B'11-5
 */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateRhythm } from '@/pages/fortune/lib/rhythm-engine';
import { PageTopbar } from '@/components/PageTopbar';
import { guardText } from '@/lib/assertions-guard';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';


export default function FortuneRhythmPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const dayPillar = searchParams.get('dayPillar') ?? '';
  const zodiac = searchParams.get('zodiac') ?? '';
  const signId = searchParams.get('signId') ?? undefined;
  const [state, setState] = useState<PageState>('idle');

  useEffect(() => {
    trackPageView('/fortune/rhythm');
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const rhythm = dayPillar && zodiac ? generateRhythm({ dayPillar, zodiac, signId }, today) : null;

  useEffect(() => {
    if (rhythm) setState('ok');
    else setState('ok-empty');
  }, [rhythm]);

  return (
    <main className="page-rhythm">
      <PageTopbar title="每日节律" onBack={() => nav("/")} />
      {state === 'ok-empty' && (
        <div className="rhythm-empty" role="status">
          <p>{guardText('请通过排盘页面进入或确保URL参数完整')}</p>
        </div>
      )}
      {state === 'ok' && rhythm && (
        <article className="rhythm-full" aria-label="每日节律详情">
          <h2>{today} 节律指引</h2>
          <dl>
            <div>
              <dt>今日焦点</dt>
              <dd>{guardText(rhythm.focus)}</dd>
            </div>
            <div>
              <dt>行动建议</dt>
              <dd>{guardText(rhythm.advice)}</dd>
            </div>
            <div>
              <dt>温馨提醒</dt>
              <dd>{guardText(rhythm.reminder)}</dd>
            </div>
          </dl>
          <p className="disclaimer">{guardText('娱乐参考，非吉凶断言。')}</p>
          <PrivacyHint />
        </article>
      )}
    </main>
  );
}
