/**
 * E-12 门户层重审 · 门户页共享组件（E-11 哲学）
 * 四门户（/academy /stars /living /plus）统一复用：
 *  - PortalTodayCard   每日新款入口（今日日期按 IANA Asia/Shanghai 实时刷新，24h 语义）
 *  - PortalToolBelt    二级「趣味工具带」（排盘/术数/塔罗/东方门户降级入口，底部弱化）
 *  - PortalCompliance  合规句（涉占内容统一声明「此为传统命理观点」）
 * 样式全部消费 portal.css（A 席深色 tokens），无白卡片。
 */
import { Link } from 'react-router-dom';

/** 今日日期（每日新款入口 · 按 IANA 时区刷新，跨日自动更新） */
export function PortalTodayCard({ tone = 'indigo' }: { tone?: 'indigo' | 'yellow' | 'green' }) {
  const now = new Date();
  const dateText = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(now);

  return (
    <section className={`portal-today portal-today--${tone}`} aria-label="每日新款">
      <div>
        <div className="portal-today__label">每日新款 · 24 小时刷新</div>
        <div className="portal-today__date">{dateText}</div>
        <p className="portal-today__hint">每日 00:00（Asia/Shanghai，IANA 时区）自动更新当日内容</p>
      </div>
      <div className="portal-today__links">
        <Link to="/daily-fortune" className="portal-btn">
          今日一签 →
        </Link>
        <Link to="/astro/events" className="portal-btn">
          今日星象 →
        </Link>
      </div>
    </section>
  );
}

/** 二级区 · 趣味工具带（排盘/术数统一降级于此，不作 Hero 主推） */
export function PortalToolBelt() {
  return (
    <section className="portal-tools" aria-label="更多工具">
      <h2 className="portal-tools__title">更多工具 · 趣味工具带</h2>
      <div className="portal-tools__belt">
        <Link to="/#paipan-tool" className="portal-chip">
          八字排盘
        </Link>
        <Link to="/bazi/dayun" className="portal-chip">
          大运详批
        </Link>
        <Link to="/ziwei/palaces" className="portal-chip">
          紫微十二宫
        </Link>
        <Link to="/astrolabe/natal" className="portal-chip">
          西占本命盘
        </Link>
        <Link to="/tarot/daily" className="portal-chip">
          塔罗日运
        </Link>
        <Link to="/tarot/spreads" className="portal-chip">
          塔罗牌阵
        </Link>
        <Link to="/divination/zhuge" className="portal-chip">
          诸葛神数
        </Link>
        <Link to="/yijing/hexagrams" className="portal-chip">
          易经六十四卦
        </Link>
        <Link to="/name-test" className="portal-chip">
          姓名测试
        </Link>
        <Link to="/search" className="portal-chip">
          全部工具 →
        </Link>
      </div>
    </section>
  );
}

/** 合规句：涉占内容统一声明（门户页二级区引用时随附） */
export function PortalCompliance() {
  return (
    <aside className="portal-compliance" aria-label="内容说明">
      <p>
        <strong>内容说明：</strong>本站以传统历法、天文与民俗文化为内容主体；涉及传统命理观点的板块
        仅供文化研究参考，<strong>此为传统命理观点</strong>，不构成任何医疗、法律或投资建议，也不作
        绝对化断言。
      </p>
    </aside>
  );
}
