import { Link, useLocation } from 'react-router-dom';
import { resolveNavigationLinks } from '@/lib/navigation-matrix';

/**
 * RelatedNavLinks — 功能跳转矩阵的页面侧消费组件。
 * 按当前 pathname 从 NAVIGATION_MATRIX 解析自然跳转目标并渲染为链接胶囊。
 * 未命中矩阵（无 related）时静默返回 null，不产生任何 UI 影响。
 */
export function RelatedNavLinks({
  title = '继续探索',
  limit = 6,
}: {
  title?: string;
  limit?: number;
}) {
  const { pathname } = useLocation();
  const links = resolveNavigationLinks(pathname);
  if (links.length === 0) return null;
  const visible = links.slice(0, limit);

  return (
    <section className="related-nav-links" aria-label="相关功能跳转">
      <div className="related-nav-links__title">{title}</div>
      <div className="related-nav-links__list">
        {visible.map((link) => (
          <Link key={link.key} to={link.to} className="related-nav-links__chip">
            {link.label} <span className="related-nav-links__arrow">→</span>
          </Link>
        ))}
      </div>
      <style>{`
        .related-nav-links {
          margin: 20px 0 24px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(77, 195, 255, 0.06);
          border: 1px solid rgba(77, 195, 255, 0.18);
        }
        .related-nav-links__title {
          font-size: 13px;
          font-weight: 600;
          color: #8b9bb4;
          margin-bottom: 10px;
        }
        .related-nav-links__list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .related-nav-links__chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(0, 0, 0, 0.2);
          color: #e2e8f0;
          font-size: 13px;
          text-decoration: none;
          transition: border-color 0.16s ease, color 0.16s ease, background 0.16s ease;
        }
        .related-nav-links__chip:hover {
          border-color: rgba(77, 195, 255, 0.55);
          color: #4dc3ff;
          background: rgba(77, 195, 255, 0.1);
        }
        .related-nav-links__arrow {
          color: #4dc3ff;
        }
      `}</style>
    </section>
  );
}
