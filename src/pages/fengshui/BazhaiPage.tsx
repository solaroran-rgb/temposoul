/**
 * 八宅风水排盘结果页（独立栏目页）
 *
 * 复用 calculateBazhaiBaseChart（@/lib/bazhai-chart，底层 analyzeBaZhai），不新造算法；
 * 仅负责从 URL 出生参数解析 → 本地排命卦 → 展示东四/西四命与四吉四凶方。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { calculateBazhaiBaseChart } from '@/lib/bazhai-chart';
import type { BaZhaiResult } from '@temposoul/core/bazhai';
import {
  parseBirthInput,
  formatApiError,
  type BirthInput,
} from '@/types/page-state';

interface SolarDate {
  year: number;
  month: number;
  day: number;
}

/** 农历入参经八字 API 换算为公历；公历直接使用。 */
async function resolveSolarDate(input: BirthInput): Promise<SolarDate> {
  if (input.dateType === 'solar') {
    return { year: input.year, month: input.month, day: input.day };
  }
  const res = await fetch('/api/v1/bazi/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(formatApiError(json));
  const solar = (json.data as { solarDate?: SolarDate }).solarDate;
  if (!solar || !solar.year || !solar.month || !solar.day) {
    throw new Error('农历换算公历失败，请改用公历出生信息进入。');
  }
  return solar;
}

export function BazhaiPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BaZhaiResult | null>(null);

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) {
      setState('error');
      setError('缺少出生信息，请从排盘入口选择出生时间后进入。');
      setResult(null);
      return;
    }
    let cancelled = false;
    setState('loading');
    setError(null);
    (async () => {
      try {
        const solar = await resolveSolarDate(input);
        const data = calculateBazhaiBaseChart({
          year: solar.year,
          month: solar.month,
          day: solar.day,
          gender: input.gender,
        });
        if (cancelled) return;
        setResult(data);
        setState('ok');
      } catch (e) {
        if (cancelled) return;
        setState('error');
        setError(e instanceof Error ? e.message : '八宅排盘失败。');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="ts-page ts-page--bazhai">
      <PageTopbar title="八宅风水排盘" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">八宅风水排盘</h1>
        <p className="ts-page__note">
          八宅法以出生年命卦分东四命、西四命，推四吉四凶方位，本页为传统文化研究展示。
        </p>

        {state === 'loading' && <div className="ts-empty">排盘中…</div>}

        {state === 'error' && (
          <div className="ts-empty">
            <p>{error ?? '加载失败'}</p>
            <button className="ts-btn ts-btn--primary" onClick={onBack}>
              回到排盘入口
            </button>
          </div>
        )}

        {state === 'ok' && result && (
          <>
            <section className="ts-card">
              <h2 className="ts-card__title">命卦</h2>
              <div className="result-summary-grid">
                <div className="result-stat-card result-stat-card-accent">
                  <span>命卦</span>
                  <strong>{result.mingGua}命</strong>
                  <small>{result.mingGroup}</small>
                </div>
                <div className="result-stat-card">
                  <span>宅卦配合</span>
                  <strong>{result.houseGua ? `${result.houseGua}宅` : '待定坐山'}</strong>
                  <small>{result.houseGroup ?? '需结合房屋坐山'}</small>
                </div>
                <div className="result-stat-card">
                  <span>命宅关系</span>
                  <strong>{result.match}</strong>
                  <small>{result.matchAdvice}</small>
                </div>
              </div>
            </section>

            <section className="ts-card">
              <h2 className="ts-card__title">四吉方（大吉方位）</h2>
              <div className="qizheng-star-list">
                {result.luckyDirections.map((p) => (
                  <div className="qizheng-star-item" key={`lucky-${p.gua}-${p.direction}`}>
                    <span className="qizheng-star-name" style={{ color: '#34d399' }}>
                      {p.label}
                    </span>
                    <strong>
                      {p.direction} · {p.gua}山
                    </strong>
                    <small>吉 · 约 {Math.round(p.degree)}°</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="ts-card">
              <h2 className="ts-card__title">四凶方（宜避方位）</h2>
              <div className="qizheng-star-list">
                {result.unluckyDirections.map((p) => (
                  <div className="qizheng-star-item" key={`unlucky-${p.gua}-${p.direction}`}>
                    <span className="qizheng-star-name" style={{ color: '#fb7185' }}>
                      {p.label}
                    </span>
                    <strong>
                      {p.direction} · {p.gua}山
                    </strong>
                    <small>凶 · 约 {Math.round(p.degree)}°</small>
                  </div>
                ))}
              </div>
            </section>

            <p className="ts-page__note" style={{ marginTop: 16 }}>
              说明：命卦按出生公历（已按立春换年）与性别推算；宅卦需另测房屋坐山后方可完整论命宅配合。
            </p>
          </>
        )}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          解释边界：八宅为传统风水文化模型，仅供文化研究与自我参照，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default BazhaiPage;
