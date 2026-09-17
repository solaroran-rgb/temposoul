/**
 * C12-知识库文章：民俗与事实：怎么区分命理中的文化传统与可验证结构
 * 文件路径：src/data/knowledge/content/why-folk-vs-fact.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-folk-vs-fact',
  title: '民俗与事实：怎么区分命理中的文化传统与可验证结构',
  metaDescription: '排盘结构可复算，吉凶解读属民俗。本文教你分辨二者。',
  h1: '民俗与事实：怎么区分命理中的文化传统与可验证结构',
  category: 'boundary',
  tags: ['民俗', '方法论'],
  sections: [
    {
      heading: '命理里其实混着两种东西',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '翻开任何一本传统命理书，你会看到两类内容并排出现：一类是"规则"，比如某年立春后换年柱、某节气换月柱、六十甲子循环；另一类是"解释"，比如"七杀主威权""桃花主人缘"。前者像历法，后者像文学与哲学。把它们混着读，是初学者最大的困惑来源。',
        },
        {
          kind: 'paragraph',
          text: '命律把这两层拆开标注：可复算的规则层，和属于文化传统的解释层。学会分辨这两层，你就不会把"今天宜嫁娶"这种宜忌当成和天气一样的客观事实。',
        },
      ],
    },
    {
      heading: '什么是可验证结构',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '历法规则：干支年、干支月、干支日、干支时的推算。',
            '节气分界：二十四节气交节时刻，可查天文历表。',
            '五行计数：一个八字里金木水火土各出现几次。',
            '关系查表：天干五合、地支六合六冲、三合局，都是定义好的查表。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这些内容的共同点是：给你一个输入（出生时间）和一套公开规则，任何人按规则都能得到同样结果。错了就是算法或数据错了，可以修、可以验。',
        },
      ],
    },
    {
      heading: '什么是民俗解释',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '凡是回答"这代表你命好命坏、财运如何、感情顺逆"的内容，都属于民俗解释。它来自历代文献与口传，版本众多、无法证伪，不应被当作事实来执行。',
        },
        {
          kind: 'list',
          items: [
            '十神性情："正官正直、七杀刚烈"是传统形容，不是人格诊断。',
            '神煞吉凶：桃花、驿马、华盖等，是辅助符号，不是事件预言。',
            '宜忌断语：黄历上的"宜出行""忌动土"属民俗择吉，非安全提示。',
          ],
        },
      ],
    },
    {
      heading: '一个简单的分辨练习',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '分辨对照表',
          header: ['句子', '属于哪一层', '怎么对待'],
          rows: [
            ['2026 年 2 月 4 日立春', '可验证结构', '可查历表核对'],
            ['立春后年柱换到丙午', '可验证结构', '按规则复算'],
            ['丙午年火旺，你今年机会多', '民俗解释', '当文化参考读'],
            ['今日宜签约', '民俗择吉', '不据此安排合同'],
          ],
        },
        {
          kind: 'paragraph',
          text: '养成这个习惯：看到一句判断，先问"它是按规则算出来的，还是某本文献这么形容的？"前者可以核对，后者应当欣赏但不必照做。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为方法论科普。民俗解释部分不构成任何现实决策建议，健康、法律、投资等事项请咨询专业人士。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《协纪辨方书》《渊海子平》通行本及历法常识整理', confidence: 'legendary' },
    { text: '可复算历法规则参考现代天文历算普及资料', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['why-confidence', 'why-data-source', 'why-bazi-limits', 'why-not-predict'],
  confidence: 'verified',
  disclaimer: '本文为方法论科普，民俗内容不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
