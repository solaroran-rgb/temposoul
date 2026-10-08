/**
 * E-12 门户层重审 · P-1100 /stars 星律宇宙（E-11 主角「天文星空」重设计）
 * 设计：Hero=真实星空视觉（CSS 星点 + 圆月装饰，不引入 WebGL/SkyPage 场景）；
 *       内容主角区=星象日历 / 真实天文（月相、星历、二十八宿、逆行、土星回归等 ≥6 卡）；
 *       二级弱化区=西占排盘（传统占星视角），置于 PortalToolBelt 下方，附合规句。
 * 链接全部为 Spec §4 /stars 白名单路由；文案保持中性天文文化向，不涉玄学话术。
 */
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/SeoHead';
import { PortalTodayCard, PortalToolBelt, PortalCompliance } from './PortalShared';
import './portal.css';

export function StarsPage() {
  return (
    <div className="portal-page portal-page--stars">
      <SeoHead
        title="星律宇宙 · 命律 TempoSoul"
        description="命律星律宇宙：月相盈亏、星象日历、星历表、二十八宿与行星逆行等真实天文现象的历法记录与文化解读，以中性天文文化视角仰望星空。"
      />
      <div className="portal-page__inner">
        {/* Hero：真实星空视觉（CSS 星点 + 圆月装饰），主角=天文星空 */}
        <header className="portal-hero portal-hero--stars">
          <div className="stars-sky" aria-hidden="true">
            <span className="stars-moon" />
          </div>
          <div className="portal-hero__eyebrow">Stars · 天文星空</div>
          <h1 className="portal-hero__title">星律宇宙</h1>
          <p className="portal-hero__sub">
            以可核验的天文坐标仰望夜空：月相盈亏、星象日历、星历表、二十八宿与行星逆行——
            把真实天体运行记录为可对照的时间轴，理解星空与历法的文化脉络。
          </p>
          <div className="portal-hero__cta">
            <Link to="/sky" className="portal-btn portal-btn--primary">
              沉浸星空 →
            </Link>
            <Link to="/astro/events" className="portal-btn">
              星象日历 →
            </Link>
          </div>
          <style>{`
            .portal-hero--stars .stars-sky {
              position: absolute;
              inset: 0;
              overflow: hidden;
              pointer-events: none;
              z-index: 0;
            }
            .portal-hero--stars .stars-sky::before {
              content: '';
              position: absolute;
              inset: 0;
              background-image:
                radial-gradient(1.5px 1.5px at 8% 22%, rgba(255,255,255,0.9), transparent 100%),
                radial-gradient(1px 1px at 16% 64%, rgba(255,255,255,0.7), transparent 100%),
                radial-gradient(1.5px 1.5px at 26% 18%, rgba(255,255,255,0.8), transparent 100%),
                radial-gradient(1px 1px at 34% 74%, rgba(255,255,255,0.6), transparent 100%),
                radial-gradient(1px 1px at 44% 30%, rgba(255,255,255,0.75), transparent 100%),
                radial-gradient(1.5px 1.5px at 52% 60%, rgba(255,255,255,0.85), transparent 100%),
                radial-gradient(1px 1px at 62% 14%, rgba(255,255,255,0.6), transparent 100%),
                radial-gradient(1px 1px at 70% 78%, rgba(255,255,255,0.7), transparent 100%),
                radial-gradient(1.5px 1.5px at 80% 34%, rgba(255,255,255,0.8), transparent 100%),
                radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.65), transparent 100%);
            }
            .portal-hero--stars .stars-moon {
              position: absolute;
              right: 64px;
              top: 50%;
              transform: translateY(-50%);
              width: 108px;
              height: 108px;
              border-radius: 50%;
              background: radial-gradient(circle at 38% 34%, #fbf7ea, #e9e4d2 46%, #c7c2b0 78%, #a49f8e 100%);
              box-shadow:
                0 0 34px rgba(245, 240, 222, 0.35),
                0 0 90px rgba(201, 214, 232, 0.18);
            }
            .portal-hero--stars .stars-moon::before {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background:
                radial-gradient(circle at 62% 40%, rgba(120,116,102,0.35), transparent 32%),
                radial-gradient(circle at 48% 66%, rgba(120,116,102,0.3), transparent 26%),
                radial-gradient(circle at 70% 62%, rgba(120,116,102,0.28), transparent 20%);
            }
            .portal-hero--stars .portal-hero__eyebrow,
            .portal-hero--stars .portal-hero__title,
            .portal-hero--stars .portal-hero__sub,
            .portal-hero--stars .portal-hero__cta {
              position: relative;
              z-index: 1;
            }
            .portal-page--stars .portal-stars-natal__note {
              margin: 12px 0 0;
              font-size: 12px;
              color: var(--text-secondary, #8fa3bd);
              opacity: 0.75;
            }
            @media (max-width: 720px) {
              .portal-hero--stars .stars-moon { width: 72px; height: 72px; right: 16px; opacity: 0.85; }
            }
          `}</style>
        </header>

        {/* 内容主角区：星象日历（真实天文），8 卡 */}
        <section className="portal-section" aria-label="星象日历">
          <div className="portal-section__head">
            <h2 className="portal-section__title">星象日历 · 真实天文</h2>
            <Link to="/astro/events" className="portal-section__more">
              全部天象事件 →
            </Link>
          </div>
          <div className="portal-grid">
            <Link to="/astrolabe/moon-phase" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">月相</span>
              <span className="portal-card__title">Moon Phase 月相盈亏</span>
              <span className="portal-card__desc">新月、上弦、满月、下弦的周期记录与盈亏时刻查询</span>
            </Link>
            <Link to="/astro/events" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">星象日历</span>
              <span className="portal-card__title">Events 天象事件</span>
              <span className="portal-card__desc">新月满月、行星逆行等天象节点的时间轴与发生时刻</span>
            </Link>
            <Link to="/astrolabe/ephemeris" className="portal-card portal-card--gray">
              <span className="portal-card__tag">星历表</span>
              <span className="portal-card__title">Ephemeris 星历表</span>
              <span className="portal-card__desc">行星位置的天文历表，逐日查询天体坐标与黄经</span>
            </Link>
            <Link to="/astrology/zodiac" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">星座百科</span>
              <span className="portal-card__title">Zodiac 星座百科</span>
              <span className="portal-card__desc">黄道十二宫的星座知识、日期范围与文化源流</span>
            </Link>
            <Link to="/astrolabe/mansions" className="portal-card portal-card--green">
              <span className="portal-card__tag">二十八宿</span>
              <span className="portal-card__title">Mansions 二十八宿</span>
              <span className="portal-card__desc">东方星宿分野与传统天文坐标系统，七曜与星宿对照</span>
            </Link>
            <Link to="/astrolabe/retrograde" className="portal-card portal-card--red">
              <span className="portal-card__tag">行星逆行</span>
              <span className="portal-card__title">Retrograde 行星逆行</span>
              <span className="portal-card__desc">行星视运动逆行现象的天文成因与发生时间表</span>
            </Link>
            <Link to="/astrolabe/saturn-return" className="portal-card portal-card--gray">
              <span className="portal-card__tag">土星回归</span>
              <span className="portal-card__title">Saturn Return 土星回归</span>
              <span className="portal-card__desc">土星约 29.5 年公转周期的回归节点，天文周期记录</span>
            </Link>
            <Link to="/astrology/parenting" className="portal-card portal-card--green">
              <span className="portal-card__tag">育儿视角</span>
              <span className="portal-card__title">Parenting 成长陪伴</span>
              <span className="portal-card__desc">以星象节律观察成长期的学习节奏与亲子陪伴参考</span>
            </Link>
          </div>
        </section>

        {/* 每日新款入口 */}
        <PortalTodayCard tone="indigo" />

        {/* 二级区：趣味工具带（底部弱化，不作主推） */}
        <PortalToolBelt />

        {/* 二级弱化小区块：西占排盘（传统占星视角），不进 Hero/主角区 */}
        <section className="portal-tools" aria-label="西占排盘">
          <h2 className="portal-tools__title">西占排盘 · 传统占星视角</h2>
          <div className="portal-tools__belt">
            <Link to="/astrolabe/natal" className="portal-chip">本命盘</Link>
            <Link to="/astrolabe/transits" className="portal-chip">行运盘</Link>
            <Link to="/zodiac/compatibility" className="portal-chip">星座配对</Link>
            <Link to="/compatibility/birthday" className="portal-chip">生日配对</Link>
          </div>
          <p className="portal-stars-natal__note">此为传统命理观点，仅供文化研究参考。</p>
        </section>

        {/* 合规句 */}
        <PortalCompliance />
      </div>
    </div>
  );
}
