/**
 * ④ 工具中心区（S-6 首页片）：id="paipan-tool"（导航片会链接 /#paipan-tool）。
 * 排盘表单（PersonForm/DivinationPanel/HomeShortcuts 等）作为 children 原样收进本区，
 * 非首屏主推；功能零删改。CTA 落地 /search（禁 /tools）。
 */
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export function HomeToolsSection({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <section id="paipan-tool" className="home-section home-tools" aria-label="专业工具中心">
      <header className="home-tools__head">
        <h2 className="home-section__title">专业工具中心</h2>
        <p className="home-section__desc">八字 · 紫微 · 西占 · 占卜 · 择日，参数完整可复算</p>
        <button
          type="button"
          className="home-btn home-btn--secondary"
          onClick={() => navigate('/search')}
        >
          进入工具中心
        </button>
      </header>
      {children}
    </section>
  );
}
