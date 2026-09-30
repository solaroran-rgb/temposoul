/**
 * B16-补交 · 知识库文章：惊蛰
 * 文件路径：src/data/knowledge/content/solar-terms/jingzhe.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'jingzhe',
  title: '惊蛰：春雷始惊 蛰虫始振',
  metaDescription: '惊蛰是二十四节气中的第三个节气，太阳到达黄经345°。本文介绍惊蛰的天文含义、物候特征与民俗传统。',
  h1: '惊蛰：春雷始惊 蛰虫始振',
  category: 'solar-terms',
  tags: ['节气', '惊蛰'],
  sections: [
    {
      heading: '惊蛰是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '惊蛰是二十四节气中的第三个节气，约在每年公历3月5—7日交节，太阳到达黄经345°。“蛰”指藏土越冬的虫类，春雷初响，蛰虫惊醒而出，故名“惊蛰”。' },
        { kind: 'paragraph', text: '惊蛰前后气温回升较快，冬眠动物陆续复苏。传统上认为这是万物从蛰伏转向活跃的节点，养生宜疏肝理气、早睡早起。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候桃始华：桃花渐次开放。',
          '二候仓庚鸣：黄鹂开始啼鸣。',
          '三候鹰化为鸠：古人观察到鹰渐隐而斑鸠渐多，附会为“鹰化为鸠”。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '民间有惊蛰吃梨、祭白虎、驱虫等习俗，取唤醒生机、除虫防疫之意。' },
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
