import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ReportErrorBoundaryProps {
  reportId?: string;
  children: ReactNode;
}

interface ReportErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ReportErrorBoundary extends Component<
  ReportErrorBoundaryProps,
  ReportErrorBoundaryState
> {
  state: ReportErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ReportErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'unknown';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    // 不上报 error.stack 到埋点，只上报 reportId 与 message
    try {
      // 延迟 import 防循环依赖
      void import('../../lib/analytics/report-events').then((mod) => {
        mod.trackReportLoadError({
          reportId: this.props.reportId || 'unknown',
          reason: `boundary:${error instanceof Error ? error.message : 'unknown'}`,
        });
      });
    } catch {
      /* ignore */
    }
    console.warn('[ReportErrorBoundary]', info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        role="alert"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: 24,
          color: '#E6EDF3',
          background: '#0D1117',
          border: '1px solid #30363D',
          borderRadius: 12,
        }}
      >
        <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>报告加载遇到问题</h2>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.7 }}>
          请刷新页面或稍后再试。如问题持续，请通过页脚联系方式反馈。
        </p>
      </div>
    );
  }
}

export default ReportErrorBoundary;
