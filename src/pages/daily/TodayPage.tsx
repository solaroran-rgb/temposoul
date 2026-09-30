// /daily/today · 每日运势（免费排盘结果后触达）
// 复用 bazi 排盘 + 确定性语料链：URL 出生参数 → /api/v1/bazi/calculate → 今日日柱 → 三主题语料确定性选取。
// 与 /bazi/daily 同源同构，但作为独立触达页，空参时引导回到排盘入口。
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { DailyPillarCard } from '@/components/bazi/DailyPillarCard';
import { DailyThemeCard } from '@/components/bazi/DailyThemeCard';
import { DailyShareBar } from '@/components/bazi/DailyShareBar';
import {
  parseBirthInput,
  formatApiError,
  type BirthInput,
  type PageState,
} from '@/types/page-state';
import { djb2, buildBirthSignature, dateKey, getSiteOrigin, safeParseIntBase36 } from '@/lib/hash';
import { DAILY_CORPUS, pickSentence, type DailyTheme } from '@/data/bazi/daily-corpus';
import { trackChartSubmit } from '@/lib/analytics';
import { SeoHead } from '@/components/SeoHead';
import { L0SummaryCard } from '@/components/fortune/L0SummaryCard';
import { runSolutionForBazi } from '@/lib/full-chart-engine/solution-context';
import '../bazi/daily.css';

const THEMES: DailyTheme[] = ['focus', 'advice', 'reminder'];
const THEME_LABEL: Record<DailyTheme, string> = {
  focus: '今日关注',
  advice: '今日建议',
  reminder: '今日提醒',
};

interface CalcData {
  pillars?: { day?: { ganZhi?: string; zhi?: string } };
}

export function TodayPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [dayPillar, setDayPillar] = useState<string>('');
  const [todayGanZhi, setTodayGanZhi] = useState<string>('');
  const [calcData, setCalcData] = useState<object | null>(null);
  const l0Output = useMemo(() => (calcData ? runSolutionForBazi(calcData) : null), [calcData]);

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) {
      setState('error');
      setError('缺少出生信息参数');
      return;
    }
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
        const dp = d.pillars?.day?.ganZhi ?? '';
        setDayPillar(dp);
        setCalcData(json.data);

        let tg = '';
        try {
          const mod = await import('@temposoul/core/ganzhi');
          const fn = (mod as { getGanZhiFromDate?: (d: Date) => unknown }).getGanZhiFromDate;
          if (typeof fn === 'function') {
            const r = fn(new Date());
            if (r && typeof r === 'object') {
              const day = (r as Record<string, unknown>).day;
              if (typeof day === 'string') tg = day;
            }
          }
        } catch {
          /* 动态导入或字段缺失时降级为空 */
        }
        setTodayGanZhi(tg);
        setState(dp ? 'ok' : 'ok-empty');
        try {
          trackChartSubmit({ mode: 'daily-today', trueSolarTime: false });
        } catch {
          /* noop */
        }
      } catch (e) {
        if (cancelled) return;
        setState('degraded');
        setError(e instanceof Error ? e.message : '未知错误');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  const sig = input ? buildBirthSignature(input) : '';
  const dk = dateKey();
  const themeTexts = useMemo<Record<DailyTheme, string>>(() => {
    const out: Record<DailyTheme, string> = { focus: '—', advice: '—', reminder: '—' };
    if (!sig) return out;
    const seed = djb2(`${dk}|${sig}`);
    for (const t of THEMES) {
      const corpus = DAILY_CORPUS[t];
      const seedInt = safeParseIntBase36(djb2(`${seed}|${corpus.salt}`));
      out[t] = seedInt === null ? '—' : pickSentence(corpus, seedInt);
    }
    return out;
  }, [sig, dk]);

  const shareText = useMemo(() => {
    const parts = THEMES.map((t) => `${THEME_LABEL[t]}：${themeTexts[t]}`);
    return `【命律·每日运势】\n${parts.join('\n')}\n——娱乐参考，非决策依据\n${getSiteOrigin()}/daily/today`;
  }, [themeTexts]);

  return (
    <div className="ts-page ts-page--bazi-daily">
      <SeoHead
        title="今日运势 · 命律 TempoSoul"
        description="基于八字日柱的每日运势，含今日关注、建议与提醒。"
      />
      <PageTopbar title="每日运势" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">每日运势</h1>
        <p className="ts-page__note">当前日期：{dk}（跨日自动更新）</p>

        {state === 'error' && (
          <div className="ts-empty">
            <p>每日运势需要先完成一次免费排盘。</p>
            <p>
              <Link to="/" className="ts-btn ts-btn--primary">
                回到排盘入口
              </Link>
            </p>
          </div>
        )}
        {state === 'loading' && <div className="ts-empty">加载中…</div>}
        {state === 'degraded' && error && (
          <div className="ts-alert ts-alert--error" role="alert">
            {error}
          </div>
        )}

        {(state === 'ok' || state === 'ok-empty') && (
          <>
            <section className="ts-card">
              <h2 className="ts-card__title">今日盘面</h2>
              <DailyPillarCard dayPillar={dayPillar || '—'} todayGanZhi={todayGanZhi || '—'} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">今日三维</h2>
              <div className="ts-daily-themes">
                {THEMES.map((t) => (
                  <DailyThemeCard key={t} theme={t} text={themeTexts[t]} />
                ))}
              </div>
              <p className="ts-daily-disclaimer">
                仅供娱乐与自我觉察，不构成对个人命运的断言或任何专业建议。语料基于本平台原创语料池
                确定性选取；内容由日期与出生信息哈希决定，不涉预测。
              </p>
              <DailyShareBar text={shareText} />
            </section>
            {l0Output && <L0SummaryCard output={l0Output} title="AI 白话解读" />}
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default TodayPage;
