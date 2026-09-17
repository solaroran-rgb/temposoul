/**
 * 行运/太阳返照 2 条（TRANSITS）
 * 来源：专家 A R3 v3.0（lunz 2.md §2.4 文件树 transits.ts）+ 收口确认卡修复①（补 TRANSITS → 280 断言）
 * 口径：2 条（transit / solar_return），逐条 ≥150 字
 */
import type { TransitExtra, ContentRecord } from './types';

export const TRANSITS: readonly ContentRecord<TransitExtra>[] = [
  {
    id: 'transit_planets',
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'transit_solar',
    seo: {
      title: '行运详解：行星相位与时间尺度',
      description: '行运的外行星/内行星分层与关键相位解读说明。',
      slug: '/wiki/transits/detail',
      canonical: '/wiki/transits/detail',
      breadcrumb: ['首页', '命理百科', '行运', '详解'],
      breadcrumb_paths: ['/', '/wiki', '/wiki/transits', '/wiki/transits/detail'],
    },
    source: { system: 'western_astrology', classic: '当代占星研究', chapter: '行运篇' },
    compliance: { no_fatalism: true, domain_note: 'lifestyle_only', banned_words_checked: true },
    review: { status: 'polished', word_count: 0, reviewer: 'expert-a' },
    body: {
      plain_reading:
        '行运（Transits）指当前天体的实际位置与出生星盘形成的相位关系，是西占中最常用的时间预测框架。解读时通常分为两层：外行星（土星、天王星、海王星、冥王星）行运代表长周期、社会性的阶段议题，内行星（水星、金星、火星）行运代表短周期、日常性的事件波动。关键做法是看行运行星与出生盘行星的相位（合、冲、三分、四分等），并结合所落宫位判断影响的领域。行运解读宜以"阶段议题与成长课题"为基调，而非具体事件的吉凶断言，结合个人自由意志作参考。',
      insight_loop: {
        insight: '行运揭示当前天象与出生盘的互动议题，分长短期两层。',
        cause: '外行星行运周期长，代表集体性阶段课题；内行星周期短，对应日常波动。',
        manifestation: '在对应宫位领域出现与该行星主题相关的事件与心境变化。',
        risk: '只看单一相位易过度解读，忽略整体天象结构。',
        suggestion: '以土星、天王等外行星为骨架，内行星为细节，综合看盘。',
        action: '结合具体宫位与出生盘格局，作阶段规划参考。',
      },
    },
    extra: {
      kind: 'transit_solar',
      type: 'transit',
      time_scale: '数日至数年（按行星周期）',
      layers: [
        { name: '外行星层', scope: '社会与人生阶段', reading: '土星-冥王星行运主长周期课题。' },
        { name: '内行星层', scope: '日常事件', reading: '水-金-火星行运主短期波动。' },
      ],
      boundary_note: '行运为参考维度，不构成对具体事件的断言。',
    },
    i18n_key: 'transit.planets',
  },
  {
    id: 'solar_return_axes',
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'transit_solar',
    seo: {
      title: '太阳返照详解：四轴与宫位框架',
      description: '太阳返照的四轴相位与关键宫位解读说明。',
      slug: '/wiki/solar-return/detail',
      canonical: '/wiki/solar-return/detail',
      breadcrumb: ['首页', '命理百科', '太阳返照', '详解'],
      breadcrumb_paths: ['/', '/wiki', '/wiki/solar-return', '/wiki/solar-return/detail'],
    },
    source: { system: 'western_astrology', classic: '当代占星研究', chapter: '太阳返照篇' },
    compliance: { no_fatalism: true, domain_note: 'lifestyle_only', banned_words_checked: true },
    review: { status: 'polished', word_count: 0, reviewer: 'expert-a' },
    body: {
      plain_reading:
        '太阳返照（Solar Return）以每年太阳回到出生度数的时刻起盘，用于解读未来一年的主题基调。返照盘的上升点与四轴（ASC/DSC/MC/IC）所在星座与宫位，是该年度最醒目的领域提示；太阳返照盘中的行星落宫，指示一年中能量集中的生活面向。解读重点有三：一是返照上升与出生上升的关系，二是返照太阳所在的宫位与相位，三是返照盘行星与出生盘行星的呼应。太阳返照适合作为年度规划与自我观察的参考框架，不宜作为吉凶断言，具体事件仍需结合行运与个人选择综合判断。',
      insight_loop: {
        insight: '太阳返照勾勒新一年的主题基调，四轴与太阳落宫最醒目。',
        cause: '返照盘以上升与太阳为核心，集中指示年度能量分布。',
        manifestation: '四轴与行星落宫对应的生活领域成为年度显性议题。',
        risk: '单看返照盘易忽略出生盘底色与行运叠加。',
        suggestion: '将返照盘与出生盘、行运三层结合解读。',
        action: '以年度规划视角观察，记录实际发生的事件作验证。',
      },
    },
    extra: {
      kind: 'transit_solar',
      type: 'solar_return',
      time_scale: '一年',
      layers: [
        { name: '四轴层', scope: '年度方向', reading: '上升/天顶等四轴指示年度主题领域。' },
        { name: '宫位层', scope: '领域分布', reading: '行星落宫指示能量集中领域。' },
      ],
      boundary_note: '返照为年度参考框架，不构成吉凶断言。',
    },
    i18n_key: 'transit.solar_return',
  },
];

export const TRANSITS_COUNT = TRANSITS.length; // 2
