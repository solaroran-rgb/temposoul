/**
 * C12-知识库文章：五行基础：金木水火土到底是什么
 * 文件路径：src/data/knowledge/content/wuxing-basics.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-basics',
  title: '五行基础：金木水火土到底是什么',
  metaDescription: '五行不是五种物质，而是五种运行状态。本文解释五行含义与相生相克。',
  h1: '五行基础：金木水火土到底是什么',
  category: 'wuxing',
  tags: ['五行', '基础'],
  sections: [
    {
      heading: '五行不是五种东西',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '很多人第一次听到"五行"，会以为是金、木、水、火、土五种具体物质。这是一个常见误解。在传统学说里，五行更接近"五种运行状态"或"五种功能角色"：木主生发条达，火主温热向上，土主承载化育，金主肃降收敛，水主滋润下行。古人用这五种"性"来归类世界万物的变化方式，而不是把世界拆成五种原子。',
        },
        {
          kind: 'paragraph',
          text: '五行之间靠"相生"与"相克"两套循环来描述动态关系：相生讲谁助长谁（木生火、火生土、土生金、金生水、水生木），相克讲谁约束谁（木克土、土克水、水克火、火克金、金克木）。理解了这张生克网，才算真正入门五行。',
        },
      ],
    },
    {
      heading: '木：生发与条达',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '【本义】木对应春季、东方、青色，象征种子破土、树木生长那种向外舒展、向上条达的力量。在人体类象中传统认为与肝胆、筋目相关。',
        },
        {
          kind: 'paragraph',
          text: '【生克】水生木（水滋养树木），木生火（木柴燃烧）；木克土（草木破土而出），金克木（金属可伐木）。',
        },
        {
          kind: 'paragraph',
          text: '【性格倾向】传统说法中木气偏旺者常被描述为有主见、爱生长、好表达；木气偏弱或受克者，民俗里形容为容易犹豫、不易舒展。这是文化象征描述，不是性格测评。',
        },
        {
          kind: 'paragraph',
          text: '【养生提示】传统养生观认为"春宜疏肝"，提倡春天多到户外活动、舒展筋骨、规律作息。这属于传统文化中的生活建议，不能替代医学诊疗。',
        },
      ],
    },
    {
      heading: '火：温热与向上',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '【本义】火对应夏季、南方、赤色，象征火焰升腾、温热明亮。传统类象中与心、血脉、神志相关。',
        },
        {
          kind: 'paragraph',
          text: '【生克】木生火，火生土（火烧成灰）；火克金（火能熔金），水克火（水能灭火）。',
        },
        {
          kind: 'paragraph',
          text: '【性格倾向】传统说法中火气偏旺者常被描述为热情、外向、急躁；火气不足者民俗形容为偏沉静、缺活力。同样属文化象征，不作个体断言。',
        },
        {
          kind: 'paragraph',
          text: '【养生提示】传统养生观认为"夏宜养心"，注意防暑降温、情绪平和、避免过度兴奋。这是传统文化中的起居建议，不构成医疗指导。',
        },
      ],
    },
    {
      heading: '土：承载与化育',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '【本义】土对应长夏与四季之交、中央、黄色，象征大地承载万物、化育生长。传统类象中与脾、胃、肌肉相关。',
        },
        {
          kind: 'paragraph',
          text: '【生克】火生土，土生金（金属矿藏出于土石）；土克水（土能挡水），木克土。',
        },
        {
          kind: 'paragraph',
          text: '【性格倾向】传统说法中土气偏旺者常被描述为稳重、包容、重信用；土气偏弱者民俗形容为容易缺乏安全感、做事不够踏实。属文化象征。',
        },
        {
          kind: 'paragraph',
          text: '【养生提示】传统养生观认为"脾喜燥恶湿"，提倡饮食有节、不过食生冷油腻、规律进餐。这是传统文化中的饮食建议，身体不适应就医。',
        },
      ],
    },
    {
      heading: '金：肃降与收敛',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '【本义】金对应秋季、西方、白色，象征万物收成、肃杀收敛，金属也代表坚硬与决断。传统类象中与肺、皮毛、鼻相关。',
        },
        {
          kind: 'paragraph',
          text: '【生克】土生金，金生水；金克木，火克金。',
        },
        {
          kind: 'paragraph',
          text: '【性格倾向】传统说法中金气偏旺者常被描述为果断、讲义气、有决断力；金气偏弱者民俗形容为容易优柔、不够利落。属文化象征。',
        },
        {
          kind: 'paragraph',
          text: '【养生提示】传统养生观认为"秋宜润肺"，秋季干燥注意补水、润燥、适时添衣。这是传统文化中的起居建议，不构成医疗建议。',
        },
      ],
    },
    {
      heading: '水：滋润与下行',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '【本义】水对应冬季、北方、黑色，象征水往低处流、滋润万物、潜藏流动。传统类象中与肾、骨、耳相关。',
        },
        {
          kind: 'paragraph',
          text: '【生克】金生水，水生木；水克火，土克水。',
        },
        {
          kind: 'paragraph',
          text: '【性格倾向】传统说法中水气偏旺者常被描述为聪明、灵活、善思；水气偏弱者民俗形容为容易缺乏安全感、决断不足。属文化象征。',
        },
        {
          kind: 'paragraph',
          text: '【养生提示】传统养生观认为"冬宜养藏"，提倡早睡晚起、注意保暖、收敛阳气。这是传统文化中的起居建议，身体不适请及时就医。',
        },
      ],
    },
    {
      heading: '怎么用这套知识',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '五行是古人解释世界变化的一套模型，它有文化与历史价值，但不是现代科学，更不能用来诊断疾病、预测命运或指导投资。',
        },
        {
          kind: 'paragraph',
          text: '把五行当作理解传统中医、命理、民俗文化的一把钥匙即可：知道木火土金水各自代表什么状态、彼此如何生克，再读其他五行相关内容就不会迷路。具体到个人命局的强弱喜忌，请配合排盘工具与理性判断，不要凭单一行的旺衰下结论。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《尚书·洪范》《黄帝内经》《五行大义》通行本整理', confidence: 'legendary' },
    { text: '五行生克序列与方位、季节配属据传统通行说法整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'wuxing-shengke',
    'wuxing-wangshuai',
    'wuxing-misunderstand',
    'wuxing-buyi',
    'wuxing-zangxiang',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统五行学说科普，性格与养生描述为文化象征，不构成医疗、投资或任何现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 5,
};

export default article;
