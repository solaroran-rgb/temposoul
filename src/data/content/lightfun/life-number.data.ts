import type { LightFunEnvelope } from './lightfun.types';

export type LifeNumberValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

export interface LifeNumberEntry {
  readonly value: LifeNumberValue;
  readonly name: string;
  readonly keywords: readonly [string, string];
  readonly one_line: string;
}

export interface LifeNumberContent {
  readonly flow: readonly string[];
  readonly rule: string;
  readonly numbers: readonly LifeNumberEntry[];
  readonly long_reading: Readonly<Record<LifeNumberValue, string>>;
  readonly master_notes: readonly { readonly value: LifeNumberValue; readonly note: string }[];
  readonly disclaimer_pack_keys: readonly string[];
}

export const LIFE_NUMBERS: readonly LifeNumberEntry[] = [
  { value: 1, name: '开创者', keywords: ['启动', '独立'], one_line: '先迈出第一步，是你的节奏。' },
  {
    value: 2,
    name: '协作者',
    keywords: ['配合', '节奏'],
    one_line: '在关系里找到平衡，是你的功课。',
  },
  {
    value: 3,
    name: '表达者',
    keywords: ['创造', '分享'],
    one_line: '把想法表达出来，能量才流动。',
  },
  { value: 4, name: '建构者', keywords: ['秩序', '稳健'], one_line: '把基础打牢，路才走得远。' },
  { value: 5, name: '探索者', keywords: ['变化', '自由'], one_line: '允许流动，也给自己锚点。' },
  { value: 6, name: '照料者', keywords: ['责任', '温度'], one_line: '照顾他人前，先安顿自己。' },
  { value: 7, name: '觉察者', keywords: ['内省', '追问'], one_line: '向内看，答案会慢慢浮现。' },
  { value: 8, name: '成就者', keywords: ['价值', '平衡'], one_line: '把价值与节奏一起算清楚。' },
  {
    value: 9,
    name: '圆成者',
    keywords: ['完成', '传递'],
    one_line: '收尾与分享，是这一阶段的主题。',
  },
  { value: 11, name: '灵感者', keywords: ['直觉', '启发'], one_line: '把灵感落到小事上，才扎实。' },
  { value: 22, name: '建造者', keywords: ['愿景', '落地'], one_line: '大愿景需要小步骤支撑。' },
  {
    value: 33,
    name: '照料大师',
    keywords: ['关怀', '言传'],
    one_line: '把善意做成日常，而非口号。',
  },
];

export const LIFE_NUMBER_LONG: Record<LifeNumberValue, string> = {
  1: '数字 1 在生命灵数文化中常与启动、独立相连。现代角度可理解为：你习惯率先发起，适合从一个最小动作开始，再邀请他人加入。',
  2: '数字 2 常与配合、节奏相连。现代角度：你擅长在关系中感知平衡，适合把“配合”当成一种主动选择，而非退让。',
  3: '数字 3 常与表达、创造相连。现代角度：你的能量在分享中放大，适合固定一个表达出口，哪怕很短。',
  4: '数字 4 常与秩序、稳健相连。现代角度：你信任结构化的过程，适合把大目标拆成可重复的小流程。',
  5: '数字 5 常与变化、自由相连。现代角度：你需要流动感，适合给自己留弹性空间，同时保留一个稳定锚点。',
  6: '数字 6 常与责任、温度相连。现代角度：你在意照料他人，适合练习先满足自己的基本需要，再向外付出。',
  7: '数字 7 常与内省、追问相连。现代角度：你需要独处消化，适合把思考写成几句话，避免反复内耗。',
  8: '数字 8 常与价值、平衡相连。现代角度：你关注产出与回报，适合定期盘点投入与所得，调整节奏。',
  9: '数字 9 常与完成、传递相连。现代角度：你擅长收尾与总结，适合把经验整理成可分享的清单。',
  11: '数字 11 在灵数文化中是主命数之一，常与直觉、启发相连。现代角度：灵感需要被记录与落地，适合“先写下来再验证”。',
  22: '数字 22 是主命数之一，常与愿景、落地相连。现代角度：你能看见大图景，适合把它拆成可执行的阶段。',
  33: '数字 33 是主命数之一，常与关怀、言传相连。现代角度：你的善意有感染力，适合用稳定的日常行动来传递。',
};

export const LIFE_NUMBER_WHITELIST: ReadonlySet<string> = new Set(
  LIFE_NUMBERS.map((n) => String(n.value)),
);

export const LIFE_NUMBER_DATA: LightFunEnvelope<LifeNumberContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-3',
  slug: 'life-number',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '生命灵数', description: '1-9 与主命数文化参考' },
    en: { title: 'Life Path Number', description: 'Numerology for fun' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '生命灵数｜1-9 与主命数参考',
    description: '按出生日计算灵数，输出文化说法与现代自我觉察角度，仅供娱乐参考。',
    canonical: '/tools/life-number',
    keywords: ['生命灵数', '数字能量', '趣味测试'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '生命灵数',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['input_birthday', 'digit_sum', 'pick_number', 'long_reading', 'close_loop'],
    rule: '将出生日各位数字相加，反复相加直到一位数；若过程中出现 11/22/33，则作为主命数保留。',
    numbers: LIFE_NUMBERS,
    long_reading: LIFE_NUMBER_LONG,
    master_notes: [
      { value: 11, note: '主命数：直觉强，宜落地。' },
      { value: 22, note: '主命数：愿景大，宜拆步。' },
      { value: 33, note: '主命数：关怀广，宜日常。' },
    ],
    disclaimer_pack_keys: ['general', 'science'],
  },
  ui: { theme: 'dark-ide', components: ['DateInput', 'NumberCard', 'LongReading', 'ShareButton'] },
  share_card: {
    title: '我的生命灵数',
    subtitle: '数字里的节奏参考',
    tags: ['#生命灵数', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '生命灵数结果卡片',
    alt_text: '按出生日计算的灵数文化解读',
    reading_order: ['value', 'name', 'keywords', 'one_line'],
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
    path: '/tools/life-number',
    params: ['[n]'],
    whitelist: 'content.numbers',
    conflicts_with_884: false,
  },
};
