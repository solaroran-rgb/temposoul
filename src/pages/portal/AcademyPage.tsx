/**
 * E-12 门户层重审 · P-1400 /academy 知识学院（E-11 第三主角「文化知识」）
 * 设计：Hero=古籍典藏视觉（无术数位）；内容主角区=lexicon/knowledge/personality/
 *       courses/classics/learning 六组全保留；二级区=趣味工具带（底部弱化）。
 * 链接全部为已注册路由（153 清单 / App.tsx 显式）；文案零「术数推断」字样。
 */
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/SeoHead';
import { PortalTodayCard, PortalToolBelt, PortalCompliance } from './PortalShared';
import './portal.css';

export function AcademyPage() {
  return (
    <div className="portal-page portal-page--academy">
      <SeoHead
        title="知识学院 · 命律 TempoSoul"
        description="命律知识学院：术语词典、干支五行知识条目、典籍选读与学习路径，系统了解传统历法与民俗文化。"
      />
      <div className="portal-page__inner">
        {/* Hero：古籍典藏视觉，主角=文化知识 */}
        <header className="portal-hero portal-hero--academy">
          <div className="portal-hero__eyebrow">Academy · 文化知识</div>
          <h1 className="portal-hero__title">知识学院</h1>
          <p className="portal-hero__sub">
            从典籍原典到现代词条，从干支五行到星象民俗——以可核验的结构性事实与传统文化解读双标注，
            系统建立东方历法与天文文化的知识框架。
          </p>
          <div className="portal-hero__cta">
            <Link to="/knowledge" className="portal-btn portal-btn--primary">
              进入知识库 →
            </Link>
            <Link to="/lexicon" className="portal-btn">
              浏览术语词典 →
            </Link>
          </div>
          <style>{`
            .portal-hero--academy::after {
              content: '典';
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
            .portal-hero--academy::before {
              content: '「为往圣继绝学」';
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
              .portal-hero--academy::after { font-size: 96px; right: 14px; }
              .portal-hero--academy::before { display: none; }
            }
          `}</style>
        </header>

        {/* 内容主角区：六大知识板块 */}
        <section className="portal-section" aria-label="知识板块">
          <div className="portal-section__head">
            <h2 className="portal-section__title">知识板块</h2>
            <Link to="/knowledge" className="portal-section__more">
              全部知识条目 →
            </Link>
          </div>
          <div className="portal-grid">
            <Link to="/lexicon" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">术语词典</span>
              <span className="portal-card__title">Lexicon 词典</span>
              <span className="portal-card__desc">1180+ 术语条目：干支、五行、神煞、格局，逐条释义与文化来源标注</span>
            </Link>
            <Link to="/knowledge" className="portal-card portal-card--green">
              <span className="portal-card__tag">知识条目</span>
              <span className="portal-card__title">Knowledge 知识库</span>
              <span className="portal-card__desc">干支五行、行星词条、经典典籍、血型知识等分类内容，理性命理双标注</span>
            </Link>
            <Link to="/personality" className="portal-card portal-card--yellow">
              <span className="portal-card__tag">性格探索</span>
              <span className="portal-card__title">Personality 自我觉察</span>
              <span className="portal-card__desc">基于传统性格类型的自我探索测试与档案，认识偏好与倾向</span>
            </Link>
            <Link to="/video" className="portal-card portal-card--red">
              <span className="portal-card__tag">课程</span>
              <span className="portal-card__title">Courses 视频频道</span>
              <span className="portal-card__desc">知识讲解视频与内容课程，从基础概念到专题深讲</span>
            </Link>
            <Link to="/yijing/hexagrams" className="portal-card portal-card--gray">
              <span className="portal-card__tag">典籍</span>
              <span className="portal-card__title">Classics 典籍选读</span>
              <span className="portal-card__desc">易经六十四卦、经典典籍篇章，原文与白话对照研读</span>
            </Link>
            <Link to="/quiz/western" className="portal-card portal-card--indigo">
              <span className="portal-card__tag">学习路径</span>
              <span className="portal-card__title">Learning 学习路径</span>
              <span className="portal-card__desc">从术语词典到知识库再到典籍研读的渐进路径，按兴趣自选</span>
            </Link>
          </div>
        </section>

        {/* 每日新款入口 */}
        <PortalTodayCard tone="indigo" />

        {/* 二级区：趣味工具带（底部弱化，不作主推） */}
        <PortalToolBelt />

        {/* 合规句 */}
        <PortalCompliance />
      </div>
    </div>
  );
}
