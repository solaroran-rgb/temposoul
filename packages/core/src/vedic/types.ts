/**
 * @file 吠陀占星输入/输出数据契约（对齐 AstrolabeBirthInput / AstrolabeData 风格）
 */
import type { EvidenceTrail } from '../shared/evidence';
import type { VedicAyanamsaInfo } from './ayanamsa';
import type { VimshottariResult } from './vimshottari';

export type VedicGender = '男' | '女' | '不确定';
export type VedicNodeMode = 'mean' | 'true';
export type VedicChartStyle = 'north' | 'south';

/** 吠陀排盘输入（字段风格对齐 AstrolabeBirthInput：字符串数值 + 时区二选一） */
export interface VedicBirthInput {
  name: string;
  gender: VedicGender;
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  /** 十进制度，南纬为负 */
  latitude: string;
  /** 十进制度，西经为负 */
  longitude: string;
  /** 与 timeZoneId 二选一 */
  timezone?: string;
  /** IANA 时区名，如 Asia/Kolkata */
  timeZoneId?: string;
  /** true 时仅附加真太阳时证据，不参与排盘瞬间 */
  useTrueSolarTime?: boolean;
  /** 岁差体系，Phase1 仅 Lahiri */
  ayanamsa?: 'lahiri';
  /** 罗睺计都交点模式，默认 mean（吠陀传统） */
  nodeMode?: VedicNodeMode;
  /** 星盘布局元数据，默认 north */
  chartStyle?: VedicChartStyle;
  locationName?: string;
}

/** 单个吠陀点（Lagna / 九曜同构） */
export interface VedicPoint {
  /** 英文键：Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn/Rahu/Ketu/Lagna */
  name: string;
  /** 中文标签：太阳/月亮/…/罗睺/计都/上升 */
  label: string;
  /** 梵名：Surya/Chandra/… */
  sanskrit: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  /** 如 "Mesha / 白羊" */
  rashi: string;
  rashiIndex: number;
  /** 宫内度数 0–30 */
  degreeInRashi: number;
  nakshatra: string;
  nakshatraIndex: number;
  pada: 1 | 2 | 3 | 4;
  /** Whole Sign 宫位 1–12 */
  bhava: number;
  retrograde: boolean;
  /** 如 "Mesha 12°34′" */
  formatted: string;
}

export interface VedicBirthMoonNakshatra {
  name: string;
  sanskrit: string;
  pada: 1 | 2 | 3 | 4;
  lord: string;
  lordLabel: string;
  /** 本宿已过比例 0..1 */
  balance: number;
}

export interface VedicBirthBlock {
  name: string;
  gender: VedicGender;
  dateTime: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: number;
  timeZoneId?: string;
  astronomicalTime?: unknown;
}

/** 分盘中单个点的落位（D9 等） */
export interface VedicVargaPlacement {
  /** Sun/Moon/…/Rahu/Ketu/Lagna */
  name: string;
  label: string;
  sanskrit: string;
  /** 如 "Mesha / 白羊" */
  rashi: string;
  rashiIndex: number;
  /** 本分盘星座内第几个 Navamsa（0..8） */
  navamsaInSign: number;
}

/** 一张分盘（D1/D9） */
export interface VedicVarga {
  name: 'D1' | 'D9';
  label: string;
  placements: VedicVargaPlacement[];
}

/** 吠陀排盘输出（Phase2：D1 骨架 + D9 Navamsa + Vimshottari 起算；Yoga·Dosha 留后续） */
export interface VedicData {
  birth: VedicBirthBlock;
  ayanamsa: VedicAyanamsaInfo;
  lagna: VedicPoint;
  grahas: VedicPoint[];
  nakshatra: {
    birthMoon: VedicBirthMoonNakshatra;
  };
  chartLayout: {
    style: VedicChartStyle;
    lagnaRashi: string;
    /** P2 预留：北印/南印方格格位坐标 */
    cells?: unknown[];
  };
  /** Phase2：Vimshottari 大运起算（Mahadasha + Antardasha） */
  vimshottari?: VimshottariResult;
  /** Phase2：D1 本命 + D9 Navamsa 分盘 */
  vargas?: {
    D1: VedicVarga;
    D9?: VedicVarga;
  };
  /** Yoga 判定（1.2-102）：含未命中条目与判定依据，便于页面「参数透明」 */
  yogas?: import('./yoga-dosha').VedicYogaFinding[];
  /** Dosha 判定（1.2-103）：含未命中条目与局限说明 */
  doshas?: import('./yoga-dosha').VedicDoshaFinding[];
  yogaDoshaSummary?: import('./yoga-dosha').VedicYogaDoshaResult['summary'];
  /** 需命理顾问终审的未实现条目（显式列出，不臆造） */
  yogaDoshaPendingReview?: import('./yoga-dosha').VedicYogaDoshaResult['pendingExpertReview'];
  /** 可直接交给在线 AI 的自包含排盘正文（与 qi_zheng / astrolabe 同构） */
  prompt?: string;
  evidenceTrail?: EvidenceTrail;
  timestamp: number;
}
