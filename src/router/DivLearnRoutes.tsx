/**
 * DivLearn 路由：占卜入门教程（章列表 + 4 章详情）
 * 列表 /learn/divination ；详情 /learn/divination/:chapter
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const DivLearnList = lazy(() => import('@/pages/learn/divination/DivLearnList'));
const DivLearnDetail = lazy(() => import('@/pages/learn/divination/DivLearnDetail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const DivLearnRoutes = (
  <>
    <Route path="/learn/divination" element={wrap(<DivLearnList />)} />
    <Route path="/learn/divination/:chapter" element={wrap(<DivLearnDetail />)} />
  </>
);
