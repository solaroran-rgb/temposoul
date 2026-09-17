/**
 * C12-知识库文章：十神常见误解清单
 * 文件路径：src/data/knowledge/content/shishen-misunderstand.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shishen-misunderstand',
  title: '十神常见误解清单',
  metaDescription:
    '把十神当吉凶标签、把"缺五行"当缺补、把格局当终身判决、把六亲比附当现实断语——本文逐条澄清对十神的四类典型误用。',
  h1: '十神常见误解清单',
  category: 'shishen',
  tags: ['十神', '误区', '理性'],
  sections: [
    {
      heading: '误解一：十神名字自带吉凶',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '最普遍的误解，是看到"七杀、伤官、枭神、劫财"就觉得凶，看到"正官、正印、正财、食神"就觉得吉。实际上十神只是五个五行关系（同我、我生、我克、克我、生我）乘以阴阳异同得到的位置标签。同一个七杀，身强时是魄力与执行力，身弱无制时才是压力；同一个正印，身弱时是补给，身强时可能是壅塞。名字不决定好坏，整体强弱和组合才决定它怎么读。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '没有天生为吉或天生为凶的十神。任何"见某神必好／必坏"的说法，都跳过了日主强弱与生克组合这一必要前提，应视为不严谨的简化。',
        },
      ],
    },
    {
      heading: '误解二：八字缺某五行＝必须补',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第二类误解是数五行个数："我八字缺火，所以要穿红、补火。"八字五行分布只是描述日主与各干支的力量对比，"缺"只说明某五行在原局不出现，并不自动等于"需要补"，更不对应现实中某种健康或运气问题。是否需要、以什么方式参考，要结合月令与整个生克链条判断；而把它升级成"改运配方"，则超出了符号系统本身。',
        },
        {
          kind: 'paragraph',
          text: '同理，"五行全就好、五行缺就差"也是伪判断。历史上大量五行不全的结构被认为可以成立，关键在于流通与平衡，而非凑齐金木水火土五个数。',
        },
      ],
    },
    {
      heading: '误解三：定了格局就是一辈子',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第三类误解是把某个格局名（如"食神生财""杀印相生"）当成终身标签。格局只是强调某组十神关系特别突出，它要放在大运、流年的动态变化里看：原局顺的方向在不同大运可能被加强或被打断。把静态格局当终身判决书，既忽视了时间维度，也忽视了个人选择与环境变化。',
        },
      ],
    },
    {
      heading: '误解四：十神可以直接断人事',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第四类，也是越界最远的一类，是把十神直接读成现实事件："财星旺＝发财""官杀现＝升官""食伤旺＝子女出息""比劫夺财＝被朋友骗"。这些断语把五行关系符号直接等同于可观察的生活事件，既不可证伪，也忽略了时代、地域、教育、机遇等现实变量。十神能提供的，是一套关于"自我、表达、资源、规则、学习"的倾向描述，而不是事件预言。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '十神内容是民俗性的自我观察框架，不构成医疗、法律、投资、婚恋、职业等现实决策依据。凡用十神对你或他人的健康、财富、婚姻下确定性结论的，都应保持警惕。',
        },
        {
          kind: 'paragraph',
          text: '理性的使用方式是：把它当作一面传统文化的镜子，帮助你梳理自己"在自我主张、表达输出、资源态度、规则感受、学习方式"上的倾向，然后回到现实里做可验证的决策。这也是命律在呈现十神时坚持"可核验层／民俗层／边界层"三层分离的原因。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据《子平真诠》《滴天髓》对格局与用神的辩证论述及现代理性命理讨论整理',
      confidence: 'legendary',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'why-not-predict',
    'shishen-combo',
    'shishen-liuqin',
    'bazi-intro',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成任何医疗、投资、婚恋或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
