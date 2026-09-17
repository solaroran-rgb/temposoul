/**
 * B16-补交 · 知识库文章：立春
 * 文件路径：src/data/knowledge/content/solar-terms/lichun.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'lichun',
  title: '立春：一年节气的开始',
  metaDescription: '立春是二十四节气之首，太阳到达黄经315°。本文介绍立春的天文含义、物候特征与民俗传统，以及节气与干支年的关系。',
  h1: '立春：一年节气的开始',
  category: 'solar-terms',
  tags: ['节气', '立春'],
  sections: [
    {
      heading: '立春是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立春是二十四节气之首，标志着万物闭藏的冬季已经过去，开始进入风和日暖、万物生长的春季。在天文意义上，立春时太阳到达黄经315°。' },
        { kind: 'paragraph', text: '立春的"立"是开始的意思，"春"代表着温暖与生长。立春时节阳气初生、大地回暖、冰雪消融、草木萌发，自然界呈现出一派生机勃勃的景象。' },
        { kind: 'paragraph', text: '在传统历法中，立春还是干支纪年切换的重要节点：传统上以立春为年度干支分界，而非公历1月1日。这一点与八字排盘中的年柱划分直接相关。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候东风解冻：东风送暖，大地开始解冻。',
          '二候蛰虫始振：蛰居的虫类慢慢在洞中苏醒。',
          '三候鱼陟负冰：河里的冰开始溶化，鱼开始到水面上游动。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立春有"咬春"的习俗，人们吃春饼、萝卜等新鲜蔬菜，寓意迎接新春。部分地区还有"打春牛"的仪式，象征劝农春耕。' },
        { kind: 'callout', tone: 'boundary', text: '节气知识属于传统历法与民俗文化范畴，节气日期与物候描述可核验，民俗意象仅供文化参考，不构成对农事或生活决策的保证。' },
      ],
    },
  ],
  sources: [
    { text: '据《月令七十二候集解》通行本及紫金山天文台节气历表整理', confidence: 'verified' },
    { text: '立春民俗据民间岁时文化资料整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['almanac-intro', 'paipan-jieqi', 'ganzhi-overview'],
  confidence: 'verified',
  disclaimer: '本文为节气与民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
