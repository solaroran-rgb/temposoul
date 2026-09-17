
// A9-共享 · djb2 同步哈希 + 站点 origin（零依赖零异步）
export function djb2(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

export function buildBirthSignature(p: {
  dateType: string; year: number; month: number; day: number; timeIndex: number;
}): string {
  return djb2(`${p.dateType}|${p.year}|${p.month}|${p.day}|${p.timeIndex}`);
}

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const FALLBACK_ORIGIN = 'https://temposoul.pages.dev';

export function getSiteOrigin(): string {
  if (typeof window !== 'undefined' && typeof window.location === 'object') {
    const o = window.location.origin;
    if (typeof o === 'string' && o.startsWith('http')) return o;
  }
  return FALLBACK_ORIGIN;
}

export function safeParseIntBase36(str: string): number | null {
  const n = parseInt(str, 36);
  return Number.isFinite(n) ? n : null;
}

