
// A11-4 · src/data/ziwei-stars/types.ts · 主星数据类型
export interface StarBrightness { level: string; note: string }
export interface StarPalace { palace: string; note: string }
export interface StarCombo { partner: string; note: string }

export interface StarArticleData {
  starId: string;
  starName: string;
  nature: string;
  brightness: StarBrightness[];
  keyPalaces: StarPalace[];
  combos: StarCombo[];
  source: string;
  note: string;
  confidence: 'legendary';
  engineRef?: string;
  reviewedBy?: string;
  updatedAt: string;
  ready: boolean;
}

export const STAR_IDS = [
  'ziwei', 'tianji', 'taiyang', 'wuqu', 'tongtian', 'lianzhen', 'tianfu',
  'taiyin', 'tanlang', 'jumen', 'tianxiang', 'tianliang', 'qisha', 'pojun',
] as const;

export type StarId = typeof STAR_IDS[number];

export const STAR_CN: Record<StarId, string> = {
  ziwei: '紫微', tianji: '天机', taiyang: '太阳', wuqu: '武曲', tongtian: '天同',
  lianzhen: '廉贞', tianfu: '天府', taiyin: '太阴', tanlang: '贪狼', jumen: '巨门',
  tianxiang: '天相', tianliang: '天梁', qisha: '七杀', pojun: '破军',
};

