import type { LightFunEnvelope } from './lightfun.types';

export interface YangzhaiQuestion {
  readonly id: string;
  readonly q: string;
  readonly options: readonly { readonly label: string; readonly score: number }[];
}
export interface YangzhaiResult {
  readonly type: string;
  readonly name: string;
  readonly reading: string;
  readonly advice: string;
}

export interface YangzhaiContent {
  readonly flow: readonly string[];
  readonly questions: readonly YangzhaiQuestion[];
  readonly results: readonly YangzhaiResult[];
  readonly disclaimer_pack_keys: readonly string[];
}

function yopt(
  a: string,
  b: string,
  c: string,
): readonly { readonly label: string; readonly score: number }[] {
  return [
    { label: a, score: 1 },
    { label: b, score: 2 },
    { label: c, score: 3 },
  ];
}

export const YANGZHAI_QUESTIONS: readonly YangzhaiQuestion[] = [
  { id: 'yz1', q: '进门第一眼，玄关通常？', options: yopt('整洁明亮', '有点杂物', '很难落脚') },
  { id: 'yz2', q: '客厅采光？', options: yopt('充足', '一般', '偏暗') },
  { id: 'yz3', q: '你常坐的位置背后？', options: yopt('靠墙', '是过道', '正对门') },
  { id: 'yz4', q: '卧室灯光？', options: yopt('柔和可调', '只有一盏亮灯', '忽明忽暗') },
  { id: 'yz5', q: '床的摆放？', options: yopt('靠墙且稳', '临窗', '正对镜子') },
  { id: 'yz6', q: '厨房台面？', options: yopt('干净整齐', '偶尔堆杂物', '很乱') },
  { id: 'yz7', q: '家里绿植状态？', options: yopt('生机盎然', '有几盆但一般', '很少养护') },
  { id: 'yz8', q: '收纳空间？', options: yopt('够用且归位', '勉强够用', '东西溢出') },
  { id: 'yz9', q: '通风情况？', options: yopt('经常开窗', '偶尔开', '很少开') },
  { id: 'yz10', q: '在家放松感？', options: yopt('很安心', '一般', '总觉杂乱') },
];

export const YANGZHAI_RESULTS: readonly YangzhaiResult[] = [
  {
    type: 'balanced',
    name: '理气舒畅型',
    reading: '你的居住环境整体整洁、采光通风良好。',
    advice: '保持现有节奏，定期整理即可。',
  },
  {
    type: 'fresh',
    name: '待整理型',
    reading: '有几处小杂乱，但底子不错。',
    advice: '先从玄关和客厅两个高频区域入手。',
  },
  {
    type: 'reset',
    name: '需重启型',
    reading: '空间里的杂乱已经影响到日常心情。',
    advice: '用一周每天整理一个角落，循序渐进。',
  },
  {
    type: 'deep',
    name: '深度焕新型',
    reading: '居住状态较久未调整，建议系统整理。',
    advice: '先清杂物，再谈布局，必要时咨询专业收纳。',
  },
];

export const YANGZHAI_DATA: LightFunEnvelope<YangzhaiContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-12',
  slug: 'yangzhai-fengshui-test',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '居家风水趣味测', description: '居住环境整理倾向小测' },
    en: { title: 'Home Vibe Quiz', description: 'A fun home-environment quiz' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '居家风水趣味测｜整理倾向',
    description: '以居住环境整洁度为题的趣味小测，结果侧重收纳与采光建议，非风水论断。',
    canonical: '/tools/yangzhai-fengshui-test',
    keywords: ['居家风水', '收纳', '趣味测试', '居住环境'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '居家风水趣味测',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['answer', 'score', 'result', 'advice', 'close_loop'],
    questions: YANGZHAI_QUESTIONS,
    results: YANGZHAI_RESULTS,
    disclaimer_pack_keys: ['general', 'science'],
  },
  ui: {
    theme: 'dark-ide',
    components: ['QuestionCard', 'ResultCard', 'AdviceList', 'ShareButton'],
  },
  share_card: {
    title: '我的居家倾向',
    subtitle: '从整理聊起的趣味小测',
    tags: ['#居家', '#收纳', '#趣味测试'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '居家风水趣味测结果卡片',
    alt_text: '居住环境整理倾向小测结果',
    reading_order: ['result_name', 'reading', 'advice'],
    min_contrast_ratio: 4.5,
  },
  compliance: {
    risk_level: 'low',
    disclaimers: [
      { key: 'general', text: '本内容仅供文化娱乐参考，不构成任何专业建议。' },
      { key: 'science', text: '本内容为文化象征与心理觉察，非科学因果结论。' },
    ],
    disclaimer_slots: ['result_card', 'page_footer'],
    forbidden_terms: ['耗财', '招扰', '必发', '一定'],
    forbidden_terms_checked: true,
    hard_scan_at_build: true,
  },
  route: {
    path: '/tools/yangzhai-fengshui-test',
    params: ['result/[type]'],
    whitelist: 'content.results',
    conflicts_with_884: false,
  },
};
