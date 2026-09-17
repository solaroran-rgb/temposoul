// A9-2 · 每日财运/日柱运势页（修正：动态 origin + 种子 NaN 防御）
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { DailyPillarCard } from '../../components/bazi/DailyPillarCard';
import { DailyThemeCard } from '../../components/bazi/DailyThemeCard';
import { DailyShareBar } from '../../components/bazi/DailyShareBar';
import {
  parseBirthInput,
  formatApiError,
  type BirthInput,
  type PageState,
} from '../../types/page-state';
import {
  djb2,
  buildBirthSignature,
  dateKey,
  getSiteOrigin,
  safeParseIntBase36,
} from '../../lib/hash';
import { DAILY_CORPUS, pickSentence, type DailyTheme } from '../../data/bazi/daily-corpus';
import { trackChartSubmit } from '../../lib/analytics';
import './daily.css';

const THEMES: DailyTheme[] = ['focus', 'advice', 'reminder'];
const THEME_LABEL: Record<DailyTheme, string> = {
  focus: '今日关注',
  advice: '今日建议',
  reminder: '今日提醒',
};

interface CalcData {
  pillars?: { day?: { ganZhi?: string; zhi?: string } };
}

export function DailyPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [dayPillar, setDayPillar] = useState<string>('');
  const [todayGanZhi, setTodayGanZhi] = useState<string>('');

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!input) {
      setState('error');
      setError('URL 参数缺失或非法，请从结果页进入');
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
          trackChartSubmit({ mode: 'bazi-daily', trueSolarTime: false });
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
    return `【命律·日柱运势】\n${parts.join('\n')}\n——娱乐参考，非决策依据\n${getSiteOrigin()}/bazi/daily`;
  }, [themeTexts]);

  return (
    <div className="ts-page ts-page--bazi-daily">
      <PageTopbar title="每日日柱运势" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">每日日柱运势</h1>
        <p className="ts-page__note">当前日期：{dk}（跨日自动更新）</p>
        {error && (
          <div className="ts-alert ts-alert--error" role="alert">
            {error}
          </div>
        )}
        {state === 'loading' && <div className="ts-empty">加载中…</div>}
        {state === 'error' && <div className="ts-empty">请从结果页进入或补全出生信息</div>}

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
                娱乐参考，非决策依据。语料基于本平台原创语料池确定性选取；内容由日期与出生信息哈希决定，不涉预测。
              </p>
              <DailyShareBar text={shareText} />
            </section>
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default DailyPage;
