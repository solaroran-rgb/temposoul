/**
 * B16-补交 · 知识库文章：十二生肖·牛
 * 文件路径：src/data/knowledge/content/zodiac-culture/ox.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-ox',
  title: '十二生肖·牛',
  metaDescription: '牛为十二生肖第二位，对应地支"丑"，五行属土。本文介绍牛的文化意象、性格象征与农耕文化中的位置。',
  h1: '十二生肖·牛',
  category: 'zodiac-culture',
  tags: ['生肖', '牛'],
  sections: [
    {
      heading: '牛在生肖中的位置',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '牛为十二生肖第二位，对应地支"丑"，传统五行归类属土。牛在中国文化中象征着勤劳、踏实和奉献精神。' },
        { kind: 'paragraph', text: '牛在农耕文化中地位崇高，是农业生产的重要伙伴，被视为丰收和富足的保障。' },
      ],
    },
    {
      heading: '文化意象',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '"老黄牛"精神是中华民族勤劳品质的象征。牛郎织女的传说也赋予了牛浪漫的文化内涵。' },
      ],
    },
    {
      heading: '性格象征',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '传统说法认为属牛之人通常具有坚韧不拔的意志、诚实守信的品质和默默奉献的精神，做事稳重、值得信赖。这类描述属民俗意象，不构成对个体的断言。' },
        { kind: 'callout', tone: 'boundary', text: '生肖文化属传统民俗，性格描述为文化象征语言，不构成心理或人格诊断。' },
      ],
    },
  ],
  sources: [
    { text: '据《说文解字》及《礼记》相关记述整理', confidence: 'legendary' },
    { text: '农耕文化常识按民俗资料整理', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-overview', 'ganzhi-jiazi', 'shensha-intro'],
  confidence: 'verified',
  disclaimer: '本文为生肖民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
