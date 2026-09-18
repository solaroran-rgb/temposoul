import type { LightFunEnvelope } from './lightfun.types';

export interface BirthFlower {
  readonly month: number;
  readonly flower: string;
  readonly keywords: readonly [string, string];
  readonly meaning: string;
  readonly one_line: string;
}

export interface BirthFlowerContent {
  readonly flow: readonly string[];
  readonly flowers: readonly BirthFlower[];
  readonly disclaimer_pack_keys: readonly string[];
}

export const BIRTH_FLOWERS: readonly BirthFlower[] = [
  {
    month: 1,
    flower: '雪花莲',
    keywords: ['坚韧', '开端'],
    meaning: '寒冬里最早绽放',
    one_line: '在冷的时候，也记得自己想生长。',
  },
  {
    month: 2,
    flower: '紫罗兰',
    keywords: ['谦逊', '温柔'],
    meaning: '安静而不张扬',
    one_line: '温柔也是一种有力量的表达。',
  },
  {
    month: 3,
    flower: '水仙花',
    keywords: ['复苏', '自知'],
    meaning: '临水而开',
    one_line: '先认识自己，再向外出发。',
  },
  {
    month: 4,
    flower: '雏菊',
    keywords: ['纯真', '明朗'],
    meaning: '朴素而明亮',
    one_line: '简单的快乐也值得被认真对待。',
  },
  {
    month: 5,
    flower: '铃兰',
    keywords: ['期待', '回甘'],
    meaning: '小巧而芬芳',
    one_line: '好事往往在不经意间到来。',
  },
  {
    month: 6,
    flower: '玫瑰',
    keywords: ['热烈', '边界'],
    meaning: '有刺的美',
    one_line: '爱与边界，可以同时拥有。',
  },
  {
    month: 7,
    flower: '飞燕草',
    keywords: ['向上', '轻盈'],
    meaning: '成串向上',
    one_line: '把目标挂高一点，脚步放稳。',
  },
  {
    month: 8,
    flower: '剑兰',
    keywords: ['挺拔', '表达'],
    meaning: '节节而上',
    one_line: '把想法一节一节说清楚。',
  },
  {
    month: 9,
    flower: '紫苑',
    keywords: ['沉淀', '感恩'],
    meaning: '秋花沉静',
    one_line: '整理已有的，比追新更踏实。',
  },
  {
    month: 10,
    flower: '万寿菊',
    keywords: ['热闹', '丰盛'],
    meaning: '秋日盛放',
    one_line: '允许自己享受收获的热闹。',
  },
  {
    month: 11,
    flower: '菊花',
    keywords: ['清雅', '持久'],
    meaning: '凌寒自开',
    one_line: '长久的美，靠的是节制。',
  },
  {
    month: 12,
    flower: '冬青',
    keywords: ['守望', '希望'],
    meaning: '冬日常绿',
    one_line: '休息与等待，也是一种守护。',
  },
];

export const BIRTH_FLOWER_WHITELIST: ReadonlySet<string> = new Set(
  BIRTH_FLOWERS.map((f) => String(f.month)),
);

export const BIRTH_FLOWER_DATA: LightFunEnvelope<BirthFlowerContent> = {
  schema_version: '2.0.0',
  item_id: '3b-A-5',
  slug: 'birth-flower',
  locale: 'zh-CN',
  i18n: {
    zh_CN: { title: '生日花语', description: '十二月生辰花文化参考' },
    en: { title: 'Birth Month Flower', description: 'Twelve birth flowers' },
  },
  created_at: '2026-09-18',
  updated_at: '2026-09-18',
  data_status: 'available',
  seo: {
    title: '生日花语｜十二月生辰花参考',
    description: '按出生月份对应生辰花，输出花语与自我觉察一句话，仅供文化娱乐。',
    canonical: '/tools/birth-flower',
    keywords: ['生日花语', '生辰花', '趣味测试'],
    json_ld: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: '生日花语',
        applicationCategory: 'EntertainmentApplication',
      },
    ],
  },
  content: {
    flow: ['pick_month', 'show_flower', 'meaning', 'close_loop'],
    flowers: BIRTH_FLOWERS,
    disclaimer_pack_keys: ['general'],
  },
  ui: { theme: 'dark-ide', components: ['MonthPicker', 'FlowerCard', 'ShareButton'] },
  share_card: {
    title: '我的生日花',
    subtitle: '每月一朵，温柔对应',
    tags: ['#生日花语', '#文化娱乐'],
    bg_gradient: ['#1e1e1e', '#252526'],
    footer: 'Know Your Rhythm. Shape Your Path.',
  },
  a11y: {
    aria_label: '生日花语结果卡片',
    alt_text: '按出生月份对应的生辰花与花语',
    reading_order: ['flower', 'keywords', 'meaning', 'one_line'],
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
    path: '/tools/birth-flower',
    params: ['[month]'],
    whitelist: 'content.flowers',
    conflicts_with_884: false,
  },
};
