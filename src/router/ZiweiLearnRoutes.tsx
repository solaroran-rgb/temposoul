/**
 * ZiweiLearn 路由：紫微入门教程（章列表 + 6 章详情）
 * 列表 /learn/ziwei ；详情 /learn/ziwei/:chapter
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const ZiweiLearnList = lazy(() => import('@/pages/learn/ziwei/ZiweiLearnList'));
const ZiweiLearnDetail = lazy(() => import('@/pages/learn/ziwei/ZiweiLearnDetail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const ZiweiLearnRoutes = (
  <>
    <Route path="/learn/ziwei" element={wrap(<ZiweiLearnList />)} />
    <Route path="/learn/ziwei/:chapter" element={wrap(<ZiweiLearnDetail />)} />
  </>
);
