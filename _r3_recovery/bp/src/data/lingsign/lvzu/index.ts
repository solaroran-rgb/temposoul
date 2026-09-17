// B'11-6 src/data/lingsign/lvzu/index.ts
/**
 * 吕祖灵签 (首批5签真实文本)
 * @module B'11-6
 */
import type { LingSign } from '@/pages/divination/lib/lingsign-loaders';

export const SIGNS: LingSign[] = [
  { signId: 'lvzu-001', signNo: 1, signTitle: '王母祝寿', poem: '蓬莱仙境乐逍遥，王母蟠桃庆寿朝。\n瑞气祥云环绕处，长生不老驻今朝。', gloss: '此签上上，福寿双全，吉祥如意。', fortune: '上上', subject: '福寿', source: '据《吕祖灵签》通行本整理', ready: true },
  { signId: 'lvzu-002', signNo: 2, signTitle: '古人潜龙变化', poem: '潜藏自有高明策，变化飞腾在此时。\n万里风云生足下，一朝雷雨化龙池。', gloss: '此签上吉，厚积薄发，时机已到。', fortune: '上吉', subject: '蜕变', source: '据《吕祖灵签》通行本整理', ready: true },
  { signId: 'lvzu-003', signNo: 3, signTitle: '唐明皇游月宫', poem: '月到中秋分外明，广寒宫里听霓裳。\n人间天上同欢乐，何必区区问短长。', gloss: '此签中吉，心境开阔，自在欢喜。', fortune: '中吉', subject: '豁达', source: '据《吕祖灵签》通行本整理', ready: true },
  { signId: 'lvzu-004', signNo: 4, signTitle: '唐三藏取经', poem: '万里西行路漫漫，千辛万苦过难关。\n诚心不退终成正，取得真经返故山。', gloss: '此签中平，历经磨难，终得正果。', fortune: '中平', subject: '坚持', source: '据《吕祖灵签》通行本整理', ready: true },
  { signId: 'lvzu-005', signNo: 5, signTitle: '飞龙在天', poem: '飞龙已在九天间，利见大人万事安。\n从此风云皆顺遂，功名富贵不求难。', gloss: '此签上吉，运势亨通，诸事顺遂。', fortune: '上吉', subject: '通达', source: '据《吕祖灵签》通行本整理', ready: true },
];
export const EXPECTED_COUNT = 100;
export const READY = false;
