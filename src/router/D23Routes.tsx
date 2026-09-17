import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const ManualNamingPage = lazy(() => import('@/pages/names/ManualNamingPage'));
const ExpertListPage = lazy(() => import('@/pages/names/ExpertListPage'));
const ExpertDetailPage = lazy(() => import('@/pages/names/ExpertDetailPage'));

/**
 * D23 路由（/names/* 域内，3 条）：
 * - /names/manual      手工起名（付费）
 * - /names/expert      大师测名 · 示例专家列表
 * - /names/expert/:id  大师测名 · 示例专家详情
 * 接线方式参照 A22Routes.tsx：在 App.tsx 的 <Routes> 内以 {D23Routes} 引入。
 */
export const D23Routes = (
  <>
    <Route
      path="/names/manual"
      element={
        <Suspense fallback={<RouteFallback />}>
          <ManualNamingPage />
        </Suspense>
      }
    />
    <Route
      path="/names/expert"
      element={
        <Suspense fallback={<RouteFallback />}>
          <ExpertListPage />
        </Suspense>
      }
    />
    <Route
      path="/names/expert/:id"
      element={
        <Suspense fallback={<RouteFallback />}>
          <ExpertDetailPage />
        </Suspense>
      }
    />
  </>
);
