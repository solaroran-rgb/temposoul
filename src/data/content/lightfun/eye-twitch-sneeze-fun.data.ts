import type { LightFunEnvelope } from './lightfun.types';

export interface EyeSneezeEntry {
  readonly shichen: string;
  readonly hour_range: string;
  readonly eye_left: string;
  readonly eye_right: string;
  readonly sneeze: string;
  readonly modern_note: string;
}

export interface EyeSneezeContent {
  readonly flow: readonly string[];
  readonly entries: readonly EyeSneezeEntry[];
  readonly disclaimer_pack_keys: readonly string[];
}

export const EYE_SNEEZE_ENTRIES: readonly EyeSneezeEntry[] = [
  {
    shichen: '子',
    hour_range: '23:00-01:00',
    eye_left: '民俗说有客来',
    eye_right: '民俗说宜静心',
    sneeze: '民俗说有人念你',
    modern_note: '眼皮跳动多与疲劳有关，注意休息。',
  },
  {
    shichen: '丑',
    hour_range: '01:00-03:00',
    eye_left: '民俗说有小聚',
    eye_right: '民俗说宜早歇',
    sneeze: '民俗说被提起',
    modern_note: '熬夜后的肌肉疲劳很常见。',
  },
  {
    shichen: '寅',
    hour_range: '03:00-05:00',
    eye_left: '民俗说有远讯',
    eye_right: '民俗说宜调息',
    sneeze: '民俗说被惦记',
    modern_note: '规律作息比联想更靠谱。',
  },
  {
    shichen: '卯',
    hour_range: '05:00-07:00',
    eye_left: '民俗说有客至',
    eye_right: '民俗说宜平稳',
    sneeze: '民俗说有问候',
    modern_note: '晨起补水，放松眼周。',
  },
  {
    shichen: '辰',
    hour_range: '07:00-09:00',
    eye_left: '民俗说有小喜',
    eye_right: '民俗说宜从容',
    sneeze: '民俗说被想起',
    modern_note: '可能是用眼过度。',
  },
  {
    shichen: '巳',
    hour_range: '09:00-11:00',
    eye_left: '民俗说有客来',
    eye_right: '民俗说宜放慢',
    sneeze: '民俗说有消息',
    modern_note: '每用眼一小时休息片刻。',
  },
  {
    shichen: '午',
    hour_range: '11:00-13:00',
    eye_left: '民俗说有小聚',
    eye_right: '民俗说宜静养',
    sneeze: '民俗说被念叨',
    modern_note: '午间小憩有助缓解。',
  },
  {
    shichen: '未',
    hour_range: '13:00-15:00',
    eye_left: '民俗说有远讯',
    eye_right: '民俗说宜稳守',
    sneeze: '民俗说有问候',
    modern_note: '注意室内通风。',
  },
  {
    shichen: '申',
    hour_range: '15:00-17:00',
    eye_left: '民俗说有客至',
    eye_right: '民俗说宜轻缓',
    sneeze: '民俗说被惦记',
    modern_note: '可能是干燥或疲劳。',
  },
  {
    shichen: '酉',
    hour_range: '17:00-19:00',
    eye_left: '民俗说有小喜',
    eye_right: '民俗说宜收束',
    sneeze: '民俗说被提起',
    modern_note: '下班前放松肩颈。',
  },
  {
    shichen: '戌',
    hour_range: '19:00-21:00',
    eye_left: '民俗说有小聚',
    eye_right: '民俗说宜安定',
    sneeze: '民俗说有消息',
    modern_note: '减少屏幕时间。',
  },
  {
    shichen: '亥',
    hour_range: '21:00-23:00',
    eye_left: '民俗说有远讯',
    eye_right: '民俗说宜早睡',
    sneeze: '民俗说被想念',
    modern_note: '早点休息最实在。',
  },
];

export const EYE_SNEEZE_WHITELIST: ReadonlySet<string> = new Set(
  EYE_SNEEZE_ENTRIES.map((e) => e.shichen),
);

export const EYE_SNEEZE_DATA: LightFunEnvelope<EyeSneezeContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-9',
  slug: 'eye-twitch-sneeze-fun',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '眼跳喷嚏民俗谈', description: '十二时辰民俗说法对照' },
    en: { title: 'Twitch & Sneeze Lore', description: 'Twelve shichen folklore' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '眼跳喷嚏民俗谈｜十二时辰',
    description: '整理眼跳、喷嚏在十二时辰里的民俗说法，并附现代健康视角，仅供文化娱乐。',
    canonical: '/tools/eye-twitch-sneeze-fun',
    keywords: ['眼跳', '喷嚏', '民俗', '趣味'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '眼跳喷嚏民俗谈',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['pick_shichen', 'show_lore', 'modern_note', 'close_loop'],
    entries: EYE_SNEEZE_ENTRIES,
    disclaimer_pack_keys: ['general', 'health', 'science'],
  },
  ui: {
    theme: 'dark-ide',
    components: ['ShichenPicker', 'LoreCard', 'DisclaimerBanner', 'ShareButton'],
  },
  share_card: {
    title: '眼跳喷嚏小谈',
    subtitle: '民俗说法 + 健康视角',
    tags: ['#民俗', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '眼跳喷嚏民俗结果卡片',
    alt_text: '十二时辰眼跳喷嚏民俗说法与健康提示',
    reading_order: ['shichen', 'eye_left', 'eye_right', 'sneeze', 'modern_note'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'high',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'health', text: '不构成诊断；如有持续不适，请咨询专业医生。' },
      { key: 'science', text: '本内容为文化象征与心理觉察，非科学因果结论。' },
    ],
    disclaimer_slots: ['page_top', 'result_card', 'page_footer'],
    forbidden_terms: ['疾病论断', '不吉之兆', '不妙', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/eye-twitch-sneeze-fun',
    params: ['[shichen]'],
    whitelist: 'content.entries',
    conflicts_with_884: false,
  },
};
