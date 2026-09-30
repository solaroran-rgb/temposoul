// 女性垂直板块路由：月亮周期科普 / 冥想与情绪记录轻页
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const MoonCyclePage = lazy(() => import('@/pages/female/MoonCyclePage'));
const MeditationPage = lazy(() => import('@/pages/female/MeditationPage'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const FemaleRoutes = (
  <>
    <Route path="/female/moon-cycle" element={wrap(<MoonCyclePage />)} />
    <Route path="/female/meditation" element={wrap(<MeditationPage />)} />
  </>
);
