import type { LightFunEnvelope } from './lightfun.types';

export type CelebrityEntry =
  | {
      readonly name: string;
      readonly birth_data_status: 'verified';
      readonly allowed_output: readonly ['sun', 'moon', 'rising', 'aspects', 'career_house'];
      readonly forbidden_output: readonly ['命运预测', '隐私推测'];
    }
  | {
      readonly name: string;
      readonly birth_data_status: 'date_only';
      readonly allowed_output: readonly ['sun_sign_culture'];
      readonly forbidden_output: readonly ['宫位断言', '命运预测', '隐私推测'];
    }
  | {
      readonly name: string;
      readonly birth_data_status: 'unknown';
      readonly allowed_output: readonly ['文化背景'];
      readonly forbidden_output: readonly ['星盘要素', '命运预测'];
    };

export interface CelebrityAstroContent {
  readonly flow: readonly string[];
  readonly celebrities: readonly CelebrityEntry[];
  readonly output_policy: readonly string[];
  readonly disclaimer_pack_keys: readonly string[];
}

export const CELEBRITIES: readonly CelebrityEntry[] = [
  {
    name: '苏轼',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '李白',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '杜甫',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '王羲之',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '陶渊明',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '白居易',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '李清照',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '辛弃疾',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '曹雪芹',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '陆游',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '沈括',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
  {
    name: '王阳明',
    birth_data_status: 'date_only',
    allowed_output: ['sun_sign_culture'],
    forbidden_output: ['宫位断言', '命运预测', '隐私推测'],
  },
];

export const CELEBRITY_WHITELIST: ReadonlySet<string> = new Set(CELEBRITIES.map((c) => c.name));

export const CELEBRITY_DATA: LightFunEnvelope<CelebrityAstroContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-10',
  slug: 'celebrity-astrology',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '名人星座文化', description: '历史名人的星座文化侧写' },
    en: { title: 'Celebrity Star Culture', description: 'Cultural notes on historical figures' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '名人星座文化｜历史人物侧写',
    description: '以历史名人为线索，聊太阳星座的文化象征，不做星盘断言，不推测隐私。',
    canonical: '/topics/celebrity-astrology',
    keywords: ['名人星座', '星座文化', '历史人物'],
    json_ld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: '名人星座文化' },
    ],
  },
  content: {
    flow: ['pick_celebrity', 'sun_sign_culture', 'close_loop'],
    celebrities: CELEBRITIES,
    output_policy: [
      '仅输出太阳星座的文化象征，不排宫位、不做命运断言。',
      '不推测私人生活，不构造未经证实的星盘细节。',
    ],
    disclaimer_pack_keys: ['general', 'no_fate', 'privacy'],
  },
  ui: { theme: 'dark-ide', components: ['CelebrityGrid', 'CultureCard', 'DisclaimerBanner'] },
  share_card: {
    title: '名人星座文化',
    subtitle: '只聊象征，不做断言',
    tags: ['#星座文化', '#历史人物'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '名人星座文化卡片',
    alt_text: '历史名人的太阳星座文化象征',
    reading_order: ['name', 'allowed_output', 'output_policy'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'medium',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'privacy', text: '本页不收集身份证、手机号、生物特征、精确地址或财务账号。' },
      { key: 'no_fate', text: '本内容不预测命运，不做宿命断言。' },
    ],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['命运预测', '隐私推测', '大富大贵', '必然'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/topics/celebrity-astrology',
    params: ['[slug]'],
    whitelist: 'content.celebrities',
    conflicts_with_884: false,
  },
};
