/**
 * 批 3b-B 路由：开运民俗与媒体资讯内容（6 栏目）
 * 列表 + 详情均复用 batch3b 通用组件 B3bList / B3bDetail
 * 路由基线（V-2）：/gems、/tools/palmistry、/knowledge/astrology-terms、
 *                  /podcast、/insights、/experts
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const B3bList = lazy(() => import('@/pages/wiki/batch3b/B3bList'));
const B3bDetail = lazy(() => import('@/pages/wiki/batch3b/B3bDetail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const BbRoutes = (
  <>
    {/* 水晶宝石图鉴 */}
    <Route path="/gems" element={wrap(<B3bList kind="b_crystal" />)} />
    <Route path="/gems/:gem_id" element={wrap(<B3bDetail kind="b_crystal" />)} />

    {/* 手相文化辞典（单页三主线） */}
    <Route path="/tools/palmistry" element={wrap(<B3bList kind="b_palmistry" />)} />

    {/* 占星百科 */}
    <Route path="/knowledge/astrology-terms" element={wrap(<B3bList kind="b_astrology_term" />)} />
    <Route
      path="/knowledge/astrology-terms/:term_id"
      element={wrap(<B3bDetail kind="b_astrology_term" />)}
    />

    {/* 民俗轻谈播客 */}
    <Route path="/podcast" element={wrap(<B3bList kind="b_podcast" />)} />
    <Route path="/podcast/:channel_id/:ep_id" element={wrap(<B3bDetail kind="b_podcast" />)} />

    {/* 节气运讯 */}
    <Route path="/insights" element={wrap(<B3bList kind="b_fortune" />)} />
    <Route path="/insights/:article_id" element={wrap(<B3bDetail kind="b_fortune" />)} />

    {/* 文化顾问团 */}
    <Route path="/experts" element={wrap(<B3bList kind="b_expert" />)} />
    <Route path="/experts/:expert_id" element={wrap(<B3bDetail kind="b_expert" />)} />
  </>
);
