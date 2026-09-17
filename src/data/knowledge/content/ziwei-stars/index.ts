// src/data/knowledge/content/ziwei-stars/index.ts
import type { DomainArticle, DomainArticleMeta } from '@/pages/knowledge/lib/useDomainArticles';

const SOURCES = ['原创概述：通行紫微斗数概念整理（非古籍原文）'] as const;

export const ZIWEI_STAR_METAS: readonly DomainArticleMeta[] = [
  { slug: 'ziwei', title: '紫微星', category: 'ziwei-star', summary: '斗数主星之首，象征主导与格局。' },
  { slug: 'tianji', title: '天机星', category: 'ziwei-star', summary: '主思虑与机变，象征谋划。' },
  { slug: 'taiyang', title: '太阳星', category: 'ziwei-star', summary: '主光明与付出，象征公开表现。' },
  { slug: 'wuqu', title: '武曲星', category: 'ziwei-star', summary: '主刚毅与执行，象征实务。' },
  { slug: 'tiantong', title: '天同星', category: 'ziwei-star', summary: '主温和与享受，象征协调。' },
  { slug: 'lianzhen', title: '廉贞星', category: 'ziwei-star', summary: '主自律与情感张力。' },
  { slug: 'tianfu', title: '天府星', category: 'ziwei-star', summary: '主储藏与稳定，象征守成。' },
  { slug: 'taiyin', title: '太阴星', category: 'ziwei-star', summary: '主内敛与细腻，象征沉淀。' },
  { slug: 'tanlang', title: '贪狼星', category: 'ziwei-star', summary: '主欲望与多才，象征探索。' },
  { slug: 'jumen', title: '巨门星', category: 'ziwei-star', summary: '主言说与辨析，象征沟通。' },
  { slug: 'tianxiang', title: '天相星', category: 'ziwei-star', summary: '主辅佐与印信，象征服务。' },
  { slug: 'tianliang', title: '天梁星', category: 'ziwei-star', summary: '主荫庇与原则，象征照顾。' },
  { slug: 'qisha', title: '七杀星', category: 'ziwei-star', summary: '主开创与决断，象征突破。' },
  { slug: 'pojun', title: '破军星', category: 'ziwei-star', summary: '主破立与变动，象征重构。' },
];

export const ZIWEI_STAR_RECORDS: Readonly<Record<string, DomainArticle>> = {
  ziwei: { slug: 'ziwei', title: '紫微星', category: 'ziwei-star', blocks: [{ kind: 'paragraph', text: '紫微为斗数十四主星之首，传统以"帝星"喻之，象征主导力与格局意识。' }, { kind: 'paragraph', text: '在文化意象中，紫微常被用来描述一个人对秩序与责任的偏好，属象征语言而非性格诊断。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  tianji: { slug: 'tianji', title: '天机星', category: 'ziwei-star', blocks: [{ kind: 'paragraph', text: '天机主思虑与机变，传统视为谋划与学习的象征。' }, { kind: 'paragraph', text: '文化意象上强调灵活与善变，宜理解为倾向描述而非定论。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  taiyang: { slug: 'taiyang', title: '太阳星', category: 'ziwei-star', blocks: [{ kind: 'paragraph', text: '太阳主光明与付出，传统以公开表现与热忱为其象征。' }, { kind: 'paragraph', text: '意象上偏向外向与承担，属文化比喻，不作个体断言。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  wuqu: { slug: 'wuqu', title: '武曲星', category: 'ziwei-star', blocks: [{ kind: 'paragraph', text: '武曲主刚毅与执行，传统视为实务与决断的象征。' }, { kind: 'paragraph', text: '文化意象强调行动力，宜作倾向参考。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  tiantong: { slug: 'tiantong', title: '天同星', category: 'ziwei-star', blocks: [{ kind: 'paragraph', text: '天同主温和与享受，传统以协调与安逸为其象征。' }, { kind: 'paragraph', text: '意象上偏向包容与慢节奏，属象征语言。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
};
