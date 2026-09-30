// src/pages/daily/DailyPage.tsx
// 9.4 每日星盘能量：财神方位 / 幸运色 / 贵人方位 / 避忌
import { useMemo, type CSSProperties } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import {
  buildHourlyDirections, extractDayStem, getCurrentHourBranch,
  type Direction, type HeavenlyStem, type EarthlyBranch,
} from '@/lib/direction-calculator';

const DIR_LABELS: Record<Direction, string> = {
  N: '正北', NE: '东北', E: '正东', SE: '东南', S: '正南', SW: '西南', W: '正西', NW: '西北',
};

// 天干 → 五行
const STEM_WUXING: Record<HeavenlyStem, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};
// 五行 → 幸运色（文化类象，可读强调色）
const WUXING_COLOR: Record<string, { name: string; hex: string }> = {
  木: { name: '青 / 绿', hex: '#4ade80' },
  火: { name: '赤 / 红', hex: '#ef4444' },
  土: { name: '黄', hex: '#eab308' },
  金: { name: '白', hex: '#f8fafc' },
  水: { name: '黑 / 玄', hex: '#64748b' },
};
// 天乙贵人（取首支）→ 地支
const STEM_NOBLE_BRANCH: Record<HeavenlyStem, EarthlyBranch> = {
  甲: '丑', 戊: '丑', 庚: '丑', 乙: '申', 己: '申', 丙: '酉', 丁: '酉',
  壬: '卯', 癸: '卯', 辛: '午',
};
// 地支 → 简化方位
const BRANCH_DIR: Record<EarthlyBranch, Direction> = {
  '子': 'N', '丑': 'NE', '寅': 'NE', '卯': 'E', '辰': 'E', '巳': 'SE',
  '午': 'S', '未': 'SW', '申': 'SW', '酉': 'W', '戌': 'W', '亥': 'NW',
};

export function DailyPage() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, loading } = useAlmanacData(today);

  const dayStem = useMemo(() => {
    const gz = data?.ganzhi as Record<string, unknown> | undefined;
    const dayGz = typeof gz?.day === 'string' ? gz.day : '';
    return extractDayStem(dayGz);
  }, [data]);

  const wealthDir = useMemo(() => {
    if (!dayStem) return null;
    const dirs = buildHourlyDirections(dayStem);
    const cur = getCurrentHourBranch();
    return dirs.find((d) => d.hourBranch === cur)?.wealth ?? null;
  }, [dayStem]);

  const wuxing = dayStem ? STEM_WUXING[dayStem] : null;
  const luckyColor = wuxing ? WUXING_COLOR[wuxing] : null;
  const nobleDir = dayStem ? BRANCH_DIR[STEM_NOBLE_BRANCH[dayStem]] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0' }}>
      <PageTopbar title="每日星盘能量" onBack={() => window.history.back()} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 18px' }}>
          {today} · {data?.lunarDate ?? '农历加载中…'}
        </p>

        {loading && <div style={{ color: '#64748b', fontSize: 13 }}>能量数据加载中…</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          <EnergyCard title="财神方位" value={wealthDir ? DIR_LABELS[wealthDir] : '—'} accent="#fbbf24" />
          <EnergyCard
            title="贵人方位"
            value={nobleDir ? DIR_LABELS[nobleDir] : '—'}
            accent="#39FF14"
          />
          <EnergyCard
            title="幸运色"
            value={luckyColor ? luckyColor.name : '—'}
            accent={luckyColor ? luckyColor.hex : '#94a3b8'}
          />
          <EnergyCard
            title="今日五行"
            value={wuxing ?? '—'}
            accent="#8fa3ff"
          />
        </div>

        {/* 避忌 */}
        <div style={blockStyle}>
          <h3 style={h3Style}>今日避忌</h3>
          <Row label="宜" items={data?.recommends ?? []} color="#39FF14" />
          <Row label="忌" items={data?.avoids ?? []} color="#E60012" />
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
          ⚠️ 方位与五行色基于传统干支文化与《五行类象》类象系统，仅供民俗参考，不构成任何决策建议。
        </p>
      </div>
    </div>
  );
}

const blockStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 18, marginTop: 16,
};
const h3Style: CSSProperties = { margin: '0 0 14px', fontSize: 16 };
const rowStyle: CSSProperties = { display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 8 };

function EnergyCard({ title, value, accent }: { title: string; value: string; accent: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 18,
      borderTop: `3px solid ${accent}`,
    }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>{value}</div>
    </div>
  );
}

function Row({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div style={rowStyle}>
      <span style={{ flex: 'none', width: 20, color, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#cbd5e1' }}>{items.length ? items.join('、') : '—'}</span>
    </div>
  );
}
"export default DailyPage;" 
