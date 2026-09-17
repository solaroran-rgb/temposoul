/**
 * C12-知识库文章：比劫：比肩与劫财
 * 文件路径：src/data/knowledge/content/shishen-bijian.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-bijian',
  title: '比劫：比肩与劫财',
  metaDescription:
    '比肩与劫财统称比劫，是与日主五行相同的十神：同阴阳为比肩，异阴阳为劫财。本文讲清二者区分、五行关系与民俗含义。',
  h1: '比劫：比肩与劫财',
  category: 'shishen',
  tags: ['十神', '比肩', '劫财', '比劫'],
  sections: [
    {
      heading: '什么是比劫：和"我"同五行的那一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '比劫是十神里"与日主同类"的一组。当另一个天干或地支藏干的五行与日主相同，就是比劫。它内部再按阴阳细分：与日主阴阳相同的叫比肩，与日主阴阳不同的叫劫财。例如甲木日主见甲木为比肩，见乙木为劫财；乙木日主见乙木为比肩，见甲木为劫财。二者五行同源，差别只在阴阳异同所带来的气质描述差异。',
        },
        {
          kind: 'list',
          items: [
            '比肩：同我同阴阳，传统上象同辈、同行、搭档，气质偏向"并肩"。',
            '劫财：同我异阴阳，传统上象竞争、分财、亦敌亦友，气质偏向"争夺"。',
          ],
        },
        {
          kind: 'paragraph',
          text: '在五行生克里，比劫既不生我也不克我，而是"帮我"。因此传统上把它看作增强日主力量的因素：日主偏弱时，比劫被视为助力；日主已经偏强时，再见比劫则可能被视为"再添一把"，反而需要食伤泄秀或官杀约束。同是比劫，用在旺弱判断里结论会反过来，这正说明十神没有固定好坏。',
        },
      ],
    },
    {
      heading: '比劫与其他十神的关系',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '比劫最常被提到的关系是"克财"。因为财星是日主所克之物，而比劫与日主同类，等于又多了一个"来分财"的角色，所以古书常说"比劫夺财"。但要注意，这是五行层面的"同类一起来克同一个对象"，并非现实中一定会破财；它描述的是一种结构倾向，需要结合财星强弱、有无食伤通关来看。',
        },
        {
          kind: 'paragraph',
          text: '反过来，官杀（克我者）天然约束比劫，所以传统说法里"官杀制比劫"；印星（生我者）又会生出比劫，形成"印生比劫"的链条。于是一个命局里，比劫多寡往往牵动印、官杀、财三组十神：比劫太重时，常见的讨论是用官杀收束，或用食伤把过旺的精力转化出去。',
        },
        {
          kind: 'table',
          header: ['关系方向', '十神', '传统描述'],
          rows: [
            ['生比劫', '印', '印再生身，助长比劫'],
            ['比劫所克', '财', '比劫分财、夺财'],
            ['制比劫', '官杀', '官杀约束比劫'],
            ['比劫所生', '食伤', '比劫生食伤，泄秀'],
          ],
        },
      ],
    },
    {
      heading: '常见误解：见比劫就怕破财',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"比劫夺财"是五行生克的结构描述，不是现实破财判决书。日主弱、财星轻时比劫未必夺财；日主强、财多身弱时，比劫反而可能帮身任财。不要看到比肩、劫财就自动联想到赔钱或朋友反目。',
        },
        {
          kind: 'paragraph',
          text: '另一类误解是把劫财直接等同于"小人"。劫财的"争夺"义来自阴阳异性相吸式的比附，是一种气质描述，不指认现实中某个人是坏人。把它套成"你命里有小人"，既超出符号系统能说的范围，也容易制造不必要的人际焦虑。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律十神模块会把四柱中属比劫的字逐一标出比肩或劫财，并在结构描述里说明它们对日主力量的加减方向（帮身／泄身），但不输出"你会破财""你有竞争对手"之类的断语。相关搭配是否需要官杀、食伤来平衡，交由用户结合整体命局自行参考。',
        },
      ],
    },
  ],
  sources: [{ text: '据《渊海子平》比肩、劫财条目及十神生克通说整理', confidence: 'legendary' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-caixing',
    'shishen-guansha',
    'shishen-misunderstand',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
