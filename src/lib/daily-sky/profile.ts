// src/lib/daily-sky/profile.ts
// 每日星象 · 生日档案（渐进披露 D1/D2/D3，规格 §4 冻结接口）。
// 不强迫、可删除：档案存 localStorage `daily-sky:profile`，提供 clearProfile。

const PROFILE_KEY = 'daily-sky:profile';

/** 生日档案：全部可选，渐进披露，可随时删除。 */
export interface DailySkyProfile {
  nickname?: string;
  timeZone?: string;
  /** YYYY-MM-DD */
  birthday?: string;
  /** HH:mm */
  birthTime?: string;
}

export interface ProfileStep {
  key: 'D1' | 'D2' | 'D3';
  /** 该档需要补齐的档案字段 */
  need: Array<keyof DailySkyProfile>;
  /** 展示给用户的渐进披露引导文案 */
  prompt: string;
}

/** 渐进披露三档（规格 §4 冻结文案）。 */
export const PROFILE_STEPS: ProfileStep[] = [
  { key: 'D1', need: ['nickname', 'timeZone'], prompt: '怎么称呼你？所在时区？' },
  { key: 'D2', need: ['birthday'], prompt: '你的生日（可选）——让今日款更懂你' },
  { key: 'D3', need: ['birthTime'], prompt: '出生时间（可选）——用于真实天象宫位' },
];

/** localStorage 环境兜底（同 dailyKey.ts，保持模块自洽）。 */
function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* 隐私模式 / SSR / 单测环境 */
  }
  return null;
}

/** 读取档案；损坏或不可用时返回空对象，绝不抛错。 */
export function getProfile(): DailySkyProfile {
  const s = storage();
  if (!s) return {};
  try {
    const raw = s.getItem(PROFILE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DailySkyProfile;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** 保存档案（整体覆盖）。 */
export function saveProfile(p: DailySkyProfile): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(PROFILE_KEY, JSON.stringify(p || {}));
  } catch {
    /* 隐私模式写入失败静默降级 */
  }
}

/** 删除档案（不强迫：用户可随时清空）。 */
export function clearProfile(): void {
  const s = storage();
  if (!s) return;
  try {
    s.removeItem(PROFILE_KEY);
  } catch {
    /* ignore */
  }
}

export type ProfileStepKey = 'D1' | 'D2' | 'D3' | 'done';

/**
 * 计算下一档待披露步骤：返回第一个「未填齐」的档位 key；三档皆齐返回 'done'。
 * D2/D3 为可选项——是否展示引导由 UI 层决定，此函数只给出缺口状态。
 */
export function nextStep(profile: DailySkyProfile | null | undefined): ProfileStepKey {
  const p = profile ?? {};
  for (const step of PROFILE_STEPS) {
    const missing = step.need.some((k) => {
      const v = p[k];
      return typeof v !== 'string' || v.trim() === '';
    });
    if (missing) return step.key;
  }
  return 'done';
}
