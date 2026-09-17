/**
 * C23 路由 · 6 条（风水知识库 2 + 英文名测试 1 + 商名 1 + 名字大全 1 + 热度榜 1）
 * 文件路径：src/router/C23Routes.tsx
 * 自查：风水列表/详情复用 KnowledgeListPage/KnowledgeDetailPage（共享组件，不传 props）；
 *       集成时需在共享 registry.ts CONTENT_LOADERS 注册本批 18 篇 slug 才能 loadArticle 命中。
 */
import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';
import { KnowledgeListPage } from '@/pages/knowledge/KnowledgeListPage';
import { KnowledgeDetailPage } from '@/pages/knowledge/KnowledgeDetailPage';

const EnglishNameTestPage = lazy(() => import('@/pages/name/EnglishNameTestPage'));
const BusinessNamePage = lazy(() => import('@/pages/names/BusinessNamePage'));
const NameCatalogPage = lazy(() => import('@/pages/names/NameCatalogPage'));
const NameRankingPage = lazy(() => import('@/pages/names/NameRankingPage'));

export const C23Routes = (
  <>
    {/* 风水知识库：分类页复用 KnowledgeListPage；详情页复用 KnowledgeDetailPage（按 :slug 加载） */}
    <Route
      path="/knowledge/fengshui"
      element={
        <Suspense fallback={<RouteFallback />}>
          <KnowledgeListPage initialCategory="fengshui" />
        </Suspense>
      }
    />
    <Route
      path="/knowledge/fengshui/:slug"
      element={
        <Suspense fallback={<RouteFallback />}>
          <KnowledgeDetailPage />
        </Suspense>
      }
    />
    {/* 英文名测试 */}
    <Route
      path="/name/english"
      element={
        <Suspense fallback={<RouteFallback />}>
          <EnglishNameTestPage />
        </Suspense>
      }
    />
    {/* 公司/店铺起名 */}
    <Route
      path="/names/business"
      element={
        <Suspense fallback={<RouteFallback />}>
          <BusinessNamePage />
        </Suspense>
      }
    />
    {/* 名字大全 */}
    <Route
      path="/names/catalog"
      element={
        <Suspense fallback={<RouteFallback />}>
          <NameCatalogPage />
        </Suspense>
      }
    />
    {/* 名字热度榜 */}
    <Route
      path="/names/ranking"
      element={
        <Suspense fallback={<RouteFallback />}>
          <NameRankingPage />
        </Suspense>
      }
    />
  </>
);

export default C23Routes;
