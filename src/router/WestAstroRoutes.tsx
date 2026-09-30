// 任务包 10 · 获客+西占专题路由：月相盘 / 土星回归 / 测验漏斗
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const MoonPhasePage = lazy(() => import('@/pages/astrolabe/MoonPhasePage'));
const SaturnReturnPage = lazy(() => import('@/pages/astrolabe/SaturnReturnPage'));
const QuizPage = lazy(() => import('@/pages/quiz/QuizPage'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const WestAstroRoutes = (
  <>
    <Route path="/astrolabe/moon-phase" element={wrap(<MoonPhasePage />)} />
    <Route path="/astrolabe/saturn-return" element={wrap(<SaturnReturnPage />)} />
    <Route path="/quiz/western" element={wrap(<QuizPage />)} />
  </>
);
