/**
 * 命律 · Top50 术语注册表
 */
import type { TermSchema } from './types';
import { shangGuan } from './terms/shangGuan';
import { zhengGuan } from './terms/zhengGuan';
import { qiSha } from './terms/qiSha';
import { zhengYin } from './terms/zhengYin';
import { pianYin } from './terms/pianYin';
import { biJian } from './terms/biJian';
import { jieCai } from './terms/jieCai';
import { shiShen } from './terms/shiShen';
import { zhengCai } from './terms/zhengCai';
import { pianCai } from './terms/pianCai';
import { PALACE_REGISTRY } from './terms/palace';
import { WUXING_REGISTRY } from './terms/wuxing';
import { RELATION_REGISTRY } from './terms/relation';
import { YONGSHEN_REGISTRY } from './terms/yongshen';
import { SHENSHA_REGISTRY } from './terms/shensha';
import { STAR_REGISTRY } from './terms/star';
import { QIMEN_REGISTRY } from './terms/qimen';
import { LOTTERY_REGISTRY } from './terms/lottery';
import { LENORMAND_REGISTRY } from './terms/lenormand';
import { TAROT_REGISTRY } from './terms/tarot';

/** 十神（10 条） */
export const TEN_GOD_REGISTRY: Record<string, TermSchema> = {
  SG: shangGuan,
  ZG: zhengGuan,
  QS: qiSha,
  ZY: zhengYin,
  PY: pianYin,
  BJ: biJian,
  JC: jieCai,
  SS: shiShen,
  ZC: zhengCai,
  PC: pianCai,
};

/** 宫位（6 条） */
export { PALACE_REGISTRY };
/** 五行（5 条） */
export { WUXING_REGISTRY };
/** 关系（7 条） */
export { RELATION_REGISTRY };
/** 用神（4 条） */
export { YONGSHEN_REGISTRY };
/** 神煞（8 条） */
export { SHENSHA_REGISTRY };
/** 星曜（4 条） */
export { STAR_REGISTRY };
/** 奇门（3 条） */
export { QIMEN_REGISTRY };
/** 灵签（3 条） */
export { LOTTERY_REGISTRY };
/** 雷诺曼（36 张，LN 组；不并入 Top50） */
export { LENORMAND_REGISTRY };
/** 塔罗（78 张，TR 组；不并入 Top50） */
export { TAROT_REGISTRY };

/** Top50 完整注册表（50 条本体 + 塔罗 78 + 雷诺曼 36，共 164 条可检索术语） */
export const TOP50_REGISTRY: Record<string, TermSchema> = {
  ...TEN_GOD_REGISTRY,
  ...PALACE_REGISTRY,
  ...WUXING_REGISTRY,
  ...RELATION_REGISTRY,
  ...YONGSHEN_REGISTRY,
  ...SHENSHA_REGISTRY,
  ...STAR_REGISTRY,
  ...QIMEN_REGISTRY,
  ...LOTTERY_REGISTRY,
  ...TAROT_REGISTRY,
  ...LENORMAND_REGISTRY,
};

/** 十神中文名映射 */
export const TEN_GOD_NAMES: Record<string, string> = {
  SG: '伤官',
  ZG: '正官',
  QS: '七杀',
  ZY: '正印',
  PY: '偏印',
  BJ: '比肩',
  JC: '劫财',
  SS: '食神',
  ZC: '正财',
  PC: '偏财',
};

// ============================================================
// 解盘主入口导出
// ============================================================

export { runSolution, type SolutionInput, type UserProfile } from './solution';
export type { SolutionOutput, PathOutput, DisplayVariant } from './api';

// ============================================================
// R3-12 双轨原型 + 意象词典
// ============================================================

export {
  ARCHETYPE_MAPPINGS,
  ARCHETYPE_BY_SHISHEN,
  TEN_GOD_ID_LIST,
  normalizeShishenId,
  getArchetypeMapping,
  validateArchetypeMappings,
  type ArchetypeMapping,
  type ArchetypeTrack,
  type LifecycleEvolution,
  type TenGodId,
} from './archetypes';

export {
  ARCHETYPE_DOMAINS,
  DOMAIN_LABELS,
  FORBIDDEN_CONTEXTS,
  FORBIDDEN_CONTEXT_LABELS,
  type ArchetypeDomain,
  type ForbiddenContext,
  type CulturalSafety,
} from './archetype_types';

export {
  IMAGERY_DICTIONARY,
  FORBIDDEN_IMAGERY,
  listImagery,
  listImageryByDomain,
  isImageryAllowed,
  validateImageryDictionary,
  type ImageryEntry,
  type ImageryQuery,
} from './imagery';

export {
  selectArchetype,
  selectArchetypes,
  listAllArchetypes,
  DEFAULT_TRACK,
  type ArchetypeResult,
  type ArchetypeSelectorProfile,
  type ArchetypeActivation,
  type ArchetypeState,
  type ArchetypeTrackKey,
  type Strength,
  type UseType,
} from './archetype_select';
