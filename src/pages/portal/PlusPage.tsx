/**
 * E-12 门户层重审 · P-1600 /plus 专家与会员门户（中性商业门户）
 * 设计：Hero=会员权益视觉（免费层/订阅/深度内容，中性商业，不作命理主推）；内容主角区=
 *       consult/experts/membership/pricing/vip/shop/account 全保留；二级区=趣味工具带（底部弱化）。
 * 链接全部为 Spec §4 白名单已注册路由；商业文案中性，无绝对化断言。
 */
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/SeoHead';
import { PortalTodayCard, PortalToolBelt, PortalCompliance } from './PortalShared';
import './portal.css';

export function PlusPage() {
  return (
    <div className="portal-page portal-page--plus">
      <SeoHead
        title="专家与会员 · 命律 TempoSoul"
        description="命律会员与服务门户：订阅定价、会员权益、在线咨询、专家团队与积分奖励，一览免费层与付费服务说明。"
      />
      <div className="portal-page__inner">
        {/* Hero：会员权益视觉，主角=会员与服务 */}
        <header className="portal-hero portal-hero--plus">
          <div className="portal-hero__eyebrow">Plus · 会员与服务</div>
          <h1 className="portal-hero__title">专家与会员</h1>
          <p className="portal-hero__sub">
            从免费层到订阅会员，从深度内容到专家服务——以清晰的权益说明与透明的定价档位，
            按需选择适合自己的内容层级与服务入口。
          </p>
          <div className="portal-hero__cta">
            <Link to="/pricing" className="portal-btn portal-btn--primary">
              查看定价 →
            </Link>
            <Link to="/membership" className="portal-btn">
              会员中心 →
            </Link>
          </div>
          <style>{`
            .portal-hero--plus::after {
              content: '惠';
              position: absolute;
              right: 36px;
              top: 50%;
              transform: translateY(-50%);
              font-family: var(--font-serif-zh, 'Noto Serif SC', serif);
              font-size: 148px;
              line-height: 1;
              color: rgba(201, 214, 232, 0.06);
              user-select: none;
              pointer-events: none;
            }
            .portal-hero--plus::before {
              content: '「权益 · 服务 · 定价」';
              position: absolute;
              right: 44px;
              bottom: 34px;
              writing-mode: vertical-rl;
              font-family: var(--font-serif-zh, 'Noto Serif SC', serif);
              font-size: 15px;
              letter-spacing: 0.3em;
              color: var(--accent-lunar, #c9d6e8);
              opacity: 0.55;
              user-select: none;
              pointer-events: none;
            }
            @media (max-width: 720px) {
              .portal-hero--plus::after { font-size: 96px; right: 14px; }
              .portal-hero--plus::before { display: none; }
            }
          `}</style>
        </header>

        {/* 内容主角区：会员与服务板块 */}
        <section className="portal-section" aria-label="会员与服务">
          <div className="portal-section__head">
            <h2 className="portal-section__title">会员与服务</h2>
            <Link to="/membership" className="portal-section__more">
              进入会员中心 →
            </Link>
          </div>
          <div className="portal-grid">
            <Link to="/pricing" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">订阅</span>
              <span className="portal-card__title">Pricing 订阅定价</span>
              <span className="portal-card__desc">免费层与付费订阅档位对比，按需选择深度内容与服务权益</span>
            </Link>
            <Link to="/membership" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">会员</span>
              <span className="portal-card__title">Membership 会员中心</span>
              <span className="portal-card__desc">管理会员状态、已开通权益与订阅记录的一站式入口</span>
            </Link>
            <Link to="/vip" className="portal-card portal-card--red">
              <span className="portal-card__tag">权益</span>
              <span className="portal-card__title">VIP 会员权益</span>
              <span className="portal-card__desc">会员专属内容、优先响应与增值服务说明，权益一屏概览</span>
            </Link>
            <Link to="/consult" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">咨询</span>
              <span className="portal-card__title">Consult 在线咨询</span>
              <span className="portal-card__desc">与专家在线预约沟通，按需选择咨询时段与主题方向</span>
            </Link>
            <Link to="/experts" className="portal-card portal-card--green">
              <span className="portal-card__tag">专家</span>
              <span className="portal-card__title">Experts 专家团队</span>
              <span className="portal-card__desc">专家团队成员介绍与擅长领域，了解每位顾问的背景与方向</span>
            </Link>
            <Link to="/shop" className="portal-card portal-card--gray">
              <span className="portal-card__tag">商城</span>
              <span className="portal-card__title">Shop 周边商城</span>
              <span className="portal-card__desc">文化周边与数字内容商品展示，浏览可选商品与服务说明</span>
            </Link>
            <Link to="/account/credits" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">积分</span>
              <span className="portal-card__title">Credits 积分充值</span>
              <span className="portal-card__desc">积分余额与充值说明，查看站内服务与内容的消耗明细</span>
            </Link>
            <Link to="/account/rewards" className="portal-card portal-card--green">
              <span className="portal-card__tag">奖励</span>
              <span className="portal-card__title">Rewards 奖励中心</span>
              <span className="portal-card__desc">签到、任务与活动奖励规则说明，查看可领取的会员权益</span>
            </Link>
          </div>
        </section>

        {/* 每日新款入口 */}
        <PortalTodayCard tone="yellow" />

        {/* 二级区：趣味工具带（底部弱化，不作主推） */}
        <PortalToolBelt />

        {/* 合规句 */}
        <PortalCompliance />
      </div>
    </div>
  );
}
