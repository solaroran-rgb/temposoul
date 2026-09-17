
// A9-3 · 婚姻/桃花专项页（修正：可选链 + 类型收窄，无任何非空断言）
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { SpousePalaceCard } from '../../components/bazi/SpousePalaceCard';
import { PeachBlossomEvidence, type ShensaMap } from '../../components/bazi/PeachBlossomEvidence';
import { MarriageNotesPanel } from '../../components/bazi/MarriageNotesPanel';
import { ToCompatibilityCTA } from '../../components/bazi/ToCompatibilityCTA';
import { parseBirthInput, formatApiError, type BirthInput, type PageState } from '../../types/page-state';
import { resolveMarriageTier, type MarriageTier } from '../../data/bazi/marriage-tiers';
import { trackChartSubmit } from '../../lib/analytics';
import './marriage.css';

interface CalcData {
  pillars?: { day?: { zhi?: string; ganZhi?: string } };
  hiddenStems?: { day?: string[] };
  shensha?: ShensaMap;
}

function pickStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

function unionShensha(s: ShensaMap | undefined): string[] {
  if (!s) return [];
  const set = new Set<string>();
  for (const x of pickStringArray(s.global)) set.add(x);
  for (const x of pickStringArray(s.day)) set.add(x);
  return Array.from(set);
}

export function MarriagePage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalcData | null>(null);

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) { setState('error'); setError('URL 参数缺失或非法，请从结果页进入'); return; }
    let cancelled = false;
    setState('loading');
    setError(null);
    (async () => {
      try {
        const res = await fetch('/api/v1/bazi/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const json = await res.json();
        if (!json.ok) throw new Error(formatApiError(json));
        if (cancelled) return;
        const d = json.data as CalcData;
        setData(d);
        setState(d.pillars?.day?.zhi ? 'ok' : 'ok-empty');
        try { trackChartSubmit({ mode: 'bazi-marriage', trueSolarTime: false }); } catch { /* noop */ }
      } catch (e) {
        if (cancelled) return;
        setState('degraded');
        setError(e instanceof Error ? e.message : '未知错误');
      }
    })();
    return () => { cancelled = true; };
  }, [input]);

  const dayBranch: string = data?.pillars?.day?.zhi ?? '';
  const hiddenStems: string[] = pickStringArray(data?.hiddenStems?.day);
  const shenshaUnion = useMemo(() => unionShensha(data?.shensha), [data]);
  const tier: MarriageTier = useMemo(
    () => resolveMarriageTier({ shenshaUnion }),
    [shenshaUnion],
  );

  return (
    <div className="ts-page ts-page--bazi-marriage">
      <PageTopbar title="八字婚姻桃花" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八字婚姻桃花</h1>
        {error && <div className="ts-alert ts-alert--error" role="alert">{error}</div>}
        {state === 'loading' && <div className="ts-empty">加载中…</div>}
        {state === 'error' && <div className="ts-empty">请从结果页进入或补全出生信息</div>}

        {(state === 'ok' || state === 'ok-empty') && data && (
          <>
            <section className="ts-card">
              <h2 className="ts-card__title">配偶宫</h2>
              <SpousePalaceCard dayBranch={dayBranch} hiddenStems={hiddenStems} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">神煞证据</h2>
              <PeachBlossomEvidence shensha={data.shensha ?? {}} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">婚缘提示</h2>
              <MarriageNotesPanel tier={tier} />
              <p className="ts-marriage-disclaimer">
                民俗文化参考，非关系预测；本页不输出匹配分数或成功率。
              </p>
            </section>
            <section className="ts-card">
              <ToCompatibilityCTA query={sp.toString()} />
            </section>
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default MarriagePage;

