/**
 * T07 · 正文语料的按语言选择器（页面侧替代直接 import 数据常量）
 *
 * 用法：把 `FAQ_DATA` 换成 `getFaq(locale)`；zh-CN 返回原对象（零开销），
 * 五语返回按字段白名单深译后的副本（带缓存）。缺译自动回落中文，不会渲染成空白。
 */

import type { Locale } from '../index';

import { bodyT, localizedValue } from './index';

import { CLASSICS_META, classicsArticles } from '@/data/classics';
import { DREAM_CAUTION, DREAM_ENTRIES, DREAM_SOURCE } from '@/data/dream/dream-dict';
import { FAQ_CATEGORIES, FAQ_DATA } from '@/data/faq';
import { ZODIAC_PROFILES } from '@/data/fortune/zodiac-profiles';
import { ARTICLE_MANIFEST } from '@/data/knowledge/manifest';
import { NEWS_META, newsArticles } from '@/data/news';
import { TAROT_CARD_MEANINGS } from '@/data/tarot/card-meanings';
import { astroWikiRegistry, parentingData } from '@/data/wiki/astro-wiki';
import { zodiacWikiData } from '@/data/wiki/zodiac';

type L = Locale | undefined;

export const getFaq = (locale?: L) => localizedValue('faq', FAQ_DATA, locale);
export const getFaqCategories = (locale?: L) => localizedValue('faq-categories', FAQ_CATEGORIES, locale);
export const getNewsMeta = (locale?: L) => localizedValue('news-meta', NEWS_META, locale);
export const getNewsArticles = (locale?: L) => localizedValue('news', newsArticles, locale);
export const getClassicsMeta = (locale?: L) => localizedValue('classics-meta', CLASSICS_META, locale);
export const getClassicsArticles = (locale?: L) => localizedValue('classics', classicsArticles, locale);
export const getZodiacWiki = (locale?: L) => localizedValue('wiki-zodiac', zodiacWikiData, locale);
export const getAstroWiki = (locale?: L) => localizedValue('wiki-astro', astroWikiRegistry, locale);
export const getParenting = (locale?: L) => localizedValue('wiki-parenting', parentingData, locale);
export const getZodiacProfiles = (locale?: L) => localizedValue('zodiac-profiles', ZODIAC_PROFILES, locale);
export const getTarotMeanings = (locale?: L) => localizedValue('tarot-meanings', TAROT_CARD_MEANINGS, locale);
export const getDreamEntries = (locale?: L) => localizedValue('dream-dict', DREAM_ENTRIES, locale);
export const getDreamSource = (locale?: L) => bodyT(DREAM_SOURCE, locale);
export const getDreamCaution = (locale?: L) => bodyT(DREAM_CAUTION, locale);
export const getManifest = (locale?: L) => localizedValue('knowledge-manifest', ARTICLE_MANIFEST, locale);
