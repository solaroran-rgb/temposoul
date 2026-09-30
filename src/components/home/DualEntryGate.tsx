// F03 · 首页双分流门
// 首页顶部两个入口卡片：普通用户（轻解读）/ 专业用户（深度解盘）。
// 选择结果持久化到 localStorage；已选过的用户看到收起态单条提示条，可一键切换或重选。
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  readUserTrack,
  writeUserTrack,
  trackUserTrackSelect,
  type UserTrack,
} from '@/lib/user-track';

type GateLink = { id: string; label: string; to: string };

type GateConfig = {
  track: UserTrack;
  badge: string;
  title: string;
  subtitle: string;
  points: string[];
  cta: string;
  target: string;
  links: GateLink[];
};

const GATES: GateConfig[] = [
  {
    track: 'casual',
    badge: '普通用户',
    title: '我想看点轻松的',
    subtitle: '一句话结论，30 秒看懂，不需要任何基础',
    points: [
      '今日运势 / 星座 / 生肖，打开就有',
      '塔罗抽牌、趣味测验，随时玩',
      '结论都是大白话，不带术语',
    ],
    cta: '轻松看运势',
    target: '/daily/today',
    links: [
      { id: 'zodiac', label: '星座', to: '/astrology/zodiac' },
      { id: 'tarot', label: '塔罗', to: '/tarot/spreads' },
      { id: 'quiz', label: '趣味测验', to: '/quiz/western' },
      { id: 'name-test', label: '姓名测试', to: '/name-test' },
    ],
  },
  {
    track: 'pro',
    badge: '专业用户',
    title: '我要完整排盘解盘',
    subtitle: '全盘参数、十神格局、大运流年逐层展开',
    points: [
      '八字 / 紫微 / 西占全参数排盘',
      '十神格局 · 大运流年逐层深挖',
      '可切换专业术语与白话解读',
    ],
    cta: '开始深度排盘',
    target: '/?mode=single',
    links: [
      { id: 'dayun', label: '大运', to: '/bazi/dayun' },
      { id: 'liunian', label: '流年', to: '/bazi/liunian' },
      { id: 'shishen', label: '十神', to: '/bazi/shishen' },
      { id: 'ziwei', label: '紫微', to: '/ziwei/palaces' },
    ],
  },
];

export function DualEntryGate() {
  const navigate = useNavigate();
  const [savedTrack, setSavedTrack] = useState<UserTrack | null>(() => readUserTrack());
  const [expanded, setExpanded] = useState(() => readUserTrack() === null);

  function pick(track: UserTrack, to: string, source: string) {
    writeUserTrack(track);
    setSavedTrack(track);
    trackUserTrackSelect(track, source);
    navigate(to);
  }

  const savedGate = GATES.find((gate) => gate.track === savedTrack) ?? null;

  // 收起态：已选过的用户不再被门挡住，只保留一条可切换的轻提示。
  if (savedGate && !expanded) {
    return (
      <section className="dual-gate dual-gate--compact" aria-label="浏览模式">
        <span className="dual-gate__compact-badge">{savedGate.badge}模式</span>
        <span className="dual-gate__compact-text">
          已按<strong>{savedGate.badge}</strong>为你呈现内容
        </span>
        <div className="dual-gate__compact-actions">
          <button
            type="button"
            className="dual-gate__link-button"
            onClick={() => setExpanded(true)}
          >
            重新选择
          </button>
          <button
            type="button"
            className="dual-gate__link-button"
            onClick={() => {
              const next = savedTrack === 'casual' ? 'pro' : 'casual';
              const gate = GATES.find((item) => item.track === next);
              if (gate) pick(gate.track, gate.target, 'compact-switch');
            }}
          >
            切到{savedTrack === 'casual' ? '专业' : '普通'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="dual-gate" aria-label="选择浏览模式">
      <header className="dual-gate__head">
        <h2 className="dual-gate__headline">你想怎么看？</h2>
        <p className="dual-gate__hint">选一个入口，两种模式随时可切换</p>
      </header>
      <div className="dual-gate__grid">
        {GATES.map((gate) => (
          <article key={gate.track} className={`dual-gate__card dual-gate__card--${gate.track}`}>
            <span className="dual-gate__badge">{gate.badge}</span>
            <h3 className="dual-gate__title">{gate.title}</h3>
            <p className="dual-gate__subtitle">{gate.subtitle}</p>
            <ul className="dual-gate__points">
              {gate.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <button
              type="button"
              className={`dual-gate__cta dual-gate__cta--${gate.track}`}
              onClick={() => pick(gate.track, gate.target, 'card')}
            >
              {gate.cta}
            </button>
            <div className="dual-gate__links">
              {gate.links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  className="dual-gate__quick-link"
                  onClick={() => pick(gate.track, link.to, `quick:${link.id}`)}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
