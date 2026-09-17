/**
 * 知识库文章：文昌
 * 文件路径：src/data/knowledge/content/shensha-wenchang.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-wenchang',
  title: '文昌',
  metaDescription: '文昌星与学业、文采的传统关联。',
  h1: '文昌',
  category: 'shensha',
  tags: ['文昌', '神煞'],
  sections: [
    {
      heading: '文昌的查法：以日干为主',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '文昌又名文曲，主文思、学业、考运，查法以日干为主。口诀为"甲乙巳午报，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯"。即日干甲见巳、乙见午、丙戊见申、丁己见酉、庚见亥、辛见子、壬见寅、癸见卯。',
        },
        {
          kind: 'table',
          header: ['日干', '文昌所在地支'],
          rows: [
            ['甲', '巳'],
            ['乙', '午'],
            ['丙、戊', '申'],
            ['丁、己', '酉'],
            ['庚', '亥'],
            ['辛', '子'],
            ['壬', '寅'],
            ['癸', '卯'],
          ],
        },
        {
          kind: 'paragraph',
          text: '文昌与古代星官文昌宫有关，后世命理把它附会到干支查表上。命带文昌被认为聪明好学、文思敏捷，尤其利于读书考试。这同样是查表加附会的结构。',
        },
      ],
    },
    {
      heading: '民俗含义：考运、文采与"聪明"标签',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '在传统语境中，文昌是最受家长和考生关注的神煞之一。民间有"拜文昌""戴文昌饰物求考运"的习俗，把文昌视为学业顺遂的象征。这种心理需求可以理解：考试压力大时，人们需要一种心理上的寄托。但需要清醒的是，考试成绩由学习方法、投入时间、基础水平、临场状态共同决定，和出生日天干无因果关系。',
        },
        {
          kind: 'paragraph',
          text: '把"命带文昌"当成不用努力也能考好的依据，是危险的自我安慰；把"不带文昌"当成自己不是读书料的理由，更是不必要的自我设限。任何关于学习能力的判断，都应以实际学习表现和科学的教育方法为准。',
        },
      ],
    },
    {
      heading: '理性看待：文昌是祝福符号，不是成绩单',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '文昌只是以日干查出的一个地支符号，传统附会为利文思、利考试，但它不能预测任何一次考试成绩，也不能判断一个人聪不聪明、适不适合读书。孩子是否擅长学习，应由教育引导与实际表现决定，切勿用"命带/不带文昌"给孩子贴标签。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘若命中文昌，仅标注查表结果与"传统主文思"的民俗含义，不做"必中状元""读书不行"式判断。把文昌当成一种文化上的美好祝愿即可，真正的学业成果永远来自持续的学习。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》文昌查法（日干长生前一位）整理', confidence: 'legendary' },
    { text: '文昌与星官文昌宫、拜文昌习俗见民俗学及古代科举文化资料', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'paipan-daymaster', 'why-not-predict'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，文昌查法仅作民俗参考，不构成学业、考试或教育决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
