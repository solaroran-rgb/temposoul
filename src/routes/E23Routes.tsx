import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';

const TenDimReportPage = lazy(() => import('../pages/reports/TenDimReportPage'));
const RefundPage = lazy(() => import('../pages/platform/RefundPage'));

const RouteFallback = () => (
  <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
    <div
      className="skeleton-line"
      style={{ height: '24px', width: '60%', margin: '0 auto 16px' }}
    ></div>
    <div className="skeleton-line" style={{ height: '16px', width: '80%', margin: '0 auto' }}></div>
  </div>
);

/**
 * E23 路由模块：报告类路由统一 /reports/*（裁决共识 B4-C-01，禁止 /ai/*）。
 * 含退款申诉页 /refund（FTC 一键取消 + 7 天退款申诉）。
 * 与现有 {A22Routes}{b22Routes}{c22Routes}{A23Routes}{B23Routes}{C23Routes}{D23Routes} 并列挂载。
 */
export const E23Routes = (
  <>
    <Route
      path="/reports/ten-dim"
      element={
        <Suspense fallback={<RouteFallback />}>
          <TenDimReportPage />
        </Suspense>
      }
    />
    <Route
      path="/refund"
      element={
        <Suspense fallback={<RouteFallback />}>
          <RefundPage />
        </Suspense>
      }
    />
  </>
);

export default E23Routes;
