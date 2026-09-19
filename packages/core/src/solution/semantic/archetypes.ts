/**
 * 命律 · 双轨原型映射表（R3-12 · 任务1）
 *
 * 依据：特色论证2 四专家共识合成 v2.0 · 系统5「散文诗摘要」双轨原型系统
 * - 东方文化原型（高 NFC / 传统偏好）：侠客 / 将军 / 大儒 / 狂士 / 逆臣 …
 * - 动力学原型（低 NFC / 现代偏好）：破壁者 / 承压者 / 解构者 / 悖论体 …
 * - 生命周期三层：内核层（大运 ~10 年）/ 面向层（流年 1 年）/ 意象层（每次排盘）
 *
 * 约定：
 * 1. `shishen_id` 沿用现有 TEN_GOD_REGISTRY 的二字代码（archetypes 与 terms 同源，禁止另起一套 ID）；
 * 2. 每个轨道（Track）在任务卡字段基础上扩展出「旺为忌（shadow_*）」三字段，
 *    保证 `eastern_archetype.name` 等原字段路径不变（向后兼容，R3-13 直接可用）；
 * 3. `suitable_domains` 取值域与 R3-11 Canonical Factor Ontology 第一层 DOMAINS 对齐（12 域）。
 */
import type { ArchetypeDomain, ForbiddenContext } from './archetype_types';

// ============================================================
// 1. 类型定义
// ============================================================

/** 单轨原型（东方轨 / 动力学轨） */
export interface ArchetypeTrack {
  /** 旺为用 · 主原型名（如「侠客」） */
  name: string;
  /** 旺为用 · 原型描述 */
  description: string;
  /** 旺为用 · 适用领域 */
  suitable_domains: ArchetypeDomain[];
  /** 旺为忌 · 失衡态原型名（如「囚徒」） */
  shadow_name: string;
  /** 旺为忌 · 失衡态描述 */
  shadow_description: string;
  /** 旺为忌 · 适用领域 */
  shadow_domains: ArchetypeDomain[];
}

/** 原型生命周期演化（共识 v2.0 · 内核层 / 面向层 / 意象层） */
export interface LifecycleEvolution {
  /** 内核层（大运级 ~10 年）主导原型迁移，如 'breaker→forge_master' */
  dayun_shift: string;
  /** 面向层（流年级 1 年）状态序列，如 ['冲锋', '防守', '观察'] */
  liunian_shift: string[];
}

/** 单条十神双轨原型映射 */
export interface ArchetypeMapping {
  /** 十神 ID（与 TermSchema.id 同源，如 'QS'） */
  shishen_id: string;
  /** 十神中文名，如 '七杀' */
  shishen_name: string;
  /** 兼容别名（拼音 snake_case / 中文名），供外部以 'qi_sha' 或 '七杀' 传入 */
  aliases: string[];
  /** 东方文化原型（高 NFC / 传统偏好） */
  eastern_archetype: ArchetypeTrack;
  /** 动力学原型（低 NFC / 现代偏好） */
  dynamic_archetype: ArchetypeTrack;
  /** 核心意象域（正向） */
  safe_imagery: string[];
  /** 反意象（警示） */
  caution_imagery: string[];
  /** 禁忌语境：命中即禁止输出意象化叙事 */
  forbidden_contexts: ForbiddenContext[];
  /** 原型演化 */
  lifecycle_evolution: LifecycleEvolution;
}

// ============================================================
// 2. 十神代码总表（与 TEN_GOD_REGISTRY 一致）
// ============================================================

export const TEN_GOD_ID_LIST = [
  'QS',
  'ZG',
  'ZY',
  'PY',
  'BJ',
  'JC',
  'SS',
  'SG',
  'ZC',
  'PC',
] as const;

export type TenGodId = (typeof TEN_GOD_ID_LIST)[number];

// ============================================================
// 3. 映射表（10 个十神）
// ============================================================

export const ARCHETYPE_MAPPINGS: ArchetypeMapping[] = [
  {
    shishen_id: 'QS',
    shishen_name: '七杀',
    aliases: ['qi_sha', '七杀', '偏官', 'pian_guan'],
    eastern_archetype: {
      name: '侠客',
      description: '破局担当，以义为先；压力越大，出手越准',
      suitable_domains: ['career', 'decision', 'mind'],
      shadow_name: '囚徒',
      shadow_description: '被压力反噬，长期紧绷却无处出手；以硬碰硬，伤己伤人',
      shadow_domains: ['health', 'mind', 'relationship'],
    },
    dynamic_archetype: {
      name: '破壁者',
      description: '打破边界，突破限制；把外部阻力当成推进燃料',
      suitable_domains: ['career', 'decision', 'timing'],
      shadow_name: '承压者',
      shadow_description: '长期高负荷运转，靠意志硬撑；表面稳，内里持续透支',
      shadow_domains: ['health', 'mind', 'career'],
    },
    safe_imagery: ['风暴', '铁器', '悬崖', '破晓', '逆风旗帜'],
    caution_imagery: ['温室', '摇篮', '妥协', '安逸'],
    forbidden_contexts: ['health_crisis', 'grief', 'acute_crisis'],
    lifecycle_evolution: {
      dayun_shift: 'breaker→forge_master',
      liunian_shift: ['冲锋', '防守', '观察'],
    },
  },
  {
    shishen_id: 'ZG',
    shishen_name: '正官',
    aliases: ['zheng_guan', '正官'],
    eastern_archetype: {
      name: '栋梁',
      description: '守位尽责，以秩序立身；担得起事，也扛得住名',
      suitable_domains: ['career', 'decision', 'mind'],
      shadow_name: '囚笼',
      shadow_description: '被规则困住，把「应该」活成了「只能」；处处合规，处处无力',
      shadow_domains: ['mind', 'career', 'relationship'],
    },
    dynamic_archetype: {
      name: '秩序构建者',
      description: '用规则降低摩擦，把混乱整理成可推进的结构',
      suitable_domains: ['career', 'timing', 'decision'],
      shadow_name: '规则受害者',
      shadow_description: '把外部标准当成唯一标尺，长期自我审查、不敢越线',
      shadow_domains: ['mind', 'health', 'career'],
    },
    safe_imagery: ['梁柱', '官印', '阶梯', '晨光'],
    caution_imagery: ['牢笼', '铁链', '压抑'],
    forbidden_contexts: ['legal_dispute', 'grief'],
    lifecycle_evolution: {
      dayun_shift: 'architect→lawgiver',
      liunian_shift: ['立规', '守成', '校准'],
    },
  },
  {
    shishen_id: 'ZY',
    shishen_name: '正印',
    aliases: ['zheng_yin', '正印'],
    eastern_archetype: {
      name: '大儒',
      description: '以学养身，以德润人；先立根基，再谈外显',
      suitable_domains: ['mind', 'parents', 'career'],
      shadow_name: '慈母多败儿',
      shadow_description: '庇护过度，反而消解了成长所需的摩擦力',
      shadow_domains: ['mind', 'career', 'health'],
    },
    dynamic_archetype: {
      name: '滋养者',
      description: '稳定供给能量与安全感，让成长有底气发生',
      suitable_domains: ['mind', 'relationship', 'parents'],
      shadow_name: '过度保护者',
      shadow_description: '以照顾之名收缩他人空间，自己也困在「必须被需要」里',
      shadow_domains: ['relationship', 'mind', 'children'],
    },
    safe_imagery: ['大地', '春雨', '炉火', '书架', '灯'],
    caution_imagery: ['洪水', '溺爱', '窒息'],
    forbidden_contexts: ['health_crisis', 'acute_crisis'],
    lifecycle_evolution: {
      dayun_shift: 'nurturer→teacher',
      liunian_shift: ['养', '授', '放'],
    },
  },
  {
    shishen_id: 'PY',
    shishen_name: '偏印',
    aliases: ['pian_yin', '偏印', '枭神', 'xiao_shen'],
    eastern_archetype: {
      name: '奇士',
      description: '走偏门而通幽微，以非常之法解非常之局',
      suitable_domains: ['mind', 'decision', 'career'],
      shadow_name: '孤客',
      shadow_description: '独来独往成为惯性，洞察变成不相信任何人',
      shadow_domains: ['relationship', 'mind', 'health'],
    },
    dynamic_archetype: {
      name: '内省者',
      description: '向内深潜，从暗处打捞被忽略的信息与直觉',
      suitable_domains: ['mind', 'decision', 'timing'],
      shadow_name: '能量黑洞',
      shadow_description: '长期内耗与过度思虑，独处变成消耗而非补给',
      shadow_domains: ['health', 'mind', 'career'],
    },
    safe_imagery: ['迷雾', '暗流', '枯井', '迷宫', '月光'],
    caution_imagery: ['坦途', '烈日', '清泉'],
    forbidden_contexts: ['grief', 'acute_crisis', 'health_crisis'],
    lifecycle_evolution: {
      dayun_shift: 'seer→hermit_master',
      liunian_shift: ['内观', '破译', '出关'],
    },
  },
  {
    shishen_id: 'BJ',
    shishen_name: '比肩',
    aliases: ['bi_jian', '比肩'],
    eastern_archetype: {
      name: '挚友',
      description: '并肩而立，同甘共苦；不越界，也不缺席',
      suitable_domains: ['relationship', 'career', 'mind'],
      shadow_name: '竞争者',
      shadow_description: '同路变同争，把并肩的人当成要超越的对象',
      shadow_domains: ['relationship', 'wealth', 'career'],
    },
    dynamic_archetype: {
      name: '同行者',
      description: '用对等关系互相确认与推进，各走各的路，同向而行',
      suitable_domains: ['relationship', 'career', 'mind'],
      shadow_name: '资源争夺者',
      shadow_description: '在有限资源里零和博弈，信任成本被反复抬高',
      shadow_domains: ['wealth', 'relationship', 'career'],
    },
    safe_imagery: ['双木', '并肩', '桥梁', '同行'],
    caution_imagery: ['独枝', '孤峰'],
    forbidden_contexts: ['financial_ruin'],
    lifecycle_evolution: {
      dayun_shift: 'companion→co_founder',
      liunian_shift: ['结盟', '并行', '分立'],
    },
  },
  {
    shishen_id: 'JC',
    shishen_name: '劫财',
    aliases: ['jie_cai', '劫财'],
    eastern_archetype: {
      name: '猛将',
      description: '冲锋在前，先斩后奏；敢为人先，赢得也快',
      suitable_domains: ['career', 'decision', 'timing'],
      shadow_name: '劫匪',
      shadow_description: '把「抢」当成常态，短期得手，长期失守人情与秩序',
      shadow_domains: ['wealth', 'relationship', 'career'],
    },
    dynamic_archetype: {
      name: '突破者',
      description: '在僵局处开一条新路，用行动速度换可能性',
      suitable_domains: ['career', 'decision', 'travel'],
      shadow_name: '冲动消耗者',
      shadow_description: '以行动掩盖犹疑，能量与资源在反复启动中被烧掉',
      shadow_domains: ['wealth', 'health', 'mind'],
    },
    safe_imagery: ['疾风', '利刃', '浪潮', '冲刺'],
    caution_imagery: ['泥潭', '漩涡', '沉船'],
    forbidden_contexts: ['financial_ruin', 'legal_dispute'],
    lifecycle_evolution: {
      dayun_shift: 'vanguard→quartermaster',
      liunian_shift: ['抢攻', '回撤', '重整'],
    },
  },
  {
    shishen_id: 'SS',
    shishen_name: '食神',
    aliases: ['shi_shen', '食神'],
    eastern_archetype: {
      name: '才子',
      description: '以闲养才，以乐生味；不争而自有福泽',
      suitable_domains: ['mind', 'relationship', 'health'],
      shadow_name: '贪欢',
      shadow_description: '沉在舒服里不动，才华停在「有」而不成「事」',
      shadow_domains: ['career', 'health', 'wealth'],
    },
    dynamic_archetype: {
      name: '表达者',
      description: '把内在感受转成作品与分享，让能量自然流动',
      suitable_domains: ['mind', 'career', 'relationship'],
      shadow_name: '享乐主义者',
      shadow_description: '以愉悦代替推进，遇到必须收口的硬事就绕开',
      shadow_domains: ['career', 'wealth', 'health'],
    },
    safe_imagery: ['春风', '花', '美酒', '琴声', '美食'],
    caution_imagery: ['寒风', '枯草', '饥饿'],
    forbidden_contexts: ['health_crisis'],
    lifecycle_evolution: {
      dayun_shift: 'artist→patron',
      liunian_shift: ['抒写', '分享', '沉淀'],
    },
  },
  {
    shishen_id: 'SG',
    shishen_name: '伤官',
    aliases: ['shang_guan', '伤官'],
    eastern_archetype: {
      name: '狂士',
      description: '不受成法拘束，敢说敢写；锐气所至，规矩自破',
      suitable_domains: ['mind', 'career', 'decision'],
      shadow_name: '逆臣',
      shadow_description: '拆解成为唯一技能，破了却没能力立，代价由关系与位置来付',
      shadow_domains: ['career', 'relationship', 'mind'],
    },
    dynamic_archetype: {
      name: '解构者',
      description: '看穿结构与假设，把旧框架拆开重装成更利落的版本',
      suitable_domains: ['mind', 'career', 'decision'],
      shadow_name: '悖论体',
      shadow_description: '一边渴望被理解，一边亲手推开来理解自己的人',
      shadow_domains: ['relationship', 'mind', 'health'],
    },
    safe_imagery: ['野火', '闪电', '狂草', '利刃', '未封口的信'],
    caution_imagery: ['枷锁', '静水', '规矩', '牢笼'],
    forbidden_contexts: ['legal_dispute', 'grief'],
    lifecycle_evolution: {
      dayun_shift: 'deconstructor→reformer',
      liunian_shift: ['破题', '立论', '重写'],
    },
  },
  {
    shishen_id: 'ZC',
    shishen_name: '正财',
    aliases: ['zheng_cai', '正财'],
    eastern_archetype: {
      name: '田主',
      description: '一分耕耘一分收成，慢而实；守住根基，枝自有果',
      suitable_domains: ['wealth', 'career', 'parents'],
      shadow_name: '守财奴',
      shadow_description: '把「不失」当成唯一目标，越守越窄，越窄越慌',
      shadow_domains: ['mind', 'relationship', 'health'],
    },
    dynamic_archetype: {
      name: '积累者',
      description: '用可复利的方式堆叠成果，耐心换确定性',
      suitable_domains: ['wealth', 'career', 'timing'],
      shadow_name: '吝啬者',
      shadow_description: '把资源抓得太死，失去流动带来的新机会',
      shadow_domains: ['wealth', 'relationship', 'mind'],
    },
    safe_imagery: ['田地', '仓库', '溪流', '果实'],
    caution_imagery: ['洪水', '流沙', '虚空'],
    forbidden_contexts: ['financial_ruin'],
    lifecycle_evolution: {
      dayun_shift: 'builder→steward',
      liunian_shift: ['播种', '守仓', '再投'],
    },
  },
  {
    shishen_id: 'PC',
    shishen_name: '偏财',
    aliases: ['pian_cai', '偏财'],
    eastern_archetype: {
      name: '商贾',
      description: '走四方、识行情；以信立市，以利通人',
      suitable_domains: ['wealth', 'travel', 'relationship'],
      shadow_name: '赌徒',
      shadow_description: '把运气当能力，赢时加码，输时加倍',
      shadow_domains: ['wealth', 'decision', 'health'],
    },
    dynamic_archetype: {
      name: '机会捕捉者',
      description: '对缝隙里的机会保持敏感，看得准也收得快',
      suitable_domains: ['wealth', 'timing', 'career'],
      shadow_name: '投机者',
      shadow_description: '在不同机会间频繁跳跃，落不了地，也留不住果实',
      shadow_domains: ['wealth', 'mind', 'career'],
    },
    safe_imagery: ['金矿', '商船', '彩虹', '意外之喜'],
    caution_imagery: ['泡沫', '幻影', '赌场', '悬崖'],
    forbidden_contexts: ['financial_ruin'],
    lifecycle_evolution: {
      dayun_shift: 'trader→patron',
      liunian_shift: ['出击', '结算', '蛰伏'],
    },
  },
];

// ============================================================
// 4. 索引与查询
// ============================================================

/** 按十神 ID 索引 */
export const ARCHETYPE_BY_SHISHEN: Record<string, ArchetypeMapping> = Object.fromEntries(
  ARCHETYPE_MAPPINGS.map((m) => [m.shishen_id, m]),
);

/** 别名 → 十神 ID（含中文名与拼音，兼容任务卡 'qi_sha' 写法） */
const ALIAS_TO_ID: Record<string, string> = Object.fromEntries(
  ARCHETYPE_MAPPINGS.flatMap((m) => [
    [m.shishen_id, m.shishen_id],
    [m.shishen_name, m.shishen_id],
    ...m.aliases.map((a) => [a, m.shishen_id] as [string, string]),
  ]),
);

/**
 * 归一化十神标识：接受 'QS' / 'qi_sha' / '七杀' 三种写法
 * @returns 十神 ID，无法识别返回 undefined
 */
export function normalizeShishenId(input: string): string | undefined {
  if (!input) return undefined;
  const key = input.trim().toLowerCase();
  return ALIAS_TO_ID[key] ?? ALIAS_TO_ID[input.trim()];
}

/** 取单条映射（支持三种 ID 写法） */
export function getArchetypeMapping(shishenId: string): ArchetypeMapping | undefined {
  const id = normalizeShishenId(shishenId);
  return id ? ARCHETYPE_BY_SHISHEN[id] : undefined;
}

/** 映射表自检：数量 / 必填项 / 意象域下限（不通过抛错，供测试与 CI 调用） */
export function validateArchetypeMappings(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const id of TEN_GOD_ID_LIST) {
    if (!ARCHETYPE_BY_SHISHEN[id]) errors.push(`缺少十神映射：${id}`);
  }
  if (ARCHETYPE_MAPPINGS.length !== TEN_GOD_ID_LIST.length) {
    errors.push(`映射条数应为 ${TEN_GOD_ID_LIST.length}，实际 ${ARCHETYPE_MAPPINGS.length}`);
  }

  for (const m of ARCHETYPE_MAPPINGS) {
    for (const track of ['eastern_archetype', 'dynamic_archetype'] as const) {
      const t = m[track];
      if (!t.name || !t.description) errors.push(`${m.shishen_id}.${track} 缺主原型`);
      if (!t.shadow_name || !t.shadow_description)
        errors.push(`${m.shishen_id}.${track} 缺失衡态原型`);
      if (t.suitable_domains.length === 0) errors.push(`${m.shishen_id}.${track} 缺适用领域`);
    }
    if (m.safe_imagery.length < 4) errors.push(`${m.shishen_id} 正向意象不足 4 个`);
    if (m.caution_imagery.length < 2) errors.push(`${m.shishen_id} 反意象不足 2 个`);
    if (m.lifecycle_evolution.liunian_shift.length !== 3) {
      errors.push(`${m.shishen_id} 流年状态序列应为 3 段`);
    }
  }

  return { ok: errors.length === 0, errors };
}
