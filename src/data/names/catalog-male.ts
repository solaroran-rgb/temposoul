/**
 * C23-4 名字大全 · 男名 300 条
 * 文件路径：src/data/names/catalog-male.ts
 * 真实姓名用字（常见姓氏 + 高频男名用字）；笔画/五行以 onomastics 为准
 * 结构：15 常见姓氏 × 20 双字名 = 300 条
 */

export interface NameCatalogEntry {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  surname: string;
  given: string;
  pinyin: string;
  strokes: number;
  wuxing: string;
  meaning: string;
}

interface SurnameMeta {
  char: string;
  strokes: number;
}

const SURNAMES: SurnameMeta[] = [
  { char: '王', strokes: 4 },
  { char: '李', strokes: 7 },
  { char: '张', strokes: 7 },
  { char: '刘', strokes: 6 },
  { char: '陈', strokes: 7 },
  { char: '杨', strokes: 7 },
  { char: '赵', strokes: 9 },
  { char: '黄', strokes: 11 },
  { char: '周', strokes: 8 },
  { char: '吴', strokes: 7 },
  { char: '徐', strokes: 10 },
  { char: '孙', strokes: 10 },
  { char: '马', strokes: 3 },
  { char: '朱', strokes: 6 },
  { char: '胡', strokes: 11 },
];

interface GivenMeta {
  given: string;
  pinyin: string;
  strokes: number;
  wuxing: string;
  meaning: string;
}

const MALE_GIVEN: GivenMeta[] = [
  { given: '浩然', pinyin: 'hào rán', strokes: 23, wuxing: '水金', meaning: '浩然正气，心胸开阔' },
  { given: '子轩', pinyin: 'zǐ xuān', strokes: 13, wuxing: '水土', meaning: '气宇轩昂，气度不凡' },
  { given: '宇航', pinyin: 'yǔ háng', strokes: 16, wuxing: '土水', meaning: '胸怀宇宙，志向远大' },
  { given: '俊杰', pinyin: 'jùn jié', strokes: 20, wuxing: '火木', meaning: '才智出众，人中俊杰' },
  {
    given: '志强',
    pinyin: 'zhì qiáng',
    strokes: 19,
    wuxing: '火木',
    meaning: '意志坚强，自强不息',
  },
  { given: '明辉', pinyin: 'míng huī', strokes: 20, wuxing: '火火', meaning: '光明灿烂，光辉照人' },
  { given: '天佑', pinyin: 'tiān yòu', strokes: 11, wuxing: '火土', meaning: '上天庇佑，福运顺遂' },
  { given: '文轩', pinyin: 'wén xuān', strokes: 14, wuxing: '水土', meaning: '文采斐然，轩昂出众' },
  { given: '浩宇', pinyin: 'hào yǔ', strokes: 17, wuxing: '水土', meaning: '浩瀚宇宙，胸襟广阔' },
  { given: '国栋', pinyin: 'guó dòng', strokes: 20, wuxing: '木木', meaning: '国家栋梁，可担大任' },
  { given: '家豪', pinyin: 'jiā háo', strokes: 24, wuxing: '木水', meaning: '英豪之家，才貌出众' },
  { given: '俊驰', pinyin: 'jùn chí', strokes: 22, wuxing: '火火', meaning: '俊朗飞驰，前程似锦' },
  { given: '鹤轩', pinyin: 'hè xuān', strokes: 25, wuxing: '水土', meaning: '鹤立鸡群，轩昂不凡' },
  { given: '博文', pinyin: 'bó wén', strokes: 12, wuxing: '水水', meaning: '博学多闻，文思敏捷' },
  { given: '昊天', pinyin: 'hào tiān', strokes: 16, wuxing: '火火', meaning: '广阔天空，志向高远' },
  { given: '思远', pinyin: 'sī yuǎn', strokes: 24, wuxing: '土土', meaning: '思虑深远，目光长远' },
  { given: '立诚', pinyin: 'lì chéng', strokes: 18, wuxing: '火火', meaning: '立身以诚，诚实守信' },
  { given: '明哲', pinyin: 'míng zhé', strokes: 18, wuxing: '火火', meaning: '明智通达，知人则哲' },
  { given: '建辉', pinyin: 'jiàn huī', strokes: 24, wuxing: '木火', meaning: '建功立业，光辉前程' },
  { given: '伟宸', pinyin: 'wěi chén', strokes: 21, wuxing: '土金', meaning: '伟大尊贵，宸宇不凡' },
];

function buildMale(): NameCatalogEntry[] {
  const out: NameCatalogEntry[] = [];
  for (const s of SURNAMES) {
    for (const g of MALE_GIVEN) {
      out.push({
        id: `m-${s.char}${g.given}`,
        name: s.char + g.given,
        gender: 'male',
        surname: s.char,
        given: g.given,
        pinyin: `${s.char} ${g.pinyin}`,
        strokes: s.strokes + g.strokes,
        wuxing: g.wuxing,
        meaning: g.meaning,
      });
    }
  }
  return out;
}

export const MALE_NAMES: NameCatalogEntry[] = buildMale();
