/**
 * Hehun 路由：八字合婚报告库（列表 + 7 篇详情）
 * 列表 /reports/hehun ；详情 /reports/hehun/:id
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const HehunList = lazy(() => import('@/pages/reports/hehun/HehunList'));
const HehunDetail = lazy(() => import('@/pages/reports/hehun/HehunDetail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const HehunRoutes = (
  <>
    <Route path="/reports/hehun" element={wrap(<HehunList />)} />
    <Route path="/reports/hehun/:id" element={wrap(<HehunDetail />)} />
  </>
);
