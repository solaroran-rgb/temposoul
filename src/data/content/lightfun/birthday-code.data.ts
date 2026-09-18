import type { LightFunEnvelope } from './lightfun.types';
import type { BirthdayCodeEntry } from './birthday-code.types';
import { BIRTHDAY_CODES_ALL } from './birthday-code.gen';

export interface BirthdayCodeContent {
  readonly total_entries: number;
  readonly generation: {
    readonly rules: readonly string[];
    readonly deterministic: boolean;
    readonly pseudo: string;
  };
  readonly entry_schema: Readonly<Record<string, string>>;
  readonly entries: readonly BirthdayCodeEntry[];
  readonly samples: readonly BirthdayCodeEntry[];
  readonly disclaimer_pack_keys: readonly string[];
}

function pickByKey(key: string): BirthdayCodeEntry {
  const found = BIRTHDAY_CODES_ALL.find((e) => e.code_key === key);
  if (!found) throw new Error(`[birthday-code] missing entry: ${key}`);
  return found;
}

export const BIRTHDAY_CODE_DATA: LightFunEnvelope<BirthdayCodeContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-4',
  slug: 'birthday-code',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '生日密码', description: '366 档日期映射与白话解读' },
    en: { title: 'Birthday Code', description: '366-day cultural mapping' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '生日密码 366 档｜日期映射解读',
    description: '按 366 天设计生日密码，输出关键词、能量与行动，仅供娱乐参考。',
    canonical: '/tools/birthday-code',
    keywords: ['生日密码', '日期解读', '趣味测试'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '生日密码',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    total_entries: 366,
    generation: {
      rules: ['digit_sum_reduce', 'season_image_map', 'flower_culture_map'],
      deterministic: true,
      pseudo: 'key=MMDD; season=by_month; hash=digit_sum(key); keywords=SEASON_KW[season]',
    },
    entry_schema: {
      month: 'int',
      day: 'int',
      code_key: 'string[4]',
      is_leap: 'boolean',
      keywords: 'tuple[3]',
      energy_desc: 'string',
      strength: 'string',
      risk: 'string',
      advice: 'string',
      action: 'string',
      related_flower: 'string',
      lucky_color_fun: 'hex',
    },
    entries: BIRTHDAY_CODES_ALL,
    samples: [pickByKey('0101'), pickByKey('0621'), pickByKey('0229')],
    disclaimer_pack_keys: ['general'],
  },
  ui: { theme: 'dark-ide', components: ['DatePicker', 'PasswordCard', 'ShareButton'] },
  share_card: {
    title: '我的生日密码',
    subtitle: '366 天，每一天都有节奏',
    tags: ['#生日密码', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '生日密码结果卡片',
    alt_text: '按日期生成的生日密码解读',
    reading_order: ['code_key', 'keywords', 'advice', 'action'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'low',
    disclaimers: [{ key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' }],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['必然', '一定', '肯定会', '宿命断言'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/birthday-code',
    params: ['[mm-dd]'],
    whitelist: 'content.entries',
    conflicts_with_884: false,
  },
};
