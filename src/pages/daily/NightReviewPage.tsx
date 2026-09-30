/**
 * NightReviewPage · 夜间复盘页
 * 每日21-23点推送，展示当日回顾、反思建议与明日指引。
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import {
  parseBirthInput,
  formatApiError,
  type BirthInput,
  type PageState,
} from '@/types/page-state';
import { djb2, buildBirthSignature, dateKey, safeParseIntBase36 } from '@/lib/hash';
import { DAILY_CORPUS, pickSentence, type DailyTheme } from '@/data/bazi/daily-corpus';
import { EvidenceItem, FortuneEvidenceCard } from '@/components/fortune/FortuneEvidenceCard';

const THEMES: DailyTheme[] = ['focus', 'advice', 'reminder'];
const THEME_LABEL: Record<DailyTheme, string> = {
  focus: '今日总结',
  advice: '反思建议',
  reminder: '明日指引',
};

interface CalcData {
  pillars?: { day?: { ganZhi?: string } };
}

export function NightReviewPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [dayGanZhi, setDayGanZhi] = useState<string>('');
  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);
  const onBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    if (!input) {
      setState('error');
      setError('缺少出生信息，请从排盘入口进入');
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
        const dg = d.pillars?.day?.ganZhi ?? '';
        setDayGanZhi(dg);
        setState(dg ? 'ok' : 'ok-empty');
      } catch (e) {
        if (cancelled) return;
        setState('degraded');
        setError(e instanceof Error ? e.message : '未知错误');
      }
    })();

    return () => { cancelled = true; };
  }, [input]);

  const sig = input ? buildBirthSignature(input) : '';
  const dk = dateKey();

  const themeTexts = useMemo<Record<DailyTheme, string>>(() => {
    const out: Record<DailyTheme, string> = { focus: '—', advice: '—', reminder: '—' };
    if (!sig) return out;
    const seed = djb2(`${dk}|${sig}`);
    for (const t of THEMES) {
      const corpus = DAILY_CORPUS[t];
      const seedInt = safeParseIntBase36(djb2(`${seed}|${t}`));
      out[t] = seedInt === null ? '—' : pickSentence(corpus, seedInt);
    }
    return out;
  }, [sig, dk]);

  const evidence: EvidenceItem[] = useMemo(() => [
    { id: 'r1', label: '回顾日期', value: dk, confidence: 'verified' },
    { id: 'r2', label: '日柱干支', value: dayGanZhi || '—', confidence: dayGanZhi ? 'verified' : 'disputed' },
    { id: 'r3', label: '数据源', value: '命律·日晷系统', confidence: 'probable' },
  ], [dk, dayGanZhi]);

  if (state === 'error') {
    return (
      <div className="ts-page">
        <PageTopbar title="夜间复盘" onBack={onBack} />
        <main className="ts-page__main">
          <div className="ts-empty">
            <p>{error ?? '加载失败'}</p>
            <button className="ts-btn ts-btn--primary" onClick={onBack}>回到排盘入口</button>
          </div>
        </main>
        <PrivacyHint />
      </div>
    );
  }

  return (
    <div className="ts-page ts-page--night-review">
      <PageTopbar title="夜间复盘" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">夜间复盘</h1>
        <p className="ts-page__note">
          夜深人静，正是回望一日、安顿身心之时。
        </p>

        {state === 'loading' && <div className="ts-empty">加载盘中信息…</div>}

        {(state === 'ok' || state === 'ok-empty') && (
          <>
            {/* 今日日柱 */}
            {dayGanZhi && (
              <section className="ts-card">
                <h2 className="ts-card__title">今日日柱</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                  <div style={{ fontSize: 32, color: '#a5b4fc' }}>{dayGanZhi}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>
                    {dk}
                  </div>
                </div>
              </section>
            )}

            {/* 三主题内容 */}
            <section className="ts-card">
              <h2 className="ts-card__title">复盘指南</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {THEMES.map((t) => (
                  <div key={t} style={{
                    padding: 12,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                  }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{THEME_LABEL[t]}</div>
                    <div style={{ fontSize: 15, color: '#e2e8f0', lineHeight: 1.6 }}>{themeTexts[t]}</div>
                  </div>
                ))}
              </div>
              <p className="ts-page__note" style={{ marginTop: 12 }}>
                内容由日期与出生信息哈希决定，仅供文化参考。
              </p>
            </section>

            {/* 证据链 */}
            <FortuneEvidenceCard title="数据依据" items={evidence} />
          </>
        )}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          解释边界：本分析基于传统文化模型，仅供文化研究与自我参照，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default NightReviewPage;
