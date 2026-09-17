// src/lib/api-adapter.ts
// 集中契约不确定字段。R4 前本地侧核对 NatalPage.tsx / ZiweiScopeSwitcher.tsx 后仅改此文件。
// IT-8-3：Natal 请求体嵌套结构。IT-8-2：BirthInput 字段。
import type { BirthInput } from '@/types/page-state';

// ---------- 出生信息解析（本地实现，规避 parseBirthInput(URLSearchParams) 签名） ----------
export function parseInputToBirth(input: string): BirthInput | null {
  const m = input.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return null;
  const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
  if (!Number.isFinite(year) || year < 1900 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  // timeIndex defaults to 6 (午时) if not extractable
  return { gender: 'male', dateType: 'solar', year, month, day, timeIndex: 6 };
}

// ---------- 限年解析 ----------
export type LimitScope = 'decadal' | 'yearly';

export interface LimitSlice {
  index: number;
  range: string;
  palace: string;
}

export function buildLimitsRequest(input: BirthInput, scope: LimitScope): unknown {
  return {
    dateType: input.dateType,
    year: input.year, month: input.month, day: input.day,
    timeIndex: input.timeIndex,
    scope,
  };
}

export function parseLimitsResponse(raw: unknown): LimitSlice[] {
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const arr = obj.slices;
  if (!Array.isArray(arr)) return [];
  const out: LimitSlice[] = [];
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (typeof o.index === 'number' && typeof o.range === 'string' && typeof o.palace === 'string') {
      out.push({ index: o.index, range: o.range, palace: o.palace });
    }
  }
  return out;
}

// ---------- 行运/返照 ----------
export interface NatalPayload {
  summary: string;
  transits: string[];
  solarReturn: string;
}

export function buildNatalRequest(input: BirthInput): unknown {
  return {
    dateType: input.dateType,
    year: input.year, month: input.month, day: input.day,
    timeIndex: input.timeIndex,
    ttlScope: 'natal',
  };
}

export function parseNatalResponse(raw: unknown): NatalPayload {
  const out: NatalPayload = { summary: '', transits: [], solarReturn: '' };
  if (!raw || typeof raw !== 'object') return out;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.summary === 'string') out.summary = obj.summary;
  if (Array.isArray(obj.transits)) {
    out.transits = obj.transits.filter((x): x is string => typeof x === 'string');
  }
  if (typeof obj.solarReturn === 'string') out.solarReturn = obj.solarReturn;
  return out;
}
