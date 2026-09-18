import type { LightFunEnvelope } from './lightfun.types';

export interface QingGongField {
  readonly field: string;
  readonly label: string;
  readonly input_type: 'number' | 'select';
  readonly note: string;
}

export interface QingGongContent {
  readonly flow: readonly string[];
  readonly cultural_origin: string;
  readonly fields: readonly QingGongField[];
  readonly stance: readonly string[];
  readonly disclaimer_pack_keys: readonly string[];
}

export const QINGGONG_DATA: LightFunEnvelope<QingGongContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-8',
  slug: 'qinggong-fun',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '清宫表文化趣谈', description: '民俗表格的文化背景介绍' },
    en: { title: 'Qing Palace Chart', description: 'Folklore chart cultural note' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'audit_aligned',
  seo: {
    title: '清宫表文化趣谈｜民俗背景',
    description: '介绍清宫表这一民俗物的文化背景，本站不做性别预测，亦不鼓励任何性别偏好。',
    canonical: '/tools/qinggong-fun',
    keywords: ['清宫表', '民俗文化', '生男生女'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '清宫表文化趣谈',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['read_origin', 'understand_stance', 'close_loop'],
    cultural_origin: '清宫表是民间流传的一张民俗对照表，多见于旧俗读物，缺乏现代医学依据。',
    fields: [
      {
        field: 'age',
        label: '农历虚岁',
        input_type: 'number',
        note: '仅作文化演示，不参与真实判断。',
      },
      {
        field: 'month',
        label: '农历月份',
        input_type: 'select',
        note: '仅作文化演示，不参与真实判断。',
      },
    ],
    stance: [
      '本站仅介绍该民俗物的文化背景，不提供任何胎儿性别预测。',
      '胎儿性别由生物学决定，应通过正规医学渠道了解。',
      '本站不鼓励、不暗示任何性别偏好。',
    ],
    disclaimer_pack_keys: ['general', 'gender', 'privacy', 'no_fate'],
  },
  ui: { theme: 'dark-ide', components: ['OriginCard', 'StanceList', 'DisclaimerBanner'] },
  share_card: {
    title: '清宫表文化趣谈',
    subtitle: '只聊文化，不做预测',
    tags: ['#民俗文化', '#性别平等'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '清宫表文化介绍卡片',
    alt_text: '清宫表民俗背景与本站立场说明',
    reading_order: ['cultural_origin', 'stance', 'disclaimer'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'high',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'gender', text: '本内容不涉及医学判断，无性别偏好。' },
      { key: 'privacy', text: '本页不收集身份证、手机号、生物特征、精确地址或财务账号。' },
      { key: 'no_fate', text: '本内容不预测命运，不做宿命断言。' },
    ],
    disclaimer_slots: ['page_top', 'result_card', 'page_footer'],
    forbidden_terms: ['预测男女', '生男', '生女', '包中', '必然', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/qinggong-fun',
    params: [],
    whitelist: undefined,
    conflicts_with_884: false,
  },
};
