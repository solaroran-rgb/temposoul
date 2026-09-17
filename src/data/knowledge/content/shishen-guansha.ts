/**
 * C12-知识库文章：官杀：正官与七杀
 * 文件路径：src/data/knowledge/content/shishen-guansha.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-guansha',
  title: '官杀：正官与七杀',
  metaDescription:
    '正官与七杀统称官杀，是克日主的十神：异阴阳为正官，同阴阳为七杀。本文讲清二者区分、身强身弱下的不同读法及"七杀"名目的来历。',
  h1: '官杀：正官与七杀',
  category: 'shishen',
  tags: ['十神', '正官', '七杀', '官杀'],
  sections: [
    {
      heading: '什么是官杀：约束日主的那一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '官杀是十神里"克我"的一组。按五行相克，克日主的五行就是官杀。再按阴阳细分：与日主阴阳不同的叫正官，与日主阴阳相同的叫七杀（又称偏官）。例如甲木日主，金克木，见辛金为正官、见庚金为七杀；辛金日主，火克金，见丁火为七杀、见丙火为正官。',
        },
        {
          kind: 'list',
          items: [
            '正官：克我、阴阳相异，传统象规则、名分、职位、温和的约束。',
            '七杀（偏官）：克我、阴阳相同，传统象压力、竞争、刚性的约束。',
          ],
        },
        {
          kind: 'paragraph',
          text: '"七杀"之名来自"七"这个序数——在五行相生相克循环里，克我者排到第七位，又因其同性相克较为直接、不带调和，故得"杀"字。但它只是命名，不等于现实中的凶杀。官杀整体代表"外在规则对我的约束"：身强时它可以是可用的纪律与方向，身弱时它就是压在身上的负担。',
        },
      ],
    },
    {
      heading: '官杀与其他十神的关系',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '官杀的关键关系有三条：它由财所生（财生官杀），表示资源与地位会带来约束；它克比劫（官杀制比劫），表示规则收敛了竞争；它被食伤所克（食伤克官杀），也就是著名的"伤官见官"。此外，印星能化官杀——官杀生印、印生日主，把压力转成学习与庇护，这叫"官印相生"。',
        },
        {
          kind: 'table',
          header: ['关系方向', '十神', '传统描述'],
          rows: [
            ['生官杀', '财', '财生官杀，资源换地位'],
            ['官杀所生', '印', '官印相生，压力化学习'],
            ['官杀所克', '比劫', '官杀制比劫，规则收竞争'],
            ['克官杀', '食伤', '伤官见官，表达冲规则'],
          ],
        },
        {
          kind: 'paragraph',
          text: '传统所谓"杀印相生""食神制杀"，都是在处理同一个问题：官杀是压力，怎么把它用出去？有印星则化压力为学识、名分；有食神则用表达与技艺把刚性的杀控制住。这些讨论都建立在"官杀要被转化或疏导，而不是被消灭"的前提上，再次说明十神要在组合里看。',
        },
      ],
    },
    {
      heading: '常见误解：七杀＝大凶、正官＝稳当',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '七杀不是"凶险之星"，正官也不是"保送成功"。二者都是描述约束日主的五行关系；身强遇七杀可以是魄力与执行力，身弱遇正官也可能是处处受制。脱离日主强弱和有无印、食伤转化，单看名字下吉凶，是常见误用。',
        },
        {
          kind: 'paragraph',
          text: '古书里"七杀无制"被提醒，是指压力型约束没有出口时，结构上显得紧张，并不预测具体灾祸。现代读者不必因八字里出现"七杀"二字紧张；更稳妥的读法，是把它当作"你生活里规则与压力的比重如何、有没有疏导出口"的一个自我观察维度。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律会把四柱中正官、七杀逐字标出，并在结构描述里说明官杀对日主的约束方向，以及有无印星化杀、食伤制杀的链条。模块不输出"有无官运""会不会被裁"之类断语，只呈现五行关系与组合结构。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据《渊海子平》《子平真诠》正官、七杀（偏官）条目及官印相生、食神制杀通说整理',
      confidence: 'legendary',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'shishen-yinxing',
    'shishen-shishang',
    'shishen-misunderstand',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
