import { memo } from 'react';

export type ReportStatus =
  | 'pending'
  | 'generating'
  | 'compliance_check'
  | 'delivering'
  | 'fulfilled'
  | 'fulfilled_with_template'
  | 'refunded';

interface ReportStatusNoticeProps {
  status: ReportStatus;
}

const STATUS_TEXT: Record<ReportStatus, { label: string; hint: string; color: string }> = {
  pending: { label: '已排队', hint: '报告正在排队，请稍候。', color: '#D29922' },
  generating: { label: '生成中', hint: 'AI 正在生成你的十维报告。', color: '#D29922' },
  compliance_check: { label: '合规检查中', hint: '正在做合规与安全校验。', color: '#D29922' },
  delivering: { label: '交付中', hint: '正在交付，请稍候。', color: '#D29922' },
  fulfilled: { label: '已交付', hint: '', color: '#3FB950' },
  fulfilled_with_template: {
    label: '模板降级交付',
    hint: '本次以模板版交付，可联系客服补差价升级或退款。',
    color: '#D29922',
  },
  refunded: { label: '已退款', hint: '本报告已退款。', color: '#F85149' },
};

function ReportStatusNoticeBase({ status }: ReportStatusNoticeProps) {
  const item = STATUS_TEXT[status];
  if (!item || status === 'fulfilled') return null;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#161B22',
        border: '1px solid #30363D',
        borderRadius: 10,
        padding: '10px 14px',
        margin: '12px 0',
        color: '#E6EDF3',
        fontSize: 13,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: item.color,
          display: 'inline-block',
        }}
      />
      <strong style={{ color: item.color, fontWeight: 600 }}>{item.label}</strong>
      {item.hint ? <span style={{ color: '#8B949E' }}>{item.hint}</span> : null}
    </div>
  );
}

export const ReportStatusNotice = memo(ReportStatusNoticeBase);
export default ReportStatusNotice;
