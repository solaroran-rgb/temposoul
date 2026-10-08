/**
 * ③ 知识双轨入口（S-6 首页片）：知识库 / 沉浸星空 / 分享墙，全部复用既有路由。
 */
import { useNavigate } from 'react-router-dom';

const ENTRIES = [
  { to: '/knowledge', tag: '知识', title: '知识库', desc: '干支、典籍、行星百科，系统可读' },
  { to: '/sky', tag: '星空', title: '沉浸星空', desc: '16 万星表渲染的真实深空现场' },
  { to: '/community/wall', tag: '社区', title: '分享墙', desc: '他人定格的星象时刻' },
] as const;

export function HomeExploreSection() {
  const navigate = useNavigate();

  return (
    <section className="home-section home-explore" aria-label="知识双轨入口">
      <h2 className="home-section__title">从星空到知识</h2>
      <p className="home-section__desc">两条主轨，任择其一进入</p>
      <div className="home-explore__grid">
        {ENTRIES.map((item) => (
          <button
            key={item.to}
            type="button"
            className="home-card home-explore__card"
            onClick={() => navigate(item.to)}
          >
            <span className="home-explore__tag">{item.tag}</span>
            <span className="home-explore__title">{item.title}</span>
            <span className="home-explore__desc">{item.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
