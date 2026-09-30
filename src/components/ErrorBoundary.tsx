import { Component, type ReactNode } from 'react';
import { reportClientError } from '@/lib/client/errlog';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // 转发到统一错误落点（仅生产、采样、不含个人信息）；不影响原渲染
    reportClientError({
      level: 'error',
      scope: 'ErrorBoundary',
      message: error.message || 'react render error',
      stack: error.stack,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback">
          <div className="error-boundary-card">
            <h2>页面出现了一些问题</h2>
            <p>请尝试刷新页面，或返回首页重新操作。</p>
            <div className="error-boundary-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
              <button
                type="button"
                className="secondary-page-button"
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
