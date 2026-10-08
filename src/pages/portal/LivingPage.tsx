/**
 * E-12 门户层重审 · P-1300 /living 生活历法（E-11 主角「历法/生活/民俗文化」）
 * 设计：Hero=今日历法卡（实时日期 + 静态示例黄历要素 + 每日更新标注，主题为历法/生活/民俗）；
 *       内容主角区前置 almanac/calendar 八工具；中位区=zodiac/names/fengshui 九板块；
 *       术数类工具统一由 PortalToolBelt 趣味工具带承载，不单独放置。
 * 链接全部为 Spec §4 白名单已注册路由；Hero 文案仅围绕历法/生活/民俗主题。
 */
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/SeoHead';
import { PortalTodayCard, PortalToolBelt, PortalCompliance } from './PortalShared';
import './portal.css';

export function LivingPage() {
  // 今日日期：按 IANA Asia/Shanghai 实时刷新（与 PortalTodayCard 同一口径）
  const now = new Date();
  const dateText = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(now);

  return (
    <div className="portal-page portal-page--living">
      <SeoHead
        title="生活历法 · 命律 TempoSoul"
        description="命律生活历法：今日黄历、万年历、择日择时与节气节律，结合生肖、起名与风水民俗，把传统历法中的时间智慧落回日常生活。"
      />
      <div className="portal-page__inner">
        {/* Hero：今日历法卡，主角=历法/生活/民俗文化 */}
        <header className="portal-hero portal-hero--living">
          <div className="portal-hero__eyebrow">Living · 生活历法</div>
          <h1 className="portal-hero__title">生活历法</h1>
          <p className="portal-hero__sub">
            以二十四节气、公农历对照与传统宜忌为脉络，把历法里的时间智慧落回日常——
            择日、择时、节气安排与民俗参考，一站浏览。
          </p>

          {/* 今日历法卡：日期实时，黄历要素为静态示例 + 每日更新标注（不编造天文数据） */}
          <div className="living-todaycard" aria-label="今日历法卡">
            <div className="living-todaycard__date">{dateText}</div>
            <div className="living-todaycard__row">
              <span className="living-todaycard__item">
                <em>宜（示例）</em>会亲友 · 整理 · 出行
              </span>
              <span className="living-todaycard__item">
                <em>忌（示例）</em>动土 · 破土
              </span>
              <span className="living-todaycard__item">
                <em>干支 · 生肖</em>每日实时更新
              </span>
            </div>
            <div className="living-todaycard__note">
              宜忌与干支为静态示例，实际内容每日 00:00（Asia/Shanghai，IANA 时区）自动更新。
            </div>
          </div>

          <div className="portal-hero__cta">
            <Link to="/almanac" className="portal-btn portal-btn--primary">
              今日黄历 →
            </Link>
            <Link to="/almanac/calendar" className="portal-btn">
              万年历 →
            </Link>
          </div>
          <style>{`
            .portal-hero--living .living-todaycard {
              margin-top: 26px;
              padding: 18px 20px;
              border-radius: var(--radius-md, 10px);
              border: 1px solid rgba(242, 204, 96, 0.3);
              background: rgba(20, 26, 36, 0.55);
              max-width: 640px;
            }
            .portal-hero--living .living-todaycard__date {
              font-family: var(--font-serif-zh, 'Noto Serif SC', serif);
              font-size: 20px;
              color: #f2f6fb;
              letter-spacing: 0.02em;
            }
            .portal-hero--living .living-todaycard__row {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 12px;
            }
            .portal-hero--living .living-todaycard__item {
              font-size: 13px;
              color: var(--text-secondary, #8fa3bd);
            }
            .portal-hero--living .living-todaycard__item em {
              font-style: normal;
              margin-right: 6px;
              color: var(--status-yellow, #f2cc60);
              font-weight: 600;
            }
            .portal-hero--living .living-todaycard__note {
              margin-top: 10px;
              font-size: 12px;
              color: var(--text-secondary, #8fa3bd);
              opacity: 0.8;
            }
            .portal-hero--living::after {
              content: '历';
              position: absolute;
              right: 36px;
              top: 50%;
              transform: translateY(-50%);
              font-family: var(--font-serif-zh, 'Noto Serif SC', serif);
              font-size: 148px;
              line-height: 1;
              color: rgba(242, 204, 96, 0.07);
              user-select: none;
              pointer-events: none;
            }
            .portal-hero--living::before {
              content: '「敬授民时」';
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
              .portal-hero--living::after { font-size: 96px; right: 14px; }
              .portal-hero--living::before { display: none; }
            }
          `}</style>
        </header>

        {/* 内容主角区：历法工具（前置 almanac/calendar，八卡） */}
        <section className="portal-section" aria-label="历法工具">
          <div className="portal-section__head">
            <h2 className="portal-section__title">历法工具</h2>
            <Link to="/almanac" className="portal-section__more">
              今日黄历 →
            </Link>
          </div>
          <div className="portal-grid">
            <Link to="/almanac" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">黄历</span>
              <span className="portal-card__title">今日黄历</span>
              <span className="portal-card__desc">每日宜忌与干支要素一览，民俗生活时间参考</span>
            </Link>
            <Link to="/almanac/calendar" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">万年历</span>
              <span className="portal-card__title">万年历</span>
              <span className="portal-card__desc">公历农历对照、节气与节日查询</span>
            </Link>
            <Link to="/almanac/select" className="portal-card portal-card--green">
              <span className="portal-card__tag">择日</span>
              <span className="portal-card__title">择日工具</span>
              <span className="portal-card__desc">按事项类别筛选适宜日期，安排生活节点</span>
            </Link>
            <Link to="/almanac/directions" className="portal-card portal-card--red">
              <span className="portal-card__tag">方位</span>
              <span className="portal-card__title">吉位煞向</span>
              <span className="portal-card__desc">当日方位与民俗宜忌参考，布置与出行参考</span>
            </Link>
            <Link to="/almanac/is-lucky/marriage" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">婚嫁</span>
              <span className="portal-card__title">婚嫁吉日</span>
              <span className="portal-card__desc">婚嫁事项的日期民俗参考</span>
            </Link>
            <Link to="/daily/today" className="portal-card portal-card--green">
              <span className="portal-card__tag">今日</span>
              <span className="portal-card__title">Daily 今日节律</span>
              <span className="portal-card__desc">每日生活节律与宜忌条目一览</span>
            </Link>
            <Link to="/calendar/pick" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">择时</span>
              <span className="portal-card__title">择时工具</span>
              <span className="portal-card__desc">按时辰安排日常事项与活动节奏</span>
            </Link>
            <Link to="/tools/life-rhythm-calendar" className="portal-card portal-card--gray">
              <span className="portal-card__tag">节律</span>
              <span className="portal-card__title">节律月历</span>
              <span className="portal-card__desc">月度生活节律与节气安排总览</span>
            </Link>
          </div>
        </section>

        {/* 中位区：生肖 · 起名 · 风水（九板块，涉传统民俗附说明句） */}
        <section className="portal-section" aria-label="生肖与民俗">
          <div className="portal-section__head">
            <h2 className="portal-section__title">生肖 · 起名 · 风水</h2>
            <span className="portal-section__more">此为传统命理观点</span>
          </div>
          <div className="portal-grid">
            <Link to="/zodiac/fortune" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">生肖</span>
              <span className="portal-card__title">生肖运势</span>
              <span className="portal-card__desc">十二生肖年度与日常民俗参考</span>
            </Link>
            <Link to="/zodiac/buddha" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">生肖文化</span>
              <span className="portal-card__title">生肖本命佛</span>
              <span className="portal-card__desc">十二生肖对应的民俗文化与守护神信仰</span>
            </Link>
            <Link to="/zodiac/tai-sui" className="portal-card portal-card--red">
              <span className="portal-card__tag">民俗</span>
              <span className="portal-card__title">太岁查询</span>
              <span className="portal-card__desc">流年太岁与民俗纪年参考</span>
            </Link>
            <Link to="/names" className="portal-card portal-card--green">
              <span className="portal-card__tag">起名</span>
              <span className="portal-card__title">智能起名</span>
              <span className="portal-card__desc">按音律、字义与喜用推荐名字候选</span>
            </Link>
            <Link to="/kangxi" className="portal-card portal-card--gray">
              <span className="portal-card__tag">字典</span>
              <span className="portal-card__title">康熙字典</span>
              <span className="portal-card__desc">汉字字形、字义与笔画传统工具书</span>
            </Link>
            <Link to="/name-test" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">姓名</span>
              <span className="portal-card__title">姓名测试</span>
              <span className="portal-card__desc">姓名音律与字义的趣味解读参考</span>
            </Link>
            <Link to="/insights/name-popularity-trends" className="portal-card portal-card--green">
              <span className="portal-card__tag">数据</span>
              <span className="portal-card__title">名字热度趋势</span>
              <span className="portal-card__desc">近年热门名字的流行趋势观察</span>
            </Link>
            <Link to="/fengshui/bazhai" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">风水</span>
              <span className="portal-card__title">八宅风水</span>
              <span className="portal-card__desc">传统住宅方位与格局的民俗文化解读</span>
            </Link>
            <Link to="/tools/yangzhai-fengshui-test" className="portal-card portal-card--red">
              <span className="portal-card__tag">趣味</span>
              <span className="portal-card__title">阳宅趣味测</span>
              <span className="portal-card__desc">居家方位布置的民俗趣味小测</span>
            </Link>
          </div>
        </section>

        {/* 每日新款入口 */}
        <PortalTodayCard tone="yellow" />

        {/* 二级区：趣味工具带（术数类排盘工具统一降级于此，底部弱化，不作主推） */}
        <PortalToolBelt />

        {/* 合规句 */}
        <PortalCompliance />
      </div>
    </div>
  );
}
