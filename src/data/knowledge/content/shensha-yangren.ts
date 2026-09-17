/**
 * 知识库文章：羊刃
 * 文件路径：src/data/knowledge/content/shensha-yangren.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-yangren',
  title: '羊刃',
  metaDescription: '羊刃的查法与"刚烈"特质的传统描述。',
  h1: '羊刃',
  category: 'shensha',
  tags: ['羊刃', '神煞'],
  sections: [
    {
      heading: '羊刃的查法：阳干帝旺位',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '羊刃（也作阳刃）以日干为主，查的是日干在十二长生中"帝旺"那一隅的地支。传统上羊刃只论阳干（甲丙戊庚壬），阴干不论：甲见卯、丙见午、戊见午、庚见酉、壬子见子。其结构含义是日干五行旺到极处，物极必反，故以"刀刃"喻之。',
        },
        {
          kind: 'table',
          header: ['日干（阳干）', '羊刃所在地支'],
          rows: [
            ['甲', '卯'],
            ['丙', '午'],
            ['戊', '午'],
            ['庚', '酉'],
            ['壬', '子'],
          ],
        },
        {
          kind: 'paragraph',
          text: '部分流派也把阴干的前一位（如乙见辰、丁己见未、辛见戌、癸见丑）称作"阴刃"，但主流子平法一般只论阳干羊刃。命律采用主流约定，只在阳干命中时标注羊刃。',
        },
      ],
    },
    {
      heading: '传统描述：刚极易折，双刃之象',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '古书中把羊刃描述为"刚烈、果断、冲动、好胜"。命带羊刃者被说成性格刚强、有冲劲、不服输，但也容易急躁、易与人冲突。因为它是日干旺极的位置，所以传统认为羊刃太重需要有制化（如官杀制刃），否则"刚极易折"。这种描述本质上是对"日主偏旺、性格外向刚强"这一五行状态的形象化命名。',
        },
        {
          kind: 'paragraph',
          text: '需要注意，"刚强"并不等于"凶命"，羊刃也绝非坏东西。很多有开拓性、执行力强的人被描述为带羊刃；关键在于整体命局是否有平衡。单凭"命中羊刃"就说此人危险、克亲、易有血光，是把一个结构符号妖魔化。',
        },
      ],
    },
    {
      heading: '理性看待：羊刃是"旺"的比喻，不是性格判决',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '羊刃只是日干帝旺位的查表符号，传统附会为性格刚烈，但它不能预测一个人是否会有暴力倾向、是否容易受伤、是否克亲克配偶。切勿因"命带羊刃"而给自己或他人贴"危险""暴躁"标签，更不应据此做出婚姻、合作等人际判断。情绪管理是现实教养问题，与干支无关。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘若命中羊刃，仅标注查表结果与"传统主刚"的民俗含义，不做"血光""克夫克妻"式断言。性格是否急躁、如何与人相处，是可通过自我觉察与现实沟通改善的，不应被一个神煞标签固定化。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》羊刃（阳干帝旺位）查法整理', confidence: 'legendary' },
    { text: '羊刃"刚极易折、需官杀制化"的论述见传统子平典籍，属命理释义', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'ganzhi-shengwang', 'wuxing-wangshuai'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，羊刃查法仅作民俗参考，不构成性格、婚姻或人身安全判断。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
