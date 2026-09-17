export type NameEvent =
  'trackNameTestSubmit' | 'trackNameGenerate' | 'trackNameReportOpen' | 'trackNameShare';

export function trackName(event: NameEvent, payload: Record<string, unknown> = {}): void {
  try {
    void import('../../../lib/analytics').then((mod: Record<string, unknown>) => {
      // GC-12：真实导出为 trackEvent(name, props)，无 track；动态探测 trackEvent，静默降级
      const fn =
        (
          mod as {
            trackEvent?: (n: string, p: unknown) => void;
            track?: (n: string, p: unknown) => void;
          }
        ).trackEvent ?? (mod as { track?: (n: string, p: unknown) => void }).track;
      if (typeof fn === 'function') fn(event, { domain: 'onomastics', ...payload });
    });
  } catch {
    /* 埋点失败不影响主流程 */
  }
}
