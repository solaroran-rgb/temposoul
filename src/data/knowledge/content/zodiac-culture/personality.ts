/**
 * 知识库文章：生肖与性格
 * 文件路径：src/data/knowledge/content/zodiac-culture/personality.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-personality',
  title: '生肖与性格：民俗性格标签是怎么来的',
  metaDescription: '"属虎的人外向、属兔的人温和"——这类说法从何而来？本文梳理生肖性格标签的文化来源与心理学边界。',
  h1: '生肖与性格：民俗性格标签是怎么来的',
  category: 'zodiac-culture',
  tags: ['生肖', '性格', '民俗'],
  sections: [
    {
      heading: '为什么每个生肖都有一套性格',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '几乎每个中国人都能脱口说出几句"生肖性格"：鼠机灵、牛踏实、虎果断、兔温和、龙大气、蛇敏锐、马奔放、羊温顺、猴灵活、鸡自律、狗忠诚、猪随和。这些说法流传极广，但它们并不是性格测评的结论，而是古人把动物的典型习性拟人化后，贴在对应年份出生者身上的文化标签。',
        },
        {
          kind: 'paragraph',
          text: '换句话说，不是"虎年出生的人天然有虎的性格"，而是"人们希望用虎的意象来理解和表达这一年出生者"。它更接近一种文化叙事，而不是科学分类。',
        },
      ],
    },
    {
      heading: '巴纳姆效应：为什么觉得"说得很准"',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '很多人第一次读到生肖性格描述时会觉得"这不就是我吗"。心理学把这种现象称为巴纳姆效应：一段笼统、含糊、正反两面都能对上的描述，几乎适用于所有人，于是每个人都能从中看到自己。',
        },
        {
          kind: 'paragraph',
          text: '例如"你外表坚强、内心也有柔软的一面""你有时很外向，有时想独处"——这类话放到任何人身上都成立。生肖性格描述之所以显得准，很大程度上是因为它写得足够圆融。',
        },
      ],
    },
    {
      heading: '科学怎么看',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '现代心理学界并没有证据支持"出生年份决定性格"。性格更多受遗传、成长环境、教育、经历与个人选择影响。同一属相的人成百上千万，性格千差万别；同年出生的双胞胎与同年出生的陌生人，性格相似度远不能用生肖来解释。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '生肖性格描述属文化象征语言，不构成心理测评、人格诊断或招聘、婚恋筛选依据。',
        },
      ],
    },
    {
      heading: '那它还有什么用',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '把生肖性格当成年俗谈资、社交破冰的话题，或者自我反思的一面哈哈镜，都无伤大雅。它有趣、亲切、有文化温度。只是不必拿它给别人下定义，更不必因为"属相不合性格"而否定一个人。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为生肖民俗与心理学边界科普，不构成心理或医疗建议。如需了解真实性格，请参考专业心理测评与自我反思。',
        },
      ],
    },
  ],
  sources: [
    { text: '生肖性格说法据民间通行文化整理', confidence: 'legendary' },
    { text: '巴纳姆效应为心理学通行概念（Forer, 1948）', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['zodiac-rat', 'zodiac-legend', 'why-folk-vs-fact', 'why-bazi-limits'],
  confidence: 'legendary',
  disclaimer: '本文为生肖民俗科普，性格描述为文化象征，不构成心理诊断或现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
