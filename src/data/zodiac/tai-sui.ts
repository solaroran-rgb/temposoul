// B23-5 src/data/zodiac/tai-sui.ts
/**
 * 本命年 / 犯太岁民俗规则静态表。
 * 生肖年以立春为分界（非正月初一）。禁"必然倒霉"断言；不导流付费法事。
 *
 * // 自查：packages/core/ganzhi、packages/core/zodiac 提供更完整的刑冲合害与立春
 * 精确历法，本表为民俗科普层的静态近似数据，后续可由引擎校验替换。
 */

export type TaiSuiType = 'value' | 'clash' | 'harm' | 'destroy' | 'punish' | 'none';

export interface TaiSuiRule {
  year: number;
  yearGanZhi: string;
  /** 立春精确时刻（ISO8601 UTC），用于界定该生肖年起点 */
  liChunDate: string;
  /** key 为生肖名（鼠牛虎…），value 为对该流年太岁的关系 */
  rules: Record<string, TaiSuiType>;
  folkCustoms: string[];
  disclaimer: string;
}

const DISC = '犯太岁为传统民俗说法，仅作文化参考，不等于运势好坏，更不存在"必然倒霉"。本站不提供也不导流任何付费法事。';

export const TAI_SUI_RULES: TaiSuiRule[] = [
  {
    year: 2024,
    yearGanZhi: '甲辰',
    liChunDate: '2024-02-04T08:26:00Z',
    rules: { 龙: 'value', 狗: 'clash', 兔: 'harm', 牛: 'destroy' },
    folkCustoms: ['立春前后注意作息规律', '重要决定多留缓冲期', '节日期间与人相处多一分耐心'],
    disclaimer: DISC,
  },
  {
    year: 2025,
    yearGanZhi: '乙巳',
    liChunDate: '2025-02-03T14:10:00Z',
    rules: { 蛇: 'value', 猪: 'clash', 虎: 'punish', 猴: 'punish' },
    folkCustoms: ['年初整理一遍账单与计划', '出行预留备选方案', '与长辈多沟通少争执'],
    disclaimer: DISC,
  },
  {
    year: 2026,
    yearGanZhi: '丙午',
    liChunDate: '2026-02-03T20:02:00Z',
    rules: { 马: 'value', 鼠: 'clash', 牛: 'harm', 兔: 'destroy' },
    folkCustoms: ['夏季注意作息与情绪', '签约前多看一遍条款', '量力而行，不盲目跟风'],
    disclaimer: DISC,
  },
  {
    year: 2027,
    yearGanZhi: '丁未',
    liChunDate: '2027-02-04T01:46:00Z',
    rules: { 羊: 'value', 牛: 'clash', 鼠: 'harm', 狗: 'destroy' },
    folkCustoms: ['开春做一次年度复盘', '健康体检按计划进行', '财务上留一笔应急金'],
    disclaimer: DISC,
  },
  {
    year: 2028,
    yearGanZhi: '戊申',
    liChunDate: '2028-02-04T07:30:00Z',
    rules: { 猴: 'value', 虎: 'clash', 猪: 'harm', 蛇: 'destroy' },
    folkCustoms: ['变动机会多时先评估风险', '沟通留痕，避免口头承诺', '短途出行注意安全'],
    disclaimer: DISC,
  },
  {
    year: 2029,
    yearGanZhi: '己酉',
    liChunDate: '2029-02-03T13:20:00Z',
    rules: { 鸡: 'value', 兔: 'clash', 狗: 'harm', 鼠: 'destroy' },
    folkCustoms: ['人际边界感适度调整', '财务计划留弹性', '情绪波动时延后重大决定'],
    disclaimer: DISC,
  },
  {
    year: 2030,
    yearGanZhi: '庚戌',
    liChunDate: '2030-02-03T19:40:00Z',
    rules: { 狗: 'value', 龙: 'clash', 鸡: 'harm', 羊: 'destroy' },
    folkCustoms: ['家庭安排多商量', '合同类文件逐条确认', '作息规律化'],
    disclaimer: DISC,
  },
];

export const TAI_SUI_TYPE_LABEL: Record<TaiSuiType, string> = {
  value: '值太岁（本命年）',
  clash: '冲太岁',
  harm: '害太岁',
  destroy: '破太岁',
  punish: '刑太岁',
  none: '无明显太岁关系',
};

export function getTaiSuiRule(year: number): TaiSuiRule | undefined {
  return TAI_SUI_RULES.find((r) => r.year === year);
}
