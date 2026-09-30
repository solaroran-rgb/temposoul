/**
 * B16-补交 · 知识库文章：芒种
 * 文件路径：src/data/knowledge/content/solar-terms/mangzhong.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'mangzhong',
  title: '芒种：有芒可种 仲夏始忙',
  metaDescription: '芒种是二十四节气中的第九个节气，太阳到达黄经75°。本文介绍芒种的天文含义、物候特征与农耕民俗。',
  h1: '芒种：有芒可种 仲夏始忙',
  category: 'solar-terms',
  tags: ['节气', '芒种'],
  sections: [
    {
      heading: '芒种是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '芒种是二十四节气中的第九个节气，约在每年公历6月5—7日交节，太阳到达黄经75°。“芒”指麦类等有芒作物成熟，“种”指谷黍类作物可播种，故名“芒种”。' },
        { kind: 'paragraph', text: '芒种是农忙最甚的节气之一，收麦与插秧几乎同时进行。此时长江中下游进入梅雨时节，高温高湿，需注意防暑祛湿。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候螳螂生：螳螂卵鞘孵化。',
          '二候鵙始鸣：伯劳鸟开始鸣叫。',
          '三候反舌无声：善鸣的反舌鸟停止鸣叫。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '芒种有送花神、安苗等习俗。旧时文人雅士在芒种饯花神，农家则以新麦祭祀祈求秋收。' },
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
