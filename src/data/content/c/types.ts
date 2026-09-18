/**
 * C 域（内容轻娱乐批）判别联合类型
 * 来源：专家 C R3（143217.md §1519-2859）+ R5（150722.md §1012-3662）
 * 说明：域内私有类型，不覆盖既有 src/data/content/bazi-ziwei/types.ts
 */

export type CContentDomain = 'c';
export type CReviewStatus = 'audited' | 'supplemented' | 'polished';
export type CDomainNote = 'culture_discussion' | 'entertainment_only' | 'lifestyle_only';

export interface CInsightLoop {
  insight: string;
  cause: string;
  manifestation: string;
  risk: string;
  suggestion: string;
  action: string;
}

export interface CContentSeo {
  title: string;
  description: string;
  slug: string;
  canonical: string;
  breadcrumb: string[];
  breadcrumb_paths: string[];
}

export interface CContentSource {
  system: string;
  classic: string;
  chapter: string;
}

export interface CContentCompliance {
  no_fatalism: true;
  domain_note: CDomainNote;
  banned_words_checked: true;
}

export interface CContentReview {
  status: CReviewStatus;
  word_count: number;
  reviewer: string;
}

export interface CContentBody {
  plain_reading: string;
  insight_loop: CInsightLoop;
  sections?: Array<{ heading: string; text: string }>;
}

// ===== C 域 extra 类型（判别联合判别键）=====

/** C-1 格局详解库 */
export interface CPatternExtendedExtra {
  kind: 'c_pattern_extended';
  pattern_type: string;
  core_meaning: string;
  manifestation: string;
  advice: string;
}

/** C-2 塔罗学习课程 */
export interface CTarotCurriculumExtra {
  kind: 'c_tarot_curriculum';
  lesson_no: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  core_concept: string;
  card_meaning: string;
  practical_use: string;
}

/** C-3 行星星座百科（占星词条） */
export interface CAstrologyTermsExtra {
  kind: 'c_astrology_terms';
  term_type: 'planet' | 'aspect' | 'house' | 'sign';
  core_theme: string;
  examples: string[];
}

/** C-4 国学典籍导读 */
export interface CClassicsGuideExtra {
  kind: 'c_classics_guide';
  dynasty: string;
  version_source: string;
  key_chapters: string;
  core_idea: string;
  modern_relevance: string;
}

/** C-5 育儿占星 */
export interface CParentingAstrologyExtra {
  kind: 'c_parenting_astrology';
  sign_name: string;
  energy_preference: string;
  parenting_mistake: string;
  positive_guidance: string;
  rhythm_advice: string;
}

/** C-6 星历表（工具页） */
export interface CEphemerisExtra {
  kind: 'c_ephemeris';
  year: number;
  sample_days: Array<{
    date: string;
    moon_phase: string;
    retrograde: string[];
  }>;
}

export type CAnyExtra =
  | CPatternExtendedExtra
  | CTarotCurriculumExtra
  | CAstrologyTermsExtra
  | CClassicsGuideExtra
  | CParentingAstrologyExtra
  | CEphemerisExtra;

export type CContentCategory = CAnyExtra['kind'];

/** 判别联合：extra 类型由 category 决定 */
export interface CContentRecord<E extends CAnyExtra = CAnyExtra> {
  id: string;
  version: string;
  domain: CContentDomain;
  category: E['kind'];
  seo: CContentSeo;
  source: CContentSource;
  compliance: CContentCompliance;
  review: CContentReview;
  body: CContentBody;
  extra: E;
  i18n_key: string;
}

export type CAnyContentRecord = CContentRecord<CAnyExtra>;

/** C 域规范 kind 集合 */
export const C_CATEGORIES: readonly CContentCategory[] = [
  'c_pattern_extended',
  'c_tarot_curriculum',
  'c_astrology_terms',
  'c_classics_guide',
  'c_parenting_astrology',
  'c_ephemeris',
] as const;
