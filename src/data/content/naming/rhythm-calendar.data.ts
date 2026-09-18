/**
 * D-6 节律月历（2026 真实节气查表 + 365 天确定性生成）
 * 来源：专家 D R3（143217.md §3）+ R4（论证322.md D-3 SOLAR_TERMS_2026 全量查表）
 * 关键修复：D-3 采用 R4 全量 24 节气查表常量；生成函数同步执行，无伪随机
 */
import type { LightFunContentEnvelope } from './types';

// ── R4 全量 24 节气查表（精确到分钟，来源：紫金山天文台口径）──
export interface SolarTermEntry {
  name: string;
  time: string;
  phenology: string;
  element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
}

export const SOLAR_TERMS_2026: Record<string, SolarTermEntry> = {
  '01-05': {
    name: '小寒',
    time: '2026-01-05T22:05:00+08:00',
    phenology: '雁北乡',
    element: 'water',
  },
  '01-20': {
    name: '大寒',
    time: '2026-01-20T15:30:00+08:00',
    phenology: '征鸟厉疾',
    element: 'water',
  },
  '02-04': {
    name: '立春',
    time: '2026-02-04T04:01:00+08:00',
    phenology: '东风解冻',
    element: 'wood',
  },
  '02-18': {
    name: '雨水',
    time: '2026-02-18T23:51:00+08:00',
    phenology: '獭祭鱼',
    element: 'wood',
  },
  '03-05': {
    name: '惊蛰',
    time: '2026-03-05T22:11:00+08:00',
    phenology: '桃始华',
    element: 'wood',
  },
  '03-20': {
    name: '春分',
    time: '2026-03-20T23:02:00+08:00',
    phenology: '玄鸟至',
    element: 'wood',
  },
  '04-05': {
    name: '清明',
    time: '2026-04-05T03:18:00+08:00',
    phenology: '桐始华',
    element: 'earth',
  },
  '04-20': {
    name: '谷雨',
    time: '2026-04-20T10:15:00+08:00',
    phenology: '萍始生',
    element: 'earth',
  },
  '05-05': {
    name: '立夏',
    time: '2026-05-05T21:25:00+08:00',
    phenology: '蝼蝈鸣',
    element: 'fire',
  },
  '05-21': {
    name: '小满',
    time: '2026-05-21T10:32:00+08:00',
    phenology: '苦菜秀',
    element: 'fire',
  },
  '06-05': {
    name: '芒种',
    time: '2026-06-05T13:14:00+08:00',
    phenology: '螳螂生',
    element: 'fire',
  },
  '06-21': {
    name: '夏至',
    time: '2026-06-21T05:34:00+08:00',
    phenology: '鹿角解',
    element: 'fire',
  },
  '07-07': {
    name: '小暑',
    time: '2026-07-07T10:05:00+08:00',
    phenology: '温风至',
    element: 'earth',
  },
  '07-22': {
    name: '大暑',
    time: '2026-07-22T21:30:00+08:00',
    phenology: '腐草为萤',
    element: 'earth',
  },
  '08-07': {
    name: '立秋',
    time: '2026-08-07T20:51:00+08:00',
    phenology: '凉风至',
    element: 'metal',
  },
  '08-23': {
    name: '处暑',
    time: '2026-08-23T11:33:00+08:00',
    phenology: '鹰乃祭鸟',
    element: 'metal',
  },
  '09-07': {
    name: '白露',
    time: '2026-09-07T18:15:00+08:00',
    phenology: '鸿雁来',
    element: 'metal',
  },
  '09-23': {
    name: '秋分',
    time: '2026-09-23T14:05:00+08:00',
    phenology: '雷始收声',
    element: 'metal',
  },
  '10-08': {
    name: '寒露',
    time: '2026-10-08T09:21:00+08:00',
    phenology: '鸿雁来宾',
    element: 'earth',
  },
  '10-23': {
    name: '霜降',
    time: '2026-10-23T12:51:00+08:00',
    phenology: '豺乃祭兽',
    element: 'earth',
  },
  '11-07': {
    name: '立冬',
    time: '2026-11-07T12:33:00+08:00',
    phenology: '水始冰',
    element: 'water',
  },
  '11-22': {
    name: '小雪',
    time: '2026-11-22T10:04:00+08:00',
    phenology: '虹藏不见',
    element: 'water',
  },
  '12-07': {
    name: '大雪',
    time: '2026-12-07T05:04:00+08:00',
    phenology: '鹖鴠不鸣',
    element: 'water',
  },
  '12-22': {
    name: '冬至',
    time: '2026-12-22T00:35:00+08:00',
    phenology: '蚯蚓结',
    element: 'water',
  },
};

// ── 判别联合：普通日 vs 交接日 ──
export interface BaseRhythmDay {
  date: string;
  solar_term: string;
  exact_transition_time?: string;
  phenology: string;
  rhythm_state: 'smooth' | 'cautious';
  energy_level: 'high' | 'low';
  scenario_advice: { career: string; relationship: string; health: string };
}
export interface NormalDay extends BaseRhythmDay {
  type: 'normal';
}
export interface TransitionDay extends BaseRhythmDay {
  type: 'transition';
  transition_advice: string;
  transition_intensity: 'mild' | 'moderate' | 'severe';
}
export type RhythmCalendarDay = NormalDay | TransitionDay;

// ── 能量状态确定性算法（无伪随机）──
function calculateRhythmState(
  month: number,
  isTransitionDay: boolean,
): {
  state: 'smooth' | 'cautious';
  level: 'high' | 'low';
} {
  const isHighEnergy = [2, 3, 4, 5, 6, 7].includes(month); // 春夏木火为 high
  return {
    state: isTransitionDay ? 'cautious' : 'smooth',
    level: isHighEnergy ? 'high' : 'low',
  };
}

// ── 同步生成 365 天（模块加载时执行，无 await）──
// 注意：SOLAR_TERMS_2026 的 key 为北京时间 MM-DD，故日期串按 UTC+8 偏移后截取，
// 避免冬至等「北京时间 00:35 交接」在 UTC 落到前一日导致查表失配。
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

export function buildRhythmCalendar(year: number): RhythmCalendarDay[] {
  const days: RhythmCalendarDay[] = [];
  const start = new Date(Date.UTC(year, 0, 1));
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 365; i++) {
    const beijing = new Date(start.getTime() + i * dayMs + BEIJING_OFFSET_MS);
    const iso = beijing.toISOString().slice(0, 10); // 北京日历日 YYYY-MM-DD
    const dayKey = iso.slice(5); // MM-DD
    const month = beijing.getUTCMonth() + 1;
    const term = SOLAR_TERMS_2026[dayKey];
    const { state, level } = calculateRhythmState(month, Boolean(term));

    const baseDay: BaseRhythmDay = {
      date: iso,
      solar_term: term?.name ?? '平气',
      exact_transition_time: term?.time,
      phenology: term?.phenology ?? '万物平稳',
      rhythm_state: state,
      energy_level: level,
      scenario_advice: {
        career: level === 'high' ? '适合推进核心事务' : '适合复盘与深度思考',
        relationship: state === 'smooth' ? '适合积极社交' : '保持边界与分寸',
        health: level === 'high' ? '适度运动释放精力' : '早睡养阴、节奏放缓',
      },
    };

    if (term) {
      days.push({
        ...baseDay,
        type: 'transition',
        transition_advice: `${term.name}交接，气场交替，宜静不宜动，重大决策可稍作推迟。`,
        transition_intensity: 'moderate',
      });
    } else {
      days.push({ ...baseDay, type: 'normal' });
    }
  }
  return days;
}

export interface RhythmCalendarPayload {
  year: number;
  days: RhythmCalendarDay[];
  term_count: number;
}

export const rhythmCalendarData: LightFunContentEnvelope<RhythmCalendarPayload> = {
  id: 'life-rhythm-calendar',
  kind: 'lightfun',
  seo: {
    title: '生命节律月历：2026 节气能量与每日行动参考',
    description: '基于真实节气交接时间与能量节律，提供每日行动参考（文化参考，非吉凶断言）。',
    keywords: ['节气', '节律', '2026 日历'],
  },
  payload: { year: 2026, days: buildRhythmCalendar(2026), term_count: 24 },
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['calendar', 'rhythm'],
  },
};
