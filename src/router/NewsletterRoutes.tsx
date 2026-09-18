/**
 * Newsletter 路由：邮件订阅管理 /newsletter
 * 前端表单 + 状态；后端端点 /api/v1/newsletter[+/unsubscribe|/manage]。
 */
import { lazy, Suspense, type ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { RouteFallback } from '@/components/RouteFallback';

const NewsletterPage = lazy(() => import('@/pages/newsletter/NewsletterPage'));

function wrap(el: ReactNode) {
  return <Suspense fallback={<RouteFallback />}>{el}</Suspense>;
}

export const NewsletterRoutes = <Route path="/newsletter" element={wrap(<NewsletterPage />)} />;
