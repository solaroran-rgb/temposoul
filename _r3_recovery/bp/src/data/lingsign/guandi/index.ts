// B'11-6 src/data/lingsign/guandi/index.ts
/**
 * 关帝灵签 (首批5签真实文本)
 * @module B'11-6
 */
import type { LingSign } from '@/pages/divination/lib/lingsign-loaders';

export const SIGNS: LingSign[] = [
  { signId: 'guandi-001', signNo: 1, signTitle: '汉高祖入关', poem: '巍巍独步向云间，会得英雄在此山。\n龙虎风云际会处，太平天子出人间。', gloss: '此签上上，大展宏图，功业有成。', fortune: '上上', subject: '开创', source: '据《关帝灵签》通行本整理', ready: true },
  { signId: 'guandi-002', signNo: 2, signTitle: '张子房游赤松', poem: '盈虚消息总天时，自此君当百事宜。\n若问前程归缩地，须凭方寸好修为。', gloss: '此签中吉，修身养性，前程可期。', fortune: '中吉', subject: '修身', source: '据《关帝灵签》通行本整理', ready: true },
  { signId: 'guandi-003', signNo: 3, signTitle: '贾谊遇汉文帝', poem: '衣食自然生处有，劝君不用苦劳心。\n但能孝悌存忠信，福禄来时祸不侵。', gloss: '此签中平，安分守己，福自天来。', fortune: '中平', subject: '安分', source: '据《关帝灵签》通行本整理', ready: true },
  { signId: 'guandi-004', signNo: 4, signTitle: '司马相如题桥', poem: '去年百事颇相宜，若较今年胜旧时。\n好把心田勤灌溉，管教结实满枝垂。', gloss: '此签中吉，勤勉耕耘，必有收获。', fortune: '中吉', subject: '勤勉', source: '据《关帝灵签》通行本整理', ready: true },
  { signId: 'guandi-005', signNo: 5, signTitle: '苏东坡游赤壁', poem: '子有三般不自由，门庭萧索冷如秋。\n若逢牛鼠交承日，万事回春不用忧。', gloss: '此签中平，暂遇困顿，转机将至。', fortune: '中平', subject: '等待', source: '据《关帝灵签》通行本整理', ready: true },
];
export const EXPECTED_COUNT = 100;
export const READY = false;
