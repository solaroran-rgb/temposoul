
// A9-5 · 诸葛神算页（修正：集成 ZhugeCalculationTrace，本地 state 追踪 mode）
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { ZhugeInputPanel } from '../../components/divination/ZhugeInputPanel';
import { ZhugeCalculationTrace } from '../../components/divination/ZhugeCalculationTrace';
import { ZhugeLibraryList } from '../../components/divination/ZhugeLibraryList';
import type { ZhugeSign } from '../../data/zhuge/types';
import { trackChartSubmit } from '../../lib/analytics';
import './zhuge.css';

const RULE_READY = false;   // 起数规则回填前恒为 false

export function ZhugePage() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [signs, setSigns] = useState<ZhugeSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'draw' | 'preview'>(() => (sp.get('mode') === 'preview' ? 'preview' : 'draw'));

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const m = await import('../../data/zhuge/384');
      if (cancelled) return;
      setSigns(m.ZHUGE_SIGNS);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try { trackChartSubmit({ mode: 'divination-zhuge', trueSolarTime: false }); } catch { /* noop */ }
  }, []);

  const switchMode = (m: 'preview' | 'draw') => {
    setMode(m);
    const next = new URLSearchParams(sp);
    next.set('mode', m);
    setSp(next, { replace: true });
  };

  return (
    <div className="ts-page ts-page--zhuge">
      <PageTopbar title="诸葛神算" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">诸葛神算</h1>
        <nav className="ts-zhuge-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'draw'} className={mode === 'draw' ? 'is-active' : ''} onClick={() => switchMode('draw')}>抽签</button>
          <button type="button" role="tab" aria-selected={mode === 'preview'} className={mode === 'preview' ? 'is-active' : ''} onClick={() => switchMode('preview')}>签文库</button>
        </nav>

        {mode === 'draw' && (
          <section className="ts-card">
            <h2 className="ts-card__title">起数抽签</h2>
            <ZhugeInputPanel disabled={!RULE_READY} />
            <ZhugeCalculationTrace enabled={RULE_READY} />
            {!RULE_READY && <p className="ts-zhuge-hint">起数规则开发中，上线时间请留意公告。</p>}
          </section>
        )}

        {mode === 'preview' && (
          <section className="ts-card">
            <h2 className="ts-card__title">签文库预览</h2>
            {loading ? <div className="ts-empty">加载中…</div> : <ZhugeLibraryList signs={signs} />}
          </section>
        )}

        <p className="ts-zhuge-disclaimer">民间文化传承，娱乐参考。</p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default ZhugePage;

---
