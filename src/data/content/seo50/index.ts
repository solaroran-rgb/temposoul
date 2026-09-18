/**
 * SEO 内容数据聚合：50 篇长尾关键词科普文
 * 八字 7 / 紫微 7 / 塔罗 7 / 星座 7 / 姓名 6 / 黄历 5 / 生肖 6 / 风水 5 = 50
 */
import type { SeoArticle, SeoTopic } from './types';
import { baziArticles } from './bazi.data';
import { ziweiArticles } from './ziwei.data';
import { tarotArticles } from './tarot.data';
import { astrologyArticles } from './astrology.data';
import { namingArticles } from './naming.data';
import { almanacArticles } from './almanac.data';
import { zodiacArticles } from './zodiac.data';
import { fengshuiArticles } from './fengshui.data';

export const seoArticles: readonly SeoArticle[] = [
  ...baziArticles,
  ...ziweiArticles,
  ...tarotArticles,
  ...astrologyArticles,
  ...namingArticles,
  ...almanacArticles,
  ...zodiacArticles,
  ...fengshuiArticles,
];

/** slug → 文章（O(1) 详情查询） */
const seoSlugIndex = new Map<string, SeoArticle>(seoArticles.map((a) => [a.slug, a]));

export function getSeoArticle(slug: string): SeoArticle | undefined {
  return seoSlugIndex.get(slug);
}

export function listSeoByTopic(topic: SeoTopic): SeoArticle[] {
  return seoArticles.filter((a) => a.topic === topic);
}

export const SEO_ARTICLE_COUNT = seoArticles.length;

export type { SeoArticle, SeoTopic, SeoBlock } from './types';
export { SEO_TOPIC_META } from './types';
