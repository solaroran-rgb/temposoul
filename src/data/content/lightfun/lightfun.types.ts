// ============ 枚举 ============
export const LOCALES = ['zh-CN', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'es'] as const;
export type Locale = (typeof LOCALES)[number];

export const SEVERITY = ['smooth', 'cautious'] as const;
export type Severity = (typeof SEVERITY)[number];

export const DATA_STATUS = ['available', 'pending_collection', 'audit_aligned'] as const;
export type DataStatus = (typeof DATA_STATUS)[number];

export const RISK_LEVEL = ['low', 'medium', 'high'] as const;
export type RiskLevel = (typeof RISK_LEVEL)[number];

export const CITATION_TYPE = [
  'classic_text',
  'cultural_tradition',
  'folklore',
  'modern_self_help',
] as const;
export type CitationType = (typeof CITATION_TYPE)[number];

export const DISCLAIMER_KEYS = [
  'general',
  'health',
  'science',
  'gender',
  'privacy',
  'no_fate',
] as const;
export type DisclaimerKey = (typeof DISCLAIMER_KEYS)[number];

export const DISCLAIMER_SLOTS = ['page_top', 'result_card', 'page_footer', 'share_card'] as const;
export type DisclaimerSlot = (typeof DISCLAIMER_SLOTS)[number];

export const LF_ERROR_CODE = {
  E_INPUT_NOT_IN_WHITELIST: 'E_INPUT_NOT_IN_WHITELIST',
  E_INPUT_EMPTY: 'E_INPUT_EMPTY',
  E_INPUT_TOO_LONG: 'E_INPUT_TOO_LONG',
  E_ROUTE_PARAM_INVALID: 'E_ROUTE_PARAM_INVALID',
  E_DATA_NOT_FOUND: 'E_DATA_NOT_FOUND',
  E_SERIALIZATION_FAILED: 'E_SERIALIZATION_FAILED',
  E_FORBIDDEN_TERM_HIT: 'E_FORBIDDEN_TERM_HIT',
  E_DISCLAIMER_MISSING: 'E_DISCLAIMER_MISSING',
  E_LOCALE_FALLBACK_FAILED: 'E_LOCALE_FALLBACK_FAILED',
  E_ROUTE_SLUG_MISMATCH: 'E_ROUTE_SLUG_MISMATCH',
  E_INVARIANT_VIOLATED: 'E_INVARIANT_VIOLATED',
} as const;
export type LFErrorCode = (typeof LF_ERROR_CODE)[keyof typeof LF_ERROR_CODE];

// ============ 基础结构 ============
export interface SourceCitation {
  readonly type: CitationType;
  readonly note: string;
  readonly edition?: string;
}

export interface InsightLoop {
  insight: string;
  reason: string;
  manifestation: string;
  risk: string;
  advice: string;
  action: string;
}

export interface SeoMeta {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
  readonly keywords: readonly string[];
  readonly json_ld: readonly Record<string, unknown>[];
}

export interface ShareCard {
  readonly title: string;
  readonly subtitle: string;
  readonly tags: readonly string[];
  readonly bg_gradient: readonly [string, string];
  readonly footer: string;
}

export interface A11y {
  readonly aria_label: string;
  readonly alt_text: string;
  readonly reading_order: readonly string[];
  readonly min_contrast_ratio: number;
}

export interface Compliance {
  readonly risk_level: RiskLevel;
  readonly disclaimers: readonly { readonly key: DisclaimerKey; readonly text: string }[];
  readonly disclaimer_slots: readonly DisclaimerSlot[];
  readonly forbidden_terms: readonly string[];
  readonly forbidden_terms_checked: boolean;
  readonly hard_scan_at_build: boolean;
}

export interface RouteMeta {
  readonly path: string;
  readonly params: readonly string[];
  readonly whitelist?: string;
  readonly conflicts_with_884: boolean;
}

// ============ i18n ============
export interface I18nBundle {
  zh_CN: { readonly title: string; readonly description: string };
  zh_TW?: { readonly title: string; readonly description: string };
  en?: { readonly title: string; readonly description: string };
  ja?: { readonly title: string; readonly description: string };
  ko?: { readonly title: string; readonly description: string };
  fr?: { readonly title: string; readonly description: string };
  es?: { readonly title: string; readonly description: string };
}

// Locale → i18n key 显式映射（避免 keyof 越界）
export const LOCALE_KEY: Record<Locale, keyof I18nBundle> = {
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  fr: 'fr',
  es: 'es',
} as const;

// ============ 信封 ============
export interface LightFunEnvelope<TContent> {
  readonly schema_version: '2.0.0';
  readonly item_id: string;
  readonly slug: string;
  readonly locale: Locale;
  readonly i18n: I18nBundle;
  readonly created_at: string;
  readonly updated_at: string;
  readonly data_status: DataStatus;
  readonly seo: SeoMeta;
  readonly content: TContent;
  readonly ui: { readonly theme: 'dark-ide'; readonly components: readonly string[] };
  readonly share_card: ShareCard;
  readonly a11y: A11y;
  readonly compliance: Compliance;
  readonly route: RouteMeta;
}

// ============ 判别联合（与批 2 兼容） ============
export interface ContentRecord {
  readonly kind: 'article' | 'knowledge' | 'pattern' | 'route' | 'lightfun';
  readonly id: string;
  readonly slug: string;
  readonly locale: Locale;
  readonly seo: SeoMeta;
  readonly content: unknown;
  readonly route: RouteMeta;
}

export interface LightFunRecord extends ContentRecord {
  readonly kind: 'lightfun';
  readonly envelope: LightFunEnvelope<unknown>;
}

export type AnyRecord = ContentRecord | LightFunRecord;

export function isLightFun(r: AnyRecord): r is LightFunRecord {
  return r.kind === 'lightfun';
}

export function toLightFunRecord(env: LightFunEnvelope<unknown>): LightFunRecord {
  return {
    kind: 'lightfun',
    id: env.item_id,
    slug: env.slug,
    locale: env.locale,
    seo: env.seo,
    content: env.content,
    route: env.route,
    envelope: env,
  };
}
