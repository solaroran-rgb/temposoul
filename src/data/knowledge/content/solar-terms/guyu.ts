/**
 * B16-补交 · 知识库文章：谷雨
 * 文件路径：src/data/knowledge/content/solar-terms/guyu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'guyu',
  title: '谷雨：雨生百谷 春将尽矣',
  metaDescription: '谷雨是二十四节气中的第六个节气，太阳到达黄经30°。本文介绍谷雨的天文含义、物候特征与农耕民俗。',
  h1: '谷雨：雨生百谷 春将尽矣',
  category: 'solar-terms',
  tags: ['节气', '谷雨'],
  sections: [
    {
      heading: '谷雨是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '谷雨是二十四节气中的第六个节气，约在每年公历4月19—21日交节，太阳到达黄经30°。“雨生百谷”，此时降水增多，利于谷类作物播种生长。' },
        { kind: 'paragraph', text: '谷雨是春季最后一个节气的临近节点，田中秧苗初插、作物新种，最需雨水滋润。民间有“谷雨前后，种瓜点豆”的农谚。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候萍始生：浮萍开始生长。',
          '二候鸣鸠拂其羽：斑鸠拂羽鸣叫。',
          '三候戴胜降于桑：戴胜鸟落于桑树，提示养蚕时节将近。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '谷雨有摘茶、采香椿、祭仓颉等习俗。谷雨茶被认为清火明目，香椿则是应季时鲜。' },
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
