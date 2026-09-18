/**
 * 合婚报告域（hehun）类型：八字合婚文化报告库
 *
 * 定位：内容型报告（列表 + 详情），非交互式合盘工具。
 * 交互式合盘工具已在 /bazi/compatibility，本域提供合婚话题的文化导读与解读框架。
 *
 * 合规：不做配对分数 / 成功率断言；不做性别偏好；仅供娱乐与自我觉察。
 */

export interface HehunSection {
  heading: string;
  paragraphs: string[];
}

export interface HehunCompliance {
  no_match_score: true;
  no_fatalism: true;
  domain_note: 'culture_discussion';
  banned_words_checked: true;
  ai_pending_review: true;
}

export interface HehunSource {
  system: string;
  classic: string;
  topic: string;
}

export interface HehunReportRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  readMinutes: number;
  sections: HehunSection[];
  takeaways: string[];
  compliance: HehunCompliance;
  source: HehunSource;
  updatedAt: string;
}

export const HEHUN_DISCLAIMER =
  '本报告为传统合婚文化的解读框架，仅供娱乐与自我觉察，不显示配对分数或成功率，' +
  '不构成对两人关系走向的断言，也不构成任何专业建议。关系的经营在于双方当下的沟通与选择。';
