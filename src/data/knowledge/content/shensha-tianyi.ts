/**
 * 知识库文章：天乙贵人
 * 文件路径：src/data/knowledge/content/shensha-tianyi.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-tianyi',
  title: '天乙贵人',
  metaDescription: '天乙贵人的查法与"遇难成祥"的民俗说法。',
  h1: '天乙贵人',
  category: 'shensha',
  tags: ['贵人', '神煞'],
  sections: [
    {
      heading: '天乙贵人的查法：以日干为主',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '天乙贵人和桃花、驿马不同，它以日干（即日柱天干）为主查四柱地支。口诀为："甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢马虎。"即甲、戊、日干见丑、未；乙、己日干见子、申；丙、丁日干见亥、酉；壬、癸日干见卯、巳；辛日干见午、寅。',
        },
        {
          kind: 'table',
          header: ['日干', '天乙贵人所在地支'],
          rows: [
            ['甲、戊、庚', '丑、未（牛、羊）'],
            ['乙、己', '子、申（鼠、猴）'],
            ['丙、丁', '亥、酉（猪、鸡）'],
            ['壬、癸', '卯、巳（兔、蛇）'],
            ['辛', '午、寅（马、虎）'],
          ],
        },
        {
          kind: 'paragraph',
          text: '天乙贵人在神煞体系里被列为最吉者之一，古籍称其"逢凶化吉、遇难呈祥"。但和所有神煞一样，它的"有无"是查表结果，"是否真有贵人相助"是民俗附会，二者不能混为一谈。',
        },
      ],
    },
    {
      heading: '民俗含义：贵人缘与"有人帮"的心理安慰',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统说法把天乙贵人解释为命中易得长辈、上司或关键人物提携，遇事有人援手。在古代社会，一个人能否被赏识、能否在困境中获得帮助，确实深刻影响命运，因此"贵人"类神煞被反复强调。它折射的是传统社会对"被提携"这一现实的文化投影。',
        },
        {
          kind: 'paragraph',
          text: '但现实中的贵人帮助，本质上来自你自己的能力、信誉、社交网络与机遇，而不是出生日天干决定的。把"命带天乙贵人"当成坐等别人来救的理由，反而会削弱主动经营关系、提升自身的动力。真正可持续的"贵人缘"，是长期靠谱积累出来的。',
        },
      ],
    },
    {
      heading: '理性看待：贵人是符号，不是救援承诺',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '天乙贵人只是以日干查出的一个地支符号，传统附会为易得他人相助，但它不能保证你遇到困难时一定有人搭救，更不能预测贵人是谁、何时出现。切勿把它当作"不用努力也会有人帮"的依据；遇到困境仍需依靠现实求助渠道与自身行动。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘若命中天乙贵人，仅标注查表结果与"传统主贵人扶持"的民俗含义，不做"你今年必有贵人""此人是你的贵人"式断言。涉及求助、合作、用人等现实判断，应回到对具体人的了解与客观事务本身。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》天乙贵人口诀（日干查支）整理', confidence: 'legendary' },
    { text: '"天乙贵人最吉"的评价见古代命理典籍，属民俗释义', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'paipan-daymaster', 'why-not-predict'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，天乙贵人查法仅作民俗参考，不构成求助、合作或用人决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
