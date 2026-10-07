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

/** 每日星图输出（L0 完整；熔断时降级） */
export interface StarCardOutput {
  blocks: StarCardBlock[];
  /** 熔断等级 L0-L3 */
  fallbackLevel: 0 | 1 | 2 | 3;
  ruleVersion: string;
  /** 是否个人层增强（仅影响呈现顺序与侧重，不进内容） */
  personalized: boolean;
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
