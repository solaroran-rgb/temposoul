/**
 * A11-共享：页面 6 态机类型 + 出生参数解析（本地侧补建）
 * 对齐契约"页面六态"与 useFortuneCache 参数命名：
 * gender / dateType / year / month / day / timeIndex
 */
export type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export interface BirthInput {
  gender: 'male' | 'female';
  dateType: 'solar' | 'lunar';
  year: number;
  month: number;
  day: number;
  timeIndex: number;
}

/** 从 URL 查询串解析出生信息；缺参/非法返回 null */
export function parseBirthInput(sp: URLSearchParams): BirthInput | null {
  const gender = sp.get('gender');
  const dateType = sp.get('dateType');
  const year = Number(sp.get('year'));
  const month = Number(sp.get('month'));
  const day = Number(sp.get('day'));
  const timeIndex = Number(sp.get('timeIndex'));

  if (gender !== 'male' && gender !== 'female') return null;
  if (dateType !== 'solar' && dateType !== 'lunar') return null;
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(day) || day < 1 || day > 31) return null;
  if (!Number.isInteger(timeIndex) || timeIndex < 0 || timeIndex > 12) return null;

  return { gender, dateType, year, month, day, timeIndex };
}

/** 统一 API 错误格式化 */
export function formatApiError(err: unknown): string {
  if (!err) return '请求失败';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message || '请求失败';
  const o = err as { error?: { message?: string }; message?: string };
  if (typeof o?.error?.message === 'string') return o.error.message;
  if (typeof o?.message === 'string') return o.message;
  return '请求失败';
}
