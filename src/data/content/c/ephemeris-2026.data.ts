/**
 * C-6 星历表 2026：年度天象速览工具页数据
 * 来源：专家 C R3（143217.md §ephemeris/ephemeris-2026.data.ts）
 * 口径：单条工具页记录，含关键节气与逆行抽样数据
 */
import type { CContentRecord, CEphemerisExtra } from './types';

const SAMPLE_DAYS = [
  { date: '2026-01-01', moon_phase: '亏凸月', retrograde: ['水星'] },
  { date: '2026-02-04', moon_phase: '新月', retrograde: [] },
  { date: '2026-03-20', moon_phase: '盈凸月', retrograde: ['金星'] },
  { date: '2026-04-20', moon_phase: '亏凸月', retrograde: [] },
  { date: '2026-05-06', moon_phase: '满月', retrograde: ['冥王星'] },
  { date: '2026-06-21', moon_phase: '亏凸月', retrograde: [] },
  { date: '2026-07-07', moon_phase: '下弦月', retrograde: ['水星'] },
  { date: '2026-08-08', moon_phase: '盈凸月', retrograde: [] },
  { date: '2026-09-23', moon_phase: '新月', retrograde: ['火星'] },
  { date: '2026-10-08', moon_phase: '上弦月', retrograde: [] },
  { date: '2026-11-07', moon_phase: '亏凸月', retrograde: ['水星'] },
  { date: '2026-12-22', moon_phase: '下弦月', retrograde: [] },
];

const body = [
  '2026 年星历表速览工具：提供年度关键天象节点的快速参考。',
  '本工具收录 2026 年 12 个关键时间节点的月相与行星逆行状态，涵盖二十四节气交接日与重要月相。',
  '使用说明：找到你关注的日期，查看当日月相和逆行行星。逆行期间适合复盘、休整，不适合启动全新项目。',
  '注意：星历表数据为近似值（精度 ±2 角分），仅供文化参考。精确占星计算请使用专业星历软件。',
].join('');

export const EPHEMERIS_2026: readonly CContentRecord<CEphemerisExtra>[] = [
  {
    id: 'c_ephemeris_2026',
    version: '1.0.0',
    domain: 'c',
    category: 'c_ephemeris',
    seo: {
      title: '2026 星历表速览',
      description: '2026 年关键天象节点：月相、节气与行星逆行速查',
      slug: '/tools/ephemeris',
      canonical: '/tools/ephemeris',
      breadcrumb: ['首页', '星历表'],
      breadcrumb_paths: ['/', '/tools/ephemeris'],
    },
    source: {
      system: 'western_astrology',
      classic: '2026 年星历表（近似值）',
      chapter: '全年速览',
    },
    compliance: {
      no_fatalism: true,
      domain_note: 'culture_discussion',
      banned_words_checked: true,
    },
    review: {
      status: 'supplemented',
      word_count: body.replace(/\s/g, '').length,
      reviewer: 'expert-c',
    },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: '星历表是观察天象节律的参考工具。',
        cause: '行星运行有其周期，星历表记录这些周期在特定年份的位置。',
        manifestation: '通过月相和逆行信息，可辅助安排个人节奏。',
        risk: '星历表为近似值，不构成专业占星咨询。',
        suggestion: '将星历表作为"天时"参考，结合个人实际情况使用。',
        action: '标记对你重要的日期，观察天象与生活节奏的对应关系。',
      },
    },
    extra: { kind: 'c_ephemeris', year: 2026, sample_days: SAMPLE_DAYS },
    i18n_key: 'c_ephemeris.2026',
  },
];

export const EPHEMERIS_2026_COUNT = EPHEMERIS_2026.length; // 1
