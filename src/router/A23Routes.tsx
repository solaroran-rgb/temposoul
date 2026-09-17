// A23 跨节点 · 全部 12 条路由 lazy + Suspense
// gufa×3 / mansions×2 / fengshui-test×1 / qinggong×1 / tarot-learn×3
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';
import '@/styles/a23.css';

const GufaIndexPage = lazy(() => import('@/pages/divination/gufa/GufaIndexPage'));
const GufaSchoolPage = lazy(() => import('@/pages/divination/gufa/GufaSchoolPage'));
const GufaCategoryPage = lazy(() => import('@/pages/divination/gufa/GufaCategoryPage'));

const MansionsListPage = lazy(() => import('@/pages/astrolabe/mansions/MansionsListPage'));
const MansionDetailPage = lazy(() => import('@/pages/astrolabe/mansions/MansionDetailPage'));

const FengshuiTestPage = lazy(() => import('@/pages/divination/fengshui-test/FengshuiTestPage'));

const QinggongPage = lazy(() => import('@/pages/divination/qinggong/QinggongPage'));

const TarotLearnHomePage = lazy(() => import('@/pages/tarot/learn/TarotLearnHomePage'));
const TarotLearnDailyPage = lazy(() => import('@/pages/tarot/learn/TarotLearnDailyPage'));
const TarotLearnGroupPage = lazy(() => import('@/pages/tarot/learn/TarotLearnGroupPage'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const A23Routes = (
  <>
    {/* A23-1 古法神煞三流派 */}
    <Route path="/divination/gufa" element={wrap(<GufaIndexPage />)} />
    <Route path="/divination/gufa/:school" element={wrap(<GufaSchoolPage />)} />
    <Route path="/divination/gufa/:school/:category" element={wrap(<GufaCategoryPage />)} />

    {/* A23-2 二十八宿 */}
    <Route path="/astrolabe/mansions" element={wrap(<MansionsListPage />)} />
    <Route path="/astrolabe/mansions/:id" element={wrap(<MansionDetailPage />)} />

    {/* A23-3 阳宅风水测试 */}
    <Route path="/divination/fengshui-test" element={wrap(<FengshuiTestPage />)} />

    {/* A23-4 清宫表 */}
    <Route path="/divination/qinggong" element={wrap(<QinggongPage />)} />

    {/* A23-5 塔罗学习（daily 静态段置于 :group 之前） */}
    <Route path="/tarot/learn" element={wrap(<TarotLearnHomePage />)} />
    <Route path="/tarot/learn/daily" element={wrap(<TarotLearnDailyPage />)} />
    <Route path="/tarot/learn/:group" element={wrap(<TarotLearnGroupPage />)} />
  </>
);
