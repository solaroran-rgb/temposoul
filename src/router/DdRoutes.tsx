/**
 * DdRoutes：D 域（起名与商业变现）7 条路由
 * R5 D-A3：静态路径 /insights/name-popularity-trends 列在最前，确保优先于
 * B 域 /insights/:article_id 动态路由（React Router v6 静态天然高分，此处按稿顺序显式声明）
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const DdPage = lazy(() => import('@/pages/wiki/batch3d/DdPage'));

function wrap(pageId: string): ReactNode {
  return (
    <Suspense fallback={<RouteFallback />}>
      <DdPage pageId={pageId} />
    </Suspense>
  );
}

export const DdRoutes = (
  <>
    {/* R5 D-A3 静态优先：/insights/name-popularity-trends 置于动态 /insights/:article_id 之前 */}
    <Route path="/insights/name-popularity-trends" element={wrap('popularity')} />
    <Route path="/partners/creator-syndicate" element={wrap('syndicate')} />

    {/* 工具与服务页 */}
    <Route path="/tools/english-name-persona" element={wrap('english-name')} />
    <Route path="/tools/brand-naming-engine" element={wrap('brand')} />
    <Route path="/tools/artisanal-naming" element={wrap('artisanal')} />
    <Route path="/tools/life-rhythm-calendar" element={wrap('rhythm')} />
    <Route path="/services/senior-name-consultant" element={wrap('consultant')} />
  </>
);
