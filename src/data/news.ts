//  完整 KnowledgeArticle, 字段逐字命中契约 (A.2-5)
// ============================================================
import type { KnowledgeArticle } from '@/data/knowledge/schema';

export const NEWS_META = {
  listTitle: '运势资讯',
  listDescription: '汇集姓名学、历法、占星、民俗等领域的文化资讯与趋势观察。',
  publishedAt: '2026-09-16',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export const newsArticles: KnowledgeArticle[] = [
  {
    slug: '2026-qiu-fen-xing-xiang-guan-cha',
    title: '秋分将至：星象观察与文化习俗漫谈',
    metaDescription: '从天文历法到民俗习惯，了解秋分在传统时间体系中的位置。',
    h1: '秋分将至：星象观察与文化习俗漫谈',
    category: 'zodiac-culture',
    tags: ['秋分', '星象', '民俗', '历法'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '秋分是二十四节气之一，是传统历法中昼夜平分的标志性时刻。' }] },
      { heading: '天文背景', level: 2, blocks: [
        { kind: 'paragraph', text: '秋分时太阳直射赤道，全球大部分地区昼夜接近等长。' },
        { kind: 'callout', tone: 'folk', text: '本文仅作文化知识介绍，不构成天文观测建议。' },
      ]},
      { heading: '民俗与时间观念', level: 2, blocks: [
        { kind: 'paragraph', text: '在传统农业社会中，秋分与收获、祭月等活动密切相关。' },
        { kind: 'list', items: ['部分地区有秋分祭月的习俗', '秋分曾是农事节奏的参考节点', '现代更多作为季节转换的文化标记'] },
      ]},
    ],
    sources: [
      { text: '《中国天文年历》相关节气说明', confidence: 'verified' },
      { text: '地方民俗志中的节气记录', confidence: 'probable' },
    ],
    citationStrategy: 'paraphrase',
    reviewedBy: '内容编辑组',
    ready: true,
    relatedSlugs: ['2026-zhong-qiu-yue-xiang-wen-hua'],
    confidence: 'verified',
    disclaimer: '本文为文化知识介绍，不构成运势预测或生活决策建议。',
    updatedAt: '2026-09-16',
  readingMinutes: 5,
  },
  {
    slug: '2026-zhong-qiu-yue-xiang-wen-hua',
    title: '中秋月相与传统文化中的月亮意象',
    metaDescription: '从月相变化到诗词典故，梳理月亮在中国传统文化中的多重意象。',
    h1: '中秋月相与传统文化中的月亮意象',
    category: 'boundary',
    tags: ['中秋', '月相', '传统文化', '诗词'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '中秋以月圆为标志，月亮承载着团圆、思念与审美等多重意象。' }] },
      { heading: '月相与历法', level: 2, blocks: [{ kind: 'paragraph', text: '农历以月相变化为基础，十五前后通常对应满月。' }] },
      { heading: '诗词中的月亮', level: 2, blocks: [
        { kind: 'paragraph', text: '从"举头望明月"到"千里共婵娟"，月亮常被用来表达思念与祝愿。' },
        { kind: 'quote', text: '但愿人长久，千里共婵娟。' },
      ]},
    ],
    sources: [
      { text: '《全宋词》苏轼《水调歌头》', confidence: 'verified' },
      { text: '《荆楚岁时记》相关节俗记载', confidence: 'probable' },
    ],
    citationStrategy: 'paraphrase',
    reviewedBy: '内容编辑组',
    ready: true,
    relatedSlugs: ['2026-qiu-fen-xing-xiang-guan-cha'],
    confidence: 'verified',
    disclaimer: '本文为文化知识介绍，不构成运势预测。',
    updatedAt: '2026-09-14',
  readingMinutes: 5,
  },
  {
    slug: '2026-xing-zuo-xing-qu-diao-cha',
    title: '星座文化兴趣观察：从娱乐到身份表达',
    metaDescription: '梳理星座文化在当代社交语境中的流行现象。',
    h1: '星座文化兴趣观察：从娱乐到身份表达',
    category: 'zodiac-culture',
    tags: ['星座', '流行文化', '社交', '娱乐'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '星座文化在当代社交平台中广泛流行，既是娱乐话题，也常被用作自我表达。' }] },
      { heading: '流行现象', level: 2, blocks: [
        { kind: 'paragraph', text: '星座话题常见于社交媒体的日常讨论，通常以轻松娱乐方式呈现。' },
        { kind: 'callout', tone: 'boundary', text: '星座性格描述属娱乐化表达，不具备科学验证依据，不应作为判断标准。' },
      ]},
      { heading: '文化功能', level: 2, blocks: [{ kind: 'paragraph', text: '从文化研究角度看，星座话题提供了一种低门槛的社交语言。' }] },
    ],
    sources: [{ text: '社交平台公开话题讨论观察', confidence: 'probable' }],
    citationStrategy: 'paraphrase',
    reviewedBy: '内容编辑组',
    ready: true,
    relatedSlugs: [],
    confidence: 'probable',
    disclaimer: '本文为文化现象观察，不构成性格判断或运势预测。',
    updatedAt: '2026-09-12',
  readingMinutes: 5,
  },
  {
    slug: '2026-xing-ming-wen-hua-re-chao',
    title: '姓名文化热潮：从起名习俗到网络社区',
    metaDescription: '观察姓名文化在当代的复兴趋势。',
    h1: '姓名文化热潮：从起名习俗到网络社区',
    category: 'ganzhi',
    tags: ['姓名学', '起名', '社区', '文化'],
    sections: [
      { heading: '摘要', level: 2, blocks: [{ kind: 'paragraph', text: '姓名文化相关内容在网络上持续升温，形成多层次的文化参与现象。' }] },
      { heading: '起名习俗的当代延续', level: 2, blocks: [{ kind: 'paragraph', text: '许多家庭在为新生儿起名时会参考字义、音韵、家族辈分与传统典籍。' }] },
      { heading: '网络社区与姓名考据', level: 2, blocks: [
        { kind: 'paragraph', text: '在线社区中，用户围绕姓氏源流、名字用字等展开讨论与考据。' },
        { kind: 'callout', tone: 'folk', text: '姓名考据应基于可靠文献与语言事实，避免将网络传言当作定论。' },
      ]},
    ],
    sources: [
      { text: '网络社区公开讨论观察', confidence: 'probable' },
      { text: '《百家姓》等传统姓氏文献', confidence: 'verified' },
    ],
    citationStrategy: 'paraphrase',
    reviewedBy: '内容编辑组',
    ready: true,
    relatedSlugs: [],
    confidence: 'probable',
    disclaimer: '本文为文化观察，不构成起名建议或命理判断。',
    updatedAt: '2026-09-10',
  readingMinutes: 5,
  },
];
