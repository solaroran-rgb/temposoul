/**
 * A 域（排盘深化/命理专题）判别联合类型
 * 来源：专家 A R3 v3.0（lunz 2.md §二）+ R4 v8.0（论证44.md §3.1）修正
 * 说明：域内私有类型，不覆盖既有 src/data/content/types.ts（被 15 文件引用）
 */
export type ContentDomain = 'bazi-ziwei' | 'calendar-astro' | 'divination' | 'western-name';
export type SourceSystem = 'bazi' | 'ziwei' | 'western_astrology' | 'iching' | 'tarot' | 'hybrid';
export type DomainNote = 'none' | 'culture_discussion' | 'lifestyle_only' | 'entertainment_only';
export type ReviewStatus = 'audited' | 'supplemented' | 'polished' | 'from_scratch';

export interface InsightLoop {
  insight: string;
  cause: string;
  manifestation: string;
  risk: string;
  suggestion: string;
  action: string;
}

export interface ContentSeo {
  title: string; // <= 30 字（含标点）
  description: string; // <= 80 字
  slug: string; // ^/[a-z0-9\-\/]+$
  canonical: string;
  breadcrumb: string[];
  /** v8.0 修正：显式传入，与 breadcrumb 等长（不再自动推导） */
  breadcrumb_paths: string[];
  alternates?: Array<{ hreflang: string; href: string }>;
}

export interface ContentSource {
  system: SourceSystem;
  classic: string; // 精确到书名
  chapter: string; // 精确到篇章
}

export interface ContentCompliance {
  no_fatalism: true;
  domain_note: DomainNote;
  banned_words_checked: true;
}

export interface ContentReview {
  status: ReviewStatus;
  word_count: number; // body 全字段含标点字符数（去空白）
  reviewer: string;
}

export interface ContentBody {
  plain_reading: string;
  insight_loop: InsightLoop;
  sections?: Array<{ heading: string; text: string }>;
}

// ===== 各内容域 extra 类型（判别联合判别键）=====
export interface TenGodExtra {
  kind: 'ten_gods';
  name_zh: string;
  pinyin: string;
  five_element_relation: string;
  preference: { strong_body: string; weak_body: string };
  combinations: Array<{ with: string; reading: string }>;
}
export interface ShenShaExtra {
  kind: 'shen_sha';
  name_zh: string;
  pinyin: string;
  lookup_rule: string;
  lookup_base: 'day_stem' | 'year_stem' | 'year_branch' | 'day_branch' | 'day_pillar';
  meaning: string;
}
export interface FourTransformExtra {
  kind: 'four_transform';
  star: string;
  star_pinyin: string;
  type: 'lu' | 'quan' | 'ke' | 'ji';
  type_zh: string;
  keyword: string;
  pair_ref: string;
}
export interface FourTransformPairExtra {
  kind: 'four_transform_pair';
  heavenly_stem: string;
  stem_pinyin: string;
  lu_star: string;
  quan_star: string;
  ke_star: string;
  ji_star: string;
  note: string;
}
export interface ZiweiPatternExtra {
  kind: 'ziwei_pattern';
  name_zh: string;
  condition: string;
  traits: string[];
  risk_note: string;
}
export interface LimitYearExtra {
  kind: 'limit_year';
  type: 'da_xian' | 'xiao_xian' | 'liu_nian';
  type_zh: string;
  definition: string;
  start_rule: string;
  span: string;
  four_transform_layer: 'base' | 'decade' | 'annual';
  input_fields: string[];
  output_fields: string[];
  guide_text: string;
}
export interface PalaceStarExtra {
  kind: 'palace_star';
  palace: string;
  palace_pinyin: string;
  star: string;
  star_pinyin: string;
  is_example: boolean;
}
export interface TransitExtra {
  kind: 'transit_solar';
  type: 'transit' | 'solar_return';
  time_scale: string;
  layers: Array<{ name: string; scope: string; reading: string }>;
  boundary_note: string;
}

// ===== B 域（历法星象）extra =====
export interface SolarTermExtra {
  kind: 'solar_term';
  term_index: number;
  solar_approx: string;
  five_element: string;
  wellness_tip: string;
}
export interface ZiweiStarBExtra {
  kind: 'ziwei_star_b';
  star: string;
  pinyin: string;
  element: string;
  keyword: string;
}
export interface PalaceBExtra {
  kind: 'palace_b';
  palace: string;
  pinyin: string;
  keyword: string;
  focus: string;
}

// ===== C 域（占卜民俗）extra =====
export interface BoneWeightExtra {
  kind: 'bone_weight';
  weight_liang: number;
  weight_qian: number;
}
export interface TarotExtra {
  kind: 'tarot';
  arcana: 'major' | 'minor';
  upright: string;
  reversed: string;
  confidence: string;
}
export interface DreamDictExtra {
  kind: 'dream_dict';
  theme: string;
}
export interface IchingExtra {
  kind: 'iching';
  hexagram_index: number;
  upper_trigram: string;
  lower_trigram: string;
}
export interface NumberDivinationExtra {
  kind: 'number_divination';
  number: number;
  tone: string;
}
export interface LoveDivinationExtra {
  kind: 'love_divination';
  result_index: number;
  tag: string;
}

// ===== D 域（西占姓名）extra =====
export interface ZodiacEncyclopediaExtra {
  kind: 'zodiac_encyclopedia';
  symbol: string;
  date_range: string;
  element: string;
  ruling_planet: string;
}
export interface ZodiacPersonalityExtra {
  kind: 'zodiac_personality';
  symbol: string;
  trait: string;
  growth: string;
}

export type AnyExtra =
  | TenGodExtra
  | ShenShaExtra
  | FourTransformExtra
  | FourTransformPairExtra
  | ZiweiPatternExtra
  | LimitYearExtra
  | PalaceStarExtra
  | TransitExtra
  | SolarTermExtra
  | ZiweiStarBExtra
  | PalaceBExtra
  | BoneWeightExtra
  | TarotExtra
  | DreamDictExtra
  | IchingExtra
  | NumberDivinationExtra
  | LoveDivinationExtra
  | ZodiacEncyclopediaExtra
  | ZodiacPersonalityExtra;

export type ContentCategory = AnyExtra['kind'];

/** 判别联合：extra 类型由 category 决定 */
export interface ContentRecord<E extends AnyExtra = AnyExtra> {
  id: string; // ^[a-z0-9_]+$
  version: string;
  domain: ContentDomain;
  category: E['kind'];
  seo: ContentSeo;
  source: ContentSource;
  compliance: ContentCompliance;
  review: ContentReview;
  body: ContentBody;
  extra: E;
  i18n_key: string;
}

export type AnyContentRecord = ContentRecord<AnyExtra>;

/** 字数下限（含标点字符数） */
export const WORD_FLOOR: Record<string, number> = {
  ten_gods: 200,
  shen_sha: 150,
  four_transform: 150,
  four_transform_pair: 80,
  ziwei_pattern: 150,
  limit_year: 150,
  palace_star: 120,
  transit_solar: 150,
  solar_term: 200,
  ziwei_star_b: 200,
  palace_b: 200,
  bone_weight: 150,
  tarot: 200,
  dream_dict: 100,
  iching: 200,
  number_divination: 150,
  love_divination: 150,
  zodiac_encyclopedia: 200,
  zodiac_personality: 200,
};

/** 规范 ID 集合（供校验断言） */
export const CATEGORIES: readonly ContentCategory[] = [
  'ten_gods',
  'shen_sha',
  'four_transform',
  'four_transform_pair',
  'ziwei_pattern',
  'limit_year',
  'palace_star',
  'transit_solar',
  'solar_term',
  'ziwei_star_b',
  'palace_b',
  'bone_weight',
  'tarot',
  'dream_dict',
  'iching',
  'number_divination',
  'love_divination',
  'zodiac_encyclopedia',
  'zodiac_personality',
] as const;
