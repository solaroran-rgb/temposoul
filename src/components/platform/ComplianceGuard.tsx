/**
 * D23-3 ｜ 批4 路由合规探针（运行时侧车组件）
 *
 * 设计说明（以主仓实际契约为准，对专家D原稿做了两处适配）：
 * 1. 原稿用 useMatches() 读 Route.handle；主仓 D23Routes/C23Routes 未注入 handle，
 *    且 batch4-routes.ts 已提供 matchRouteCompliance(pathname) 运行时匹配，
 *    故本组件改用 matchRouteCompliance，与路由树解耦，不要求任何 Route 加 handle。
 * 2. 原稿渲染 <Outlet/> 要求作为布局路由；主仓路由树由 A22/B22/C22/A23 多线程共享，
 *    改嵌套布局路由会侵入他人域。本组件为纯侧车（side-effect-only），在 App 布局层
 *    与 TrustBanner 并列挂载，渲染 null；页面级 PrivacyHint 由各页面自行渲染。
 *
 * 职责：
 * - 命中 BATCH4_ROUTES 的个人结果页（requiresNoindex=true）注入 robots=noindex meta；
 *   路由离开时移除。
 * - 命中表但配置自相矛盾（isPersonalResult=true 且 requiresNoindex!=true）时打点告警，
 *   不阻断渲染（避免白屏）。
 * - ComplianceErrorBoundary 兜底：合规探针自身异常不影响主页面。
 */
import { Component, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { matchRouteCompliance } from '@/config/batch4-routes';
import { trackEvent } from '@/lib/analytics';

interface GuardState {
  hasError: boolean;
}

class ComplianceErrorBoundary extends Component<{ children: ReactNode }, GuardState> {
  state: GuardState = { hasError: false };

  static getDerivedStateFromError(): GuardState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    trackEvent('compliance_guard_error', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

/** 注入的 noindex meta 句柄记录，避免重复插入与跨路由残留 */
let injectedMeta: HTMLMetaElement | null = null;

function removeInjectedMeta(): void {
  if (injectedMeta && document.head.contains(injectedMeta)) {
    document.head.removeChild(injectedMeta);
  }
  injectedMeta = null;
}

function ComplianceSidecar(): null {
  const location = useLocation();

  useEffect(() => {
    const meta = matchRouteCompliance(location.pathname);
    removeInjectedMeta();

    if (!meta) return;

    // 配置自相矛盾：个人结果页必须 noindex。打点告警但不阻断。
    if (meta.isPersonalResult && !meta.requiresNoindex) {
      trackEvent('compliance_violation_blocked', {
        path: location.pathname,
        violation: 'personal_result_missing_noindex',
      });
      return;
    }

    if (meta.requiresNoindex) {
      injectedMeta = document.createElement('meta');
      injectedMeta.name = 'robots';
      injectedMeta.content = 'noindex, nofollow';
      document.head.appendChild(injectedMeta);
    }

    return () => removeInjectedMeta();
  }, [location.pathname]);

  return null;
}

export function ComplianceGuard(): ReactNode {
  return (
    <ComplianceErrorBoundary>
      <ComplianceSidecar />
    </ComplianceErrorBoundary>
  );
}

export default ComplianceGuard;
