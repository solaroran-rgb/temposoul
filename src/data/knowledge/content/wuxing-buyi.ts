/**
 * C12-知识库文章：五行补益的常见说法与边界
 * 文件路径：src/data/knowledge/content/wuxing-buyi.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-buyi',
  title: '五行补益的常见说法与边界',
  metaDescription: '"缺什么补什么"是流行说法，本文说明它的来源与局限。',
  h1: '五行补益的常见说法与边界',
  category: 'wuxing',
  tags: ['五行', '补益'],
  sections: [
    {
      heading: '"缺什么补什么"是怎么来的',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '民间最流行的说法是：八字里少哪种五行，名字、颜色、方位就该补哪种五行。这个说法简化自传统命理的"扶抑"思路——日主偏弱时宜生扶，偏旺时宜克泄。但流行版本把它压缩成了"缺=补"，丢掉了原理论里大量前提。',
        },
        {
          kind: 'paragraph',
          text: '严格的扶抑法要先判断日主是偏强还是偏弱，再看是该扶、该抑、还是该调候，甚至存在"从强""从弱"等特殊格局——这种情况下"补缺"反而可能背道而驰。',
        },
      ],
    },
    {
      heading: '流行"补益"说法的几种形式',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '名字补：缺木就名字里带木字旁，缺水就带水字旁。',
            '颜色补：缺火就多穿红，缺金就多穿白。',
            '方位补：缺某行就往对应方位发展（东方木、南方火等）。',
            '饰品补：戴水晶、木珠、金属饰物等"补"对应五行。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这些做法在文化心理上可能有自我暗示的作用，但它们是否真的"补"了命局，传统命理本身也没有统一答案，现代更没有任何实证支持。',
        },
      ],
    },
    {
      heading: '为什么命律不提供"补运方案"',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '命律不提供"缺什么补什么"的改名、改色、改方位建议，也不卖任何"开运物品"。把民俗符号当成必须执行的处方，既不尊重传统命理的复杂理论，也容易让用户花冤枉钱。',
        },
        {
          kind: 'paragraph',
          text: '更重要的是，"缺某五行"和现实中的健康、财运、感情没有可验证的因果关系。把它当成必须处理的问题，反而制造焦虑。命律只把五行分布作为一种结构描述呈现，让你知道"这组干支里木多水少"，而不是告诉你"你必须去补水"。',
        },
      ],
    },
    {
      heading: '理性看待"补益"',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '喜欢红色就穿红色，不必因为"补火"才穿。',
            '起名字优先考虑含义、读音、家庭期望，而非五行缺补。',
            '任何声称"佩戴此物改运"的付费建议，都保持警惕。',
            '现实问题用现实手段解决，不靠符号弥补。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为五行补益观念的科普与边界说明，不构成改名、配色、方位、佩戴等任何建议，更不构成医疗或投资建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》扶抑、调候、从格诸说整理', confidence: 'legendary' },
    { text: '民间"缺什么补什么"说法的流行版本梳理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'wuxing-shengke',
    'wuxing-misunderstand',
    'wuxing-color',
    'why-bazi-limits',
    'why-rational-decl',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统观念科普，不构成改名、配色、方位、佩戴或任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
