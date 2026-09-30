/**
 * 报告 PDF 导出（客户端打印引擎）
 *
 * 选型理由见 docs/PDF导出说明.md：站点部署在 Cloudflare Pages（edge runtime），跑不了无头浏览器，
 * 因此正文走「同一份 DOM + 打印样式 → 浏览器打印 → 另存为 PDF」。这样版式与网页天然一致，
 * 中文字体走系统回退（站点无 @font-face），不会出现缺字/乱码。
 *
 * 服务端闸门在 POST /api/v1/report/export（鉴权 + 限流 + 类型校验）。
 */

export type ReportExportType = 'liunian' | 'hehun' | 'naming';

const TYPE_LABEL: Record<ReportExportType, string> = {
  liunian: '流年报告',
  hehun: '合婚报告',
  naming: '起名报告',
};

/** 文件名规范：命律-流年报告-<姓名>-<YYYYMMDD>.pdf */
export function buildExportFilename(type: ReportExportType, subject?: string): string {
  const safe = (subject ?? '').replace(/[\\/:*?"<>|\s]+/g, '').slice(0, 12);
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
  return `命律-${TYPE_LABEL[type]}${safe ? `-${safe}` : ''}-${stamp}.pdf`;
}

export type ExportGrantResult = 'granted' | 'unauthorized' | 'rate_limited' | 'failed';

/** 过服务端闸门：未登录 401 / 超限 429；未拿到授权时不展示导出入口。 */
export async function requestExportGrant(type: ReportExportType): Promise<ExportGrantResult> {
  try {
    const res = await fetch('/api/v1/report/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    if (res.status === 429) return 'rate_limited';
    if (res.status === 401) return 'unauthorized';
    return res.ok ? 'granted' : 'failed';
  } catch {
    return 'failed';
  }
}

/**
 * 打印当前报告页。用户在打印对话框里选「另存为 PDF」即可落 PDF。
 * 多数浏览器（Chrome/Edge）把 document.title 作为另存时的默认文件名，故打印前临时改标题。
 */
export function printReport(filename?: string): void {
  if (!filename) {
    window.print();
    return;
  }
  const prevTitle = document.title;
  document.title = filename;
  let timer = 0;
  const restore = () => {
    window.clearTimeout(timer);
    window.removeEventListener('afterprint', restore);
    document.title = prevTitle;
  };
  timer = window.setTimeout(restore, 120_000);
  window.addEventListener('afterprint', restore);
  window.print();
}
