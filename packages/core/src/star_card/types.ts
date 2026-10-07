/**
 * star_card · 每日星图模块类型定义
 * @description 每日星图（B2 论证定稿 · A5 卡）规则层类型。
 * 双层卡片：匿名=全局层（无个人信息，可 CDN）；登录=个人层（uid 哈希隔离）。
 * 纪律：全局层输出不得含八字/城市/真名；所有文本经合规扫描。
 */

/** 用户本地日期键（YYYY-MM-DD，Asia/Shanghai 日界由调用方计算后传入） */
export type DateKey = string;

/** 气候带（P0 静态表，实时天气为 P1 增强，不依赖外部 API） */
export type ClimateZone =
  | 'cold' // 寒温带
  | 'temperate' // 温带
  | 'subtropical' // 亚热带
  | 'tropical' // 热带
  | 'plateau'; // 高原

/** 六爻问题分类（规则分类器词典，零 LLM） */
export type LiuyaoCategory =
  | 'party' // 聚会
  | 'direction' // 方位/出行
  | 'lost' // 失物
  | 'career' // 事业
  | 'love' // 感情
  | 'general'; // 综合兜底

/** 每日星图输入（个人层可选；不传=纯全局层） */
export interface StarCardInput {
  /** 用户本地日期键 YYYY-MM-DD */
  dateKey: DateKey;
  /** 时区（供日界对齐，默认 Asia/Shanghai） */
  tz?: string;
  /** 规则版本（ruleVersion，变更即缓存失效） */
  ruleVersion: string;
  /** 气候带（调用方按城市/静态表传入；缺省 temperate） */
  climateZone?: ClimateZone;
  /** 登录用户 uid 哈希（可选；不传则仅全局层） */
  uidHash?: string;
  /** 天气预警（P1 增强；P0 传空） */
  weatherWarning?: string;
}

/** 单区块内容（已合规处理） */
export interface StarCardBlock {
  id: 'summary' | 'fortune' | 'dress' | 'diet' | 'avoid' | 'liuyao';
  title: string;
  content: string;
  /** 数据来源键（可追溯：rule:{ruleVersion}:{table}:{key}） */
  sourceKey: string;
}

/** 零依赖天气参考（B2 P2：节气+气候带静态表，纯本地规则，不接第三方 API） */
export interface WeatherInfo {
  /** 当日近似节气（24 节气静态表推算） */
  solarTerm: string;
  /** 气候带微调提示（叠加在节气要点后） */
  climateNote: string;
  /** 是否触发极端天气保守分支 */
  extremeRisk: boolean;
  sourceKey: string;
}

/** 方位条目（B2 二、运势方位：一行一位+简注） */
export interface DirectionItem {
  direction: string;
  note: string;
}

/** 结构化三方位（财神/煞/贵人） */
export interface DirectionsInfo {
  /** 财神方位（传统方位参考，非投资建议） */
  wealth: DirectionItem;
  /** 煞/宜避方位 */
  sha: DirectionItem;
  /** 贵人方位 */
  noble: DirectionItem;
  sourceKey: string;
}

/** 卡底深链条目（B2 二、区块7：节气文章/宜忌详情/StarMark 出口） */
export interface DeepLink {
  id: string;
  label: string;
  href: string;
}

/** 每日星图输出（L0 完整；熔断时降级）
 * 升级说明：blocks/fallbackLevel/ruleVersion/personalized 为既有字段，保持兼容；
 * weather/directions/deepLinks/layers 为 B2 升级新增（可选），旧消费方不受影响。 */
export interface StarCardOutput {
  blocks: StarCardBlock[];
  /** 熔断等级 L0-L3 */
  fallbackLevel: 0 | 1 | 2 | 3;
  ruleVersion: string;
  /** 是否个人层增强（仅影响呈现顺序与侧重，不进内容） */
  personalized: boolean;
  /** 【新增】零依赖天气参考（节气+气候带静态表） */
  weather?: WeatherInfo;
  /** 【新增】结构化三方位 */
  directions?: DirectionsInfo;
  /** 【新增】卡底深链区 */
  deepLinks?: DeepLink[];
  /** 【新增】双层卡片物理隔离视图（全局层无个人信息；个人层仅 uid 哈希） */
  layers?: {
    global: { dateKey: DateKey; ruleVersion: string };
    personal: { uidHash: string } | null;
  };
}

/** 六爻输入 */
export interface LiuyaoQuestionInput {
  uidHash: string;
  dateKey: DateKey;
  category: LiuyaoCategory;
  /** 用户问题原文（敏感拦截用；不入缓存键） */
  question?: string;
}

/** 六爻输出 */
export interface LiuyaoResult {
  /** 卦名（确定性：同 uid+日期+类别 恒同） */
  hexagramName: string;
  /** 卦象二进制（自下而上 6 爻，1=阳） */
  yaoLines: number[];
  /** 解读四段式：象/势/行/免责 */
  sections: { part: '象' | '势' | '行' | '免责'; text: string }[];
  /** 是否被敏感拦截（医法金：不起卦不出解） */
  blocked: boolean;
  seed: string;
}
