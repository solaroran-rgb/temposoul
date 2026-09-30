/**
 * B16-补交 · 知识库文章：秋分
 * 文件路径：src/data/knowledge/content/solar-terms/qiufen.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'qiufen',
  title: '秋分：昼夜均而寒暑平',
  metaDescription: '秋分是二十四节气中的第十六个节气，太阳到达黄经180°。本文介绍秋分的天文含义、物候特征与民俗传统。',
  h1: '秋分：昼夜均而寒暑平',
  category: 'solar-terms',
  tags: ['节气', '秋分'],
  sections: [
    {
      heading: '秋分是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '秋分是二十四节气中的第十六个节气，约在每年公历9月22—24日交节，太阳到达黄经180°（秋分点）。这天全球昼夜几乎等长，此后北半球昼渐短夜渐长。' },
        { kind: 'paragraph', text: '秋分与春分一样，是昼夜均分的节点。此时正值秋收秋种“三秋大忙”，也是中国农民丰收节的设立时点。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候雷始收声：雷雨天渐少。',
          '二候蛰虫坯户：蛰虫开始培土封洞准备冬眠。',
          '三候水始涸：降水减少，河流水量渐枯。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '秋分有祭月、吃秋菜、送秋牛图等习俗。古代秋分曾是“祭月节”，后演变为中秋节。' },
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
