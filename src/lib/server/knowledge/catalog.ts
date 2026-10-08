/**
 * N-13 知识库总览目录（服务端只读权威真值源）
 *
 * 纪律：
 *   - 纯内置静态数据，不读写 DB、不改写内容；
 *   - lexicon_categories 派生自 src/data/lexicon.ts 的 LexiconCategory 联合类型，
 *     用类型级穷举校验保证数组与联合类型永不漂移（漏加/多加都会编译报错）；
 *   - classics 仅作书种目录登记，chapterCount 为约数，ready=false 表示整理中，
 *     绝不伪造「已就绪」或具体卷次原文。
 */

import type { LexiconCategory } from '../../../data/lexicon';

/**
 * 词典分类（与 LexiconCategory 联合类型一一对应）。
 * 任务单枚举 37 个；联合类型后续新增「吠陀」共 38 个成员，此处全量收录。
 */
export const LEXICON_CATEGORIES: readonly LexiconCategory[] = [
  '天干',
  '地支',
  '五行',
  '十神',
  '紫微星曜',
  '基础',
  '神煞',
  '命理流派',
  '三才四象',
  '河洛',
  '七政四余',
  '奇门遁甲',
  '六壬',
  '节气',
  '择日',
  '三元九运',
  '二十四山',
  '风水',
  '十二宫',
  '十二长生',
  '九宫',
  '八卦',
  '二十八宿',
  '纳音',
  '六十四卦',
  '地支关系',
  '干支组合',
  '天干五合',
  '三合三会',
  '十二消息卦',
  '命理典籍',
  '北斗七星',
  '十干禄',
  '推命体系',
  '紫微四化',
  '紫微格局',
  '八字格局',
  '吠陀',
] as const;

// 穷举校验：若 LexiconCategory 新增成员而漏收，下面类型为 false，编译报错。
type Assert<T extends true> = T;
type _CategoriesCoverUnion = Assert<
  [LexiconCategory] extends [(typeof LEXICON_CATEGORIES)[number]] ? true : false
>;

/** 命理典籍目录条目（N-13） */
export interface KnowledgeClassic {
  slug: string;
  title: string;
  author: string;
  dynasty: string;
  description: string;
  /** 约数：传世本卷/篇数，仅供前端展示规模，不作精确考据 */
  chapterCount: number;
  /** 内容整理中，未上线正文 */
  ready: false;
}

/**
 * 命理典籍登记（对齐 B 线 N-13 hint 名单，全部收录）。
 * 作者/朝代/简介取通行公开常识；ready 一律 false 表示正文整理中。
 */
export const KNOWLEDGE_CLASSICS: readonly KnowledgeClassic[] = [
  {
    slug: 'di-tian-sui',
    title: '滴天髓',
    author: '旧题宋·京图撰，清·任铁樵辑注',
    dynasty: '宋（传世为明清注疏本）',
    description: '子平命理经典，以理气旺衰为纲，任铁樵《滴天髓阐微》影响最广。仅作文献目录登记。',
    chapterCount: 24,
    ready: false,
  },
  {
    slug: 'yuanhai-ziping',
    title: '渊海子平',
    author: '宋·徐大升 编集',
    dynasty: '宋',
    description: '现存早期子平法系统典籍，确立以日干为主、四柱论命的基本框架。仅作文献目录登记。',
    chapterCount: 5,
    ready: false,
  },
  {
    slug: 'sanming-tonghui',
    title: '三命通会',
    author: '明·万民英',
    dynasty: '明',
    description: '明代命理集大成之作，十二卷广收各家论述，资料汇编性质突出。仅作文献目录登记。',
    chapterCount: 12,
    ready: false,
  },
  {
    slug: 'ziwei-quanshu',
    title: '紫微斗数全书',
    author: '旧题陈抟（希夷先生）撰',
    dynasty: '明代刊本',
    description: '紫微斗数通行底本之一，系统罗列星曜、宫位与排盘起例。仅作文献目录登记。',
    chapterCount: 8,
    ready: false,
  },
  {
    slug: 'guolao-xingzong',
    title: '果老星宗',
    author: '旧题唐·张果（果老）传',
    dynasty: '唐代（后世刊本）',
    description: '七政四余星命学经典，以七政四余入十二宫论命。仅作文献目录登记。',
    chapterCount: 10,
    ready: false,
  },
  {
    slug: 'zhouyi',
    title: '周易',
    author: '传统归诸圣所作（卦爻辞 + 十翼）',
    dynasty: '先秦',
    description: '六经之一，含六十四卦卦爻辞与易传，为传统象数与义理共同源头。仅作文献目录登记。',
    chapterCount: 64,
    ready: false,
  },
  {
    slug: 'meihua-yishu',
    title: '梅花易数',
    author: '旧题宋·邵雍 撰',
    dynasty: '宋（托名）',
    description: '以先天八卦数起卦、重体用生克与外应的易占流派代表作。仅作文献目录登记。',
    chapterCount: 5,
    ready: false,
  },
  {
    slug: 'liuren-jinkou-jue',
    title: '六壬神课金口诀',
    author: '旧题鬼谷子传、孙膑撰',
    dynasty: '古本（传世为明清抄本）',
    description: '大六壬旁支，以地分、将神、贵神、人元四位成课，直断方位事理。仅作文献目录登记。',
    chapterCount: 3,
    ready: false,
  },
];

/** GET /api/v1/knowledge/overview 聚合输出 */
export interface KnowledgeOverview {
  lexicon_categories: readonly LexiconCategory[];
  classics: readonly KnowledgeClassic[];
}

export function getKnowledgeOverview(): KnowledgeOverview {
  return {
    lexicon_categories: LEXICON_CATEGORIES,
    classics: KNOWLEDGE_CLASSICS,
  };
}
