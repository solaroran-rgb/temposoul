/**
 * B16-补交 · 知识库文章：冬至
 * 文件路径：src/data/knowledge/content/solar-terms/dongzhi.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'dongzhi',
  title: '冬至：一阳来复的开始',
  metaDescription: '冬至是北半球白昼最短、黑夜最长的一天，太阳直射南回归线。本文介绍冬至的天文含义、物候特征与民俗传统。',
  h1: '冬至：一阳来复的开始',
  category: 'solar-terms',
  tags: ['节气', '冬至'],
  sections: [
    {
      heading: '冬至是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '冬至是北半球白昼最短、黑夜最长的一天，太阳直射南回归线（黄经270°）。冬至过后，太阳直射点向北移动，北半球白昼逐渐增长。' },
        { kind: 'paragraph', text: '冬至在古代被视为重要节日，有"冬至大如年"的说法。此时天气寒冷，进入数九寒天。"一阳来复"之说亦源于冬至阳气初生的天文与哲学意象。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候蚯蚓结：阳气虽已生长，但阴气仍然强盛，土中的蚯蚓仍蜷缩着身体。',
          '二候麋角解：麋感阴气渐退而解角。',
          '三候水泉动：由于阳气初生，山中的泉水可以流动并且温热。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '北方有冬至吃饺子的习俗，南方则有吃汤圆的传统。部分地区还有祭祖、酿米酒等习俗。' },
        { kind: 'callout', tone: 'boundary', text: '冬至的天文事实可核验；饮食与祭祖习俗属传统民俗，不构成任何健康或行为指导。' },
      ],
    },
  ],
  sources: [
    { text: '据《汉书》及《东京梦华录》相关记述整理', confidence: 'verified' },
    { text: '冬至物候据《月令七十二候集解》通行本整理', confidence: 'legendary' },
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
