/**
 * star_card · 五区块确定性规则（P0 简化版）
 * 数据源：标准日干支推导（儒略日 mod 60）+ 传统方位/五行/节气映射表。
 * 诚实声明：P0 规则表为确定性简化版（表驱动、零外部依赖、零 LLM）；
 * 完整内容扩充（每表 ≥6 条模板）列入 A5 P1 内容生产批次。
 */

import type { DateKey, StarCardBlock, ClimateZone } from './types';
import { sanitizeForbidden, isExtremeWeather, EXTREME_WEATHER_SAFE_SUFFIX, withDisclaimer } from './compliance';

/** 儒略日整数（UTC） */
function julianDay(dateKey: DateKey): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** 日干支：返回 { stemIdx 0-9, branchIdx 0-11, ganzhi }（标准算法） */
export function dayGanzhi(dateKey: DateKey): { stemIdx: number; branchIdx: number; ganzhi: string } {
  const idx = ((julianDay(dateKey) + 49) % 60 + 60) % 60;
  const stemIdx = idx % 10;
  const branchIdx = idx % 12;
  const STEMS = '甲乙丙丁戊己庚辛壬癸';
  const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
  return { stemIdx, branchIdx, ganzhi: STEMS[stemIdx] + BRANCHES[branchIdx] };
}

const WUXING_BY_STEM: Record<string, string> = {
  甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土',
  己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水',
};

/** 财神方位（传统口诀：甲乙东北、丙丁西南、戊己正北、庚辛正东、壬癸正南） */
const CAISHEN_DIRECTION: Record<string, string> = {
  甲: '东北', 乙: '东北', 丙: '西南', 丁: '西南', 戊: '正北',
  己: '正北', 庚: '正东', 辛: '正东', 壬: '正南', 癸: '正南',
};

/** 贵神方位（简化映射：按日干五行生克定喜用方） */
const GUIREN_DIRECTION: Record<string, string> = {
  甲: '东南', 乙: '正南', 丙: '正西', 丁: '西北', 戊: '东北',
  己: '正北', 庚: '西南', 辛: '正南', 壬: '正东', 癸: '东南',
};

/** 避凶方位（简化：喜用方位之对冲） */
const AVOID_DIRECTION: Record<string, string> = {
  甲: '正西', 乙: '正北', 丙: '正东', 丁: '正南', 戊: '西南',
  己: '正南', 庚: '正北', 辛: '正西', 壬: '正西', 癸: '正北',
};

/** 五行 → 幸运色 / 材质 */
const WUXING_STYLE: Record<string, { color: string; accent: string; material: string }> = {
  木: { color: '青绿', accent: '淡绿', material: '棉麻' },
  火: { color: '赤红', accent: '橙', material: '丝质' },
  土: { color: '米黄', accent: '棕', material: '棉质' },
  金: { color: '月白', accent: '银灰', material: '针织' },
  水: { color: '墨蓝', accent: '深蓝', material: '毛呢' },
};

/** 节气（简化：按月令给食养主线；完整 24 节气表入 P1） */
const MONTH_DIET: Record<number, string> = {
  1: '冬末养藏，宜温补，注意防寒保暖。',
  2: '立春前后宜升发，多户外舒展，注意春捂。',
  3: '惊蛰清明间宜清淡，多时蔬，注意防风。',
  4: '春夏之交宜疏泄，多饮水，注意养肝。',
  5: '夏初宜清热，多瓜果，注意午间避暑。',
  6: '夏至前后宜养心，多静养，注意防暑。',
  7: '盛夏宜祛湿，多薏仁冬瓜，注意防暑补水。',
  8: '立秋前后宜润燥，多梨藕，注意护肺。',
  9: '秋分前后宜平补，多五谷，注意润燥。',
  10: '深秋宜温润，多银耳山药，注意添衣。',
  11: '立冬前后宜温补，多暖汤，注意早睡。',
  12: '冬至前后宜养藏，多温热，注意护阳。',
};

/** 气候带微调（叠加在节气建议后） */
const CLIMATE_DIET: Record<ClimateZone, string> = {
  cold: '当地偏寒，注意保暖防寒，食宜温热。',
  temperate: '',
  subtropical: '当地偏湿热，注意祛湿，饮食宜清淡。',
  tropical: '当地炎热，注意防暑补水，食宜清润。',
  plateau: '当地海拔较高，注意防风保暖，适度补水。',
};

/** 今日一句话模板（结论式/理由式由前端 E1 实验变量选择，P0 默认结论式） */
const SUMMARY_TEMPLATES: readonly string[] = [
  '今日宜从容，按节奏行事，整体平稳。',
  '今日利于专注手头之事，宜守不宜攻。',
  '今日宜与人协作，沟通顺畅，顺势而为。',
  '今日宜整理与规划，为接下来的安排做准备。',
];

/** 避凶正向表述模板（写入正向可执行：写"早点休息"不写"防意外"） */
const AVOID_POSITIVE: readonly string[] = [
  '今日适合早点休息，保持精力，重要安排留到状态好的时段。',
  '今日贵重物品请随身携带并妥善保管，出门前检查随身清单。',
  '今日沟通宜多确认细节，重要消息以书面为准，避免口头误解。',
  '今日适合保持低调节奏，把时间留给真正重要的事。',
];

function hashInt(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 生成五区块（不含六爻，六爻由 liuyao.ts 独立产出） */
export function buildBlocks(
  dateKey: DateKey,
  ruleVersion: string,
  climateZone: ClimateZone,
  weatherWarning: string,
): StarCardBlock[] {
  const gz = dayGanzhi(dateKey);
  const stem = gz.ganzhi[0];
  const wuxing = WUXING_BY_STEM[stem];
  const style = WUXING_STYLE[wuxing];
  const r = hashInt(dateKey + ':' + ruleVersion);

  const dietBase = MONTH_DIET[Number(dateKey.slice(5, 7))] ?? MONTH_DIET[1];
  const dietClimate = CLIMATE_DIET[climateZone];
  const dietText = sanitizeForbidden(dietBase + dietClimate).text;

  const summaryText = SUMMARY_TEMPLATES[r % SUMMARY_TEMPLATES.length];
  const avoidText = AVOID_POSITIVE[r % AVOID_POSITIVE.length];

  let avoidFinal = avoidText;
  if (isExtremeWeather(weatherWarning)) {
    avoidFinal = `${avoidText}${EXTREME_WEATHER_SAFE_SUFFIX}`;
  }

  const blocks: StarCardBlock[] = [
    {
      id: 'summary',
      title: '今日一句话',
      content: withDisclaimer(sanitizeForbidden(summaryText).text),
      sourceKey: `rule:${ruleVersion}:summary:t${r % SUMMARY_TEMPLATES.length}`,
    },
    {
      id: 'fortune',
      title: '今日方位参考',
      content: withDisclaimer(
        `财神方位：${CAISHEN_DIRECTION[stem]}；贵人方位：${GUIREN_DIRECTION[stem]}；宜避方位：${AVOID_DIRECTION[stem]}（传统方位参考）。`,
      ),
      sourceKey: `rule:${ruleVersion}:direction:${stem}`,
    },
    {
      id: 'dress',
      title: '今日穿搭参考',
      content: withDisclaimer(
        `适合颜色：${style.color}（辅色${style.accent}）；适合材质：${style.material}（${wuxing}日传统参考）。`,
      ),
      sourceKey: `rule:${ruleVersion}:style:${stem}`,
    },
    {
      id: 'diet',
      title: '今日饮食养生',
      content: withDisclaimer(dietText),
      sourceKey: `rule:${ruleVersion}:diet:${Number(dateKey.slice(5, 7))}:${climateZone}`,
    },
    {
      id: 'avoid',
      title: '今日提醒',
      content: withDisclaimer(sanitizeForbidden(avoidFinal).text),
      sourceKey: `rule:${ruleVersion}:avoid:t${r % AVOID_POSITIVE.length}`,
    },
  ];
  return blocks;
}
