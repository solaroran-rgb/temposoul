/**
 * C12-知识库文章：食伤：食神与伤官
 * 文件路径：src/data/knowledge/content/shishen-shishang.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-shishang',
  title: '食伤：食神与伤官',
  metaDescription:
    '食神与伤官统称食伤，是日主所生的十神：同阴阳为食神，异阴阳为伤官。本文讲清二者区分、泄秀原理与民俗含义。',
  h1: '食伤：食神与伤官',
  category: 'shishen',
  tags: ['十神', '食神', '伤官', '食伤'],
  sections: [
    {
      heading: '什么是食伤：日主"生出来"的那一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '食伤是十神里"日主所生"的一组。按五行相生，木生火、火生土，日主把自己的气"泄"出去，所生的那个五行就是食伤。再按阴阳细分：与日主阴阳相同的叫食神，与日主阴阳不同的叫伤官。例如甲木日主，火是其所生，见丙火为食神、见丁火为伤官；丙火日主，土是其所生，见戊土为食神、见己土为伤官。',
        },
        {
          kind: 'list',
          items: [
            '食神：同我所生、阴阳相同，传统象口福、从容的产出、温和的表达。',
            '伤官：我所生、阴阳不同，传统象锋芒、才情、不服管束的表达。',
          ],
        },
        {
          kind: 'paragraph',
          text: '因为食伤是"我生"，它在力量上会消耗日主，传统称为"泄秀"——把日主的能量向外释放。日主偏强时，泄秀通常被视为好事，代表才华有出口；日主已经偏弱时，再见重食伤可能被视为"泄得太过"，需要印星（生我者）来制食伤、同时生身。',
        },
      ],
    },
    {
      heading: '食伤与其他十神的关系',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '食伤最关键的一条关系是"生财"：日主生食伤，食伤又生财，形成"我→食伤→财"的流通链条。所以传统上常说食伤是"财的源头"，代表产出、技艺、想法可以转化为资源。另一条是"克官杀"：食伤是我生，官杀是克我，五行上我生者克制克我者，于是有了著名的"伤官见官"讨论。',
        },
        {
          kind: 'table',
          header: ['关系方向', '十神', '传统描述'],
          rows: [
            ['生食伤', '比劫', '比劫生食伤，帮身泄秀'],
            ['食伤所生', '财', '食伤生财，产出变现'],
            ['食伤所克', '官杀', '伤官见官，与规则冲突'],
            ['制食伤', '印', '印克食伤，收束表达'],
          ],
        },
        {
          kind: 'paragraph',
          text: '"伤官见官"之所以被古书反复提醒，是因为伤官代表不受约束的表达，正官代表规则、职位、名分，二者在五行上天然相克。但它不是逢见必凶：若命局有财星居中通关（伤官生财、财生官），冲突可被缓冲；若日主强、伤官旺而无制，才更多被描述为与权威、体制的摩擦倾向。',
        },
      ],
    },
    {
      heading: '常见误解：伤官一定不好、一定克夫',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"伤官"的"伤"字是命名术语，不是"伤害"。它描述的是日主以阴阳相异的方式泄秀，不指现实中的克害、灾祸或婚姻不幸。把"伤官见官"直接读成"婚姻破裂／得罪领导"，是把民俗比喻当成了事实断言。',
        },
        {
          kind: 'paragraph',
          text: '古代命书里"伤官克夫"之类的说法，建立在"正官为夫星"这一古代性别角色比附之上。现代社会的婚姻、职业结构早已不同，这类断语没有可证伪的现实依据，更不应用来评判任何人的感情或事业。食神、伤官的合理读法，是看一个人表达与产出的倾向，而非下人事判决。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律会把四柱中食神、伤官逐字标出，并在结构描述里提示食伤对日主的泄秀方向，以及它与财、官杀、印之间的生克链条是否通畅。模块不使用"克夫""克官"式表述，只描述五行流通与表达倾向。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《神峰通考》食神、伤官条目及伤官见官通说整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-caixing',
    'shishen-guansha',
    'shishen-yinxing',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
