/**
 * C12-知识库文章：十二时辰与时柱
 * 文件路径：src/data/knowledge/content/paipan-shichen.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-shichen',
  title: '十二时辰与时柱',
  metaDescription:
    '一昼夜分十二时辰，每时辰约两小时，从子时（23:00-01:00）起。时柱由日干配时辰推出。本文讲清十二时辰对应与时干五鼠遁口诀。',
  h1: '十二时辰与时柱',
  category: 'paipan',
  tags: ['时辰', '时柱', '十二地支'],
  sections: [
    {
      heading: '十二时辰：把一昼夜切成十二段',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '古人把一昼夜分成十二个时辰，用地支命名。每个时辰约等于现代两小时：子时 23:00–01:00、丑时 01:00–03:00、寅时 03:00–05:00、卯时 05:00–07:00、辰时 07:00–09:00、巳时 09:00–11:00、午时 11:00–13:00、未时 13:00–15:00、申时 15:00–17:00、酉时 17:00–19:00、戌时 19:00–21:00、亥时 21:00–23:00。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '子时跨午夜（23:00 起算），且传统上又有"早子时／夜子时"之争。排盘口径不同会让 23:00–24:00 出生者的时柱（甚至日柱）结论不同；遇到这种边界时辰，应按所用排盘体系明确说明，不要含糊。',
        },
        {
          kind: 'paragraph',
          text: '要特别注意：以上是"北京时间"下的大致对应。严格说，时辰应按出生地的地方太阳时来切，中国东西跨五个时区，新疆、西藏等地同一北京时间对应的真实太阳时段和东部差一到两小时。这就是真太阳时校正要解决的问题，另文专述。',
        },
      ],
    },
    {
      heading: '时柱怎么配：日干推时干',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '知道时辰地支后，还要配一个天干才成时柱。时干不是随便定的，而是由日干推出来，口诀称"五鼠遁"（又称日上起时法）。大意是：甲己日起甲子时、乙庚日起丙子时、丙辛日起戊子时、丁壬日起庚子时、戊癸日起壬子时。确定子时的天干后，按六十甲子顺推，即可得到其余各时的时柱。',
        },
        {
          kind: 'list',
          items: [
            '日干甲或己：子时为甲子，丑时乙丑……顺推。',
            '日干乙或庚：子时为丙子，丑时丁丑……顺推。',
            '日干丙或辛：子时为戊子，丑时己丑……顺推。',
            '日干丁或壬：子时为庚子，丑时辛丑……顺推。',
            '日干戊或癸：子时为壬子，丑时癸丑……顺推。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这也解释了为什么时辰和日柱必须成对确定：时干依赖日干，时支依赖出生时段。报盘时若只知道出生"早上"而不知几点，时柱只能估个大概，后续时支相关判断都会失准。',
        },
      ],
    },
    {
      heading: '常见误解：一个时辰＝固定命运',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '把同一时辰（两小时内出生）的人说成命运相同，是错的。一个时辰内还有分钟级差异，且时柱只是四柱之一；即便时柱相同，年月日不同，整张盘也完全不同。时辰只决定时柱这一组干支，不决定整个人生。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '时辰与真太阳时只是排盘参数，用于确定时柱干支，不携带吉凶。不要因为"生在寅时"或"生在子时"而附加任何性格或命运结论。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律根据出生时间（可选真太阳时校正）自动确定时辰地支，再按日干用五鼠遁推出时柱，并在结果里显示所用北京时间、校正后的地方时与对应时辰，便于核对。',
        },
      ],
    },
  ],
  sources: [{ text: '据十二时辰对应及五鼠遁（日上起时法）通行口诀整理', confidence: 'verified' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'paipan-overview',
    'paipan-true-solar-time',
    'paipan-daymaster',
    'paipan-faq',
    'ganzhi-overview',
  ],
  confidence: 'legendary',
  disclaimer: '本文为历法与排盘科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
