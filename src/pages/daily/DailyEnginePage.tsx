/**
 * DailyEnginePage · 晨间能量页
 * 每日日出推送，展示当日能量建议、宜忌、行动指南。
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
import { djb2, buildBirthSignature, dateKey, getSiteOrigin, safeParseIntBase36 } from '@/lib/hash';
import { DAILY_CORPUS, pickSentence, type DailyTheme } from '@/data/bazi/daily-corpus';

const THEMES: DailyTheme[] = ['focus', 'advice', 'reminder'];
const THEME_LABEL: Record<DailyTheme, string> = {
  focus: '今日能量',
  advice: '行动建议',
  reminder: '注意事项',
};

const ENERGY_HOURS = [
  { label: '早 (5-7点)', icon: '🌅', energy: '木' },
  { label: '中 (11-13点)', icon: '☀️', energy: '火' },
  { label: '晚 (17-19点)', icon: '🌇', energy: '金' },
  { label: '夜 (21-23点)', icon: '🌙', energy: '水' },
];

interface CalcData {
  pillars?: { day?: { ganZhi?: string } };
  wuxingStrength?: Record<string, number>;
}

export function DailyEnginePage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const [state, setState] = useState<PageState>('loading');
  const [dayGanZhi, setDayGanZhi] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState(0);

  const input: BirthInput | null = useMemo(() => parseBirthInput(sp), [sp]);
  const onBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    if (!input) {
      setState('error');
      return;
    }

    let cancelled = false;
    setState('loading');

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

        const dg = (json.data as CalcData)?.pillars?.day?.ganZhi ?? '';
        setDayGanZhi(dg);
        setState(dg ? 'ok' : 'ok-empty');
      } catch (e) {
        if (cancelled) return;
        setState('degraded');
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
      const seedInt = safeParseIntBase36(djb2(`${seed}|${corpus.salt}`));
      out[t] = seedInt === null ? '—' : pickSentence(corpus, seedInt);
    }
    return out;
  }, [sig, dk]);

  const currentEnergy = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 7) return ENERGY_HOURS[3]; // 夜
    if (hour < 11) return ENERGY_HOURS[0]; // 早
    if (hour < 13) return ENERGY_HOURS[1]; // 中
    if (hour < 19) return ENERGY_HOURS[2]; // 晚
    return ENERGY_HOURS[3]; // 夜
  }, []);

  const shareText = useMemo(() => {
    const parts = THEMES.map((t) => `${THEME_LABEL[t]}：${themeTexts[t]}`);
    return `【命律·晨间能量】\n${parts.join('\n')}\n——娱乐参考，非决策依据\n${getSiteOrigin()}/daily/engine`;
  }, [themeTexts]);

  return (
    <div className="ts-page ts-page--daily-engine">
      <PageTopbar title="晨间能量" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">晨间能量</h1>
        <p className="ts-page__note">
          当前时段：{currentEnergy.icon} {currentEnergy.label} · 五行属{currentEnergy.energy}
        </p>

        {state === 'error' && (
          <div className="ts-empty">
            <p>晨间能量需要先完成一次免费排盘。</p>
            <button className="ts-btn ts-btn--primary" onClick={onBack}>回到排盘入口</button>
          </div>
        )}

        {state === 'loading' && <div className="ts-empty">加载盘中信息…</div>}

        {(state === 'ok' || state === 'ok-empty') && (
          <>
            {/* 日柱信息 */}
            {dayGanZhi && (
              <section className="ts-card">
                <h2 className="ts-card__title">今日日柱</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                  <div style={{ fontSize: 32, color: '#a5b4fc' }}>{dayGanZhi}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>
                    {dk} · 日干支
                  </div>
                </div>
              </section>
            )}

            {/* 能量时段选择 */}
            <section className="ts-card">
              <h2 className="ts-card__title">时段能量</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ENERGY_HOURS.map((h, i) => (
                  <button
                    key={h.label}
                    onClick={() => setSelectedHour(i)}
                    style={{
                      flex: 1,
                      minWidth: 100,
                      padding: '12px 8px',
                      borderRadius: 8,
                      border: `1px solid ${selectedHour === i ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)'}`,
                      background: selectedHour === i ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{h.icon}</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>{h.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>属{h.energy}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* 三主题能量 */}
            <section className="ts-card">
              <h2 className="ts-card__title">今日能量指南</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {THEMES.map((t) => (
                  <div key={t} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{THEME_LABEL[t]}</div>
                    <div style={{ fontSize: 15, color: '#e2e8f0', lineHeight: 1.6 }}>{themeTexts[t]}</div>
                  </div>
                ))}
              </div>
              <p className="ts-page__note" style={{ marginTop: 12 }}>
                内容由日期与出生信息哈希决定，仅供娱乐参考。
              </p>
            </section>

            {/* 分享 */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
              <button
                className="ts-btn ts-btn--secondary"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: '晨间能量', text: shareText });
                  }
                }}
              >
                分享今日能量
              </button>
            </div>
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default DailyEnginePage;
