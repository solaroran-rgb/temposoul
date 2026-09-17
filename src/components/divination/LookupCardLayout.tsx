import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import './LookupCardLayout.css';

export type LookupState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

interface LookupCardLayoutProps {
  title: string;
  state: LookupState;
  renderPicker: () => ReactNode;
  renderResult: () => ReactNode;
  emptyMessages?: Partial<Record<Exclude<LookupState, 'ok'>, string>>;
  footer?: ReactNode;
  topCallout?: ReactNode;
  skeletonRows?: number;
  onBack?: () => void;
}

const DEFAULT_MESSAGES: Record<Exclude<LookupState, 'ok'>, string> = {
  idle: '请选择条件',
  loading: '加载中',
  'ok-empty': '暂无可用数据',
  degraded: '服务降级中，请稍后重试',
  error: '加载失败，请重试',
};

export function LookupCardLayout({
  title,
  state,
  renderPicker,
  renderResult,
  emptyMessages,
  footer,
  topCallout,
  skeletonRows = 3,
  onBack,
}: LookupCardLayoutProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const msg = emptyMessages?.[state as Exclude<LookupState, 'ok'>] ?? DEFAULT_MESSAGES[state as Exclude<LookupState, 'ok'>];

  return (
    <div className="lookup-card-layout">
      <PageTopbar title={title} onBack={handleBack} />
      {topCallout && <div className="lookup-top-callout">{topCallout}</div>}
      <div className="lookup-picker">{renderPicker()}</div>
      <div className="lookup-body">
        {state === 'loading' && (
          <div className="skeleton">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className="skeleton-row" />
            ))}
          </div>
        )}
        {state === 'ok' && renderResult()}
        {state === 'ok-empty' && <div className="lookup-empty">{msg}</div>}
        {state === 'degraded' && <div className="lookup-degraded">{msg}</div>}
        {state === 'error' && <div className="lookup-error">{msg}</div>}
        {state === 'idle' && <div className="lookup-idle">{msg}</div>}
      </div>
      <div className="lookup-footer">{footer ?? <PrivacyHint />}</div>
    </div>
  );
}
