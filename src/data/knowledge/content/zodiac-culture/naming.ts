/**
 * 知识库文章：生肖取名宜忌
 * 文件路径：src/data/knowledge/content/zodiac-culture\naming.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-naming',
  title: '生肖取名宜忌：偏旁部首说法的由来与边界',
  metaDescription: '民间有"属鼠宜用米字旁、属马忌用田字旁"等说法。本文梳理生肖取名民俗的来源与理性看待。',
  h1: '生肖取名宜忌：偏旁部首说法的由来与边界',
  category: 'zodiac-culture',
  tags: ['生肖', '取名', '民俗'],
  sections: [
    {
      heading: '什么是生肖取名宜忌',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '民间取名时有一套"生肖宜用字""生肖忌用字"的说法：例如说属鼠的人名字里宜带"米、豆、禾、口"等字，寓意有粮吃、有住处；说属马的人忌用"田"字头，因为马下地干活辛苦；说属虎的人宜带"王、林、月"，因为虎居山林、额有王纹。这类说法把动物的生活习性投射到了汉字偏旁上。',
        },
        {
          kind: 'paragraph',
          text: '它本质上是一种讨口彩的民俗：用偏旁寄托对孩子衣食无忧、自在顺遂的祝愿，而不是一套有严格逻辑的演算体系。不同流派给出的宜忌表常常互相矛盾，并没有统一标准答案。',
        },
      ],
    },
    {
      heading: '常见宜忌举例',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '生肖取名常见宜用说法（民间版本，仅供了解）',
          header: ['生肖', '常见"宜"字偏旁', '常见"忌"说法'],
          rows: [
            ['鼠', '米、豆、禾、宀、口', '日、火（怕光怕晒的想象）'],
            ['牛', '艹、禾、水、宀', '心、忄（荤食不食草牛）'],
            ['虎', '王、君、令、林、月', '人、彳（伤人的联想）'],
            ['兔', '艹、禾、月、宀', '日、雄（怕被猎的想象）'],
            ['马', '艹、木、禾、麦、宀', '田、车、火（劳作辛苦说）'],
            ['羊', '艹、禾、木、金、玉', '心、忄、车（食肉不食草说）'],
          ],
        },
        {
          kind: 'paragraph',
          text: '上表只是众多民间版本中的一种，用来帮助你理解这套说法的思路，并非权威标准。',
        },
      ],
    },
    {
      heading: '理性看待：取名的真正依据',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '生肖偏旁取名是民俗祝吉，不是科学。它不能决定一个孩子的命运，也不必为了"避忌"而放弃一个音义都很好的字。',
        },
        {
          kind: 'paragraph',
          text: '给孩子取名更值得花精力的，是读音顺口、寓意积极、不易起外号、不生僻难写、且在户籍系统中能正常登记。把生肖宜忌当作一种文化趣味来参考可以，把它当成取名的硬门槛则会舍本逐末。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为取名民俗科普，不构成姓名学结论，也不推荐任何具体用字或改名服务。',
        },
      ],
    },
  ],
  sources: [
    { text: '据民间生肖取名宜忌通行版本整理（多版本并存）', confidence: 'legendary' },
    { text: '生肖与动物习性的文化关联据民俗常识整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['zodiac-legend', 'zodiac-compat', 'wuxing-buyi', 'why-folk-vs-fact'],
  confidence: 'legendary',
  disclaimer: '本文为生肖取名民俗科普，属传统文化参考，不构成姓名学结论或现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
