/**
 * C12-知识库文章：排盘工具怎么选
 * 文件路径：src/data/knowledge/content/paipan-tools.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-tools',
  title: '排盘工具怎么选',
  metaDescription:
    '用万年历、排盘软件还是手算？本文讲清靠谱排盘工具应具备的几项能力：节气精确、真太阳时、夏令时、藏干与边界提示，并说明工具只排不断。',
  h1: '排盘工具怎么选',
  category: 'paipan',
  tags: ['排盘工具', '万年历', '软件'],
  sections: [
    {
      heading: '一个靠谱排盘工具至少该做对什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '排盘是可复算的技术活，工具之间的差别主要在"算得对不对"，而不是"解读神不神"。选工具时，与其看它的断语多花哨，不如看它有没有把几件基础事做对：是否按真实天文节气精确到交节时刻换年换月、是否支持真太阳时校正、是否处理夏令时与时区、是否显示地支藏干、是否在交节或夜子时边界给出提示。',
        },
        {
          kind: 'list',
          items: [
            '节气：换年换月用当年精确交节时刻，而非按月份估算。',
            '真太阳时：可按出生地经度校正，并显示校正前后时间。',
            '夏令时：对 1986–1991 年出生者提示回拨。',
            '藏干与十神：地支藏干计入五行与十神标注。',
            '边界提示：交节、夜子时、跨日附近给出敏感提示。',
          ],
        },
      ],
    },
    {
      heading: '手算、万年历与软件各有何用',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '手算适合理解原理：用日柱推算公式、五鼠遁起时，能让你真正明白每个字怎么来。但日常排盘靠手算容易在节气时刻、均时差上出错。纸质万年历可核对四柱干支，但通常不自动做真太阳时和夏令时。现代排盘软件把这几步自动化，效率高，但前提是它内部用的天文表和规则靠谱——所以仍建议用权威万年历交叉核对一次关键四柱。',
        },
        {
          kind: 'table',
          header: ['方式', '优点', '局限'],
          rows: [
            ['手算', '理解原理、可教学', '节气/均时差易错'],
            ['纸质万年历', '干支可核对', '不自动校时/夏令时'],
            ['排盘软件', '自动化、快', '需核对其规则是否透明'],
          ],
        },
        {
          kind: 'paragraph',
          text: '无论用哪种方式，排完都建议自查三件事：年柱是否按立春而非元旦、月柱是否按节气而非公历月、时柱是否考虑出生地与夏令时。这三处是历史上最常见的错误来源。',
        },
      ],
    },
    {
      heading: '边界：工具负责排盘，不负责断命',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '排盘工具的价值在于把干支算对，而不在于它弹出的"性格分析""运势预测"。越是用华丽断语吸引你的工具，越要警惕——那些解读既不可证伪，也不该用来指导现实决策。',
        },
        {
          kind: 'paragraph',
          text: '好的排盘工具会把"可核验的数据"和"民俗性解读"分开，告诉你哪些是查表可得的事实，哪些是某种流派的解释。命律的排盘页即按这一原则设计：先给可核对的四柱与参数，再分层给出标注了来源的解释。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律排盘页按上述清单实现：精确节气、可选真太阳时、夏令时提示、藏干与十神标注、边界敏感提示，并在结果旁列出所用参数，方便你和其他万年历交叉核对。',
        },
      ],
    },
  ],
  sources: [{ text: '据排盘软件功能项与万年历核对通行实践整理', confidence: 'probable' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'paipan-overview',
    'paipan-true-solar-time',
    'paipan-jieqi',
    'paipan-lunar-solar',
    'paipan-faq',
  ],
  confidence: 'legendary',
  disclaimer: '本文为排盘工具选型科普，不构成对任何具体软件的背书，亦不构成现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
