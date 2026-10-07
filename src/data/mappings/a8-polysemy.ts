/**
 * @file A8 多义注册表（T-17 子项 B）
 * @description lexicon.ts ↔ lexicon-extra.ts 跨文件同名 term 实算 = 17 个（T-14 回执口径「跨文件同名 17」，
 *   由探针 import 两文件实算确认）。同一中文术语在不同排盘体系含义不同，按 disambiguation 字段拟定 sense_id。
 *   key 格式 `<namespace>:<term>_<sense_id>`（与 vedic keys.ts 的 POLYSEMY_ROWS 结构同构；
 *   但本体系为 bazi/ziwei/common/shasha/zeiri/qimen/liuren 等，非吠陀）。
 *   注意：本注册表只登记消歧 key，不改 lexicon.ts/lexicon-extra.ts 本体（T-14 K4-1 断言 key 尾段=term）。
 *
 * sense_id 拟定依据（按 disambiguation 字段实算）：
 *   general    = disambiguation「通用/基础命理」(common:*)
 *   shensha    = 神煞 (shasha:*)
 *   ziweiStar  = 紫微斗数星曜 (ziwei:* 紫微星曜)
 *   palace     = 紫微斗数十二宫 (ziwei:命宫/身宫)
 *   geju       = 紫微斗数格局 (ziwei-geju:*)
 *   bazi       = 八字命理/八字格局 (bazi:*)
 *   zeiri      = 择日 (zeiri:*)
 *   qimen      = 奇门遁甲 (qimen:*)
 *   liuren     = 大六壬 (liuren:*)
 */

export interface A8PolysemyRow {
  /** lexicon 命名空间（common/bazi/ziwei/shasha/zeiri/qimen/liuren/ziwei-geju …） */
  namespace: string;
  /** 规范中文术语（= lexicon term） */
  term: string;
  /** 消歧位（按 disambiguation 体系拟定，见文件头） */
  senseId: string;
  /** `<namespace>:<term>_<sense_id>` */
  key: string;
  /** 适用体系说明（= lexicon disambiguation 原样） */
  disambiguation: string;
  /** lexicon category */
  category: string;
}

/** 17 个跨文件多义基础术语（实算 lexicon.ts ∩ lexicon-extra.ts 同名 term） */
export const A8_POLYSEMY_BASE_TERMS: readonly string[] = [
  '三方四正',
  '丧门',
  '华盖',
  '吊客',
  '命宫',
  '咸池',
  '天德',
  '岁破',
  '火贪格',
  '用神',
  '白虎',
  '空亡',
  '调候',
  '身宫',
  '通关',
  '青龙',
  '龙德',
];

const R = (namespace: string, term: string, senseId: string, disambiguation: string, category: string): A8PolysemyRow => ({
  namespace,
  term,
  senseId,
  key: `${namespace}:${term}_${senseId}`,
  disambiguation,
  category,
});

/** 17 个基础术语展开的 sense 行（天德 3 / 白虎 5 / 青龙 3，其余各 2） */
export const A8_POLYSEMY_ROWS: A8PolysemyRow[] = [
  // 三方四正
  R('common', '三方四正', 'general', '通用/基础命理', '基础'),
  R('ziwei', '三方四正', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 丧门
  R('shasha', '丧门', 'shensha', '神煞', '神煞'),
  R('ziwei', '丧门', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 华盖
  R('shasha', '华盖', 'shensha', '神煞', '神煞'),
  R('ziwei', '华盖', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 吊客
  R('shasha', '吊客', 'shensha', '神煞', '神煞'),
  R('ziwei', '吊客', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 命宫（common 通用 / ziwei 十二宫）
  R('common', '命宫', 'general', '通用/基础命理', '基础'),
  R('ziwei', '命宫', 'palace', '紫微斗数', '十二宫'),
  // 咸池
  R('shasha', '咸池', 'shensha', '神煞', '神煞'),
  R('ziwei', '咸池', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 天德（神煞 / 择日 / 紫微星曜 三义）
  R('shasha', '天德', 'shensha', '神煞', '神煞'),
  R('zeiri', '天德', 'zeiri', '择日', '择日'),
  R('ziwei', '天德', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 岁破
  R('shasha', '岁破', 'shensha', '神煞', '神煞'),
  R('ziwei', '岁破', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 火贪格（紫微星曜 / 紫微格局）
  R('ziwei', '火贪格', 'ziweiStar', '紫微斗数', '紫微星曜'),
  R('ziwei-geju', '火贪格', 'geju', '紫微斗数格局', '紫微格局'),
  // 用神（通用基础 / 八字格局）
  R('common', '用神', 'general', '通用/基础命理', '基础'),
  R('bazi', '用神', 'bazi', '八字命理', '八字格局'),
  // 白虎（神煞 / 奇门 / 六壬 / 择日 / 紫微 五义）
  R('shasha', '白虎', 'shensha', '神煞', '神煞'),
  R('qimen', '白虎', 'qimen', '奇门遁甲', '奇门遁甲'),
  R('liuren', '白虎', 'liuren', '大六壬', '六壬'),
  R('zeiri', '白虎', 'zeiri', '择日', '择日'),
  R('ziwei', '白虎', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 空亡
  R('common', '空亡', 'general', '通用/基础命理', '基础'),
  R('shasha', '空亡', 'shensha', '神煞', '神煞'),
  // 调候
  R('common', '调候', 'general', '通用/基础命理', '基础'),
  R('bazi', '调候', 'bazi', '八字命理', '八字格局'),
  // 身宫
  R('common', '身宫', 'general', '通用/基础命理', '基础'),
  R('ziwei', '身宫', 'palace', '紫微斗数', '十二宫'),
  // 通关
  R('common', '通关', 'general', '通用/基础命理', '基础'),
  R('bazi', '通关', 'bazi', '八字命理', '八字格局'),
  // 青龙（六壬 / 择日 / 紫微 三义）
  R('liuren', '青龙', 'liuren', '大六壬', '六壬'),
  R('zeiri', '青龙', 'zeiri', '择日', '择日'),
  R('ziwei', '青龙', 'ziweiStar', '紫微斗数', '紫微星曜'),
  // 龙德
  R('shasha', '龙德', 'shensha', '神煞', '神煞'),
  R('ziwei', '龙德', 'ziweiStar', '紫微斗数', '紫微星曜'),
];

/** 多义 key 格式：`<namespace>:<term>_<sense_id>`（term 可为中文） */
export const A8_POLYSEMY_KEY_RE = /^[a-z0-9@_-]+:[^:\s]+_[a-zA-Z][a-zA-Z0-9]*$/;
