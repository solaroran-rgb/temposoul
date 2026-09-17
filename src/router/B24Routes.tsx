/**
 * B24 路由：B/C/D 域 458 路由（历法星象 50 + 占卜民俗 384 + 西占姓名 24）
 * 静态列表 11 + 动态详情 458 均复用 B2List/B2Detail 通用组件
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const B2List = lazy(() => import('@/pages/wiki/batch2/B2List'));
const B2Detail = lazy(() => import('@/pages/wiki/batch2/B2Detail'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const B24Routes = (
  <>
    {/* ── B 域：历法星象（50） ── */}
    <Route path="/wiki/solar-terms" element={wrap(<B2List kind="solar_terms" />)} />
    <Route path="/wiki/solar-terms/:id" element={wrap(<B2Detail kind="solar_terms" />)} />
    <Route path="/wiki/ziwei-stars" element={wrap(<B2List kind="ziwei_stars_b" />)} />
    <Route path="/wiki/ziwei-stars/:id" element={wrap(<B2Detail kind="ziwei_stars_b" />)} />
    <Route path="/wiki/palaces" element={wrap(<B2List kind="palaces_b" />)} />
    <Route path="/wiki/palaces/:id" element={wrap(<B2Detail kind="palaces_b" />)} />

    {/* ── C 域：占卜民俗（384） ── */}
    <Route path="/wiki/bone_weight" element={wrap(<B2List kind="bone_weight" />)} />
    <Route path="/wiki/bone_weight/:id" element={wrap(<B2Detail kind="bone_weight" />)} />
    <Route path="/wiki/tarot/cards" element={wrap(<B2List kind="tarot" />)} />
    <Route path="/wiki/tarot/cards/:id" element={wrap(<B2Detail kind="tarot" />)} />
    <Route path="/wiki/dream" element={wrap(<B2List kind="dream_dict" />)} />
    <Route path="/wiki/dream/:id" element={wrap(<B2Detail kind="dream_dict" />)} />
    <Route path="/wiki/iching" element={wrap(<B2List kind="iching" />)} />
    <Route path="/wiki/iching/:id" element={wrap(<B2Detail kind="iching" />)} />
    <Route path="/wiki/number-divination" element={wrap(<B2List kind="number_divination" />)} />
    <Route path="/wiki/number-divination/:id" element={wrap(<B2Detail kind="number_divination" />)} />
    <Route path="/tools/love-divination/result" element={wrap(<B2List kind="love_divination" />)} />
    <Route path="/tools/love-divination/result/:id" element={wrap(<B2Detail kind="love_divination" />)} />

    {/* ── D 域：西占姓名（24） ── */}
    <Route path="/wiki/zodiac/encyclopedia" element={wrap(<B2List kind="zodiac_encyclopedia" />)} />
    <Route path="/wiki/zodiac/encyclopedia/:id" element={wrap(<B2Detail kind="zodiac_encyclopedia" />)} />
    <Route path="/wiki/zodiac/personality" element={wrap(<B2List kind="zodiac_personality" />)} />
    <Route path="/wiki/zodiac/personality/:id" element={wrap(<B2Detail kind="zodiac_personality" />)} />
  </>
);
