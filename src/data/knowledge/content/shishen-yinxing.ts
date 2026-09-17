/**
 * C12-知识库文章：印星：正印与偏印
 * 文件路径：src/data/knowledge/content/shishen-yinxing.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-yinxing',
  title: '印星：正印与偏印',
  metaDescription:
    '正印与偏印（枭神）统称印星，是生日主的十神：异阴阳为正印，同阴阳为偏印。本文讲清二者区分、生身原理与"枭神夺食"的由来。',
  h1: '印星：正印与偏印',
  category: 'shishen',
  tags: ['十神', '正印', '偏印', '枭神'],
  sections: [
    {
      heading: '什么是印星：生我、滋养我的那一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '印星是十神里"生我"的一组。按五行相生，生助日主的五行就是印。再按阴阳细分：与日主阴阳不同的叫正印，与日主阴阳相同的叫偏印。例如甲木日主，水生木，见癸水为正印、见壬水为偏印；壬水日主，金生水，见辛金为正印、见庚金为偏印。',
        },
        {
          kind: 'list',
          items: [
            '正印：生我、阴阳相异，传统象正规学习、长辈庇护、名分文书。',
            '偏印（枭神）：生我、阴阳相同，传统象偏门学问、直觉、非常规资源。',
          ],
        },
        {
          kind: 'paragraph',
          text: '印星是生扶日主的力量，日主偏弱时尤其需要它。传统上把印和比劫合称"生扶"一方，把财、官杀、食伤合称"消耗"一方——印直接把气补到日主身上。但印太多也有问题：它会克食伤（印克食伤），使表达与产出被压制，日主也可能变得依赖、懒于行动。',
        },
      ],
    },
    {
      heading: '印星与其他十神的关系',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '印星处在十神链条的枢纽：它由官杀所生（官印相生），又生出比劫（印生比劫），同时克制食伤（印克食伤），还被财所克（财克印）。所谓"枭神夺食"，就是偏印（枭）去克食神——食神代表温和的产出与口福，偏印去克它，传统上被描述为"产出被打断"。但这同样是五行关系描述，不是现实灾祸。',
        },
        {
          kind: 'table',
          header: ['关系方向', '十神', '传统描述'],
          rows: [
            ['生印', '官杀', '官印相生，压力化庇护'],
            ['印所生', '比劫', '印生比劫，继续帮身'],
            ['印所克', '食伤', '枭神夺食，学习压表达'],
            ['克印', '财', '财克印，务实压学习'],
          ],
        },
        {
          kind: 'paragraph',
          text: '理解印星的关键是"平衡"：身弱用印是补给，身强再见印则可能壅塞。所以古书既说"印为福寿之基"，也警惕"母慈灭子""印多身滞"。同一个印，在强弱不同的命局里评价可以完全相反，这再次印证十神没有固定吉凶。',
        },
      ],
    },
    {
      heading: '常见误解：印多一定有福、枭神一定克子',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '偏印（枭神）的"枭"字是命名术语，"枭神夺食"是五行生克描述，不指现实中伤害子女或亲人。把印星多少等同于福寿、把偏印等同于克害，是把古代比附当成了事实，不应据此做家庭或人生判断。',
        },
        {
          kind: 'paragraph',
          text: '传统里"正印为母""偏印为继母／偏母"之类对应，来自古代家庭结构的比附，现代社会的养育、代际关系远比这复杂。印星的合理读法，是观察一个人获取知识、获得庇护、以及"过度依赖庇护"的倾向，而非指认具体亲属。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律会把四柱中正印、偏印逐字标出，并结合五行计数说明印星对日主的生扶方向，以及它与食伤、财、官杀之间是否壅塞。模块不使用"克母""克子"式表述，只描述五行生扶与表达被压制的结构倾向。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据《渊海子平》《三命通会》正印、偏印（枭神）条目及枭神夺食通说整理',
      confidence: 'legendary',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-guansha',
    'shishen-bijian',
    'shishen-misunderstand',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
