/**
 * C 域页面注册表：kind → 数据数组（供 CcList/CcDetail 通用组件消费）
 * kind 命名前缀 c_*，与 batch2 的 B2Kind 完全隔离
 */
import {
  PATTERN_EXTENDED,
  TAROT_CURRICULUM,
  ASTROLOGY_TERMS,
  CLASSICS_GUIDES,
  PARENTING_ASTROLOGY,
  EPHEMERIS_2026,
  type CAnyContentRecord,
} from '@/data/content/c';

export type CcKind =
  | 'c_pattern_extended'
  | 'c_tarot_curriculum'
  | 'c_astrology_terms'
  | 'c_classics_guide'
  | 'c_parenting_astrology'
  | 'c_ephemeris';

export interface CcKindMeta {
  kind: CcKind;
  title: string;
  desc: string;
  listSlug: string;
  base: string;
  records: readonly CAnyContentRecord[];
}

export const CC_KIND_META: Record<CcKind, CcKindMeta> = {
  c_pattern_extended: {
    kind: 'c_pattern_extended',
    title: '格局详解库',
    desc: '紫微斗数 10 大主格局白话解读',
    listSlug: '/knowledge/ziwei/pattern-extended',
    base: '/knowledge/ziwei/pattern-extended',
    records: PATTERN_EXTENDED,
  },
  c_tarot_curriculum: {
    kind: 'c_tarot_curriculum',
    title: '塔罗学习',
    desc: '三阶 19 课：从愚者到世界',
    listSlug: '/learn/tarot/curriculum',
    base: '/learn/tarot/curriculum',
    records: TAROT_CURRICULUM,
  },
  c_astrology_terms: {
    kind: 'c_astrology_terms',
    title: '行星星座百科',
    desc: '27 条占星核心词条白话解读',
    listSlug: '/knowledge/astrology/terms',
    base: '/knowledge/astrology/terms',
    records: ASTROLOGY_TERMS,
  },
  c_classics_guide: {
    kind: 'c_classics_guide',
    title: '国学典籍',
    desc: '10 部经典白话导读',
    listSlug: '/knowledge/classics',
    base: '/knowledge/classics',
    records: CLASSICS_GUIDES,
  },
  c_parenting_astrology: {
    kind: 'c_parenting_astrology',
    title: '育儿占星',
    desc: '12 星座孩子的养育指南',
    listSlug: '/knowledge/parenting',
    base: '/knowledge/parenting',
    records: PARENTING_ASTROLOGY,
  },
  c_ephemeris: {
    kind: 'c_ephemeris',
    title: '星历表',
    desc: '2026 年天象速览工具',
    listSlug: '/tools/ephemeris',
    base: '/tools/ephemeris',
    records: EPHEMERIS_2026,
  },
};

/** C 域全域记录总数 */
export const CC_TOTAL_RECORDS = Object.values(CC_KIND_META).reduce(
  (n, m) => n + m.records.length,
  0,
);
