// B'11-6 src/pages/divination/DailySignPage.tsx
/**
 * 灵签页 (支持 type='lingsign')
 * @module B'11-6
 */
import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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
import { L0SummaryCard } from '@/components/fortune/L0SummaryCard';
import { runSolutionForBazi } from '@/lib/full-chart-engine/solution-context';
import { parseInputState } from '@/lib/query-state';
import { buildPersonFromInput, calculateFullBaziChart } from '@/lib/full-chart-engine/bazi';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

interface Props {
  type?: string;
}

export default function DailySignPage({ type }: Props) {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
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

  // 真实出生输入：从 URL 查询串读排盘参数 → 计算 chart → runSolution（与 ResultPage 一致）
  const input = useMemo(
    () => parseInputState(new URLSearchParams(searchParams)),
    [searchParams],
  );
  const chart = useMemo(() => {
    // 无出生参数直连（如 /lingsign/guanyin 无 ?year= 等）时跳过排盘，避免 buildPersonFromInput 抛"出生年份必须是整数"
    if (!input.year || !input.month || !input.day) return null;
    try {
      const person = buildPersonFromInput({
        gender: input.gender,
        year: input.year,
        month: input.month,
        day: input.day,
        timeIndex: input.timeIndex,
        dateType: input.dateType,
        isLeapMonth: input.isLeapMonth,
        useTrueSolarTime: input.useTrueSolarTime,
        birthHour: input.birthHour,
        birthMinute: input.birthMinute,
        birthPlace: input.birthPlace,
        birthLongitude: input.birthLongitude,
        applyChinaDst: input.applyChinaDst,
      });
      return calculateFullBaziChart(person);
    } catch (e) {
      console.error('排盘计算失败:', e);
      return null;
    }
  }, [input]);
  const solutionOutput = useMemo(
    () => (chart ? runSolutionForBazi(chart) : null),
    [chart],
  );

  if (type === 'lingsign' && code && !isValidCode(code)) {
    return <Navigate to="/lingsign/guanyin" replace />;
  }

  const handleDraw = () => {
    if (!mod) return;
    const seed = djb2(`${code}|${Date.now()}`);
    const idx = Math.abs(parseInt(seed, 36)) % mod.SIGNS.length;
    const drawn = mod.SIGNS[idx];
    setCurrent(drawn);
    trackChartSubmit({ mode: 'ling_sign', trueSolarTime: false });
    // AI 解读直接复用真实 chart 跑出的 solutionOutput，不再喂假八字；
    // 无有效出生输入时不生成解读（由下方空态提示）。
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
          {!chart && (
            <p role="alert" style={{ margin: '12px 0', color: '#f59e0b' }}>
              请先排盘/输入出生信息后，再为您生成真实八字解读。
            </p>
          )}
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
          {current && solutionOutput && (
            <L0SummaryCard output={solutionOutput} title="AI 灵签解读" />
          )}
        </>
      )}
    </main>
  );
}
