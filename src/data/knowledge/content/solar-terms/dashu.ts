/**
 * B16-补交 · 知识库文章：大暑
 * 文件路径：src/data/knowledge/content/solar-terms/dashu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'dashu',
  title: '大暑：炎热之极 湿热交蒸',
  metaDescription: '大暑是二十四节气中的第十二个节气，太阳到达黄经120°。本文介绍大暑的天文含义、物候特征与民俗传统。',
  h1: '大暑：炎热之极 湿热交蒸',
  category: 'solar-terms',
  tags: ['节气', '大暑'],
  sections: [
    {
      heading: '大暑是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大暑是二十四节气中的第十二个节气，约在每年公历7月22—24日交节，太阳到达黄经120°。大暑意为炎热至极，是一年中日照最烈、气温最高的时段。' },
        { kind: 'paragraph', text: '大暑与三伏中伏高度重叠，高温高湿，作物生长最快。此时也是台风、暴雨最活跃的时期，需注意防灾。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候腐草为萤：古人见萤火虫卵化于草间，附会为腐草所化。',
          '二候土润溽暑：土地潮湿，天气闷热。',
          '三候大雨时行：强对流天气带来时降大雨。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大暑有饮伏茶、晒伏姜、吃仙草/龟苓膏等消暑习俗，沿海地区则有送“大暑船”的祈福活动。' },
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
