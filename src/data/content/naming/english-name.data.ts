/**
 * D-1 英文名测试（数据工厂 + 全量落盘）
 * 来源：专家 D R3（143217.md §2）+ R4（论证322.md D-2 全量 12 题）
 * 口径：6 outer 情境 + 6 inner 情境 = 12 题；4 原型 × 10 词根 = 40 名
 */
import type { LightFunContentEnvelope } from './types';

// ── 1. 维度种子（R4 全量 12 题，紧凑字段 w=权重映射）──
export interface EnQuestionOption {
  id: string;
  text: string;
  w: Record<string, number>;
}
export interface EnQuestion {
  id: string;
  axis: 'outer' | 'inner';
  text: string;
  opts: EnQuestionOption[];
}

export const EN_QUESTIONS: EnQuestion[] = [
  {
    id: 'q01',
    axis: 'outer',
    text: '在陌生行业交流会上，你通常会？',
    opts: [
      { id: 'a', text: '主动破冰', w: { icebreaker: 3 } },
      { id: 'b', text: '寻找熟人', w: { listener: 2 } },
      { id: 'c', text: '安静观察', w: { observer: 3 } },
      { id: 'd', text: '居中协调', w: { mediator: 3 } },
    ],
  },
  {
    id: 'q02',
    axis: 'outer',
    text: '团队遇到突发危机，你的第一反应？',
    opts: [
      { id: 'a', text: '立刻指挥', w: { icebreaker: 3 } },
      { id: 'b', text: '安抚情绪', w: { listener: 3 } },
      { id: 'c', text: '分析数据', w: { observer: 2 } },
      { id: 'd', text: '寻求外援', w: { mediator: 2 } },
    ],
  },
  {
    id: 'q03',
    axis: 'outer',
    text: '周末聚会，你更倾向于？',
    opts: [
      { id: 'a', text: '组织大型派对', w: { icebreaker: 3 } },
      { id: 'b', text: '三五知己深谈', w: { listener: 3 } },
      { id: 'c', text: '独自看展/看书', w: { observer: 3 } },
      { id: 'd', text: '穿梭不同圈子', w: { mediator: 2 } },
    ],
  },
  {
    id: 'q04',
    axis: 'outer',
    text: '面对意见分歧，你通常？',
    opts: [
      { id: 'a', text: '强势表达观点', w: { icebreaker: 3 } },
      { id: 'b', text: '倾听双方诉求', w: { listener: 3 } },
      { id: 'c', text: '保留个人意见', w: { observer: 3 } },
      { id: 'd', text: '寻找折中方案', w: { mediator: 3 } },
    ],
  },
  {
    id: 'q05',
    axis: 'outer',
    text: '在社交媒体上，你更多是？',
    opts: [
      { id: 'a', text: '频繁发帖互动', w: { icebreaker: 3 } },
      { id: 'b', text: '点赞评论好友', w: { listener: 2 } },
      { id: 'c', text: '潜水浏览内容', w: { observer: 3 } },
      { id: 'd', text: '转发协调资源', w: { mediator: 2 } },
    ],
  },
  {
    id: 'q06',
    axis: 'outer',
    text: '进入新环境，你最先做的是？',
    opts: [
      { id: 'a', text: '主动自我介绍', w: { icebreaker: 3 } },
      { id: 'b', text: '观察他人互动', w: { observer: 3 } },
      { id: 'c', text: '寻找舒适角落', w: { listener: 2 } },
      { id: 'd', text: '帮助大家破冰', w: { mediator: 3 } },
    ],
  },
  {
    id: 'q07',
    axis: 'inner',
    text: '面对高风险高回报项目，首要考量？',
    opts: [
      { id: 'a', text: '商业价值', w: { value_driven: 3 } },
      { id: 'b', text: '团队成长', w: { emotion_driven: 3 } },
      { id: 'c', text: '数据逻辑', w: { logic_driven: 3 } },
      { id: 'd', text: '创新突破', w: { vision_driven: 3 } },
    ],
  },
  {
    id: 'q08',
    axis: 'inner',
    text: '做重大决策时，你最依赖？',
    opts: [
      { id: 'a', text: 'ROI 预期', w: { value_driven: 3 } },
      { id: 'b', text: '直觉与感受', w: { emotion_driven: 3 } },
      { id: 'c', text: '严密的推演', w: { logic_driven: 3 } },
      { id: 'd', text: '长远愿景', w: { vision_driven: 3 } },
    ],
  },
  {
    id: 'q09',
    axis: 'inner',
    text: '评价一部电影/一本书，你最看重？',
    opts: [
      { id: 'a', text: '现实隐喻/价值', w: { value_driven: 3 } },
      { id: 'b', text: '情感共鸣', w: { emotion_driven: 3 } },
      { id: 'c', text: '逻辑严密性', w: { logic_driven: 3 } },
      { id: 'd', text: '想象力/世界观', w: { vision_driven: 3 } },
    ],
  },
  {
    id: 'q10',
    axis: 'inner',
    text: '如果有一笔意外之财，你会？',
    opts: [
      { id: 'a', text: '投资/理财', w: { value_driven: 3 } },
      { id: 'b', text: '给家人/慈善', w: { emotion_driven: 3 } },
      { id: 'c', text: '存起来/精算', w: { logic_driven: 3 } },
      { id: 'd', text: '探索新爱好', w: { vision_driven: 3 } },
    ],
  },
  {
    id: 'q11',
    axis: 'inner',
    text: '工作中最让你有成就感的是？',
    opts: [
      { id: 'a', text: '达成业绩目标', w: { value_driven: 3 } },
      { id: 'b', text: '帮助同事成长', w: { emotion_driven: 3 } },
      { id: 'c', text: '解决复杂 Bug', w: { logic_driven: 3 } },
      { id: 'd', text: '提出全新架构', w: { vision_driven: 3 } },
    ],
  },
  {
    id: 'q12',
    axis: 'inner',
    text: '面对未知领域，你的态度是？',
    opts: [
      { id: 'a', text: '评估变现可能', w: { value_driven: 3 } },
      { id: 'b', text: '寻找同频伙伴', w: { emotion_driven: 3 } },
      { id: 'c', text: '查阅底层原理', w: { logic_driven: 3 } },
      { id: 'd', text: '畅想未来图景', w: { vision_driven: 3 } },
    ],
  },
];

// ── 2. 名字词根库（4 原型 × 10 词根 = 40 名）──
export type EnPersona = 'visionary' | 'anchor' | 'muse' | 'catalyst';
export interface EnNameRoot {
  root: string;
  suffix: string;
  ipa: string;
  meaning: string;
  feature: 'open_vowel' | 'stable_consonant' | 'liquid_flow' | 'sharp_edge';
  taboo: string;
}
export interface EnRecommendation {
  name: string;
  pronunciation_ipa: string;
  etymology: string;
  phonetic_feature: string;
  matched_personas: EnPersona[];
  cultural_taboos: string[];
}

const NAME_ROOTS: Record<EnPersona, EnNameRoot[]> = {
  visionary: [
    {
      root: 'Aurel',
      suffix: 'ia',
      ipa: '/ɔːˈriːliə/',
      meaning: '金色闪耀',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Cass',
      suffix: 'ius',
      ipa: '/ˈkæʃəs/',
      meaning: '深邃思想',
      feature: 'stable_consonant',
      taboo: '避免极度保守宗教场合',
    },
    {
      root: 'Luna',
      suffix: 'ire',
      ipa: '/luːˈnaɪərə/',
      meaning: '月光引路',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Sol',
      suffix: 'enne',
      ipa: '/sɒˈlɛn/',
      meaning: '日光内在',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Oriel',
      suffix: 'la',
      ipa: '/ɔːriˈɛlə/',
      meaning: '金色庭阁',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Elio',
      suffix: 'ra',
      ipa: '/ˈɛliərə/',
      meaning: '阳光使者',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Cygn',
      suffix: 'us',
      ipa: '/ˈsɪɡnəs/',
      meaning: '天鹅远翔',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Nova',
      suffix: 'ri',
      ipa: '/ˈnoʊvəri/',
      meaning: '新星绽放',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Stell',
      suffix: 'a',
      ipa: '/ˈstɛlə/',
      meaning: '星辰之华',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Zeph',
      suffix: 'yr',
      ipa: '/ˈzɛfɪə/',
      meaning: '西风启程',
      feature: 'sharp_edge',
      taboo: '',
    },
  ],
  anchor: [
    {
      root: 'Marc',
      suffix: 'us',
      ipa: '/ˈmɑːrkəs/',
      meaning: '坚定如石',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Petr',
      suffix: 'a',
      ipa: '/ˈpiːtrə/',
      meaning: '磐石之基',
      feature: 'stable_consonant',
      taboo: '避免同音歧义场合',
    },
    {
      root: 'Thorn',
      suffix: 'ton',
      ipa: '/ˈθɔːntən/',
      meaning: '坚韧岗哨',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Hold',
      suffix: 'en',
      ipa: '/ˈhoʊldən/',
      meaning: '持守稳固',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Sten',
      suffix: 'on',
      ipa: '/ˈstɛnən/',
      meaning: '石质沉稳',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Berna',
      suffix: 'rd',
      ipa: '/ˈbɜːrnərd/',
      meaning: '熊之坚毅',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Edm',
      suffix: 'und',
      ipa: '/ˈɛdmənd/',
      meaning: '富有的守护者',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Ald',
      suffix: 'ous',
      ipa: '/ˈɔːldəs/',
      meaning: '古老睿智',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Wint',
      suffix: 'on',
      ipa: '/ˈwɪntən/',
      meaning: '白地坚忍',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Sever',
      suffix: 'us',
      ipa: '/səˈvɪrəs/',
      meaning: '严肃自律',
      feature: 'sharp_edge',
      taboo: '',
    },
  ],
  muse: [
    {
      root: 'Calli',
      suffix: 'ope',
      ipa: '/kəˈlaɪəpi/',
      meaning: '颂歌之缪斯',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Thal',
      suffix: 'ia',
      ipa: '/θəˈliːə/',
      meaning: '繁花盛开',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Eut',
      suffix: 'erpe',
      ipa: '/juːˈtɜːrpi/',
      meaning: '欢乐之缪斯',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Poly',
      suffix: 'hymnia',
      ipa: '/pɒliˈhɪmniə/',
      meaning: '圣歌千首',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Terp',
      suffix: 'sich',
      ipa: '/tərpˈsɪtʃəri/',
      meaning: '歌舞之乐',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Melp',
      suffix: 'omene',
      ipa: '/mɛlpəˈmɛni/',
      meaning: '悲剧沉思',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Ur',
      suffix: 'ania',
      ipa: '/jʊˈreɪniə/',
      meaning: '星空仰望',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Erat',
      suffix: 'o',
      ipa: '/ˈɛrətoʊ/',
      meaning: '抒情爱歌',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Clio',
      suffix: 'na',
      ipa: '/ˈklaɪənə/',
      meaning: '史诗铭记',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Ter',
      suffix: 'psi',
      ipa: '/ˈtɜːrsaɪ/',
      meaning: '韵律节奏',
      feature: 'liquid_flow',
      taboo: '',
    },
  ],
  catalyst: [
    {
      root: 'Iren',
      suffix: 'eus',
      ipa: '/aɪˈriːniəs/',
      meaning: '和平使者',
      feature: 'open_vowel',
      taboo: '',
    },
    {
      root: 'Pro',
      suffix: 'mus',
      ipa: '/ˈproʊməs/',
      meaning: '率先行动',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Axi',
      suffix: 'll',
      ipa: '/ˈæksɪl/',
      meaning: '价值支点',
      feature: 'sharp_edge',
      taboo: '',
    },
    {
      root: 'Drus',
      suffix: 'o',
      ipa: '/ˈdruːsoʊ/',
      meaning: '森林跃动',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Val',
      suffix: 'ens',
      ipa: '/ˈvælɛnz/',
      meaning: '刚强有力',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Xen',
      suffix: 'on',
      ipa: '/ˈzɛnɒn/',
      meaning: '异客新见',
      feature: 'sharp_edge',
      taboo: '避免与化学元素联想混淆',
    },
    {
      root: 'Tych',
      suffix: 'o',
      ipa: '/ˈtaɪkoʊ/',
      meaning: '机遇推动',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Lys',
      suffix: 'ander',
      ipa: '/laɪˈsændər/',
      meaning: '释局破局',
      feature: 'liquid_flow',
      taboo: '',
    },
    {
      root: 'Ast',
      suffix: 'or',
      ipa: '/ˈæstɔːr/',
      meaning: '群星行动',
      feature: 'stable_consonant',
      taboo: '',
    },
    {
      root: 'Zor',
      suffix: 'o',
      ipa: '/ˈzɒroʊ/',
      meaning: '锐意革新',
      feature: 'sharp_edge',
      taboo: '',
    },
  ],
};

// ── 3. 构建时生成纯函数（同步，无副作用）──
export function buildEnglishNameDataset(): {
  questions: EnQuestion[];
  recommendations: EnRecommendation[];
} {
  const recommendations = (Object.entries(NAME_ROOTS) as Array<[EnPersona, EnNameRoot[]]>).flatMap(
    ([persona, roots]) =>
      roots.map((r) => ({
        name: r.root + r.suffix,
        pronunciation_ipa: r.ipa,
        etymology: r.meaning,
        phonetic_feature: r.feature,
        matched_personas: [persona],
        cultural_taboos: r.taboo ? [r.taboo] : [],
      })),
  );
  return { questions: EN_QUESTIONS, recommendations };
}

export type EnglishNamePayload = ReturnType<typeof buildEnglishNameDataset>;

export const englishNameData: LightFunContentEnvelope<EnglishNamePayload> = {
  id: 'english-name-persona',
  kind: 'lightfun',
  seo: {
    title: '英文名测试：探索社交面具与内在驱动',
    description: '双轴心理情境测试，匹配契合气场与特质的英文名。',
    keywords: ['英文名', '性格测试', '起名参考'],
  },
  payload: buildEnglishNameDataset(),
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['naming', 'test'],
  },
};
