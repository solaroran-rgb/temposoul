
// A9-1 · 五行缺失页（修正：state 初值改为 loading，避免 mount 短暂空白）
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { WuxingChart } from '../../components/bazi/WuxingChart';
import { WuxingDiagnosis } from '../../components/bazi/WuxingDiagnosis';
import { HiddenStemsTable } from '../../components/bazi/HiddenStemsTable';
import { RemedyCard } from '../../components/bazi/RemedyCard';
import { parseBirthInput, formatApiError, type BirthInput, type PageState } from '../../types/page-state';
import { trackChartSubmit } from '../../lib/analytics';
import './five-elements.css';

interface WuxingStrength {
  missing?: string[];
  present?: string[];
  dominantByRule?: string[];
  ruleBasis?: string[];
}
interface CalcData {
  wuxingStrength?: WuxingStrength;
  hiddenStems?: { year?: string[]; month?: string[]; day?: string[]; hour?: string[] };
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

export function FiveElementsPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<CalcData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) { setState('error'); setError('URL 参数缺失或非法，请从结果页进入'); setData(null); return; }
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
        const ws = d.wuxingStrength;
        const hasAny = (ws?.present?.length ?? 0) + (ws?.dominantByRule?.length ?? 0) + (ws?.missing?.length ?? 0) > 0;
        setState(hasAny ? 'ok' : 'ok-empty');
        try { trackChartSubmit({ mode: 'bazi-five-elements', trueSolarTime: false }); } catch { /* noop */ }
      } catch (e) {
        if (cancelled) return;
        setState('degraded');
        setError(e instanceof Error ? e.message : '未知错误');
      }
    })();
    return () => { cancelled = true; };
  }, [input]);

  const ws = data?.wuxingStrength ?? {};
  const missing = asStringArray(ws.missing);
  const present = asStringArray(ws.present);
  const dominant = asStringArray(ws.dominantByRule);
  const ruleBasis = asStringArray(ws.ruleBasis);

  return (
    <div className="ts-page ts-page--bazi-five-elements">
      <PageTopbar title="五行缺失查询" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">五行缺失查询</h1>
        {error && <div className="ts-alert ts-alert--error" role="alert">{error}</div>}
        {state === 'loading' && <div className="ts-empty">加载中…</div>}
        {state === 'error' && <div className="ts-empty">请从结果页进入或补全出生信息</div>}

        {(state === 'ok' || state === 'ok-empty') && (
          <>
            <section className="ts-card">
              <h2 className="ts-card__title">五行分布</h2>
              <WuxingChart present={present} dominant={dominant} missing={missing} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">诊断</h2>
              <WuxingDiagnosis missing={missing} dominant={dominant} ruleBasis={ruleBasis} />
            </section>
            {missing.length > 0 && (
              <section className="ts-card">
                <h2 className="ts-card__title">补益建议（民俗参考）</h2>
                <RemedyCard missing={missing} />
                <p className="ts-remedy-card__disclaimer">
                  民俗文化参考，非可验证结论；具体取名请前往「起名器」。
                </p>
              </section>
            )}
            {data?.hiddenStems && (
              <section className="ts-card">
                <h2 className="ts-card__title">藏干明细</h2>
                <HiddenStemsTable hiddenStems={data.hiddenStems} />
              </section>
            )}
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default FiveElementsPage;

