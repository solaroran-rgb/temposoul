import type { DisclaimerKey, LFErrorCode } from './lightfun.types';

export const DISCLAIMER_PACK: Record<DisclaimerKey, string> = {
  general: '本内容仅供文化娱乐参考，不构成任何专业建议。',
  health: '不构成诊断；如有持续不适，请咨询专业医生。',
  science: '本内容为文化象征与心理觉察，非科学因果结论。',
  gender: '本内容不涉及医学判断，无性别偏好。',
  privacy: '本页不收集身份证、手机号、生物特征、精确地址或财务账号。',
  no_fate: '本内容不预测命运，不做宿命断言。',
};

export const LF_ERROR_MESSAGES: Record<LFErrorCode, string> = {
  E_INPUT_NOT_IN_WHITELIST: '输入不在白名单内。',
  E_INPUT_EMPTY: '输入为空。',
  E_INPUT_TOO_LONG: '输入超过长度上限。',
  E_ROUTE_PARAM_INVALID: '路由参数非法。',
  E_DATA_NOT_FOUND: '数据未找到。',
  E_SERIALIZATION_FAILED: '序列化失败。',
  E_FORBIDDEN_TERM_HIT: '命中禁用词。',
  E_DISCLAIMER_MISSING: '缺失必需声明。',
  E_LOCALE_FALLBACK_FAILED: '语言兜底失败。',
  E_ROUTE_SLUG_MISMATCH: '路由与 slug 不一致。',
  E_INVARIANT_VIOLATED: '结构性不变式被破坏。',
};

export const LOCALE_FALLBACK_CHAIN: Record<string, readonly string[]> = {
  'zh-CN': ['zh-CN'],
  'zh-TW': ['zh-TW', 'zh-CN'],
  en: ['en', 'zh-CN'],
  ja: ['ja', 'en', 'zh-CN'],
  ko: ['ko', 'en', 'zh-CN'],
  fr: ['fr', 'en', 'zh-CN'],
  es: ['es', 'en', 'zh-CN'],
};

// 高危项强制声明槽
export const HIGH_RISK_REQUIRED_SLOTS = ['page_top', 'result_card', 'page_footer'] as const;
export const DEFAULT_REQUIRED_SLOTS = ['result_card'] as const;
