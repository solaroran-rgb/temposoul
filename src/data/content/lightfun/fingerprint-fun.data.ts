import type { LightFunEnvelope } from './lightfun.types';

export interface FingerprintType {
  readonly type_id: string;
  readonly name: string;
  readonly keywords: readonly [string, string];
  readonly meaning: string;
  readonly reading: string;
}

export interface FingerprintContent {
  readonly flow: readonly string[];
  readonly fp_types: readonly FingerprintType[];
  readonly reading_note: string;
  readonly disclaimer_pack_keys: readonly string[];
}

export const FP_TYPES: readonly FingerprintType[] = [
  {
    type_id: 'whorl',
    name: '斗形纹',
    keywords: ['独立', '节奏'],
    meaning: '涡旋闭合的纹路',
    reading: '传统说法偏自主，现代可理解为习惯按自己的节奏推进。',
  },
  {
    type_id: 'loop-left',
    name: '左箕纹',
    keywords: ['观察', '倾听'],
    meaning: '开口偏向拇指一侧',
    reading: '传统说法善倾听，现代可理解为习惯先观察再表达。',
  },
  {
    type_id: 'loop-right',
    name: '右箕纹',
    keywords: ['表达', '行动'],
    meaning: '开口偏向小指一侧',
    reading: '传统说法善表达，现代可理解为习惯边做边调整。',
  },
  {
    type_id: 'arch',
    name: '弓形纹',
    keywords: ['务实', '稳进'],
    meaning: '纹路横拱如桥',
    reading: '传统说法重实际，现代可理解为偏好结构化与落地。',
  },
  {
    type_id: 'tented-arch',
    name: '帐弓纹',
    keywords: ['敏锐', '张力'],
    meaning: '中央突起如帐',
    reading: '传统说法感受敏锐，现代可理解为对环境变化敏感。',
  },
  {
    type_id: 'peacock-eye',
    name: '眼形纹',
    keywords: ['审美', '聚焦'],
    meaning: '纹中现眼形环',
    reading: '传统说法重美感，现代可理解为注意力容易聚焦在细节。',
  },
  {
    type_id: 'double-loop',
    name: '双箕纹',
    keywords: ['灵活', '多面'],
    meaning: '两个箕形交叠',
    reading: '传统说法善变通，现代可理解为能在两种视角间切换。',
  },
  {
    type_id: 'composite',
    name: '混合纹',
    keywords: ['综合', '弹性'],
    meaning: '多种纹形组合',
    reading: '传统说法适应力强，现代可理解为应对方式较灵活。',
  },
  {
    type_id: 'accident',
    name: '变异纹',
    keywords: ['少见', '独特'],
    meaning: '纹路非典型',
    reading: '传统说法称独特，现代可理解为不必强套标准类型。',
  },
];

export const FINGERPRINT_WHITELIST: ReadonlySet<string> = new Set(FP_TYPES.map((t) => t.type_id));

export const FINGERPRINT_DATA: LightFunEnvelope<FingerprintContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-2',
  slug: 'fingerprint-fun',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '指纹趣味类型', description: '九种指纹形态文化参考' },
    en: { title: 'Fingerprint Types', description: 'Nine print patterns for fun' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '指纹趣味类型｜九型文化参考',
    description: '整理九种常见指纹形态的文化说法与现代自我觉察角度，仅供娱乐参考。',
    canonical: '/tools/fingerprint-fun',
    keywords: ['指纹', '指纹', '趣味测试', '文化参考'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '指纹趣味类型',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['pick_type', 'show_meaning', 'modern_lens', 'close_loop'],
    fp_types: FP_TYPES,
    reading_note: '指纹形态为生理特征，此处仅作文化与自我觉察的趣味参照，不做人格或命运断言。',
    disclaimer_pack_keys: ['general', 'science'],
  },
  ui: {
    theme: 'dark-ide',
    components: ['FingerprintPicker', 'ResultCard', 'ShareButton', 'DisclaimerBanner'],
  },
  share_card: {
    title: '我的指纹倾向',
    subtitle: '文化说法，非科学结论',
    tags: ['#指纹', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '指纹类型结果卡片',
    alt_text: '九种指纹形态的文化解读',
    reading_order: ['name', 'keywords', 'meaning', 'reading'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'low',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'science', text: '本内容为文化象征与心理觉察，非科学因果结论。' },
    ],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['必然', '一定', '肯定会', '宿命断言'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/fingerprint-fun',
    params: ['[type]'],
    whitelist: 'content.fp_types',
    conflicts_with_884: false,
  },
};
