import type { LightFunEnvelope } from './lightfun.types';

export interface BloodTypeEntry {
  readonly blood_type: 'A' | 'B' | 'AB' | 'O';
  readonly keywords: readonly [string, string];
  readonly reading: string;
  readonly caution: string;
}

export interface BloodTypeContent {
  readonly flow: readonly string[];
  readonly blood_types: readonly BloodTypeEntry[];
  readonly science_note: string;
  readonly disclaimer_pack_keys: readonly string[];
}

export const BLOOD_TYPES: readonly BloodTypeEntry[] = [
  {
    blood_type: 'A',
    keywords: ['细致', '稳定'],
    reading: '文化里常说 A 型人细心、重秩序，现代可理解为偏好把事情安排稳妥。',
    caution: '血型与性格无科学因果，别用来给人贴标签。',
  },
  {
    blood_type: 'B',
    keywords: ['灵活', '自在'],
    reading: '文化里常说 B 型人灵活、随性，现代可理解为节奏不太受规则束缚。',
    caution: '这是文化印象，不是对个人的判断。',
  },
  {
    blood_type: 'AB',
    keywords: ['多元', '切换'],
    reading: '文化里常说 AB 型人兼有两面，现代可理解为能在不同风格间切换。',
    caution: '组合印象不等于真实人格。',
  },
  {
    blood_type: 'O',
    keywords: ['外放', '热情'],
    reading: '文化里常说 O 型人爽朗、直接，现代可理解为表达偏向外放。',
    caution: '血型说法仅供娱乐，不做性格定论。',
  },
];

export const BLOOD_TYPE_WHITELIST: ReadonlySet<string> = new Set(
  BLOOD_TYPES.map((b) => b.blood_type),
);

export const BLOOD_TYPE_DATA: LightFunEnvelope<BloodTypeContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-7',
  slug: 'blood-type-fun',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '血型趣味说', description: 'ABO 血型文化印象参考' },
    en: { title: 'Blood Type Fun', description: 'ABO cultural stereotypes for fun' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '血型趣味说｜ABO 文化印象',
    description: 'ABO 血型的文化印象与现代视角，仅供娱乐，血型与性格无科学因果。',
    canonical: '/tools/blood-type-fun',
    keywords: ['血型', '血型性格', '趣味测试'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '血型趣味说',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['pick_blood', 'show_reading', 'science_note', 'close_loop'],
    blood_types: BLOOD_TYPES,
    science_note: '血型性格说是流行文化印象，现代科学不支持血型决定性格。',
    disclaimer_pack_keys: ['general', 'science'],
  },
  ui: {
    theme: 'dark-ide',
    components: ['BloodPicker', 'ResultCard', 'DisclaimerBanner', 'ShareButton'],
  },
  share_card: {
    title: '我的血型印象',
    subtitle: '文化说法，图个轻松',
    tags: ['#血型', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '血型趣味结果卡片',
    alt_text: 'ABO 血型的文化印象解读',
    reading_order: ['blood_type', 'keywords', 'reading', 'caution'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'high',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'science', text: '本内容为文化象征与心理觉察，非科学因果结论。' },
      { key: 'no_fate', text: '本内容不预测命运，不做宿命断言。' },
    ],
    disclaimer_slots: ['page_top', 'result_card', 'page_footer'],
    forbidden_terms: ['性格决定', '人格判定', '必然', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/blood-type-fun',
    params: ['[A|B|AB|O]'],
    whitelist: 'content.blood_types',
    conflicts_with_884: false,
  },
};
