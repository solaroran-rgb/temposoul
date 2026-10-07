/**
 * presets.ts —— P0-1 参数预设入口 + 称谓模板（B3 四-c / 八 P0-1）
 *
 * B3 冻结口径：落地页「不是四步表单，是参数预设入口 + 称谓模板」。
 * 三预设：birthday 生日 / anniversary 纪念日 / now 此刻。
 * 称谓模板优先（P12）：用户只给一个名字，套用情感模板，降低 UGC 摩擦。
 *
 * 纪律：本文件纯函数、零 DOM、可在 node:test 跑；now 可注入以保证确定性。
 *      称谓模板产出的是「展示称谓」，上卡前仍须经 templates.sanitizeName 过滤（P12）；
 *      称谓永远不进 sky_id（见 skyId.ts）。
 */

export type PresetType = 'birthday' | 'anniversary' | 'now';

/** 三个预设入口（B3 四-c：生日/纪念日/此刻） */
export const STAR_MARK_PRESETS: {
  id: PresetType;
  displayName: string;
  description: string;
}[] = [
  { id: 'birthday', displayName: '生日星空', description: '把出生那晚的星空定格送给 TA' },
  { id: 'anniversary', displayName: '纪念星空', description: '回到你们相遇/相爱的那一刻' },
  { id: 'now', displayName: '此刻星空', description: '就现在，这片头顶的天' },
];

/** 默认观测点：济南（与基础版示例卡一致，城市级） */
export const DEFAULT_LOCATION = {
  latDeg: 36.6512,
  lngDeg: 117.1201,
  label: '济南',
} as const;

/** 复现观测点（不含渲染尺寸；尺寸由渲染端决定，保证同一观测点可多尺寸复现） */
export interface ObservationPoint {
  unixMs: number;
  latDeg: number;
  lngDeg: number;
  dirDeg: number;
}

export interface BuildPresetOptions {
  /** now 注入（测试确定性）；now 预设与生日/纪念日默认时刻均以此为锚 */
  now?: number;
  /** 指定时刻（生日/纪念日真实时刻）；缺省回落当日 21:47（示例时刻） */
  unixMs?: number;
  latDeg?: number;
  lngDeg?: number;
  dirDeg?: number;
}

/**
 * 由预设构建观测点。确定性：传入 now 后输出完全可复现。
 * - now：直接取注入/当前时刻；
 * - birthday / anniversary：有真实时刻用真实时刻，否则回落当日 21:47（UTC+8 展示口径由调用方标注）。
 */
export function buildPresetObservation(
  type: PresetType,
  opts: BuildPresetOptions = {},
): ObservationPoint {
  const now = opts.now ?? Date.now();
  const latDeg = opts.latDeg ?? DEFAULT_LOCATION.latDeg;
  const lngDeg = opts.lngDeg ?? DEFAULT_LOCATION.lngDeg;
  const dirDeg = opts.dirDeg ?? 0;

  let unixMs: number;
  if (type === 'now') {
    unixMs = now;
  } else if (opts.unixMs !== undefined) {
    unixMs = opts.unixMs;
  } else {
    const d = new Date(now);
    d.setHours(21, 47, 0, 0);
    unixMs = d.getTime();
  }

  return { unixMs, latDeg, lngDeg, dirDeg };
}

/** 称谓模板（P12「称谓模板优先」）：用户给一个名字即可，不要求写完整文案 */
export const NAME_TEMPLATES: {
  id: string;
  displayName: string;
  render: (name: string) => string;
}[] = [
  { id: 'for', displayName: '给{name}', render: (n) => `给${n}` },
  { id: 'to', displayName: '致{name}', render: (n) => `致${n}` },
  { id: 'exclusive', displayName: '{name}的专属星空', render: (n) => `${n}的专属星空` },
];

/** 套用称谓模板；未知模板回落到第一个。产出仍需 sanitizeName 过滤后才能上卡。 */
export function applyNameTemplate(templateId: string, name: string): string {
  const tpl = NAME_TEMPLATES.find((t) => t.id === templateId) ?? NAME_TEMPLATES[0];
  return tpl.render(name);
}
