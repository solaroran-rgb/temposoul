// 女性垂直内容页 · 月亮周期（月相与情绪/经期节律的文化科普）
// 纯内容页：复用既有月相天文近似（与 /astrolabe/moon-phase 同一套朔望月参数），
// 不做医疗断言，仅作文化与身心作息参考。
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';
import './female.css';

// 复用既有月相数据的朔望月参数（与 src/pages/astrolabe/MoonPhasePage 一致）
const SYNODIC = 29.530588853;
const REF_NEW_MOON_JD = 2451550.1; // 2000-01-06 18:14 UTC 新月参考点

type PhaseNote = {
  index: number;
  key: string;
  name: string;
  emoji: string;
  rhythm: string;
  culture: string;
};

// 八相 × 情绪/节律文化映射（folk 与身心作息视角，非医学结论）
const PHASE_NOTES: PhaseNote[] = [
  {
    index: 0,
    key: 'new',
    name: '新月',
    emoji: '🌑',
    rhythm: '内收、蓄能、清零',
    culture: '多文化里新月都代表“开始前的黑暗”。适合复盘上一周期、写下新意图，不必急于行动。',
  },
  {
    index: 1,
    key: 'waxing-crescent',
    name: '蛾眉月',
    emoji: '🌒',
    rhythm: '萌芽、试探、小步启动',
    culture: '新月后的微光，象征愿望被温柔地“看见”。适合把意图拆成最小的第一步。',
  },
  {
    index: 2,
    key: 'first-quarter',
    name: '上弦月',
    emoji: '🌓',
    rhythm: '张力、推进、做选择',
    culture: '半满的“拉扯感”被视为需要决断的节点。适合处理搁置已久、需要拍板的小事。',
  },
  {
    index: 3,
    key: 'waxing-gibbous',
    name: '盈凸月',
    emoji: '🌔',
    rhythm: '打磨、协作、补细节',
    culture: '接近圆满的阶段，文化叙事里强调“耐心完善”。适合做收尾前的校对与沟通。',
  },
  {
    index: 4,
    key: 'full',
    name: '满月',
    emoji: '🌕',
    rhythm: '外放、表达、情绪显化',
    culture: '满月在很多传统里是情绪与关系被“照亮”的时刻。适合表达与庆祝，避免在情绪高点做重大决定。',
  },
  {
    index: 5,
    key: 'waning-gibbous',
    name: '亏凸月',
    emoji: '🌖',
    rhythm: '分享、感恩、回馈',
    culture: '光开始收回，主题转向“把成果分享出去”。适合复盘、致谢与交付。',
  },
  {
    index: 6,
    key: 'last-quarter',
    name: '下弦月',
    emoji: '🌗',
    rhythm: '放下、清理、断舍离',
    culture: '下弦象征“松开不再服务你的东西”。适合整理空间、结束拖延、原谅与告别。',
  },
  {
    index: 7,
    key: 'waning-crescent',
    name: '残月',
    emoji: '🌘',
    rhythm: '休整、内省、蓄势',
    culture: '临归零的“灰色时光”，被视为适合休息、做梦、不被打扰的阶段。允许自己慢下来。',
  },
];

function julianDate(d: Date): number {
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

export default function MoonCyclePage() {
  useEffect(() => {
    trackPageView('/female/moon-cycle');
  }, []);

  const now = useMemo(() => new Date(), []);
  const current = useMemo(() => {
    const frac = phaseFraction(now);
    const idx = phaseIndexOf(frac);
    return { info: PHASE_NOTES[idx], illumPct: Math.round(illumination(frac) * 100) };
  }, [now]);

  return (
    <div className="female-page">
      <header className="female-page__hero">
        <h1 className="female-page__title">月亮周期 · 月相与身心节律</h1>
        <p className="female-page__subtitle">
          月亮约 29.5 天走完一个朔望周期。世界各地的文化都曾把月相变化当作照看情绪与作息的一面镜子。
          这里把它整理成一份温柔的“节奏地图”，陪你观察自己。
        </p>
      </header>

      <section className="female-page__current" aria-label="当前月相">
        <div className="female-page__moon" aria-hidden="true">
          {current.info.emoji}
        </div>
        <div className="female-page__current-meta">
          <h2>
            当前：{current.info.name}
            <span className="female-page__illum"> · 照度约 {current.illumPct}%</span>
          </h2>
          <p className="female-page__emotion">
            这个阶段的节律关键词：{current.info.rhythm}。{current.info.culture}
          </p>
          <p className="female-page__date">
            观测基准日：{now.getMonth() + 1}月{now.getDate()}日（当地时间正午近似，误差约 ±1 天）
          </p>
        </div>
      </section>

      <section aria-label="月相与情绪节律文化">
        <h2 className="female-page__section-title">八相节奏地图</h2>
        <div className="female-page__cards">
          {PHASE_NOTES.map((p) => (
            <article
              key={p.key}
              className={`female-page__card${p.index === current.info.index ? ' female-page__card--active' : ''}`}
            >
              <div className="female-page__card-head">
                <span aria-hidden="true">{p.emoji}</span>
                <strong>{p.name}</strong>
                <span className="female-page__card-hint">{p.rhythm}</span>
              </div>
              <p>{p.culture}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="关于经期与月亮周期的文化说法">
        <h2 className="female-page__section-title">关于“月经与月亮”的文化说法</h2>
        <div className="female-page__prose">
          <p>
            <strong>民间与文化叙事：</strong>在许多古老观察里，女性经期约 28 天的长度被拿来与约 29.5
            天的朔望月作类比，由此衍生出“月相影响情绪与体力起伏”的说法。这属于一种跨文化的
            <strong>节律隐喻</strong>，用来解释人为何有时想独处、有时想表达。
          </p>
          <p>
            <strong>更稳妥的理解：</strong>每个人的周期、作息与情绪节奏都很不一样。把月相当作
            <strong>自我观察的提示物</strong>——在“内收相”多安排休息，在“外放相”多安排表达与协作——
            通常比强行“对齐月亮”更有帮助。它是一面镜子，不是一张处方。
          </p>
          <p>
            <strong>可以怎么用：</strong>连续几个月，在每次情绪起伏、体力变化时随手记一笔月相，
            看看自己是否真的存在某种个人节奏。这个过程本身，比结论更重要。
          </p>
        </div>
      </section>

      <nav className="female-page__related" aria-label="相关女性垂直内容">
        <Link to="/female/meditation">去冥想与情绪记录 →</Link>
        <Link to="/astrolabe/moon-phase">查看完整月相盘（当月日历）→</Link>
      </nav>

      <p className="female-page__disclaimer">
        说明：本页为文化科普与身心作息参考，月相时间为天文近似（误差约 ±1 天），相关说法来自民俗与跨文化叙事，
        不适替代专业医疗、心理或妇科意见。如有持续身体不适、经期异常或情绪困扰，请及时咨询专业人士。
      </p>
    </div>
  );
}
