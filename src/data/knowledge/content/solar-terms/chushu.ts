/**
 * B16-补交 · 知识库文章：处暑
 * 文件路径：src/data/knowledge/content/solar-terms/chushu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'chushu',
  title: '处暑：暑气渐止 秋凉初生',
  metaDescription: '处暑是二十四节气中的第十四个节气，太阳到达黄经150°。本文介绍处暑的天文含义、物候特征与民俗传统。',
  h1: '处暑：暑气渐止 秋凉初生',
  category: 'solar-terms',
  tags: ['节气', '处暑'],
  sections: [
    {
      heading: '处暑是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '处暑是二十四节气中的第十四个节气，约在每年公历8月22—24日交节，太阳到达黄经150°。“处”是终止、躲藏之意，处暑即暑气至此而止。' },
        { kind: 'paragraph', text: '处暑后冷空气南下渐多，气温逐日下降，昼夜温差拉大。但华南仍常有“秋老虎”回热天气，需耐心等待真正秋凉。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鹰乃祭鸟：秋高气爽，鹰开始捕猎并陈列如祭。',
          '二候天地始肃：天地间万物开始凋零萧瑟。',
          '三候禾乃登：黍稷稻粱陆续成熟，进入秋收季。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '处暑有放河灯、开渔节、煎药茶等习俗。沿海的开渔节标志着伏季休渔结束，渔获开始丰收。' },
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
