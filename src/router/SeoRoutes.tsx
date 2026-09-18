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
  </>
);
