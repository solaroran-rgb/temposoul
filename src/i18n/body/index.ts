/**
 * T07 · 正文 i18n 运行时
 *
 * 设计要点（为什么是「字符串映射」而不是「结构镜像」）：
 *  - src/data 下的正文是 TS 结构化数据（KnowledgeArticle / TarotCardMeaning / DreamEntry…），
 *    结构键与文案混排；用「中文原文 → 目标语言」映射 + 字段白名单深译，可以在
 *    **不改任何数据结构、不新增任何 key** 的前提下让正文支持新语言，缺译自动回落中文。
 *  - 抽取侧 scripts/i18n/extract-body-corpus.ts 与运行时侧共用同一套白名单，二者口径一致；
 *    改白名单必须同时重跑抽取脚本与重建译文（否则队列对不上）。
 */

import type { Locale } from '../index';

import { safeStorage } from '@/lib/safe-storage';

import { esESBodyMap } from './esES';
import { jaBodyMap } from './ja';
import { koKNBodyMap } from './koKN';
import { thTHBodyMap } from './thTH';
import { viVNBodyMap } from './viVN';

export type BodyMap = Record<string, string>;

/** 语言常量透出（数据层接线时无需再 import 上层 Provider 模块） */
export type { Locale };

/** 各语言译文映射（zh-CN 无映射＝原样中文；en 沿用既有 UI 英文，正文暂不译） */
export const BODY_MAPS: Partial<Record<Locale, BodyMap>> = {
  ja: jaBodyMap,
  'ko-KN': koKNBodyMap,
  'vi-VN': viVNBodyMap,
  'th-TH': thTHBodyMap,
  'es-ES': esESBodyMap,
};

/** 可译文案字段白名单 —— 与 extract-body-corpus.ts 保持一致 */
export const TRANSLATABLE_KEYS = new Set([
  'aliases',
  'answer',
  'author',
  'blocks',
  'caution',
  'description',
  'disclaimer',
  'dynasty',
  'h1',
  'header',
  'heading',
  'intro',
  'items',
  'keyword',
  'label',
  'listDescription',
  'listTitle',
  'metaDescription',
  'modernText',
  'name',
  'question',
  'rows',
  'sources',
  'summary',
  'tags',
  'template',
  'text',
  'title',
  'traditionalText',
  'unit',
  'upright',
  'reversed',
  'variables',
]);

function mapOf(locale: Locale): BodyMap | null {
  if (locale === 'zh-CN') return null;
  return BODY_MAPS[locale] ?? null;
}

/** 当前语言：与 I18nProvider 同源（localStorage ts_locale），无存储环境回落 zh-CN */
export function currentLocale(): Locale {
  try {
    const v = safeStorage.get('ts_locale');
    if (typeof v === 'string' && v) return v as Locale;
  } catch {
    /* localStorage 不可用时回落中文 */
  }
  return 'zh-CN';
}

/** 单句翻译：命中即译，未命中回落中文原文 */
export function bodyT(zh: string, locale?: Locale): string {
  const map = mapOf(locale ?? currentLocale());
  if (!map) return zh;
  const v = map[zh];
  return typeof v === 'string' && v.trim() ? v : zh;
}

function localizeNode(node: unknown, map: BodyMap | null): unknown {
  if (!map) return node;
  if (typeof node === 'string') {
    const v = map[node];
    return typeof v === 'string' && v.trim() ? v : node;
  }
  if (Array.isArray(node)) return node.map((n) => localizeNode(n, map));
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = TRANSLATABLE_KEYS.has(k) ? localizeNode(v, map) : v;
    }
    return out;
  }
  return node;
}

/** 结构化深译：按白名单字段递归替换文案，结构/标识符原样保留 */
export function localize<T>(value: T, locale?: Locale): T {
  const map = mapOf(locale ?? currentLocale());
  return localizeNode(value, map) as T;
}

/** 带缓存的列表选择器（同一 locale 只算一次） */
const cache = new Map<string, unknown>();

export function localized<A extends readonly unknown[]>(namespace: string, source: A, locale?: Locale): A {
  return localizedValue<A>(namespace, source, locale);
}

/** 带缓存的通用选择器（对象/常量同样适用） */
export function localizedValue<T>(namespace: string, value: T, locale?: Locale): T {
  const loc = locale ?? currentLocale();
  const key = `${namespace}@${loc}`;
  if (cache.has(key)) return cache.get(key) as T;
  const out = localize(value, loc);
  cache.set(key, out);
  return out;
}

/** 运行时自检：统计某语数据在给定 locale 下的未译（回落中文）条目占比 */
export function coverageOf(locale: Locale, source: readonly unknown[]): { total: number; hit: number; rate: number } {
  const strings: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === 'string') strings.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        if (TRANSLATABLE_KEYS.has(k)) walk(v);
      }
    }
  };
  source.forEach(walk);
  if (!strings.length) return { total: 0, hit: 0, rate: 1 };
  const hit = strings.filter((s) => bodyT(s, locale) !== s).length;
  return { total: strings.length, hit, rate: hit / strings.length };
}
