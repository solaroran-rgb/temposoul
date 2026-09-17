
// A11-4 · src/data/ziwei-stars/types.ts · 主星数据类型
// 修正：同时导出 StarArticleData（主名）与 ZiweiStarDoc（别名，兼容已交付 loaders/StarDetailPage）

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
  /** 就绪星建议填写引擎字段来源（如 'StarFact.name=紫微'），便于本地一致性校验 */
  engineRef?: string;
  reviewedBy?: string;
  updatedAt: string;
  /**
   * 内容是否已定稿。
   * - true：页面正常渲染 + 可被索引（就绪星）
   * - false：骨架态 + noindex（内容整理中）
   * 就绪星清单必须与 loaders.ts 的 READY_STAR_IDS 保持单源一致。
   */
  ready: boolean;
}

/** 兼容别名：与 StarArticleData 完全等价 */
export type ZiweiStarDoc = StarArticleData;

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

