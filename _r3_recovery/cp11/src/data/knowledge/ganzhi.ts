
/**

* C11-干支专题：干支结构化真值表（修改后）
* 文件路径：src/data/knowledge/ganzhi.ts
  */
  export interface GanzhiEntry {
  id: string;
  kind: 'tiangan' | 'dizhi';
  index: number;
  char: string;
  ready: boolean;
  structure: {
   yinYang: '阴' | '阳';
   wuxing: string;
   direction?: string;
   season?: string;
   hiddenStems?: string[];
  };
  culture: {
   temperament: string;
   images: string[];
   shishenFit: string[];
   relations: string[];
   organNote?: string;
  };
  relatedSlugs: string[];
  sources: string[];
  reviewedBy: string;
  confidence: 'verified' | 'legendary';
  }

const EMPTY_CULTURE = {
  temperament: '',
  images: [] as string[],
  shishenFit: [] as string[],
  relations: [] as string[],
};

// 仅链接“已计划/已发布”的 slug，避免死链
const SAFE_REL = ['ganzhi-overview', 'ganzhi-jiazi', 'wuxing-basics', 'why-no-fortune-score'];

export const TIANGAN: GanzhiEntry[] = [
  {
    id: 'jia', kind: 'tiangan', index: 0, char: '甲', ready: true,
    structure: { yinYang: '阳', wuxing: '木', direction: '东', season: '春' },
    culture: {
      temperament: '甲木为十天干之首，传统描述为「栋梁之木」，取参天、正直、向上生发之象。',
      images: ['参天大树', '栋梁', '森林', '雷'],
      shishenFit: ['比肩', '劫财', '食神', '伤官'],
      relations: ['甲己合土', '甲庚相冲'],
      organNote: '传统观念中甲木与胆相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十天干属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'yi', kind: 'tiangan', index: 1, char: '乙', ready: true,
    structure: { yinYang: '阴', wuxing: '木', direction: '东', season: '春' },
    culture: {
      temperament: '乙木为阴木，传统描述为「花草之木」，取柔韧、依附、曲折生长之象。',
      images: ['藤蔓', '花草', '禾苗'],
      shishenFit: ['比肩', '劫财', '食神', '伤官'],
      relations: ['乙庚合金', '乙辛相冲'],
      organNote: '传统观念中乙木与肝相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十天干属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'bing', kind: 'tiangan', index: 2, char: '丙', ready: true,
    structure: { yinYang: '阳', wuxing: '火', direction: '南', season: '夏' },
    culture: {
      temperament: '丙火为阳火，传统描述为「太阳之火」，取光明、热烈、外放之象。',
      images: ['太阳', '烈火', '光芒'],
      shishenFit: ['食神', '伤官', '正财', '偏财'],
      relations: ['丙辛合水', '丙壬相冲'],
      organNote: '传统观念中丙火与小肠相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十天干属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'ding', kind: 'tiangan', index: 3, char: '丁', ready: true,
    structure: { yinYang: '阴', wuxing: '火', direction: '南', season: '夏' },
    culture: {
      temperament: '丁火为阴火，传统描述为「灯烛之火」，取温明、内敛、持久之象。',
      images: ['灯火', '烛光', '星火'],
      shishenFit: ['食神', '伤官', '正财', '偏财'],
      relations: ['丁壬合木', '丁癸相冲'],
      organNote: '传统观念中丁火与心相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十天干属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  ...['wu', 'ji', 'geng', 'xin', 'ren', 'gui'].map((id, i) => ({
    id,
    kind: 'tiangan' as const,
    index: i + 4,
    char: ['戊', '己', '庚', '辛', '壬', '癸'][i],
    ready: false,
    structure: { yinYang: (i % 2 === 0 ? '阳' : '阴') as '阳' | '阴', wuxing: '' },
    culture: { ...EMPTY_CULTURE },
    relatedSlugs: [],
    sources: [],
    reviewedBy: '',
    confidence: 'legendary' as const,
  })),
];

export const DIZHI: GanzhiEntry[] = [
  {
    id: 'zi', kind: 'dizhi', index: 0, char: '子', ready: true,
    structure: { yinYang: '阳', wuxing: '水', direction: '北', season: '冬', hiddenStems: ['癸'] },
    culture: {
      temperament: '子水为十二地支之首，传统描述为「墨池之水」，取流动、含蓄、机敏之象。',
      images: ['江河', '雨露', '深夜'],
      shishenFit: ['正印', '偏印', '正官', '七杀'],
      relations: ['子丑合土', '子午相冲', '申子辰三合水'],
      organNote: '传统观念中子水与肾相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十二地支属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'chou', kind: 'dizhi', index: 1, char: '丑', ready: true,
    structure: { yinYang: '阴', wuxing: '土', direction: '中', season: '冬末', hiddenStems: ['己', '癸', '辛'] },
    culture: {
      temperament: '丑为湿土，传统取承载、沉稳、内藏之象，为金库。',
      images: ['田土', '堤坝', '寒土'],
      shishenFit: ['比肩', '劫财', '食神', '伤官'],
      relations: ['子丑合土', '丑未相冲', '巳酉丑三合金'],
      organNote: '传统观念中丑土与脾相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十二地支属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'yin', kind: 'dizhi', index: 2, char: '寅', ready: true,
    structure: { yinYang: '阳', wuxing: '木', direction: '东北', season: '春', hiddenStems: ['甲', '丙', '戊'] },
    culture: {
      temperament: '寅为阳木，传统取生发、活跃、向外之象，为火长生之地。',
      images: ['山林', '虎', '初春'],
      shishenFit: ['比肩', '劫财', '食神', '伤官'],
      relations: ['寅亥合木', '寅申相冲', '寅午戌三合火'],
      organNote: '传统观念中寅木与胆相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十二地支属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  {
    id: 'mao', kind: 'dizhi', index: 3, char: '卯', ready: true,
    structure: { yinYang: '阴', wuxing: '木', direction: '东', season: '春', hiddenStems: ['乙'] },
    culture: {
      temperament: '卯为阴木，传统取柔顺、条达、生长之象，为桃花地之一。',
      images: ['柳枝', '花草', '兔'],
      shishenFit: ['比肩', '劫财', '食神', '伤官'],
      relations: ['卯戌合火', '卯酉相冲', '亥卯未三合木'],
      organNote: '传统观念中卯木与肝相关联。',
    },
    relatedSlugs: SAFE_REL,
    sources: ['十二地支属性据传统文献通行说法整理'],
    reviewedBy: 'content-team',
    confidence: 'legendary',
  },
  ...['chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'].map((id, i) => ({
    id,
    kind: 'dizhi' as const,
    index: i + 4,
    char: ['辰', '巳', '午', '未', '申', '酉', '戌', '亥'][i],
    ready: false,
    structure: { yinYang: (i % 2 === 0 ? '阳' : '阴') as '阳' | '阴', wuxing: '' },
    culture: { ...EMPTY_CULTURE },
    relatedSlugs: [],
    sources: [],
    reviewedBy: '',
    confidence: 'legendary' as const,
  })),
];

export function buildJiazi(): { ganzhi: string; tiangan: string; dizhi: string; index: number }[] {
  const out: { ganzhi: string; tiangan: string; dizhi: string; index: number }[] = [];
  for (let i = 0; i < 60; i++) {
    const t = TIANGAN[i % 10];
    const d = DIZHI[i % 12];
    if (!t || !d) continue;
    out.push({ ganzhi: `${t.char}${d.char}`, tiangan: t.char, dizhi: d.char, index: i });
  }
  return out;
}

export const ORGAN_FORBIDDEN_VERBS = [
  '调理',
  '改善',
  '治疗',
  '预防',
  '缓解',
  '治愈',
  '根治',
] as const;

