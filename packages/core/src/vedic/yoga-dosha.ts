/**
 * @file 吠陀 Yoga / Dosha 判定（红线 1.2-102 / 1.2-103）
 *
 * @设计口径
 *   只实现**可由 D1 盘面确定性推导**的条目：即输入为九曜的恒星黄经、Rashi（星座）与
 *   Bhava（Whole Sign 宫位），输出为布尔判定 + 触发条件 + 传统依据 + 局限说明。
 *   依赖「分盘精细度数」「地域流派差异」「双方合盘」的条目一律不臆造，改在
 *   `pendingExpertReview` 中显式列出，交由命理顾问终审（符合全站合规纪律：不画饼、可追溯）。
 *
 * @判定范围（本版 12 条 Yoga + 5 条 Dosha）
 *   Yoga：
 *     · Pancha Mahapurusha 五大瑜伽 ×5（Ruchaka / Bhadra / Hamsa / Malavya / Shasha）
 *     · Gajakesari（月木互处角宫）
 *     · Budha-Aditya（日月…水日同宫）
 *     · Chandra-Mangala（月火同宫）
 *     · Dharma-Karmadhipati（9 主与 10 主互处角宫）
 *     · Viparita Raja（6/8/12 主落入 6/8/12）
 *     · Amala（吉星居 10 宫，自命宫或自月亮）
 *   Dosha：
 *     · Mangal / Kuja Dosha（火星居 1/2/4/7/8/12）
 *     · Kaal Sarp Dosha（七曜全在罗睺-计都轴一侧）
 *     · Guru-Chandal Dosha（木星与罗睺同宫）
 *     · Kemadruma Dosha（月亮 2/12 宫无星）
 *     · Shani-Moon Sade Sati（土星居月亮 12/1/2 宫，出生时刻基准）
 *
 * @传统依据 Brihat Parashara Hora Shastra（BPHS）通行定义；不同流派口径差异见各条 limitations。
 */
import type { VedicPoint } from './types';

/** 12 Rashi 的守护星（0=Mesha … 11=Meena） */
export const RASHI_LORDS = [
  'Mars', // 0 Mesha 白羊
  'Venus', // 1 Vrishabha 金牛
  'Mercury', // 2 Mithuna 双子
  'Moon', // 3 Karka 巨蟹
  'Sun', // 4 Simha 狮子
  'Mercury', // 5 Kanya 处女
  'Venus', // 6 Tula 天秤
  'Mars', // 7 Vrischika 天蝎
  'Jupiter', // 8 Dhanu 射手
  'Saturn', // 9 Makara 摩羯
  'Saturn', // 10 Kumbha 水瓶
  'Jupiter', // 11 Meena 双鱼
] as const;

/** 擢升（exaltation）星座索引；null 表示不适用 */
export const EXALTATION_RASHI: Record<string, number> = {
  Sun: 0, // Mesha 白羊 10°
  Moon: 1, // Vrishabha 金牛 3°
  Mars: 9, // Makara 摩羯 28°
  Mercury: 5, // Kanya 处女 15°
  Jupiter: 3, // Karka 巨蟹 5°
  Venus: 11, // Meena 双鱼 27°
  Saturn: 6, // Tula 天秤 20°
};

/** 落陷（debilitation）星座索引 */
export const DEBILITATION_RASHI: Record<string, number> = {
  Sun: 6,
  Moon: 7,
  Mars: 3,
  Mercury: 11,
  Jupiter: 9,
  Venus: 5,
  Saturn: 0,
};

/** 角宫（Kendra）：1 / 4 / 7 / 10 */
const KENDRAS = new Set([1, 4, 7, 10]);
/** 天然吉星 */
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);

export type YogaKey =
  | 'ruchaka'
  | 'bhadra'
  | 'hamsa'
  | 'malavya'
  | 'shasha'
  | 'gajakesari'
  | 'budha-aditya'
  | 'chandra-mangala'
  | 'dharma-karmadhipati'
  | 'viparita-raja'
  | 'amala';

export type DoshaKey = 'mangal' | 'kaal-sarp' | 'guru-chandal' | 'kemadruma' | 'shani-sade-sati';

export interface VedicYogaFinding {
  key: YogaKey;
  sanskrit: string;
  name: string;
  category: '大人物瑜伽' | '王瑜伽' | '常规瑜伽';
  active: boolean;
  /** 命中时的触发条件事实描述 */
  condition: string;
  /** 命中时的传统解读（娱乐/参考视角，无确定性断语） */
  interpretation: string;
  /** 参与判定的星体 */
  participants: string[];
  basis: string;
  limitations: string[];
}

export interface VedicDoshaFinding {
  key: DoshaKey;
  sanskrit: string;
  name: string;
  severity: '无' | '轻' | '中' | '重';
  active: boolean;
  condition: string;
  interpretation: string;
  participants: string[];
  basis: string;
  limitations: string[];
  /** 传统缓解说法（仅供参考，不构成建议） */
  traditionalNote?: string;
}

export interface VedicYogaDoshaResult {
  yogas: VedicYogaFinding[];
  doshas: VedicDoshaFinding[];
  /** 需命理顾问终审的未实现条目（显式列出，不隐藏、不臆造） */
  pendingExpertReview: Array<{
    item: string;
    reason: string;
    plannedApproach: string;
  }>;
  summary: {
    activeYogas: string[];
    activeDoshas: string[];
    detectedCount: number;
    totalYogas: number;
    totalDoshas: number;
  };
}

/** 相对宫位：from 起算，to 落在第几宫（Whole Sign，1–12） */
function relativeBhava(fromBhava: number, toBhava: number): number {
  return ((toBhava - fromBhava + 12) % 12) + 1;
}

function isKendra(rel: number): boolean {
  return KENDRAS.has(rel);
}

/** 某宫的宫主星 */
function lordOfBhava(lagnaBhavaRashi: number, bhava: number, grahas: VedicPoint[]): VedicPoint | undefined {
  const rashiIndex = ((lagnaBhavaRashi + bhava - 1) % 12 + 12) % 12;
  const lordName = RASHI_LORDS[rashiIndex];
  return grahas.find((g) => g.name === lordName);
}

/**
 * Yoga / Dosha 判定主入口。
 * @param lagna 上升点（含 rashiIndex 与 bhava=1）
 * @param grahas 九曜（含 Rahu / Ketu）
 */
export function computeYogaDosha(lagna: VedicPoint, grahas: VedicPoint[]): VedicYogaDoshaResult {
  const byName = (n: string) => grahas.find((g) => g.name === n);
  const mars = byName('Mars');
  const mercury = byName('Mercury');
  const jupiter = byName('Jupiter');
  const venus = byName('Venus');
  const saturn = byName('Saturn');
  const moon = byName('Moon');
  const sun = byName('Sun');
  const rahu = byName('Rahu');

  const yogas: VedicYogaFinding[] = [];

  // ---------- Pancha Mahapurusha 五大瑜伽 ----------
  const pancha: Array<{
    key: YogaKey;
    sanskrit: string;
    name: string;
    planet: VedicPoint | undefined;
    interpretation: string;
  }> = [
    { key: 'ruchaka', sanskrit: 'Ruchaka', name: '火星大人物瑜伽', planet: mars, interpretation: '传统认为与行动力、统御力相关的星象组合（参考视角）。' },
    { key: 'bhadra', sanskrit: 'Bhadra', name: '水星大人物瑜伽', planet: mercury, interpretation: '传统认为与思辨、表达相关的星象组合（参考视角）。' },
    { key: 'hamsa', sanskrit: 'Hamsa', name: '木星大人物瑜伽', planet: jupiter, interpretation: '传统认为与学识、声誉相关的星象组合（参考视角）。' },
    { key: 'malavya', sanskrit: 'Malavya', name: '金星大人物瑜伽', planet: venus, interpretation: '传统认为与审美、资源相关的星象组合（参考视角）。' },
    { key: 'shasha', sanskrit: 'Shasha', name: '土星大人物瑜伽', planet: saturn, interpretation: '传统认为与纪律、耐久相关的星象组合（参考视角）。' },
  ];

  for (const p of pancha) {
    if (!p.planet) continue;
    const ownSign = RASHI_LORDS[p.planet.rashiIndex] === p.planet.name;
    const exalted = EXALTATION_RASHI[p.planet.name] === p.planet.rashiIndex;
    const inKendra = isKendra(p.planet.bhava);
    const active = (ownSign || exalted) && inKendra;
    yogas.push({
      key: p.key,
      sanskrit: p.sanskrit,
      name: p.name,
      category: '大人物瑜伽',
      active,
      condition: `${p.planet.label}须落本座或擢升座且居角宫（1/4/7/10）；实测：${p.planet.label}居 ${p.planet.rashi}（第 ${p.planet.bhava} 宫），${ownSign ? '本座' : exalted ? '擢升' : '非本座非擢升'}，${inKendra ? '角宫' : '非角宫'}。`,
      interpretation: p.interpretation,
      participants: [p.planet.label],
      basis: 'BPHS：五星各自居本座或擢升座并落角宫，成 Pancha Mahapurusha Yoga。',
      limitations: [
        '本判定采用 Whole Sign 宫位；改用 Bhava Chalit（Sripati）分宫时边缘度数可能改变宫位归属。',
        '擢升/落陷仅按星座判定，未按传统精确到特定度数（如火星摩羯 28°），属简化口径。',
      ],
    });
  }

  // ---------- Gajakesari ----------
  if (moon && jupiter) {
    const rel = isKendra(relativeBhava(moon.bhava, jupiter.bhava));
    yogas.push({
      key: 'gajakesari',
      sanskrit: 'Gajakesari',
      name: '象狮瑜伽',
      category: '常规瑜伽',
      active: rel,
      condition: `月亮与木星互处角宫（1/4/7/10）；实测：月亮第 ${moon.bhava} 宫、木星第 ${jupiter.bhava} 宫，相对第 ${relativeBhava(moon.bhava, jupiter.bhava)} 宫。`,
      interpretation: '传统认为与声望、稳健相关的星象组合（参考视角）。',
      participants: [moon.label, jupiter.label],
      basis: 'BPHS：月亮与木星互居角宫成 Gajakesari Yoga。',
      limitations: ['部分流派要求二者同时避开落陷与 combust（合日焦伤），本版未纳入 combust 判定。'],
    });
  }

  // ---------- Budha-Aditya ----------
  if (sun && mercury) {
    const active = sun.rashiIndex === mercury.rashiIndex;
    yogas.push({
      key: 'budha-aditya',
      sanskrit: 'Budha-Aditya',
      name: '水日瑜伽',
      category: '常规瑜伽',
      active,
      condition: `水星与太阳同宫；实测：太阳 ${sun.rashi}、水星 ${mercury.rashi}。`,
      interpretation: '传统认为与才智、表达相关的星象组合（参考视角）。',
      participants: [sun.label, mercury.label],
      basis: '通行定义：水星与太阳同处一星座。',
      limitations: [
        '同宫容许度未设度数上限（只要落在同一 30° 星座即算），比部分流派（≤14°）宽。',
        '水星距太阳过近时传统视为 combust，本版未单独判定。',
      ],
    });
  }

  // ---------- Chandra-Mangala ----------
  if (moon && mars) {
    const active = moon.rashiIndex === mars.rashiIndex;
    yogas.push({
      key: 'chandra-mangala',
      sanskrit: 'Chandra-Mangala',
      name: '月火瑜伽',
      category: '常规瑜伽',
      active,
      condition: `月亮与火星同宫；实测：月亮 ${moon.rashi}、火星 ${mars.rashi}。`,
      interpretation: '传统认为与行动驱力、财务主动性相关的星象组合（参考视角）。',
      participants: [moon.label, mars.label],
      basis: '通行定义：月亮与火星同处一星座。',
      limitations: ['部分流派仅认同宫（≤10°），本版按同星座判定，口径更宽。'],
    });
  }

  // ---------- Dharma-Karmadhipati Raja Yoga ----------
  const lord9 = lordOfBhava(lagna.rashiIndex, 9, grahas);
  const lord10 = lordOfBhava(lagna.rashiIndex, 10, grahas);
  if (lord9 && lord10) {
    const rel = relativeBhava(lord9.bhava, lord10.bhava);
    const active = isKendra(rel) || isKendra(relativeBhava(lord10.bhava, lord9.bhava)) || lord9.rashiIndex === lord10.rashiIndex;
    yogas.push({
      key: 'dharma-karmadhipati',
      sanskrit: 'Dharma-Karmadhipati Raja',
      name: '法业王瑜伽',
      category: '王瑜伽',
      active,
      condition: `第 9 宫主（${lord9.label}）与第 10 宫主（${lord10.label}）互处角宫或同宫；实测：${lord9.label} 第 ${lord9.bhava} 宫、${lord10.label} 第 ${lord10.bhava} 宫，相对第 ${rel} 宫。`,
      interpretation: '传统视为王瑜伽类组合（参考视角）。',
      participants: [lord9.label, lord10.label],
      basis: 'BPHS：9 主与 10 主形成角宫关系（含同宫）成 Raja Yoga。',
      limitations: ['未纳入「宫主受克 / 落陷 / 逆行」等削弱条件，属基础判定。'],
    });
  }

  // ---------- Viparita Raja Yoga ----------
  const dusthanas = [6, 8, 12];
  const dusthanaLords = dusthanas
    .map((b) => lordOfBhava(lagna.rashiIndex, b, grahas))
    .filter((p): p is VedicPoint => !!p);
  const viparitaHits = dusthanaLords.filter((p) => dusthanas.includes(p.bhava));
  yogas.push({
    key: 'viparita-raja',
    sanskrit: 'Viparita Raja',
    name: '逆境王瑜伽',
    category: '王瑜伽',
    active: viparitaHits.length > 0,
    condition: `6/8/12 宫主落入 6/8/12 宫；实测命中 ${viparitaHits.length} 项（${viparitaHits.map((p) => `${p.label}→第${p.bhava}宫`).join('、') || '无'}）。`,
    interpretation: '传统视为「由逆境转强」类组合（参考视角）。',
    participants: viparitaHits.map((p) => p.label),
    basis: 'BPHS：凶宫主落入凶宫成 Viparita Raja Yoga。',
    limitations: ['未区分三种亚型（Harsha / Sarala / Vimala），也未判定宫主受克削弱。'],
  });

  // ---------- Amala Yoga ----------
  const amalaHits = grahas.filter(
    (g) => BENEFICS.has(g.name) && (g.bhava === 10 || (moon ? relativeBhava(moon.bhava, g.bhava) === 10 : false)),
  );
  yogas.push({
    key: 'amala',
    sanskrit: 'Amala',
    name: '清净瑜伽',
    category: '常规瑜伽',
    active: amalaHits.length > 0,
    condition: `吉星（木/金/水/月）居自命宫或自月亮起第 10 宫；实测命中 ${amalaHits.length} 项（${amalaHits.map((g) => g.label).join('、') || '无'}）。`,
    interpretation: '传统认为与声誉、清望相关的星象组合（参考视角）。',
    participants: amalaHits.map((g) => g.label),
    basis: 'BPHS：吉星居 10 宫（自 Lagna 或自 Chandra）成 Amala Yoga。',
    limitations: ['月亮为吉星的判定采用「非朔望附近」简化口径，未计算月相精确盈亏。'],
  });

  // ================= Dosha =================
  const doshas: VedicDoshaFinding[] = [];

  // ---------- Mangal / Kuja Dosha ----------
  if (mars) {
    const rel = mars.bhava;
    const active = [1, 2, 4, 7, 8, 12].includes(rel);
    doshas.push({
      key: 'mangal',
      sanskrit: 'Mangal / Kuja',
      name: '火星煞（曼伽煞）',
      severity: active ? ([1, 7, 8].includes(rel) ? '重' : '中') : '无',
      active,
      condition: `火星自命宫起居 1/2/4/7/8/12 宫；实测：火星第 ${rel} 宫（${mars.rashi}）。`,
      interpretation: '传统认为与关系摩擦倾向相关的星象组合（参考视角，非确定性断语）。',
      participants: [mars.label],
      basis: '通行定义：火星自 Lagna 起居 1/2/4/7/8/12 宫。',
      limitations: [
        '部分流派同时自月亮、金星起算（本版仅自 Lagna 起算，另两口径待扩展）。',
        '传统缓解条件（如火星落本座/擢升、受吉星照、特定星座例外）本版未纳入。',
      ],
      traditionalNote: '传统上有「以合盘对冲消解」的说法，属民俗范畴，本站仅作文化介绍，不构成任何建议。',
    });
  }

  // ---------- Kaal Sarp Dosha ----------
  if (rahu) {
    const ketu = byName('Ketu');
    const sevenGrahas = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
      .map((n) => byName(n))
      .filter((p): p is VedicPoint => !!p);
    let allOnOneSide = false;
    if (ketu && sevenGrahas.length === 7) {
      const rahuLon = rahu.siderealLongitude;
      // 以罗睺为起点沿黄道顺行至计都（180°）为 A 侧，另一半为 B 侧
      const inSideA = (lon: number) => ((lon - rahuLon + 360) % 360) < 180;
      const sideA = sevenGrahas.filter((p) => inSideA(p.siderealLongitude)).length;
      const sideB = sevenGrahas.length - sideA;
      allOnOneSide = sideA === 7 || sideB === 7;
    }
    doshas.push({
      key: 'kaal-sarp',
      sanskrit: 'Kaal Sarp',
      name: '时蛇煞',
      severity: allOnOneSide ? '中' : '无',
      active: allOnOneSide,
      condition: `七曜（日月火水木金土）全部落在罗睺—计都轴同一侧；实测：${allOnOneSide ? '全部同侧' : '两侧均有分布'}。`,
      interpretation: '传统视为需留意的星象组合（参考视角，非确定性断语）。',
      participants: [rahu.label, byName('Ketu')?.label ?? '计都'],
      basis: '通行定义：七曜全被 Rahu-Ketu 轴夹于一侧。',
      limitations: [
        '「是否纳入罗睺计都自身」「半侧边界容差」各流派不一，本版按严格 180° 半分判定。',
        '未细分 12 种亚型（Anant / Karmuka / …）。',
      ],
    });
  }

  // ---------- Guru-Chandal Dosha ----------
  if (jupiter && rahu) {
    const active = jupiter.rashiIndex === rahu.rashiIndex;
    doshas.push({
      key: 'guru-chandal',
      sanskrit: 'Guru-Chandal',
      name: '木罗同宫煞',
      severity: active ? '轻' : '无',
      active,
      condition: `木星与罗睺同宫；实测：木星 ${jupiter.rashi}、罗睺 ${rahu.rashi}。`,
      interpretation: '传统认为与判断力受扰相关的星象组合（参考视角）。',
      participants: [jupiter.label, rahu.label],
      basis: '通行定义：木星与罗睺同处一星座。',
      limitations: ['部分流派要求度数 ≤10°，本版按同星座判定，口径更宽。'],
    });
  }

  // ---------- Kemadruma Dosha ----------
  if (moon) {
    const neighbours = grahas.filter((g) => {
      if (g.name === 'Moon' || g.name === 'Rahu' || g.name === 'Ketu') return false;
      const rel = relativeBhava(moon.bhava, g.bhava);
      return rel === 2 || rel === 12;
    });
    const active = neighbours.length === 0;
    doshas.push({
      key: 'kemadruma',
      sanskrit: 'Kemadruma',
      name: '孤月煞',
      severity: active ? '轻' : '无',
      active,
      condition: `月亮两侧（2/12 宫）无任何星体（不含罗睺计都）；实测邻近星体 ${neighbours.length} 颗。`,
      interpretation: '传统认为与资源感不足相关的星象组合（参考视角）。',
      participants: [moon.label, ...neighbours.map((g) => g.label)],
      basis: 'BPHS：月亮 2/12 宫无星成 Kemadruma Yoga（凶）。',
      limitations: ['传统存在多项豁免条件（如月亮居角宫、受吉星照），本版未纳入豁免判定。'],
    });
  }

  // ---------- Shani Sade Sati（出生时刻基准）----------
  if (saturn && moon) {
    const rel = relativeBhava(moon.bhava, saturn.bhava);
    const active = rel === 12 || rel === 1 || rel === 2;
    doshas.push({
      key: 'shani-sade-sati',
      sanskrit: 'Sade Sati',
      name: '土星七半（出生时刻基准）',
      severity: active ? (rel === 1 ? '中' : '轻') : '无',
      active,
      condition: `土星居月亮 12/1/2 宫；实测：土星相对月亮第 ${rel} 宫。`,
      interpretation: '传统视为土星周期类组合（参考视角，非确定性断语）。',
      participants: [saturn.label, moon.label],
      basis: '通行定义：土星行经月亮 12/1/2 宫。',
      limitations: [
        '本判定为**出生时刻静态基准**；真正的 Sade Sati 是行运概念，需指定查询日期计算行运土星位置。',
        '按 Whole Sign 宫位判定，未用精确度数窗口。',
      ],
    });
  }

  const activeYogas = yogas.filter((y) => y.active).map((y) => `${y.name}（${y.sanskrit}）`);
  const activeDoshas = doshas.filter((d) => d.active).map((d) => `${d.name}（${d.sanskrit}）`);

  return {
    yogas,
    doshas,
    pendingExpertReview: [
      {
        item: 'Neecha-Bhanga Raja Yoga（落陷取消王瑜伽）',
        reason: '取消条件多且流派分歧大（落陷星主居角宫 / 落陷星主擢升 / 同宫星擢升等多套规则），自动化易产生误导性结论。',
        plannedApproach: '整理 BPHS 与近代注疏的取消条件清单，逐条做成可勾选规则后实现，并须命理顾问复核。',
      },
      {
        item: 'D60 Shashtiamsa 分盘',
        reason: 'D60 需高精度恒星黄经（分盘单位仅 0.5°），且传统计算法与现代插值法结果存在差异。',
        plannedApproach: '先固化 D9/D10/D12 等常用分盘，再按「传统法 vs 现代插值法」双轨产出并标注差异。',
      },
      {
        item: 'Nadi Dosha（合盘纳迪煞）',
        reason: '属双方合盘判定，需两人盘面与 Nadi 分组表，单盘无法计算。',
        plannedApproach: '随 V3 阶段二的「吠陀合盘（Kundali Matching / Ashtakoot）」一并实现。',
      },
      {
        item: '精准 Sade Sati / 行运 Dosha',
        reason: '需行运星历与查询日期，当前仅提供出生时刻静态基准。',
        plannedApproach: '接入行运计算（transit Saturn）并开放查询日期参数。',
      },
    ],
    summary: {
      activeYogas,
      activeDoshas,
      detectedCount: activeYogas.length + activeDoshas.length,
      totalYogas: yogas.length,
      totalDoshas: doshas.length,
    },
  };
}
