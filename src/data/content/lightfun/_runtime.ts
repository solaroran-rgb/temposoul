import {
  DISCLAIMER_PACK,
  LOCALE_FALLBACK_CHAIN,
  LF_ERROR_MESSAGES,
  HIGH_RISK_REQUIRED_SLOTS,
  DEFAULT_REQUIRED_SLOTS,
} from './_constants';
import { LOCALE_KEY } from './lightfun.types';
import type {
  LightFunEnvelope,
  Locale,
  DisclaimerKey,
  DisclaimerSlot,
  LFErrorCode,
  I18nBundle,
  RouteMeta,
} from './lightfun.types';

export class LightFunError extends Error {
  readonly code: LFErrorCode;
  constructor(code: LFErrorCode, detail?: string) {
    super(`${LF_ERROR_MESSAGES[code]}${detail ? ` (${detail})` : ''}`);
    this.code = code;
    this.name = 'LightFunError';
  }
}

// ========== 语言兜底 ==========
export function resolveLocale(
  bundle: I18nBundle,
  requested: Locale,
): { title: string; description: string; resolved: Locale } {
  const chain = LOCALE_FALLBACK_CHAIN[requested] ?? ['zh-CN'];
  for (const loc of chain) {
    const key = LOCALE_KEY[loc as Locale];
    if (!key) continue;
    const entry = bundle[key];
    if (entry?.title && entry?.description) {
      return { title: entry.title, description: entry.description, resolved: loc as Locale };
    }
  }
  throw new LightFunError('E_LOCALE_FALLBACK_FAILED', `requested=${requested}`);
}

// ========== 禁用词 ==========
export function scanForbiddenTerms(text: string, forbidden: readonly string[]) {
  const terms = forbidden.filter((t) => text.includes(t));
  return { hit: terms.length > 0, terms };
}

export function assertNoForbiddenTerms<T>(envelope: LightFunEnvelope<T>): void {
  const text = JSON.stringify(envelope);
  const { hit, terms } = scanForbiddenTerms(text, envelope.compliance.forbidden_terms);
  if (hit) throw new LightFunError('E_FORBIDDEN_TERM_HIT', terms.join(','));
}

// ========== 声明校验 ==========
export function assertDisclaimersRendered<T>(envelope: LightFunEnvelope<T>): void {
  const required: readonly DisclaimerSlot[] =
    envelope.compliance.risk_level === 'high' ? HIGH_RISK_REQUIRED_SLOTS : DEFAULT_REQUIRED_SLOTS;
  for (const slot of required) {
    if (!envelope.compliance.disclaimer_slots.includes(slot)) {
      throw new LightFunError('E_DISCLAIMER_MISSING', `slot=${slot}`);
    }
  }
  for (const d of envelope.compliance.disclaimers) {
    const expected = DISCLAIMER_PACK[d.key as DisclaimerKey];
    if (expected && d.text !== expected) {
      throw new LightFunError('E_DISCLAIMER_MISSING', `text_mismatch:${d.key}`);
    }
  }
}

// ========== 序列化 ==========
export function validateSerialize<T>(envelope: LightFunEnvelope<T>): void {
  try {
    const s = JSON.stringify(envelope);
    if (s.includes('undefined') || s.includes('[object')) {
      throw new LightFunError('E_SERIALIZATION_FAILED', 'dirty_output');
    }
    JSON.parse(s);
  } catch (e) {
    if (e instanceof LightFunError) throw e;
    throw new LightFunError('E_SERIALIZATION_FAILED', String(e));
  }
}

// ========== 白名单 ==========
export function assertWhitelist(input: string, whitelist: ReadonlySet<string>): void {
  if (!input) throw new LightFunError('E_INPUT_EMPTY');
  if (input.length > 32) throw new LightFunError('E_INPUT_TOO_LONG');
  if (!whitelist.has(input)) throw new LightFunError('E_INPUT_NOT_IN_WHITELIST', input);
}

// ========== SEO 字数 ==========
export function assertSeoLength(seo: { title: string; description: string }): void {
  if (seo.title.length > 30)
    throw new LightFunError('E_DATA_NOT_FOUND', `title_len=${seo.title.length}`);
  if (seo.description.length > 80)
    throw new LightFunError('E_DATA_NOT_FOUND', `desc_len=${seo.description.length}`);
}

// ========== 路由与 slug 一致性 ==========
export function assertRouteSlugConsistency<T>(envelope: LightFunEnvelope<T>): void {
  const route = envelope.route as RouteMeta;
  const segments = route.path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && lastSegment !== envelope.slug) {
    throw new LightFunError('E_ROUTE_SLUG_MISMATCH', `${envelope.slug} vs ${lastSegment}`);
  }
}

// ========== 结构性不变式 ==========
export function assertInvariant(condition: boolean, message: string): void {
  if (!condition) throw new LightFunError('E_INVARIANT_VIOLATED', message);
}

// ========== 综合校验 ==========
export function validateEnvelope<T>(envelope: LightFunEnvelope<T>): void {
  assertNoForbiddenTerms(envelope);
  assertDisclaimersRendered(envelope);
  assertSeoLength(envelope.seo);
  assertRouteSlugConsistency(envelope);
  validateSerialize(envelope);
}
