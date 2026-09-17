// 回退种子集：@temposoul/core/onomastics 全量字表导出名尚未确认（见契约缺口）。
// 一旦 CHAR_DOSSIERS 可用，scripts/gen-names-skeleton.mjs 将覆盖本文件。
// 字段对齐 CharDossierLike（IT-6.9）。

import type { ContentSkeleton } from '@/data/content/types';
import { makeEngineRef } from '@/data/content/fingerprint';

export const NAME_CHAR_SEED: Array<{
  char: string;
  pinyin: string;
  tone: number;
  kangxiStrokes: number;
  radical: string;
  wuxing: string;
  rareCharLevel: 'common' | 'rare';
}> = [
  {
    char: '安',
    pinyin: 'an',
    tone: 1,
    kangxiStrokes: 6,
    radical: '宀',
    wuxing: '土',
    rareCharLevel: 'common',
  },
  {
    char: '辰',
    pinyin: 'chen',
    tone: 2,
    kangxiStrokes: 7,
    radical: '辰',
    wuxing: '土',
    rareCharLevel: 'common',
  },
  {
    char: '恩',
    pinyin: 'en',
    tone: 1,
    kangxiStrokes: 10,
    radical: '心',
    wuxing: '土',
    rareCharLevel: 'common',
  },
  {
    char: '涵',
    pinyin: 'han',
    tone: 2,
    kangxiStrokes: 12,
    radical: '氵',
    wuxing: '水',
    rareCharLevel: 'common',
  },
  {
    char: '杰',
    pinyin: 'jie',
    tone: 2,
    kangxiStrokes: 12,
    radical: '木',
    wuxing: '木',
    rareCharLevel: 'common',
  },
  {
    char: '琳',
    pinyin: 'lin',
    tone: 2,
    kangxiStrokes: 13,
    radical: '王',
    wuxing: '木',
    rareCharLevel: 'common',
  },
  {
    char: '明',
    pinyin: 'ming',
    tone: 2,
    kangxiStrokes: 8,
    radical: '日',
    wuxing: '火',
    rareCharLevel: 'common',
  },
  {
    char: '瑞',
    pinyin: 'rui',
    tone: 4,
    kangxiStrokes: 14,
    radical: '王',
    wuxing: '金',
    rareCharLevel: 'common',
  },
  {
    char: '婷',
    pinyin: 'ting',
    tone: 2,
    kangxiStrokes: 12,
    radical: '女',
    wuxing: '火',
    rareCharLevel: 'common',
  },
  {
    char: '宇',
    pinyin: 'yu',
    tone: 3,
    kangxiStrokes: 6,
    radical: '宀',
    wuxing: '土',
    rareCharLevel: 'common',
  },
  {
    char: '泽',
    pinyin: 'ze',
    tone: 2,
    kangxiStrokes: 17,
    radical: '氵',
    wuxing: '水',
    rareCharLevel: 'common',
  },
  {
    char: '志',
    pinyin: 'zhi',
    tone: 4,
    kangxiStrokes: 7,
    radical: '心',
    wuxing: '火',
    rareCharLevel: 'common',
  },
];

/** 康熙笔画以繁体字形计 */
export const NAME_STROKE_NOTE = '康熙笔画依《康熙字典》通行算法，以繁体字形计。';

export const NAME_CHAR_SKELETONS: ContentSkeleton[] = NAME_CHAR_SEED.map((c, index) => ({
  id: c.char,
  slug: c.char,
  title: c.char,
  category: c.wuxing,
  order: index,
  engineRef: makeEngineRef('@temposoul/core/onomastics#CharDossierLike', {
    char: c.char,
    kangxiStrokes: c.kangxiStrokes,
  }),
  domainFields: {
    pinyin: c.pinyin,
    tone: c.tone,
    kangxiStrokes: c.kangxiStrokes,
    radical: c.radical,
    wuxing: c.wuxing,
    rareCharLevel: c.rareCharLevel,
  },
}));
