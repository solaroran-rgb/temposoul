/**
 * B16-补交 · 知识库文章：小满
 * 文件路径：src/data/knowledge/content/solar-terms/xiaoman.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'xiaoman',
  title: '小满：小得盈满 麦穗渐满',
  metaDescription: '小满是二十四节气中的第八个节气，太阳到达黄经60°。本文介绍小满的天文含义、物候特征与农耕民俗。',
  h1: '小满：小得盈满 麦穗渐满',
  category: 'solar-terms',
  tags: ['节气', '小满'],
  sections: [
    {
      heading: '小满是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小满是二十四节气中的第八个节气，约在每年公历5月20—22日交节，太阳到达黄经60°。此时北方麦类籽粒开始灌浆，尚未全熟，故称“小满”。' },
        { kind: 'paragraph', text: '小满反映的是麦类作物将熟未熟的状态。南方则进入夏收夏种的“三夏”大忙前奏，降水与气温同步升高。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候苦菜秀：苦菜枝叶繁茂。',
          '二候靡草死：喜阴的细枝草类在强烈阳光下枯死。',
          '三候麦秋至：麦子将熟，古人视为麦类的“秋天”（收获季）。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小满有祭车神、动三车（水车、油车、丝车）等农耕民俗，体现对水利与农作的重视。' },
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
