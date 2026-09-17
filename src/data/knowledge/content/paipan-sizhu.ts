/**
 * C12-知识库文章：四柱：年月日时四组干支
 * 文件路径：src/data/knowledge/content/paipan-sizhu.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-sizhu',
  title: '四柱：年月日时四组干支',
  metaDescription:
    '四柱是年、月、日、时四组干支，各由一天干一地支组成。本文讲清四柱各自的结构、天干地支如何搭配，以及"日柱为我"的读法。',
  h1: '四柱：年月日时四组干支',
  category: 'paipan',
  tags: ['四柱', '天干', '地支'],
  sections: [
    {
      heading: '四柱的结构：一柱＝一干一支',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '四柱就是年柱、月柱、日柱、时柱四组。每柱由一个天干加一个地支组成，共两个字，四柱合计八个字，这就是"八字"名称的由来。天干有十个：甲乙丙丁戊己庚辛壬癸；地支有十二个：子丑寅卯辰巳午未申酉戌亥。天干按阳奇阴偶分阴阳：甲丙戊庚壬为阳，乙丁己辛癸为阴；地支子寅辰午申戌为阳，丑卯巳未酉亥为阴。',
        },
        {
          kind: 'list',
          items: [
            '年柱：出生年的干支，如甲子，记录这一年的时间标号。',
            '月柱：出生月令的干支，如丙寅，记录这个节气月。',
            '日柱：出生日的干支，如戊午，其中日干又称日主、日元，是十神的"我"。',
            '时柱：出生时辰的干支，如庚申，记录这一时段。',
          ],
        },
        {
          kind: 'paragraph',
          text: '天干和地支不是任意配对，而是按"阳干配阳支、阴干配阴支"依次顺排，从甲子开始到癸亥结束，共六十组，称为六十甲子，循环记日记年。所以知道某一天是甲子日，就能推出前后各天的干支，日柱因此可以精确复算。',
        },
      ],
    },
    {
      heading: '为什么日柱最重：日干是十神的原点',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '四柱里，日柱的日干（又称日主、日元）被当作"我"。其余天干和所有地支藏干，都要相对这个日干来贴十神标签。换句话说，没有日柱就没有十神；日柱一旦排错，整张盘的十神关系全部跟着错。这也是为什么日柱推算被视为排盘的核心。',
        },
        {
          kind: 'paragraph',
          text: '地支本身还"藏"有一个到三个天干（称人元藏干），例如寅藏甲丙戊。排盘时除了看表面的地支，还要把藏干也算进五行和十神里。所以八字实际参与分析的干支，不止表面八个，还包括各支藏干。',
        },
      ],
    },
    {
      heading: '边界：四柱是编码，不是人格画像',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '四柱只是把出生时间编码成干支符号，不直接描述性格、命运或健康。把"日主甲木"读成"你一定像大树一样正直"，是把天干象征当成了人格测试；符号与现实人格之间没有可证伪的对应。',
        },
        {
          kind: 'paragraph',
          text: '另外要避免把四柱和星座、生肖混为一谈：生肖只是年支一个字，而八字要看年月日时八个字加藏干；用"你属什么"代替整套排盘，信息损失极大。同理，年柱只代表你出生那年立春后的时间标号，不决定性格或命运。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律把四柱以"年／月／日／时"四列并排展示，每列显示天干、地支及其藏干，并把日干单独高亮为"日主"，再据此标注其余各字的十神角色。用户可直接对照万年历核对每柱干支。',
        },
      ],
    },
  ],
  sources: [{ text: '据天干地支、六十甲子通行排列及地支藏干通说整理', confidence: 'verified' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'paipan-overview',
    'paipan-daymaster',
    'paipan-jieqi',
    'ganzhi-overview',
    'bazi-intro',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统历法科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
