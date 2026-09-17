import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const PodcastsPage = lazy(() => import('@/pages/podcasts/PodcastsPage'));
const NewsListPage = lazy(() => import('@/pages/news/NewsListPage'));
const NewsDetailPage = lazy(() => import('@/pages/news/NewsDetailPage'));
const ClassicsListPage = lazy(() => import('@/pages/knowledge/ClassicsListPage'));
const ClassicDetailPage = lazy(() => import('@/pages/knowledge/ClassicDetailPage'));

export const c22Routes = (
  <>
    <Route path="/podcasts" element={<Suspense fallback={<RouteFallback />}><PodcastsPage /></Suspense>} />
    <Route path="/news" element={<Suspense fallback={<RouteFallback />}><NewsListPage /></Suspense>} />
    <Route path="/news/:slug" element={<Suspense fallback={<RouteFallback />}><NewsDetailPage /></Suspense>} />
    <Route path="/knowledge/classics" element={<Suspense fallback={<RouteFallback />}><ClassicsListPage /></Suspense>} />
    <Route path="/knowledge/classics/:slug" element={<Suspense fallback={<RouteFallback />}><ClassicDetailPage /></Suspense>} />
  </>
);
