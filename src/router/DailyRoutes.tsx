/**
 * Daily 路由：每日运势 /daily/today
 * 免费排盘结果后触达的每日运势独立页。
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const TodayPage = lazy(async () => {
  const module = await import('@/pages/daily/TodayPage');
  return { default: module.TodayPage };
});

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const DailyRoutes = <Route path="/daily/today" element={wrap(<TodayPage />)} />;
