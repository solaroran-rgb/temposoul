/**
 * 七政四余排盘结果页（独立栏目页）
 *
 * 复用引擎 generateQizheng（@temposoul/core/qizheng）与 ResultPage 的 QizhengBoard 展示组件，
 * 不新造算法；仅负责从 URL 出生参数解析 → 本地排盘 → 展示星曜/度宿/吊照结果。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { QizhengBoard } from '@/pages/ResultPage/components/QizhengBoard';
import { generateQizheng, type QizhengResult } from '@temposoul/core/qizheng';
import { BIRTH_TIME_OPTIONS } from '@/lib/birth-time';
import { FRONTEND_DEFAULT_TIME_ZONE_ID } from '@/lib/time-policy';
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

export function QizhengPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QizhengResult | null>(null);

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
        const slot = BIRTH_TIME_OPTIONS[input.timeIndex];
        const data = generateQizheng({
          year: solar.year,
          month: solar.month,
          day: solar.day,
          hour: slot?.hour ?? 12,
          minute: slot?.minute ?? 0,
          timeZoneId: FRONTEND_DEFAULT_TIME_ZONE_ID,
        });
        if (cancelled) return;
        setResult(data);
        setState('ok');
      } catch (e) {
        if (cancelled) return;
        setState('error');
        setError(e instanceof Error ? e.message : '七政四余排盘失败。');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="ts-page ts-page--qizheng">
      <PageTopbar title="七政四余排盘" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">七政四余排盘</h1>
        <p className="ts-page__note">
          七政四余以七政（日月五星）与四余（罗睺、计都、月孛、紫炁）二十八宿度宿论命，本页为文化研究展示。
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
          <QizhengBoard title="七政四余星盘" name="七政四余命盘" data={result} />
        )}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          解释边界：本排盘基于传统天文历法模型，仅供文化研究与自我参照，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default QizhengPage;
