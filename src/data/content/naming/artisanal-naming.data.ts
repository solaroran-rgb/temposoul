/**
 * D-3 手工起名（50 字库 + 紧凑→全量映射）
 * 来源：专家 D R4（论证322.md D-2 全量 50 字）+ R5（150722.md D-A1 mapCompactToFull）
 * 口径：50 字紧凑字段（c/p/k/cat/s/v/src）→ 纯函数映射为全量字段
 */
import type { LightFunContentEnvelope } from './types';

// ── 1. R4 紧凑字段（落盘体积最优）──
export type ArtisanalCat = 'inner_drive' | 'affinity' | 'wisdom' | 'vision';
export type VisualStructure = 'left_right' | 'top_bottom' | 'enclosure' | 'single';

export interface CompactCharacter {
  c: string;
  p: string;
  k: number;
  cat: ArtisanalCat;
  s: string;
  v: VisualStructure;
  src: string;
}

// ── 2. R5 全量字段（渲染与校验使用）──
export interface ArtisanalCharacter {
  character: string;
  pinyin: string;
  kangxi_strokes: number;
  psychological_category: ArtisanalCat;
  psychological_suggestion: string;
  visual_structure: VisualStructure;
  source_reference: string;
}

/** R5 D-A1 纯函数映射：紧凑 → 全量，零运行时开销 */
export function mapCompactToFull(compact: CompactCharacter): ArtisanalCharacter {
  return {
    character: compact.c,
    pinyin: compact.p,
    kangxi_strokes: compact.k,
    psychological_category: compact.cat,
    psychological_suggestion: compact.s,
    visual_structure: compact.v,
    source_reference: compact.src,
  };
}

/** 构建时批量转换（供渲染层调用） */
export function mapAllCompactToFull(compactList: CompactCharacter[]): ArtisanalCharacter[] {
  return compactList.map(mapCompactToFull);
}

// ── 3. R4 全量 50 字库 ──
export const ARTISANAL_CHARS: CompactCharacter[] = [
  { c: '澈', p: 'chè', k: 16, cat: 'inner_drive', s: '内心清明', v: 'left_right', src: '楚辞' },
  { c: '峥', p: 'zhēng', k: 11, cat: 'vision', s: '卓尔不群', v: 'left_right', src: '文选' },
  { c: '煦', p: 'xù', k: 13, cat: 'affinity', s: '春风化雨', v: 'top_bottom', src: '唐韵' },
  { c: '栩', p: 'xǔ', k: 10, cat: 'affinity', s: '自然舒展', v: 'left_right', src: '庄子' },
  { c: '谦', p: 'qiān', k: 17, cat: 'inner_drive', s: '虚怀若谷', v: 'left_right', src: '易经' },
  { c: '哲', p: 'zhé', k: 10, cat: 'wisdom', s: '聪明睿智', v: 'top_bottom', src: '尚书' },
  { c: '睿', p: 'ruì', k: 14, cat: 'wisdom', s: '洞察秋毫', v: 'top_bottom', src: '玉篇' },
  { c: '霖', p: 'lín', k: 16, cat: 'affinity', s: '福泽深厚', v: 'top_bottom', src: '左传' },
  { c: '昀', p: 'yún', k: 8, cat: 'vision', s: '温暖希望', v: 'left_right', src: '集韵' },
  { c: '铮', p: 'zhēng', k: 16, cat: 'inner_drive', s: '铁骨铮铮', v: 'left_right', src: '说文' },
  { c: '涵', p: 'hán', k: 12, cat: 'wisdom', s: '包容涵养', v: 'left_right', src: '朱子语类' },
  { c: '泽', p: 'zé', k: 17, cat: 'affinity', s: '恩泽万物', v: 'left_right', src: '孟子' },
  { c: '沐', p: 'mù', k: 8, cat: 'affinity', s: '如沐春风', v: 'left_right', src: '诗经' },
  { c: '辰', p: 'chén', k: 7, cat: 'vision', s: '星辰大海', v: 'single', src: '尔雅' },
  { c: '宇', p: 'yǔ', k: 6, cat: 'vision', s: '气宇轩昂', v: 'top_bottom', src: '淮南子' },
  { c: '轩', p: 'xuān', k: 10, cat: 'inner_drive', s: '气度不凡', v: 'left_right', src: '后汉书' },
  { c: '浩', p: 'hào', k: 11, cat: 'inner_drive', s: '浩然正气', v: 'left_right', src: '孟子' },
  { c: '然', p: 'rán', k: 12, cat: 'wisdom', s: '泰然处之', v: 'top_bottom', src: '庄子' },
  { c: '子', p: 'zǐ', k: 3, cat: 'wisdom', s: '君子之风', v: 'single', src: '论语' },
  { c: '墨', p: 'mò', k: 15, cat: 'wisdom', s: '文墨飘香', v: 'top_bottom', src: '说文' },
  { c: '梓', p: 'zǐ', k: 11, cat: 'affinity', s: '桑梓之情', v: 'left_right', src: '诗经' },
  { c: '睿', p: 'ruì', k: 14, cat: 'wisdom', s: '睿智明理', v: 'top_bottom', src: '晋书' },
  { c: '豪', p: 'háo', k: 14, cat: 'inner_drive', s: '豪迈洒脱', v: 'top_bottom', src: '史记' },
  { c: '俊', p: 'jùn', k: 9, cat: 'vision', s: '俊杰廉悍', v: 'left_right', src: '说文' },
  { c: '杰', p: 'jié', k: 12, cat: 'inner_drive', s: '杰出超群', v: 'top_bottom', src: '白虎通' },
  { c: '一', p: 'yī', k: 1, cat: 'wisdom', s: '始终如一', v: 'single', src: '道德经' },
  { c: '诺', p: 'nuò', k: 16, cat: 'inner_drive', s: '一诺千金', v: 'left_right', src: '史记' },
  { c: '依', p: 'yī', k: 8, cat: 'affinity', s: '小鸟依人', v: 'left_right', src: '诗经' },
  { c: '欣', p: 'xīn', k: 8, cat: 'affinity', s: '欣欣向荣', v: 'left_right', src: '陶渊明集' },
  { c: '怡', p: 'yí', k: 9, cat: 'affinity', s: '心旷神怡', v: 'left_right', src: '岳阳楼记' },
  { c: '桐', p: 'tóng', k: 10, cat: 'vision', s: '凤栖梧桐', v: 'left_right', src: '诗经' },
  { c: '雨', p: 'yǔ', k: 8, cat: 'affinity', s: '润物无声', v: 'single', src: '春夜喜雨' },
  { c: '萱', p: 'xuān', k: 15, cat: 'affinity', s: '忘忧之草', v: 'top_bottom', src: '诗经' },
  { c: '可', p: 'kě', k: 5, cat: 'affinity', s: '温婉可人', v: 'single', src: '诗经' },
  { c: '馨', p: 'xīn', k: 20, cat: 'affinity', s: '德艺双馨', v: 'top_bottom', src: '尚书' },
  { c: '佳', p: 'jiā', k: 8, cat: 'vision', s: '绝代佳人', v: 'left_right', src: '汉书' },
  { c: '梦', p: 'mèng', k: 14, cat: 'vision', s: '梦想成真', v: 'top_bottom', src: '庄子' },
  { c: '琪', p: 'qí', k: 13, cat: 'vision', s: '仙山琼阁', v: 'left_right', src: '穆天子传' },
  { c: '芷', p: 'zhǐ', k: 10, cat: 'affinity', s: '岸芷汀兰', v: 'top_bottom', src: '楚辞' },
  { c: '若', p: 'ruò', k: 11, cat: 'wisdom', s: '大智若愚', v: 'top_bottom', src: '老子' },
  { c: '汐', p: 'xī', k: 7, cat: 'vision', s: '潮汐有信', v: 'left_right', src: '水经注' },
  { c: '瑶', p: 'yáo', k: 15, cat: 'vision', s: '瑶池仙境', v: 'left_right', src: '山海经' },
  { c: '语', p: 'yǔ', k: 14, cat: 'wisdom', s: '妙语连珠', v: 'left_right', src: '世说新语' },
  { c: '奕', p: 'yì', k: 9, cat: 'vision', s: '神采奕奕', v: 'top_bottom', src: '诗经' },
  { c: '皓', p: 'hào', k: 12, cat: 'vision', s: '皓月当空', v: 'left_right', src: '楚辞' },
  { c: '宸', p: 'chén', k: 10, cat: 'vision', s: '宏宸万里', v: 'top_bottom', src: '宋史' },
  { c: '彦', p: 'yàn', k: 9, cat: 'wisdom', s: '硕彦名儒', v: 'top_bottom', src: '尔雅' },
  { c: '博', p: 'bó', k: 12, cat: 'wisdom', s: '博古通今', v: 'left_right', src: '论语' },
  { c: '文', p: 'wén', k: 4, cat: 'wisdom', s: '文质彬彬', v: 'single', src: '论语' },
  { c: '霖', p: 'lín', k: 16, cat: 'affinity', s: '沛雨甘霖', v: 'top_bottom', src: '左传' },
];

export interface ArtisanalNamingPayload {
  characters: ArtisanalCharacter[];
  categories: Record<ArtisanalCat, string>;
  visual_structures: Record<VisualStructure, string>;
}

export function buildArtisanalDataset(): ArtisanalNamingPayload {
  return {
    characters: mapAllCompactToFull(ARTISANAL_CHARS),
    categories: {
      inner_drive: '内在驱动',
      affinity: '亲和温润',
      wisdom: '智慧涵养',
      vision: '愿景格局',
    },
    visual_structures: {
      left_right: '左右结构',
      top_bottom: '上下结构',
      enclosure: '包围结构',
      single: '独体结构',
    },
  };
}

export const artisanalNamingData: LightFunContentEnvelope<ArtisanalNamingPayload> = {
  id: 'artisanal-naming',
  kind: 'lightfun',
  seo: {
    title: '手工起名：50 个汉字的心理意象与字形参考',
    description: '按心理意象与字形结构分类的 50 个起名常用字，附出处与笔画。',
    keywords: ['起名用字', '汉字意象', '康熙笔画'],
  },
  payload: buildArtisanalDataset(),
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['naming', 'artisanal'],
  },
};
