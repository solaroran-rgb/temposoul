// src/pages/calendar/CalendarPage.tsx
// 9.2 交互式择时工具：选日子 + 选时辰
import { useMemo, useState, type CSSProperties } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import {
  buildHourlyDirections, extractDayStem,
  type Direction, type EarthlyBranch,
} from '@/lib/direction-calculator';

const DIR_LABELS: Record<Direction, string> = {
  N: '正北', NE: '东北', E: '正东', SE: '东南', S: '正南', SW: '西南', W: '正西', NW: '西北',
};

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];
const HOUR_BRANCHES: EarthlyBranch[] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
];
const HOUR_RANGES: Record<EarthlyBranch, string> = {
  '子': '23-01', '丑': '01-03', '寅': '03-05', '卯': '05-07',
  '辰': '07-09', '巳': '09-11', '午': '11-13', '未': '13-15',
  '申': '15-17', '酉': '17-19', '戌': '19-21', '亥': '21-23',
};

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [picked, setPicked] = useState<string>(toISO(today.getFullYear(), today.getMonth(), today.getDate()));
  const [activeBranch, setActiveBranch] = useState<EarthlyBranch | null>(null);

  const { data, loading } = useAlmanacData(picked);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [view]);

  const dayStem = useMemo(() => {
    const gz = data?.ganzhi as Record<string, unknown> | undefined;
    const dayGz = typeof gz?.day === 'string' ? gz.day : '';
    return extractDayStem(dayGz);
  }, [data]);

  const hourly = useMemo(
    () => (dayStem ? buildHourlyDirections(dayStem) : []),
    [dayStem],
  );

  const activeHour = hourly.find((h) => h.hourBranch === activeBranch) ?? null;

  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0' }}>
      <PageTopbar title="择时工具" onBack={() => window.history.back()} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
        {/* 月份切换 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => shift(-1)} style={navBtn}>‹</button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{view.y} 年 {view.m + 1} 月</span>
          <button onClick={() => shift(1)} style={navBtn}>›</button>
        </div>

        {/* 日历网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 24 }}>
          {WEEK_LABELS.map((w) => (
            <div key={w} style={{ textAlign: 'center', fontSize: 12, color: '#64748b', padding: '6px 0' }}>{w}</div>
          ))}
          {cells.map((d, i) => {
            if (d === null) return <div key={`e${i}`} />;
            const iso = toISO(view.y, view.m, d);
            const isPicked = iso === picked;
            return (
              <button
                key={iso}
                onClick={() => { setPicked(iso); setActiveBranch(null); }}
                style={{
                  padding: '12px 0', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                  border: isPicked ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
                  background: isPicked ? 'rgba(251,191,36,0.14)' : 'rgba(255,255,255,0.04)',
                  color: isPicked ? '#fbbf24' : '#e2e8f0',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* 当日宜忌 */}
        <div style={cardStyle}>
          <h3 style={h3Style}>选定日 · {picked} 宜忌</h3>
          {loading && <div style={{ color: '#64748b', fontSize: 13 }}>加载中…</div>}
          {!loading && (
            <>
              <Row label="宜" items={data?.recommends ?? []} color="#39FF14" />
              <Row label="忌" items={data?.avoids ?? []} color="#E60012" />
            </>
          )}
        </div>

        {/* 12 时辰 */}
        <div style={cardStyle}>
          <h3 style={h3Style}>选时辰 · 吉时参考</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {HOUR_BRANCHES.map((b) => {
              const isActive = activeBranch === b;
              return (
                <button
                  key={b}
                  onClick={() => setActiveBranch(b)}
                  style={{
                    padding: '10px 0', borderRadius: 9, cursor: 'pointer', fontSize: 13,
                    border: isActive ? '1px solid #39FF14' : '1px solid rgba(255,255,255,0.08)',
                    background: isActive ? 'rgba(57,255,20,0.12)' : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#39FF14' : '#94a3b8',
                  }}
                >
                  <div>{b}时</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{HOUR_RANGES[b]}</div>
                </button>
              );
            })}
          </div>
          {activeHour && (
            <div style={{ marginTop: 14, fontSize: 13, lineHeight: 1.8 }}>
              <div>财神：{DIR_LABELS[activeHour.wealth]}</div>
              <div>喜神：{DIR_LABELS[activeHour.joy]}</div>
              <div>福神：{DIR_LABELS[activeHour.fortune]}</div>
            </div>
          )}
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
          ⚠️ 择时结果基于传统黄历与方位文化，仅供民俗参考，不构成任何决策建议。
        </p>
      </div>
    </div>
  );
}

const navBtn: CSSProperties = {
  width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 18,
};
const cardStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 18, marginBottom: 18,
};
const h3Style: CSSProperties = { margin: '0 0 14px', fontSize: 16 };
const rowStyle: CSSProperties = { display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8 };

function Row({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div style={rowStyle}>
      <span style={{ flex: 'none', width: 20, color, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#cbd5e1' }}>{items.length ? items.join('、') : '—'}</span>
    </div>
  );
}
"export default CalendarPage;" 
