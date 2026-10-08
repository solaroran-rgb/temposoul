/**
 * 线程 C · SEO 内容路由
 *
 * 挂载方式：在 src/App.tsx 中
 *   import { SeoRoutes } from '@/router/SeoRoutes';
 * 并在 <Routes> 内与其他 *Routes 并列处追加 {SeoRoutes}。
 *
 * 路由清单：
 *   /seo                 全部列表
 *   /seo/bazi            八字主题列表（静态段优先于详情 :slug）
 *   /seo/ziwei           紫微主题列表
 *   /seo/tarot           塔罗主题列表
 *   /seo/astrology       星座占星列表
 *   /seo/naming          姓名学列表
 *   /seo/almanac         老黄历列表
 *   /seo/zodiac          生肖列表
 *   /seo/fengshui        风水列表
 *   /seo/:slug           文章详情
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';
import type { SeoTopic } from '@/data/content/seo50';

const SeoListPage = lazy(() => import('@/pages/seo/SeoListPage'));
const SeoDetailPage = lazy(() => import('@/pages/seo/SeoDetailPage'));
/* E-12 门户层重审：4 个 L1 门户页（/academy /stars /living /plus）。
 * 挂载于本模块（App.tsx 已 import {SeoRoutes} 且处于他人未提交改动中，
 * 本批零连带提交纪律：不触碰 App.tsx 脏文件，门户路由在此注册）。
 * 路由均在 ia-navigation.json 中 approved → existing（E-12），并已入 route-table.json。 */
const AcademyPage = lazy(() => import('@/pages/portal/AcademyPage').then((m) => ({ default: m.AcademyPage })));
const StarsPage = lazy(() => import('@/pages/portal/StarsPage').then((m) => ({ default: m.StarsPage })));
const LivingPage = lazy(() => import('@/pages/portal/LivingPage').then((m) => ({ default: m.LivingPage })));
const PlusPage = lazy(() => import('@/pages/portal/PlusPage').then((m) => ({ default: m.PlusPage })));

function wrap(el: ReactNode): ReactNode {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

const topicPath: SeoTopic[] = [
  'bazi',
  'ziwei',
  'tarot',
  'astrology',
  'naming',
  'almanac',
  'zodiac',
  'fengshui',
];

export const SeoRoutes = (
  <>
    <Route path="/seo" element={wrap(<SeoListPage />)} />
    {topicPath.map((t) => (
      <Route key={t} path={`/seo/${t}`} element={wrap(<SeoListPage topic={t} />)} />
    ))}
    <Route path="/seo/:slug" element={wrap(<SeoDetailPage />)} />
    {/* E-12 门户层重审：4 L1 门户路由（E-12 批准，153 冻结外最小新增） */}
    <Route path="/academy" element={wrap(<AcademyPage />)} />
    <Route path="/stars" element={wrap(<StarsPage />)} />
    <Route path="/living" element={wrap(<LivingPage />)} />
    <Route path="/plus" element={wrap(<PlusPage />)} />
  </>
);
