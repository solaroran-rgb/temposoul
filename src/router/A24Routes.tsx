/**
 * A24 路由：A 域（排盘深化/命理专题）280 路由
 * 静态 14 + 动态 266（十神10/神煞12/四化56/格局15/限年3/行运2/宫星168）
 * 挂载方式参照 A23Routes：lazy + Suspense(<RouteFallback/>) + Route；由 App.tsx 聚合
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const B2List = lazy(() => import('@/pages/wiki/batch2/B2List'));
const B2Detail = lazy(() => import('@/pages/wiki/batch2/B2Detail'));

/** 静态页（overview/guide/faq/tool 等）：复用对应 kind 列表或详情 */
function StaticPage({ kind, title, desc }: { kind: 'ten_gods' | 'shen_sha' | 'four_transform' | 'ziwei_patterns' | 'limit_year' | 'transits' | 'palace_star'; title: string; desc: string }) {
  return <B2List kind={kind} title={title} desc={desc} />;
}

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const A24Routes = (
  <>
    {/* ── 静态 14 ── */}
    <Route path="/wiki/ten-gods" element={wrap(<B2List kind="ten_gods" />)} />
    <Route path="/wiki/shen-sha" element={wrap(<B2List kind="shen_sha" />)} />
    <Route path="/wiki/four-transform" element={wrap(<B2List kind="four_transform" />)} />
    <Route path="/wiki/ziwei-patterns" element={wrap(<B2List kind="ziwei_patterns" />)} />
    <Route path="/wiki/palace-star" element={wrap(<B2List kind="palace_star" />)} />
    <Route path="/wiki/limit-year-guide" element={wrap(<B2List kind="limit_year" />)} />
    <Route path="/wiki/transits" element={wrap(<B2List kind="transits" />)} />
    <Route path="/wiki/solar-return" element={wrap(<B2List kind="transits" title="太阳返照" desc="太阳返照的概念与解读框架" />)} />
    <Route path="/tools/limit-year" element={wrap(<StaticPage kind="limit_year" title="紫微限年工具" desc="大限小限流年查询入口" />)} />
    <Route path="/tools/solar-return" element={wrap(<StaticPage kind="transits" title="太阳返照查询工具" desc="太阳返照盘查询入口" />)} />
    <Route path="/wiki/limit-year-guide/faq" element={wrap(<StaticPage kind="limit_year" title="限年工具常见问题" desc="限年工具使用常见问题与口径说明" />)} />
    <Route path="/wiki/four-transform/pairs" element={wrap(<StaticPage kind="four_transform" title="十干四化配对表" desc="十干生年四化配对表，标注为参考维度" />)} />
    <Route path="/wiki/palace-star/overview" element={wrap(<StaticPage kind="palace_star" title="紫微十二宫与主星总览" desc="12 宫位与 14 主星对应总览" />)} />
    <Route path="/wiki/four-transform/overview" element={wrap(<StaticPage kind="four_transform" title="四化体系总览" desc="四化含义与十四主星对应关系总览" />)} />

    {/* ── 动态列表（与静态列表同组件，kind 相同） ── */}
    {/* 十神 / 神煞 / 四化 / 格局 详情 */}
    <Route path="/wiki/ten-gods/:id" element={wrap(<B2Detail kind="ten_gods" />)} />
    <Route path="/wiki/shen-sha/:id" element={wrap(<B2Detail kind="shen_sha" />)} />
    <Route path="/wiki/four-transform/:id" element={wrap(<B2Detail kind="four_transform" />)} />
    <Route path="/wiki/ziwei-patterns/:id" element={wrap(<B2Detail kind="ziwei_patterns" />)} />

    {/* 限年详情 */}
    <Route path="/wiki/limit-year/:id" element={wrap(<B2Detail kind="limit_year" />)} />

    {/* 行运/太阳返照静态详情 */}
    <Route path="/wiki/transits/detail" element={wrap(<B2Detail kind="transits" />)} />
    <Route path="/wiki/solar-return/detail" element={wrap(<B2Detail kind="transits" />)} />

    {/* 宫星 168 详情 */}
    <Route path="/wiki/palace-star/:id" element={wrap(<B2Detail kind="palace_star" />)} />
  </>
);
