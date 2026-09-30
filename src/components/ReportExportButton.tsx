import { useState } from 'react';
import {
  buildExportFilename,
  printReport,
  requestExportGrant,
  type ReportExportType,
} from '../lib/report/pdf-export';

interface ReportExportButtonProps {
  /** 报告类型：liunian 流年 / hehun 合婚 / naming 起名 */
  type: ReportExportType;
  /** 报告主体名（姓名等），用于文件名；不传则文件名省略该段 */
  subject?: string;
  disabled?: boolean;
}

const DENY_HINT: Record<string, string> = {
  unauthorized: '请先登录后再导出报告',
  rate_limited: '导出过于频繁，请稍后再试',
  failed: '导出服务暂不可用，请稍后重试',
};

/** 报告页统一导出入口：先过服务端鉴权/限流闸门，再触发打印另存为 PDF。 */
export function ReportExportButton({
  type,
  subject,
  disabled,
}: ReportExportButtonProps): React.ReactElement {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    setHint(null);
    const grant = await requestExportGrant(type);
    if (grant !== 'granted') {
      setHint(DENY_HINT[grant] ?? '导出失败');
      setBusy(false);
      return;
    }
    printReport(buildExportFilename(type, subject));
    setBusy(false);
  };

  return (
    <span className="report-export">
      <button
        type="button"
        className="ts-btn ts-btn--ghost"
        onClick={onClick}
        disabled={disabled || busy}
        data-testid="report-export-btn"
      >
        {busy ? '准备导出…' : '导出 PDF'}
      </button>
      {hint && (
        <span className="report-export__hint" role="status">
          {hint}
        </span>
      )}
    </span>
  );
}
