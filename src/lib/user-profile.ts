// H02 · 档案一次录入
// src/lib/user-profile.ts
// 用户档案（UserProfile）↔ 排盘输入（QueryInputState）双向适配层。
// 目标：用户一次录入生辰八字，所有排盘（八字/紫微/星盘/风水）自动复用，无需重复输入。
import type { UserProfile } from '@/types/profile';
import {
  buildResultSearch,
  defaultInputState,
  defaultPromptState,
  type QueryInputState,
} from '@/lib/query-state';

const DEFAULT_TIMEZONE = 'Asia/Shanghai';

/** 档案 → 排盘输入表单状态（进入输入页时自动预填用） */
export function profileToInputState(profile: UserProfile): Partial<QueryInputState> {
  const patch: Partial<QueryInputState> = {
    name: profile.name,
    gender: profile.gender === 'female' ? 'female' : 'male',
    dateType: profile.dateType,
    year: String(profile.year),
    month: String(profile.month),
    day: String(profile.day),
    timeIndex: profile.timeIndex,
    isLeapMonth: false,
  };

  if (profile.location) {
    patch.birthPlace = profile.location.cityName;
    patch.birthLongitude = String(profile.location.longitude);
    patch.birthLatitude = String(profile.location.latitude);
  }

  return patch;
}

/** 排盘输入表单 → 档案（保存/更新档案用；existing 存在时继承关系与默认标记） */
export function inputStateToProfile(
  input: QueryInputState,
  existing?: UserProfile,
): Omit<UserProfile, 'id'> {
  const name = input.name.trim();
  return {
    name: name || existing?.name || '我的档案',
    relation: existing?.relation ?? 'self',
    isDefault: existing?.isDefault ?? false,
    gender: input.gender,
    dateType: input.dateType,
    year: Number(input.year) || existing?.year || 1990,
    month: Number(input.month) || existing?.month || 1,
    day: Number(input.day) || existing?.day || 1,
    timeIndex: typeof input.timeIndex === 'number' ? input.timeIndex : existing?.timeIndex ?? 0,
    location: buildLocation(input),
  };
}

/** 表单是否具备完整生辰（可建档 / 可提交排盘） */
export function hasCompleteBirthData(input: QueryInputState): boolean {
  if (input.year === '' || input.month === '' || input.day === '') {
    return false;
  }
  if (input.useTrueSolarTime) {
    return input.birthHour !== '' && input.birthMinute !== '';
  }
  return input.timeIndex !== '';
}

/** 档案 → 一键排盘跳转参数（档案页“一键排盘”入口用） */
export function profileToResultSearch(profile: UserProfile): string {
  const input: QueryInputState = {
    ...defaultInputState,
    ...profileToInputState(profile),
  };
  return buildResultSearch(input, {
    ...defaultPromptState,
    tab: 'bazi',
    promptSource: 'bazi',
  });
}

/** 档案摘要（列表展示用） */
export function formatProfileSummary(profile: UserProfile): string {
  const date = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(
    profile.day,
  ).padStart(2, '0')}`;
  const dateLabel = profile.dateType === 'lunar' ? `农历 ${date}` : `公历 ${date}`;
  const genderLabel = profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '';
  return [dateLabel, genderLabel].filter(Boolean).join(' · ');
}

function buildLocation(
  input: QueryInputState,
): UserProfile['location'] {
  if (!input.birthPlace.trim() || !input.birthLongitude || !input.birthLatitude) {
    return undefined;
  }
  const longitude = Number(input.birthLongitude);
  const latitude = Number(input.birthLatitude);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
    return undefined;
  }
  return {
    cityName: input.birthPlace.trim(),
    longitude,
    latitude,
    timeZoneId: DEFAULT_TIMEZONE,
  };
}
