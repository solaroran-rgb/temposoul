/**
 * C12-知识库文章：理性命理宣言
 * 文件路径：src/data/knowledge/content/why-rational-decl.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-rational-decl',
  title: '理性命理宣言',
  metaDescription: '命律的产品纲领：尊重传统、标明证据、不做断言、不承诺效果。',
  h1: '理性命理宣言',
  category: 'boundary',
  tags: ['宣言', '产品理念'],
  sections: [
    {
      heading: '我们为什么做命律',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '中国传统命理是一整套延续千年的时间观、符号系统与自我叙述方式。它有趣、有文化深度，也确实陪伴过无数人整理自己的人生。但它同时也被滥用：被包装成预测工具、焦虑生意、甚至诈骗话术。命律想做的，是把这套传统中"可理解、可核对、可对话"的部分保留下来，把它被滥用的部分切掉。',
        },
        {
          kind: 'paragraph',
          text: '我们不假装命理是科学，也不假装它毫无价值。我们的立场是中间的、克制的：把它当一种有历史厚度的文化解释语言，诚实地告诉你哪部分能算、哪部分只是说法。',
        },
      ],
    },
    {
      heading: '四条产品纲领',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '纲领一·尊重传统：我们认真对待经典文献，不歪曲、不戏说，把十神、五行、神煞按其历史语境介绍。',
            '纲领二·标明证据：每一条结论标注置信度，区分可复算规则与民俗说法，不把后者包装成事实。',
            '纲领三·不做断言：不预测具体事件，不打吉凶分数，不承诺"改运"效果，不下"你命里如何"的判决书。',
            '纲领四·不越专业：健康找医生，法律找律师，投资自己尽调；命律不替代任何专业服务。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '命律不提供医疗诊断、法律意见、投资建议，也不承诺任何改运、招财、催桃花的效果。任何把本站内容当作这类建议使用的行为，风险由使用者自行承担。',
        },
      ],
    },
    {
      heading: '我们反对什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '我们反对把命理变成恐吓生意：用"你今年有灾""不化解就会出事"来逼迫用户付费。我们反对伪精确：用一个无法解释的分数制造焦虑。我们反对越界：把民俗解读说成医学诊断或法律结论。我们也反对把传统庸俗化成"幸运色、幸运数字"的消费话术。',
        },
        {
          kind: 'paragraph',
          text: '如果一个产品需要靠让你害怕来赚钱，它就不是在帮你理解自己，而是在利用你的不安。',
        },
      ],
    },
    {
      heading: '我们希望你怎么用命律',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '把命律当成一面文化镜子：它用传统语言帮你换一个角度看自己的节奏与倾向，你带着现实的常识去对照、去取舍。看得懂的部分，当自我对话；看不懂的部分，就当了解一段传统。做决定时，回到现实、回到专业、回到你信任的人。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '这是命律的产品纲领。本站全部内容属民俗参考，不构成任何医疗、法律、投资或人生重大决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '命律产品纲领（内部）', confidence: 'verified' },
    {
      text: '传统命理经典《渊海子平》《三命通会》《五行大义》相关论述整理',
      confidence: 'legendary',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'why-no-fortune-score',
    'why-not-predict',
    'why-confidence',
    'why-bazi-limits',
    'why-ai-boundary',
  ],
  confidence: 'verified',
  disclaimer: '本文为产品纲领，全部相关内容属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
