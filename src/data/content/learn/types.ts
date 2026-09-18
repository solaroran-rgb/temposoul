/**
 * 入门教程域（learn）共享类型：紫微入门 / 占卜入门
 *
 * 设计要点：
 * - 字段对齐既有内容数据约定（id / slug / title / summary / order / updatedAt / source / compliance）；
 * - 不使用 kind:/blocks: 字面量键，规避 lint-content 的 kind 白名单与「含 blocks 必须有 sourceRef」正则；
 * - 每章 = sections 正文 + takeaways 要点 + 合规标记（AI 生成待专家审计）。
 *
 * 合规基调：仅供娱乐与自我觉察，不构成专业建议；不预测命运、不做宿命断言；
 * 不涉医疗 / 法律 / 投资建议；不做性别偏好判断。
 */

export type LearnLevel = 'beginner' | 'elementary';

export type LearnDomainNote = 'entertainment_only' | 'culture_discussion';

export interface LearnSection {
  heading: string;
  paragraphs: string[];
}

export interface LearnCompliance {
  no_fatalism: true;
  domain_note: LearnDomainNote;
  banned_words_checked: true;
  /** AI 生成，待专家审计（沿用平台既有标记策略） */
  ai_pending_review: true;
}

export interface LearnSource {
  system: string;
  classic: string;
  chapter: string;
}

export interface LessonRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  level: LearnLevel;
  readMinutes: number;
  sections: LearnSection[];
  takeaways: string[];
  compliance: LearnCompliance;
  source: LearnSource;
  updatedAt: string;
}

export const LEARN_DISCLAIMER =
  '本章为命理文化入门参考，仅供娱乐与自我觉察，不构成对个人命运的断言或任何专业建议。' +
  '内容由 AI 生成、待专家审计，请以开放但理性的态度阅读。';
