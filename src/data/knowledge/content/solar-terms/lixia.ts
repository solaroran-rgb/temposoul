/**
 * B16-补交 · 知识库文章：立夏
 * 文件路径：src/data/knowledge/content/solar-terms/lixia.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'lixia',
  title: '立夏：万物并秀 夏之始也',
  metaDescription: '立夏是二十四节气中的第七个节气，太阳到达黄经45°。本文介绍立夏的天文含义、物候特征与民俗传统。',
  h1: '立夏：万物并秀 夏之始也',
  category: 'solar-terms',
  tags: ['节气', '立夏'],
  sections: [
    {
      heading: '立夏是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立夏是二十四节气中的第七个节气，约在每年公历5月5—7日交节，太阳到达黄经45°。“立”为始，夏季自此开始，万物至此渐次长大。' },
        { kind: 'paragraph', text: '立夏前后气温明显升高，雷雨增多，农作物进入旺盛生长期。传统养生讲究养心安神，宜午间小憩、饮食清淡。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候蝼蝈鸣：蝼蛄开始鸣叫。',
          '二候蚯蚓出：蚯蚓出土松土。',
          '三候王瓜生：王瓜的藤蔓开始攀援生长。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立夏有“称人”“吃立夏蛋”“尝三鲜”等习俗，寄托人们对夏日安康、作物丰收的期盼。' },
        { kind: 'callout', tone: 'boundary', text: '节气知识属于传统历法与民俗文化范畴，节气日期与物候描述可核验，民俗意象仅供文化参考，不构成对农事或生活决策的保证。' },
      ],
    },
  ],
  sources: [
    { text: '据《月令七十二候集解》通行本及紫金山天文台节气历表整理', confidence: 'verified' },
    { text: '本节气民俗据民间岁时文化资料整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['almanac-intro', 'paipan-jieqi', 'ganzhi-overview'],
  confidence: 'verified',
  disclaimer: '本文为节气与民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
