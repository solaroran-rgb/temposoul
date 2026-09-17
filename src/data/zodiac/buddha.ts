// B23-4 src/data/zodiac/buddha.ts
/**
 * 十二生肖 → 本命佛（八大守护神）静态对照表。
 * 定位：民俗文化科普。严禁传教/皈依/募捐/开光售卖；严禁"佩戴即保佑"功效断言。
 */

export interface ZodiacBuddha {
  /** 对应生肖（1-2 个） */
  zodiac: string[];
  buddhaName: string;
  alias: string;
  summary: string;
  culturalOrigin: string;
  disclaimer: string;
}

const ORIGIN = '密宗八大守护神体系（民俗流传）';
const DISC = '本命佛为民俗文化说法，仅作文化科普，不构成宗教皈依建议，也不存在"佩戴即保佑"的功效承诺。';

export const ZODIAC_BUDDHAS: ZodiacBuddha[] = [
  {
    zodiac: ['鼠'],
    buddhaName: '千手观音',
    alias: '千光圆满观世音',
    summary: '在民俗流传中，属鼠者常与千手观音菩萨相联系，象征护佑与观照。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['牛', '虎'],
    buddhaName: '虚空藏菩萨',
    alias: '虚空库菩萨',
    summary: '在民俗流传中，属牛、属虎者常与虚空藏菩萨相联系，象征福德与智慧如虚空广大。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['兔'],
    buddhaName: '文殊菩萨',
    alias: '文殊师利',
    summary: '在民俗流传中，属兔者常与文殊菩萨相联系，象征智慧与清明。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['龙', '蛇'],
    buddhaName: '普贤菩萨',
    alias: '普贤大士',
    summary: '在民俗流传中，属龙、属蛇者常与普贤菩萨相联系，象征行愿与实践。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['马'],
    buddhaName: '大势至菩萨',
    alias: '得大势菩萨',
    summary: '在民俗流传中，属马者常与大势至菩萨相联系，象征智慧光明。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['羊', '猴'],
    buddhaName: '大日如来',
    alias: '毗卢遮那佛',
    summary: '在民俗流传中，属羊、属猴者常与大日如来相联系，象征光明遍照。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['鸡'],
    buddhaName: '不动明王',
    alias: '不动使者',
    summary: '在民俗流传中，属鸡者常与不动明王相联系，象征稳固与决断。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
  {
    zodiac: ['狗', '猪'],
    buddhaName: '阿弥陀佛',
    alias: '无量寿佛',
    summary: '在民俗流传中，属狗、属猪者常与阿弥陀佛相联系，象征光明与长寿的文化意象。',
    culturalOrigin: ORIGIN,
    disclaimer: DISC,
  },
];

export const ALL_ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const;

export function findBuddhaByZodiac(z: string): ZodiacBuddha | undefined {
  return ZODIAC_BUDDHAS.find((b) => b.zodiac.includes(z));
}
