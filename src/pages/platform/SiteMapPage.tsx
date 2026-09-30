/**
 * 全站功能总览（站点地图）页
 *
 * 数据源唯一：NAVIGATION_MATRIX / NAVIGATION_GROUPS（src/lib/navigation-matrix）。
 * 按导航分组列出全部栏目入口；含 :param 的模板页渲染为纯文本（需具体参数进入，不做死链）。
 */
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import {
  NAVIGATION_GROUPS,
  NAVIGATION_MATRIX,
  type NavGroupId,
} from '@/lib/navigation-matrix';

function isTemplatePath(path: string): boolean {
  return path.includes(':');
}

export function SiteMapPage() {
  const navigate = useNavigate();
  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  return (
    <div className="ts-page ts-page--sitemap">
      <PageTopbar title="网站地图" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">网站地图</h1>
        <p className="ts-page__note">
          本站全部栏目按功能分组总览，共 {NAVIGATION_MATRIX.length} 个页面入口。
        </p>

        {NAVIGATION_GROUPS.map((group) => {
          const pages = NAVIGATION_MATRIX.filter((p) => p.group === (group.id as NavGroupId));
          if (pages.length === 0) return null;
          return (
            <section key={group.id} className="ts-card" style={{ marginBottom: 16 }}>
              <h2 className="ts-card__title">{group.label}</h2>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 10,
                }}
              >
                {pages.map((page) => {
                  const templated = isTemplatePath(page.path);
                  const inner = (
                    <>
                      <strong>{page.title}</strong>
                      {page.desc ? (
                        <small style={{ display: 'block', color: '#94a3b8', marginTop: 2 }}>
                          {page.desc}
                        </small>
                      ) : null}
                      <small
                        style={{ display: 'block', color: '#64748b', marginTop: 2, fontSize: 11 }}
                      >
                        {page.path}
                      </small>
                    </>
                  );
                  return (
                    <li
                      key={page.key}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 8,
                        background: templated ? 'rgba(148,163,184,0.06)' : 'rgba(56,189,248,0.08)',
                        border: '1px solid rgba(148,163,184,0.12)',
                      }}
                    >
                      {templated ? (
                        <span title="需从列表页携带具体参数进入">{inner}</span>
                      ) : (
                        <Link to={page.path} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <p className="ts-page__note" style={{ marginTop: 24, textAlign: 'center', color: '#64748b' }}>
          本站内容为传统文化民俗研究与娱乐参考，不构成任何决策依据。
        </p>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default SiteMapPage;
