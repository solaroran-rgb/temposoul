/**
 * 吠陀占星排盘结果页（独立栏目页）
 *
 * 复用引擎 generateVedicChart（@temposoul/core/vedic），不新造算法；
 * 仅负责 URL 出生参数解析 → 本地排盘 → 展示 D1 / 月宿 / Vimshottari / Yoga·Dosha。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { VedicBoard } from '@/pages/ResultPage/components/VedicBoard';
import { generateVedicChart, type VedicData } from '@temposoul/core/vedic';
import { BIRTH_TIME_OPTIONS } from '@/lib/birth-time';
import { FRONTEND_DEFAULT_TIME_ZONE_ID } from '@/lib/time-policy';
import { parseBirthInput, formatApiError, type BirthInput } from '@/types/page-state';

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
    headers: { 'Content': 'application/json' },
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

export function VedicPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VedicData | null>(null);

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
        const data = generateVedicChart({
          name: '吠陀命盘',
          gender: input.gender === 'female' ? '女' : '男',
          year: String(solar.year),
          month: String(solar.month),
          day: String(solar.day),
          hour: String(slot?.hour ?? 12),
          minute: String(slot?.minute ?? 0),
          latitude: '39.9042',
          longitude: '116.4074',
          timeZoneId: FRONTEND_DEFAULT_TIME_ZONE_ID,
        });
        if (cancelled) return;
        setResult(data);
        setState('ok');
      } catch (e) {
        if (cancelled) return;
        setState('error');
        setError(e instanceof Error ? e.message : '吠陀占星排盘失败。');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="ts-page ts-page--vedic">
      <PageTopbar title="吠陀占星排盘" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">吠陀占星排盘</h1>
        <p className="ts-page__note">
          吠陀占星（Jyotish）以恒星黄经排布九曜与十二宫，按月宿起 Vimshottari 大运，本页为文化研究展示。
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

        {state === 'ok' && result && <VedicBoard title="吠陀命盘" name="吠陀占星星盘" data={result} />}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          解释边界：本排盘基于传统天文历法模型，仅供文化研究与自我参照，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default VedicPage;
