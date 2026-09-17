// B23 src/router/B23Routes.tsx
/**
 * 批4 B 域 5 节点分路由（6 条）。
 * 挂载方式参照 A22Routes：lazy + Suspense(<RouteFallback/>) + Route。
 * 本文件不改动 App.tsx / 主路由聚合文件；由主路由侧 import { B23Routes } 并嵌入。
 */
import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const CelebrityListPage = lazy(() => import('@/pages/astrology/CelebrityListPage'));
const CelebrityDetailPage = lazy(() => import('@/pages/astrology/CelebrityDetailPage'));
const BirthdayPairingPage = lazy(() => import('@/pages/compatibility/BirthdayPairingPage'));
const MazuSignPage = lazy(() => import('@/pages/lingsign/MazuSignPage'));
const ZodiacBuddhaPage = lazy(() => import('@/pages/zodiac/ZodiacBuddhaPage'));
const TaiSuiPage = lazy(() => import('@/pages/zodiac/TaiSuiPage'));

export const B23Routes = (
  <>
    <Route
      path="/astrology/celebrities"
      element={<Suspense fallback={<RouteFallback />}><CelebrityListPage /></Suspense>}
    />
    <Route
      path="/astrology/celebrities/:id"
      element={<Suspense fallback={<RouteFallback />}><CelebrityDetailPage /></Suspense>}
    />
    <Route
      path="/compatibility/birthday"
      element={<Suspense fallback={<RouteFallback />}><BirthdayPairingPage /></Suspense>}
    />
    <Route
      path="/lingsign/mazu"
      element={<Suspense fallback={<RouteFallback />}><MazuSignPage /></Suspense>}
    />
    <Route
      path="/zodiac/buddha"
      element={<Suspense fallback={<RouteFallback />}><ZodiacBuddhaPage /></Suspense>}
    />
    <Route
      path="/zodiac/tai-sui"
      element={<Suspense fallback={<RouteFallback />}><TaiSuiPage /></Suspense>}
    />
  </>
);
