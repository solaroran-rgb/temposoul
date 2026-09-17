/**
 * 知识库文章：驿马
 * 文件路径：src/data/knowledge/content/shensha-yima.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-yima',
  title: '驿马',
  metaDescription: '驿马主迁动，本文说明其查法与民俗含义。',
  h1: '驿马',
  category: 'shensha',
  tags: ['驿马', '神煞'],
  sections: [
    {
      heading: '驿马的查法：三合局对冲位',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '驿马是主"迁动、出行、变动"的神煞，查法同样以年支或日支所属三合局为基准，指向该局的对冲地支。口诀为：申子辰马在寅、寅午戌马在申、巳酉丑马在亥、亥卯未马在巳。例如年支为寅，属寅午戌火局，则见申即为驿马。',
        },
        {
          kind: 'table',
          header: ['年支/日支（三合局）', '驿马所在地支', '与局的关系'],
          rows: [
            ['申子辰（水局）', '寅', '与申相冲'],
            ['寅午戌（火局）', '申', '与寅相冲'],
            ['巳酉丑（金局）', '亥', '与巳相冲'],
            ['亥卯未（木局）', '巳', '与亥相冲'],
          ],
        },
        {
          kind: 'paragraph',
          text: '可以看到，驿马恰好落在三合局第一个字的冲位上。这是它得名"驿马"的结构原因：冲主动、主动而不居，古人便以车马奔走附会之。命中与否仍是查表，与是否真的远行无必然因果。',
        },
      ],
    },
    {
      heading: '民俗含义：变动、出差、迁徙',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统说法把驿马解释为"好动"：命带驿马的人被描述为适合奔波、外出、迁移，从事贸易、运输、外交、外派等流动性强的事务更顺。大运或流年逢驿马，也常被说成"这一年有走动、搬家、出差、换环境"。在古代交通不便的背景下，这种说法是对"冲"这一结构现象的生活化比喻。',
        },
        {
          kind: 'paragraph',
          text: '到了现代，人口流动本就是常态，几乎每个人一生都会多次换城市、换工作、长途出行，因此"命带驿马主奔波"的区分度已经很低。把它读成"你天生注定到处跑"或"你一定会出国"，都属于过度解读。真正影响一个人是否迁徙的，是求学、就业、家庭等现实因素。',
        },
      ],
    },
    {
      heading: '理性看待：驿马是"动"的符号，不是行程表',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '驿马只表示干支组合落在了三合局的冲位，是一个"主动"的结构符号，不能预测你哪一年会搬家、会不会出国、出差是否顺利。是否迁徙、何时迁徙应由现实规划决定，切勿因"逢驿马年"而冲动辞职或盲目迁移。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘若命中驿马，仅标注这一查表结果，并附"主迁动、民俗说法"的提示，不做"今年必远行"之类断言。读者可把它当作了解传统命理如何用"冲"字解释生活变化的一个例子，而非行程预测。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》驿马查法（三合冲位）整理', confidence: 'legendary' },
    { text: '驿马"主动"的语义见古代命理通俗语汇，属民俗附会', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'ganzhi-clash', 'ganzhi-sanhe'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，驿马查法仅作民俗参考，不构成迁徙、择业或出行决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
