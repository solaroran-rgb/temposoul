// src/data/ziwei/palace-star.ts
import type { ContentEntryBase, ContentPack, ContentBlockParagraph } from '@/data/content/entry-types';

export interface PalaceStarEntry extends ContentEntryBase {
  palace: string; palaceSlug: string; star: string; starSlug: string;
  palaceMeaning: string; starInPalace: string; classicRef: string;
}

export const PALACES = [
  { name: '命宫', slug: 'ming' }, { name: '兄弟', slug: 'xiongdi' },
  { name: '夫妻', slug: 'fuqi' }, { name: '子女', slug: 'zinv' },
  { name: '财帛', slug: 'caibo' }, { name: '疾厄', slug: 'jibing' },
  { name: '迁移', slug: 'qianyi' }, { name: '交友', slug: 'jiaoyou' },
  { name: '官禄', slug: 'guanlu' }, { name: '田宅', slug: 'tianzhai' },
  { name: '福德', slug: 'fude' }, { name: '父母', slug: 'fumu' },
] as const;

export const STARS = [
  { name: '紫微', slug: 'ziwei' }, { name: '天机', slug: 'tianji' },
  { name: '太阳', slug: 'taiyang' }, { name: '武曲', slug: 'wuqu' },
  { name: '天同', slug: 'tiantong' }, { name: '廉贞', slug: 'lianzhen' },
  { name: '天府', slug: 'tianfu' }, { name: '太阴', slug: 'taiyin' },
  { name: '贪狼', slug: 'tanlang' }, { name: '巨门', slug: 'jumen' },
  { name: '天相', slug: 'tianxiang' }, { name: '天梁', slug: 'tianliang' },
  { name: '七杀', slug: 'qisha' }, { name: '破军', slug: 'pojun' },
] as const;

const U = '2026-09-16';
const P = (text: string): ContentBlockParagraph => ({ kind: 'paragraph', text });
const B = {
  citations: [] as string[], confidence: 'legendary' as const,
  completeness: 'stub' as const, ready: false, status: 'published' as const,
  updatedAt: U, classicRef: '',
};

export const palaceStarPack: ContentPack<PalaceStarEntry> = {
  version: '1.0.0', ready: false,
  entries: [
    { ...B, key: 'ming-ziwei', title: '紫微在命宫', summary: '紫微星坐守命宫的传统释义。', blocks: [P('紫微为北斗主星，坐守命宫时传统上用以描述尊贵与自我定位的倾向。')], palace: '命宫', palaceSlug: 'ming', star: '紫微', starSlug: 'ziwei', palaceMeaning: '命宫主整体格局与自我定位。', starInPalace: '紫微入命，强调尊贵与主导性。' },
    { ...B, key: 'caibo-wuqu', title: '武曲在财帛', summary: '武曲星坐守财帛宫的传统释义。', blocks: [P('武曲主财与行动，坐守财帛宫时传统上用以描述务实求财倾向。')], palace: '财帛', palaceSlug: 'caibo', star: '武曲', starSlug: 'wuqu', palaceMeaning: '财帛宫主财运与资源。', starInPalace: '武曲入财帛，强调务实与稳健。' },
    { ...B, key: 'fuqi-taiyin', title: '太阴在夫妻', summary: '太阴星坐守夫妻宫的传统释义。', blocks: [P('太阴主柔与内在，坐守夫妻宫时传统上用以描述细腻与情感互动倾向。')], palace: '夫妻', palaceSlug: 'fuqi', star: '太阴', starSlug: 'taiyin', palaceMeaning: '夫妻宫主伴侣关系与情感。', starInPalace: '太阴入夫妻，强调温和与细腻。' },
    { ...B, key: 'guanlu-tianliang', title: '天梁在官禄', summary: '天梁星坐守官禄宫的传统释义。', blocks: [P('天梁主庇护，坐守官禄宫时传统上用以描述稳定与协助倾向。')], palace: '官禄', palaceSlug: 'guanlu', star: '天梁', starSlug: 'tianliang', palaceMeaning: '官禄宫主事业与职责。', starInPalace: '天梁入官禄，强调协助与稳健。' },
    { ...B, key: 'fude-tianxiang', title: '天相在福德', summary: '天相星坐守福德宫的传统释义。', blocks: [P('天相主协调与规范，坐守福德宫时传统上用以描述内在平和倾向。')], palace: '福德', palaceSlug: 'fude', star: '天相', starSlug: 'tianxiang', palaceMeaning: '福德宫主内在状态与精神生活。', starInPalace: '天相入福德，强调平和与协调。' },
  ],
};

export function findPalaceStar(p: string, s: string): PalaceStarEntry | undefined {
  return palaceStarPack.entries.find((e) => e.palaceSlug === p && e.starSlug === s);
}
export function findPalaceBySlug(slug: string) { return PALACES.find((p) => p.slug === slug); }
export function findStarBySlug(slug: string) { return STARS.find((s) => s.slug === slug); }
