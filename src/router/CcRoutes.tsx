/**
 * Cc 路由：批3b C 域 6 项内容轻娱乐路由
 * 格局详解库 / 塔罗学习 / 行星星座百科 / 国学典籍 / 育儿占星 / 星历表
 * 5 个列表+详情 + 1 个工具页 = 11 条 Route
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const CcList = lazy(() => import('@/pages/wiki/batch3c/CcList'));
const CcDetail = lazy(() => import('@/pages/wiki/batch3c/CcDetail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const CcRoutes = (
  <>
    {/* C-1 格局详解库（10 条详情） */}
    <Route
      path="/knowledge/ziwei/pattern-extended"
      element={wrap(<CcList kind="c_pattern_extended" />)}
    />
    <Route
      path="/knowledge/ziwei/pattern-extended/:id"
      element={wrap(<CcDetail kind="c_pattern_extended" />)}
    />

    {/* C-2 塔罗学习（19 课详情） */}
    <Route path="/learn/tarot/curriculum" element={wrap(<CcList kind="c_tarot_curriculum" />)} />
    <Route
      path="/learn/tarot/curriculum/:id"
      element={wrap(<CcDetail kind="c_tarot_curriculum" />)}
    />

    {/* C-3 行星星座百科（27 条详情） */}
    <Route path="/knowledge/astrology/terms" element={wrap(<CcList kind="c_astrology_terms" />)} />
    <Route
      path="/knowledge/astrology/terms/:id"
      element={wrap(<CcDetail kind="c_astrology_terms" />)}
    />

    {/* C-4 国学典籍（10 部详情）— 改路径避免与 C22Routes /knowledge/classics 冲突 */}
    <Route path="/knowledge/classics-guide" element={wrap(<CcList kind="c_classics_guide" />)} />
    <Route path="/knowledge/classics-guide/:id" element={wrap(<CcDetail kind="c_classics_guide" />)} />

    {/* C-5 育儿占星（12 档详情） */}
    <Route path="/knowledge/parenting" element={wrap(<CcList kind="c_parenting_astrology" />)} />
    <Route
      path="/knowledge/parenting/:id"
      element={wrap(<CcDetail kind="c_parenting_astrology" />)}
    />

    {/* C-6 星历表（单工具页，无详情） */}
    <Route path="/tools/ephemeris" element={wrap(<CcList kind="c_ephemeris" />)} />
  </>
);
