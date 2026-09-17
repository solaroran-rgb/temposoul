/**
 * C12-知识库文章：财星：正财与偏财
 * 文件路径：src/data/knowledge/content/shishen-caixing.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-caixing',
  title: '财星：正财与偏财',
  metaDescription:
    '正财与偏财统称财星，是日主所克的十神：异阴阳为正财，同阴阳为偏财。本文讲清二者区分、身强身弱与"财多身弱"的含义。',
  h1: '财星：正财与偏财',
  category: 'shishen',
  tags: ['十神', '正财', '偏财', '财星'],
  sections: [
    {
      heading: '什么是财星：日主"克得住"的那一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '财星是十神里"日主所克"的一组。按五行相克，木克土、土克水……日主所能克制的五行就是财。再按阴阳细分：与日主阴阳不同的叫正财，与日主阴阳相同的叫偏财。例如甲木日主，土是其所克，见己土为正财、见戊土为偏财；戊土日主，水是其所克，见癸水为正财、见壬水为偏财。',
        },
        {
          kind: 'list',
          items: [
            '正财：我克、阴阳相异，传统象稳定收入、务实经营、可掌握的资源。',
            '偏财：我克、阴阳相同，传统象流动资源、意外之财、人缘之财。',
          ],
        },
        {
          kind: 'paragraph',
          text: '财星在五行上消耗日主（我去克物要出力），所以它和印星、比劫分别站在"消耗我"与"生扶我"两侧。理解财星的关键，不是财越多越好，而是日主是否"担得住"——身强能任财，财星才是可用资源；身弱财重，传统称为"财多身弱"，象看着机会很多却消耗不动。',
        },
      ],
    },
    {
      heading: '财星与其他十神的关系',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '财星是十神链条里的"被生"与"被克"交汇点：它由食伤所生（食伤生财），又被比劫所克（比劫夺财）；同时财星生官杀（财生官），财星又克印星（财克印）。这条链条决定了单看财星数量没有意义——要先看有没有食伤这个"源头"，再看日主能不能担，最后看有没有比劫来分。',
        },
        {
          kind: 'table',
          header: ['关系方向', '十神', '传统描述'],
          rows: [
            ['生财', '食伤', '食伤生财，产出变现'],
            ['财所生', '官杀', '财生官杀，资源换约束'],
            ['财所克', '印', '财克印，务实压过学习'],
            ['克财', '比劫', '比劫夺财，多人分利'],
          ],
        },
        {
          kind: 'paragraph',
          text: '所谓"财多身弱"，就是命局里财星很重、而生扶日主的印比很轻。这时传统讨论的不是"怎么发财"，而是"怎么先把日主扶起来"——常见方向是用比劫帮身或印星生身，而不是一味去追财。这再次说明十神要放在整体强弱里读，不能孤立数财星个数。',
        },
      ],
    },
    {
      heading: '常见误解：财星多＝有钱人',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '财星是五行生克关系的符号，不对应现实银行存款。"财多身弱""无财星"都不是贫富预言；把八字财星数量等同于财富水平，既忽略了日主强弱，也忽略了时代、地域、教育、职业等现实决定因素。',
        },
        {
          kind: 'paragraph',
          text: '另一类误解是把正财、偏财直接套成"正职工资＝正财、炒股彩票＝偏财"。这种对应只是后世比附，古人所谓正偏财更多指稳定与流动、公开与人缘之别，并不精确等于现代收入科目。用来做自我观察可以，当成理财依据则不可。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律会把四柱中正财、偏财逐字标出，并结合五行计数给出日主强弱的结构描述，提醒用户财星需看"源头（食伤）—担财能力（印比）—是否被分（比劫）"三段，而不是数财星个数。模块不输出财运预测或投资建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》正财、偏财条目及财多身弱通说整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-shishang',
    'shishen-bijian',
    'shishen-yinxing',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何投资、理财或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
