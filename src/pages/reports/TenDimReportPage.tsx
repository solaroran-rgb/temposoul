import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReportSkeleton } from '../../components/reports/ReportSkeleton';
import { ReportErrorBoundary } from '../../components/reports/ReportErrorBoundary';
import { ReportStatusNotice, type ReportStatus } from '../../components/reports/ReportStatusNotice';
import { DimensionCard, type DimensionData } from '../../components/reports/DimensionCard';
import { PaywallGate } from '../../components/reports/PaywallGate';
import { ReportSummaryShare, type SharePage } from '../../components/reports/ReportSummaryShare';
import { DisclaimerInline } from '../../components/reports/DisclaimerInline';
import {
  trackReportView,
  trackReportDimensionExpand,
  trackReportEvidenceToggle,
  trackReportPlainToggle,
  trackReportShareOpen,
  trackReportShareDownload,
  trackReportPaywallView,
  trackReportWaitlistSubmit,
  trackReportLoadError,
  trackReportStatusChange,
} from '../../lib/analytics/report-events';
import { getAuthToken } from '../../lib/auth/token';

interface ReportTaskResponse {
  id: string;
  status: ReportStatus;
  tier: 'free' | 'premium';
  dimensions?: DimensionData[];
  share?: SharePage[];
  error?: string;
}

// 认证 token 统一走 lib/auth/token（ND-1 修复），隐私模式安全
const POLL_INTERVAL_MS = 3000;

function safeGetToken(): string | null {
  return getAuthToken();
}

async function fetchReport(id: string): Promise<ReportTaskResponse> {
  const token = safeGetToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`/api/v1/report-task?id=${encodeURIComponent(id)}`, { headers });
  if (!res.ok) throw new Error(`http_${res.status}`);
  return (await res.json()) as ReportTaskResponse;
}

const TERMINAL_STATUSES: ReadonlySet<ReportStatus> = new Set<ReportStatus>([
  'fulfilled',
  'fulfilled_with_template',
  'refunded',
]);

function TenDimReportInner() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') || '';

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [data, setData] = useState<ReportTaskResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const viewedRef = useRef(false);
  const lastStatusRef = useRef<ReportStatus | null>(null);

  useEffect(() => {
    if (!reportId) {
      setState('error');
      setErrorMsg('缺少报告 id');
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const res = await fetchReport(reportId);
        if (cancelled) return;

        setData(res);

        if (!viewedRef.current) {
          viewedRef.current = true;
          trackReportView({ reportId, tier: res.tier });
        }

        if (lastStatusRef.current && lastStatusRef.current !== res.status) {
          trackReportStatusChange({
            reportId,
            from: lastStatusRef.current,
            to: res.status,
          });
        }
        lastStatusRef.current = res.status;

        if (TERMINAL_STATUSES.has(res.status)) {
          setState('ready');
          return;
        }

        setState('ready');
        timer = window.setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err: unknown) {
        if (cancelled) return;
        const reason = err instanceof Error ? err.message : 'unknown';
        setState('error');
        setErrorMsg(reason);
        trackReportLoadError({ reportId, reason });
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [reportId]);

  const dimensions = useMemo<DimensionData[]>(() => data?.dimensions || [], [data]);
  const sharePages = useMemo<SharePage[]>(() => data?.share || [], [data]);

  const handleEvidenceToggle = useCallback(
    (key: string, open: boolean) => trackReportEvidenceToggle({ reportId, dimension: key, open }),
    [reportId],
  );

  const handlePlainToggle = useCallback(
    (key: string, on: boolean) => trackReportPlainToggle({ reportId, dimension: key, on }),
    [reportId],
  );

  const handleDimensionExpand = useCallback(
    (key: string) => trackReportDimensionExpand({ reportId, dimension: key }),
    [reportId],
  );

  const handleShareOpen = useCallback(
    (page: number) => trackReportShareOpen({ reportId, page }),
    [reportId],
  );

  const handleShareDownload = useCallback(
    (page: number) => trackReportShareDownload({ reportId, page }),
    [reportId],
  );

  const handlePaywallView = useCallback(
    (reason: string) => trackReportPaywallView({ reportId, reason }),
    [reportId],
  );

  const handleWaitlist = useCallback((domain: string) => {
    trackReportWaitlistSubmit({ source: 'report_waitlist', domain });
  }, []);

  if (state === 'loading') return <ReportSkeleton dimensionCount={10} />;

  if (state === 'error') {
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, color: '#E6EDF3' }}>
        <h1 style={{ fontSize: 18 }}>报告暂时不可用</h1>
        <p style={{ color: '#8B949E', fontSize: 13 }}>原因：{errorMsg}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, color: '#E6EDF3' }}>
        <h1 style={{ fontSize: 18 }}>报告数据为空</h1>
      </div>
    );
  }

  if (data.status === 'refunded') {
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 20, color: '#E6EDF3', marginBottom: 8 }}>十维深度报告</h1>
        <ReportStatusNotice status={data.status} />
        <PaywallGate
          reportId={reportId}
          reason="refunded"
          onView={handlePaywallView}
          onWaitlistSubmit={handleWaitlist}
        />
      </div>
    );
  }

  const hasPaidContent = data.tier === 'premium' && dimensions.length > 0;
  const isPending = !TERMINAL_STATUSES.has(data.status) && data.status !== 'fulfilled';

  if (!hasPaidContent) {
    const reason = isPending ? 'pending_payment' : 'locked';
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 20, color: '#E6EDF3', marginBottom: 8 }}>十维深度报告</h1>
        <ReportStatusNotice status={data.status} />
        <DisclaimerInline variant="report" />
        <PaywallGate
          reportId={reportId}
          reason={reason}
          onView={handlePaywallView}
          onWaitlistSubmit={handleWaitlist}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '24px 16px' }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, color: '#E6EDF3', margin: '0 0 6px' }}>十维深度报告</h1>
        <p style={{ color: '#8B949E', fontSize: 13, margin: 0 }}>
          理解生命的规律，而不是预测命运。
        </p>
        <ReportStatusNotice status={data.status} />
        <DisclaimerInline variant="report" />
      </header>

      <section aria-label="维度列表">
        {dimensions.map((dim) => (
          <div
            key={dim.key}
            onClick={() => handleDimensionExpand(dim.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDimensionExpand(dim.key);
              }
            }}
            role="presentation"
          >
            <DimensionCard
              data={dim}
              onEvidenceToggle={handleEvidenceToggle}
              onPlainToggle={handlePlainToggle}
            />
          </div>
        ))}
      </section>

      {sharePages.length > 0 ? (
        <section aria-label="分享卡" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, color: '#E6EDF3' }}>分享摘要</h2>
          <ReportSummaryShare
            reportId={reportId}
            pages={sharePages}
            onOpen={handleShareOpen}
            onDownload={handleShareDownload}
          />
        </section>
      ) : null}

      <footer style={{ marginTop: 24 }}>
        <DisclaimerInline variant="dimension" />
      </footer>
    </div>
  );
}

export default function TenDimReportPage() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('id') || '';
  return (
    <ReportErrorBoundary reportId={reportId}>
      <TenDimReportInner />
    </ReportErrorBoundary>
  );
}
