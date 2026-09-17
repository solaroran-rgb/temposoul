import { memo } from 'react';

interface ReportSkeletonProps {
  dimensionCount?: number;
}

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #161B22 25%, #21262D 37%, #161B22 63%)',
  backgroundSize: '400% 100%',
  animation: 'report-skeleton-shimmer 1.4s ease infinite',
  borderRadius: 12,
};

function ReportSkeletonBase({ dimensionCount = 10 }: ReportSkeletonProps) {
  return (
    <div
      className="report-skeleton"
      role="progressbar"
      aria-busy="true"
      aria-label="报告加载中"
      style={{ padding: '24px 16px', maxWidth: 880, margin: '0 auto' }}
    >
      <style>{`@keyframes report-skeleton-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}`}</style>
      <div style={{ ...shimmerStyle, height: 160, marginBottom: 20 }} />
      {Array.from({ length: dimensionCount }).map((_, i) => (
        <div key={i} style={{ ...shimmerStyle, height: 96, marginBottom: 12 }} />
      ))}
    </div>
  );
}

export const ReportSkeleton = memo(ReportSkeletonBase);
export default ReportSkeleton;
