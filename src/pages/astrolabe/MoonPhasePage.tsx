// 任务包 10.1 · 月相盘：当月月相 + 情绪影响解读
// 纯前端天文近似（精度约 ±1 天），仅供情绪觉察与反思，非医疗/命理断言。
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';
import './moon-phase.css';

const SYNODIC = 29.530588853;
const REF_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC 新月参考点

type PhaseInfo = {
  index: number;
  key: string;
  name: string;
  emoji: string;
  illuminationHint: string;
  emotion: string;
};

const PHASES: PhaseInfo[] = [
  {
    index: 0,
    key: 'new',
    name: '新月',
    emoji: '🌑',
    illuminationHint: '0% 照度',
    emotion: '能量内收，适合清零与种下意图。情绪上偏安静、甚至有些空，别急着要答案——这是重新定向的窗口。',
  },
  {
    index: 1,
    key: 'waxing-crescent',
    name: '蛾眉月',
    emoji: '🌒',
    illuminationHint: '约 25% 照度',
    emotion: '微弱的光开始回来，行动欲萌芽。适合做小步尝试，把新月的意图落地成第一件事。',
  },
  {
    index: 2,
    key: 'first-quarter',
    name: '上弦月',
    emoji: '🌓',
    illuminationHint: '50% 照度',
    emotion: '半满的张力点。容易遇到卡顿与拉扯——这是“推进 vs 放弃”的考验，把精力放在最难的那一公里。',
  },
  {
    index: 3,
    key: 'waxing-gibbous',
    name: '盈凸月',
    emoji: '🌔',
    illuminationHint: '约 75% 照度',
    emotion: '势能上行，执行力强。适合打磨细节、协作推进，但留意别因“什么都想抓”而分散。',
  },
  {
    index: 4,
    key: 'full',
    name: '满月',
    emoji: '🌕',
    illuminationHint: '100% 照度',
    emotion: '情绪峰值与显化点。易被放大的是非、关系冲突与灵感都更亮。适合收尾、表达与看见真相，少做重大决定。',
  },
  {
    index: 5,
    key: 'waning-gibbous',
    name: '亏凸月',
    emoji: '🌖',
    illuminationHint: '约 75% 照度',
    emotion: '光开始退，转向内省与分享。适合复盘、交付成果、把经验讲给别人听。',
  },
  {
    index: 6,
    key: 'last-quarter',
    name: '下弦月',
    emoji: '🌗',
    illuminationHint: '50% 照度',
    emotion: '再一次的张力点，主题是“放下”。适合断舍离、结束循环、原谅，别硬撑已过季的事。',
  },
  {
    index: 7,
    key: 'waning-crescent',
    name: '残月',
    emoji: '🌘',
    illuminationHint: '约 25% 照度',
    emotion: '临近归零的休整期。情绪偏倦、梦多、灵感模糊但深沉。允许自己慢下来，为下个新月蓄能。',
  },
];

function julianDate(d: Date): number {
  // 以当地正午为基准，规避跨日边界
  const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  return noon.getTime() / 86400000 + 2440587.5;
}

function phaseFraction(d: Date): number {
  const jd = julianDate(d);
  let p = ((jd - REF_NEW_MOON_JD) % SYNODIC) / SYNODIC;
  if (p < 0) p += 1;
  return p;
}

function illumination(frac: number): number {
  return (1 - Math.cos(2 * Math.PI * frac)) / 2;
}

function phaseIndexOf(frac: number): number {
  return Math.floor(frac * 8) % 8;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function fmtDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function MoonPhasePage() {
  useEffect(() => {
    trackPageView('/astrolabe/moon-phase');
  }, []);

  const now = useMemo(() => new Date(), []);

  const current = useMemo(() => {
    const frac = phaseFraction(now);
    const idx = phaseIndexOf(frac);
    return {
      frac,
      info: PHASES[idx],
      illumPct: Math.round(illumination(frac) * 100),
    };
  }, [now]);

  // 当月 8 相首次出现日期
  const monthPhases = useMemo(() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    const total = daysInMonth(year, month);
    const seen = new Map<number, Date>();
    for (let day = 1; day <= total; day += 1) {
      const d = new Date(year, month, day, 12, 0, 0, 0);
      const idx = phaseIndexOf(phaseFraction(d));
      if (!seen.has(idx)) seen.set(idx, d);
    }
    return PHASES.map((p) => ({
      ...p,
      date: seen.get(p.index) ?? null,
    }));
  }, [now]);

  return (
    <div className="moon-phase-page">
      <header className="moon-phase-page__hero">
        <h1 className="moon-phase-page__title">月相盘</h1>
        <p className="moon-phase-page__subtitle">
          看一眼今晚的月亮，借它的节奏照看自己的情绪。
        </p>
      </header>

      <section className="moon-phase-page__current" aria-label="当前月相">
        <div className="moon-phase-page__moon" data-phase={current.info.key}>
          <span className="moon-phase-page__moon-emoji" aria-hidden="true">
            {current.info.emoji}
          </span>
        </div>
        <div className="moon-phase-page__current-meta">
          <h2>
            当前：{current.info.name}
            <span className="moon-phase-page__illum"> · 照度 {current.illumPct}%</span>
          </h2>
          <p className="moon-phase-page__emotion">{current.info.emotion}</p>
          <p className="moon-phase-page__date">观测基准日：{fmtDate(now)}（当地时间正午估算）</p>
        </div>
      </section>

      <section className="moon-phase-page__month" aria-label="当月月相">
        <h2 className="moon-phase-page__section-title">本月月相日历</h2>
        <ul className="moon-phase-page__grid">
          {monthPhases.map((p) => (
            <li
              key={p.key}
              className={`moon-phase-page__cell${p.date ? '' : ' moon-phase-page__cell--next'}`}
            >
              <span className="moon-phase-page__cell-emoji" aria-hidden="true">
                {p.emoji}
              </span>
              <span className="moon-phase-page__cell-name">{p.name}</span>
              <span className="moon-phase-page__cell-date">
                {p.date ? fmtDate(p.date) : '落于邻月'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="moon-phase-page__interpret" aria-label="情绪影响解读">
        <h2 className="moon-phase-page__section-title">八相情绪解读</h2>
        <div className="moon-phase-page__cards">
          {PHASES.map((p) => (
            <article
              key={p.key}
              className={`moon-phase-page__card${p.index === current.info.index ? ' moon-phase-page__card--active' : ''}`}
            >
              <div className="moon-phase-page__card-head">
                <span aria-hidden="true">{p.emoji}</span>
                <strong>{p.name}</strong>
                <span className="moon-phase-page__card-hint">{p.illuminationHint}</span>
              </div>
              <p>{p.emotion}</p>
            </article>
          ))}
        </div>
      </section>

      <nav className="moon-phase-page__related" aria-label="相关西占专题">
        <Link to="/astrolabe/saturn-return">土星回归专题 →</Link>
        <Link to="/quiz/western">做个趣味测验，生成你的星盘 →</Link>
      </nav>

      <p className="moon-phase-page__disclaimer">
        说明：月相时间为天文近似（误差约 ±1 天），“情绪影响”为西方月亮 folklore 与情绪觉察的映射，
        用于自我反思与放松，不构成医疗、心理或命理方面的专业意见。如持续情绪低落，请咨询专业帮助。
      </p>
    </div>
  );
}
