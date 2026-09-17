/**
 * C12-知识库文章：地支藏干
 * 文件路径：src/data/knowledge/content/ganzhi-canggan.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-canggan',
  title: '地支藏干',
  metaDescription: '每个地支所藏天干，以及藏干在十神分析中的作用。',
  h1: '地支藏干',
  category: 'ganzhi',
  tags: ['藏干', '干支'],
  sections: [
    {
      heading: '什么是地支藏干',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '天干透在外面，地支藏在里面。传统命理认为，每个地支不只代表它本身的五行，还"藏"着一到三个天干，称为藏干（或人元）。这样一来，四柱八个字其实远不止表面看到的八个符号——地支里的藏干会参与五行力量与十神的计算。',
        },
        {
          kind: 'paragraph',
          text: '藏干有主气、中气、余气之分：主气是该地支本五行的主要天干，中气、余气是附带的其他天干。例如寅藏甲丙戊，甲木为主气。',
        },
      ],
    },
    {
      heading: '十二地支藏干表',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '地支藏干对照',
          header: ['地支', '藏干（主·中·余）', '本气'],
          rows: [
            ['子', '癸', '癸水'],
            ['丑', '己、癸、辛', '己土'],
            ['寅', '甲、丙、戊', '甲木'],
            ['卯', '乙', '乙木'],
            ['辰', '戊、乙、癸', '戊土'],
            ['巳', '丙、戊、庚', '丙火'],
            ['午', '丁、己', '丁火'],
            ['未', '己、丁、乙', '己土'],
            ['申', '庚、壬、戊', '庚金'],
            ['酉', '辛', '辛金'],
            ['戌', '戊、辛、丁', '戊土'],
            ['亥', '壬、甲', '壬水'],
          ],
        },
        {
          kind: 'paragraph',
          text: '这张表是命理分析的基础查表。命律排盘会自动展开每柱地支的藏干，供你核对。',
        },
      ],
    },
    {
      heading: '藏干在十神分析中的作用',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '十神以日干为"我"。当天干上看不到某五行时，不代表它不存在——它可能藏在地支里。例如天干无官杀，但地支藏干中见克我之五行，传统上仍视为有官杀之根。藏干因此被用来判断某十神是否"有根"、力量是否扎实。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '藏干是查表规则，属于可复算的结构信息；但"藏干透出主事"等解读仍属传统分析框架，不是事件预测。',
        },
      ],
    },
    {
      heading: '为什么要重视藏干',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '只看天干会漏掉地支里的五行根气。',
            '地支藏干决定十神是否有根、能否发力。',
            '合冲刑害发生在地支时，也要看藏干是否被引动。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为藏干规则科普。藏干查表可复算，其命理解释属传统框架，不构成任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》人元藏干章节整理', confidence: 'legendary' },
    { text: '十二地支藏干表据传统命理通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-overview', 'ganzhi-sanhe', 'shishen-overview', 'wuxing-wangshuai'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理规则科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
