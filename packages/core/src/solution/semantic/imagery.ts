/**
 * 命律 · 意象词典（R3-12 · 任务2）
 *
 * 依据：特色论证2 共识 v2.0 · 系统6「概念隐喻」
 * - 术语 → 身体感知词 → 场景化语句
 * - 每个意象必须标注「目标身体感受」（body_target），散文诗靠它做身体锚定
 *
 * 约定：
 * 1. 键为十神 ID（与 archetypes.ts / TEN_GOD_REGISTRY 同源）；
 * 2. 每个十神 ≥5 条意象（实际 6 条：4 safe + 2 caution）；
 * 3. body_target 必须是可感知的身体部位 + 状态（胸口紧绷 / 肩背用力 …），禁写心理形容词；
 * 4. cultural_safety = 'caution' 的意象进散文诗须配降级措辞（「需注意、可借力」）。
 */
import type { ArchetypeDomain, CulturalSafety, ForbiddenContext } from './archetype_types';
import type { TenGodId } from './archetypes';
import { normalizeShishenId } from './archetypes';

// ============================================================
// 1. 类型定义
// ============================================================

/** 意象词条 */
export interface ImageryEntry {
  /** 意象，如 '未出鞘的刀' */
  image: string;
  /** 目标身体感受，如 '胸口紧绷，蓄势待发' */
  body_target: string;
  /** 文化安全分级 */
  cultural_safety: CulturalSafety;
  /** 适用领域 */
  suitable_domains: ArchetypeDomain[];
  /** 额外禁忌语境（可叠加十神级 forbidden_contexts） */
  forbidden_contexts?: ForbiddenContext[];
}

/** 意象筛选条件 */
export interface ImageryQuery {
  /** 限定领域（命中任一即通过；空 = 不限） */
  domains?: ArchetypeDomain[];
  /** 限定文化分级（空 = 不限，默认排除 forbidden） */
  safety?: CulturalSafety[];
  /** 当前语境（命中任一条目 forbidden_contexts 即排除） */
  context?: ForbiddenContext | string;
}

// ============================================================
// 2. 全局禁忌意象（任何语境不得输出）
// ============================================================

/**
 * 情绪安全熔断词表：死亡 / 血光 / 离散 / 崩溃类意象
 * 共识 v2.0：高负极性只转写为「需注意、可借力」，禁用恐惧意象。
 */
export const FORBIDDEN_IMAGERY: string[] = [
  '死亡',
  '坟墓',
  '棺木',
  '血光',
  '绝症',
  '断指',
  '大祸',
  '灭顶',
  '家破人亡',
  '生离死别',
  '破产清算',
  '绝路',
];

// ============================================================
// 3. 词典（10 个十神 × 6 条）
// ============================================================

export const IMAGERY_DICTIONARY: Record<TenGodId, ImageryEntry[]> = {
  QS: [
    {
      image: '未出鞘的刀',
      body_target: '胸口紧绷，蓄势待发',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'mind'],
    },
    {
      image: '铁与盐的气味',
      body_target: '鼻腔发涩，警觉上提',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'decision'],
    },
    {
      image: '逆风中的旗帜',
      body_target: '肩背用力，不肯后退',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'career'],
    },
    {
      image: '城墙上的哨兵',
      body_target: '后背挺直，孤独但清醒',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'mind'],
    },
    {
      image: '淬火中的钢',
      body_target: '皮肤灼热，正在被重塑',
      cultural_safety: 'caution',
      suitable_domains: ['mind'],
    },
    {
      image: '悬崖边的窄桥',
      body_target: '胃部收紧，脚下发虚',
      cultural_safety: 'caution',
      suitable_domains: ['decision', 'travel'],
    },
  ],
  ZG: [
    {
      image: '厅堂上的梁柱',
      body_target: '脊柱挺直，重心下沉',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'mind'],
    },
    {
      image: '落在纸上的官印',
      body_target: '掌心发热，责任压肩',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'decision'],
    },
    {
      image: '一级一级的石阶',
      body_target: '大腿发力，步子踏实',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'wealth'],
    },
    {
      image: '清晨六点的光',
      body_target: '眉心舒展，呼吸放慢',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'health'],
    },
    {
      image: '系紧的领口',
      body_target: '喉咙发紧，不敢出声',
      cultural_safety: 'caution',
      suitable_domains: ['mind', 'career'],
    },
    {
      image: '数不清的表格',
      body_target: '眼睛发干，肩颈僵硬',
      cultural_safety: 'caution',
      suitable_domains: ['career', 'health'],
    },
  ],
  ZY: [
    {
      image: '掌心里的土',
      body_target: '掌心温厚，被托住',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'parents'],
    },
    {
      image: '春雨落在瓦上',
      body_target: '后颈放松，呼吸变长',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'health'],
    },
    {
      image: '炉边的旧椅子',
      body_target: '四肢回暖，想坐下来',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'relationship'],
    },
    {
      image: '书架上的一盏灯',
      body_target: '眼底发亮，视线柔和',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'career'],
    },
    {
      image: '涨到脚踝的水',
      body_target: '脚背发凉，行动变钝',
      cultural_safety: 'caution',
      suitable_domains: ['decision', 'travel'],
    },
    {
      image: '裹得太紧的被子',
      body_target: '胸口发闷，想挣一下',
      cultural_safety: 'caution',
      suitable_domains: ['mind', 'career'],
    },
  ],
  PY: [
    {
      image: '凌晨的雾',
      body_target: '视线发虚，听觉变尖',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'decision'],
    },
    {
      image: '水下的暗流',
      body_target: '腹部沉坠，说不出话',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'health'],
    },
    {
      image: '井底的反光',
      body_target: '低头久视，后颈发凉',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'career'],
    },
    {
      image: '转不出去的走廊',
      body_target: '脚步放轻，呼吸变浅',
      cultural_safety: 'safe',
      suitable_domains: ['decision', 'mind'],
    },
    {
      image: '半片月亮',
      body_target: '眼眶发酸，心口发空',
      cultural_safety: 'caution',
      suitable_domains: ['relationship', 'mind'],
    },
    {
      image: '没有窗的房间',
      body_target: '胸口压闷，想推开门',
      cultural_safety: 'caution',
      suitable_domains: ['mind', 'health'],
    },
  ],
  BJ: [
    {
      image: '两棵并排的树',
      body_target: '双腿站稳，肩膀放松',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'career'],
    },
    {
      image: '并肩走的路',
      body_target: '步幅一致，呼吸同频',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'career'],
    },
    {
      image: '两个人抬的木梁',
      body_target: '手臂发力，重心前移',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'parents'],
    },
    {
      image: '过河的木桥',
      body_target: '手掌扶栏，脚下试探',
      cultural_safety: 'safe',
      suitable_domains: ['decision', 'travel'],
    },
    {
      image: '一根单独的枝',
      body_target: '手臂发空，握不实在',
      cultural_safety: 'caution',
      suitable_domains: ['relationship', 'mind'],
    },
    {
      image: '抢同一块地',
      body_target: '下颌收紧，语速变快',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'career'],
    },
  ],
  JC: [
    {
      image: '突然起的一阵疾风',
      body_target: '前额发凉，心跳加快',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'decision'],
    },
    {
      image: '出鞘的利刃',
      body_target: '手掌发热，指尖发麻',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'decision'],
    },
    {
      image: '迎面来的浪',
      body_target: '胸腔被推，屏住呼吸',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'travel'],
    },
    {
      image: '冲刺的最后十米',
      body_target: '大腿发酸，牙关咬紧',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'health'],
    },
    {
      image: '脚下的泥潭',
      body_target: '小腿发沉，拔不出来',
      cultural_safety: 'caution',
      suitable_domains: ['health', 'wealth'],
    },
    {
      image: '转下去的漩涡',
      body_target: '头晕目眩，方向感丢失',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'decision'],
    },
  ],
  SS: [
    {
      image: '三月的春风',
      body_target: '脸颊发暖，胸口松开',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'relationship'],
    },
    {
      image: '灶上的一锅汤',
      body_target: '胃部发热，想分给别人',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'parents'],
    },
    {
      image: '弹到一半的琴',
      body_target: '手指发痒，指尖轻快',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'career'],
    },
    {
      image: '桌上没吃完的果子',
      body_target: '舌尖生津，心情变软',
      cultural_safety: 'safe',
      suitable_domains: ['health', 'relationship'],
    },
    {
      image: '半夜还亮着的灯',
      body_target: '眼睛发涩，还想再写一点',
      cultural_safety: 'caution',
      suitable_domains: ['health', 'mind'],
    },
    {
      image: '空掉的碗',
      body_target: '胃部抽紧，心里发慌',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'health'],
    },
  ],
  SG: [
    {
      image: '烧过一片的野火',
      body_target: '面部发烫，心跳顶上来',
      cultural_safety: 'safe',
      suitable_domains: ['career', 'mind'],
    },
    {
      image: '划开夜空的闪电',
      body_target: '瞳孔收缩，瞬间清醒',
      cultural_safety: 'safe',
      suitable_domains: ['decision', 'career'],
    },
    {
      image: '没写完的狂草',
      body_target: '手腕发酸，越写越快',
      cultural_safety: 'safe',
      suitable_domains: ['mind', 'career'],
    },
    {
      image: '未封口的信',
      body_target: '指尖发凉，舌抵上颚',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'mind'],
    },
    {
      image: '一把削自己的刀',
      body_target: '眉心发紧，越想越疼',
      cultural_safety: 'caution',
      suitable_domains: ['mind', 'relationship'],
    },
    {
      image: '被按住的肩膀',
      body_target: '肩膀下沉，喉咙发堵',
      cultural_safety: 'caution',
      suitable_domains: ['career', 'mind'],
    },
  ],
  ZC: [
    {
      image: '一块翻过的田',
      body_target: '手掌粗糙，腰部发力',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'career'],
    },
    {
      image: '装满的粮仓',
      body_target: '腹部安稳，呼吸放长',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'mind'],
    },
    {
      image: '一条稳定的溪流',
      body_target: '小腿放松，脚步不快',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'health'],
    },
    {
      image: '结在枝上的果子',
      body_target: '手心发痒，想摘下来',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'children'],
    },
    {
      image: '数了很多遍的钱袋',
      body_target: '手指发紧，眼睛发干',
      cultural_safety: 'caution',
      suitable_domains: ['mind', 'wealth'],
    },
    {
      image: '淤住的河道',
      body_target: '胸口发闷，气不顺',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'health'],
    },
  ],
  PC: [
    {
      image: '露头的金矿',
      body_target: '掌心出汗，瞳孔放大',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'career'],
    },
    {
      image: '远处的商船',
      body_target: '视线拉长，脚想往前走',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'travel'],
    },
    {
      image: '雨后的彩虹',
      body_target: '胸口敞开，想笑一下',
      cultural_safety: 'safe',
      suitable_domains: ['wealth', 'mind'],
    },
    {
      image: '别人递来的一杯酒',
      body_target: '喉咙发热，话变多',
      cultural_safety: 'safe',
      suitable_domains: ['relationship', 'wealth'],
    },
    {
      image: '阳光下的泡沫',
      body_target: '眼睛发花，一碰就破',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'decision'],
    },
    {
      image: '亮着灯的赌场',
      body_target: '心跳加速，手心发痒',
      cultural_safety: 'caution',
      suitable_domains: ['wealth', 'decision'],
    },
  ],
};

// ============================================================
// 4. 查询与校验
// ============================================================

/** 全局禁忌意象集合（判定用） */
const FORBIDDEN_IMAGERY_SET = new Set(FORBIDDEN_IMAGERY);

/** 单条意象是否允许在当前语境输出 */
export function isImageryAllowed(
  image: string,
  entry?: ImageryEntry,
  context?: ForbiddenContext | string,
): boolean {
  if (FORBIDDEN_IMAGERY_SET.has(image)) return false;
  if (!entry) return true;
  if (entry.cultural_safety === 'forbidden') return false;
  if (context && entry.forbidden_contexts?.includes(context as ForbiddenContext)) return false;
  return true;
}

/**
 * 取某十神的意象列表（可按领域 / 分级 / 语境过滤）
 * @param shishenId 'QS' / 'qi_sha' / '七杀'
 */
export function listImagery(shishenId: string, query: ImageryQuery = {}): ImageryEntry[] {
  const id = normalizeShishenId(shishenId) as TenGodId | undefined;
  if (!id) return [];

  const pool = IMAGERY_DICTIONARY[id] ?? [];
  const allowSafety = query.safety ?? (['safe', 'caution'] as CulturalSafety[]);

  return pool.filter((e) => {
    if (!allowSafety.includes(e.cultural_safety)) return false;
    if (!isImageryAllowed(e.image, e, query.context)) return false;
    if (query.domains?.length && !e.suitable_domains.some((d) => query.domains!.includes(d))) {
      return false;
    }
    return true;
  });
}

/** 按领域取意象（跨十神，供散文诗按领域配额取象） */
export function listImageryByDomain(domain: ArchetypeDomain): ImageryEntry[] {
  return Object.values(IMAGERY_DICTIONARY)
    .flat()
    .filter((e) => e.cultural_safety !== 'forbidden' && e.suitable_domains.includes(domain));
}

/** 词典自检：每十神 ≥5 条、body_target 非空、无禁忌意象混入 */
export function validateImageryDictionary(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [id, entries] of Object.entries(IMAGERY_DICTIONARY)) {
    if (entries.length < 5) errors.push(`${id} 意象不足 5 条（实际 ${entries.length}）`);
    for (const e of entries) {
      if (!e.image) errors.push(`${id} 存在空意象名`);
      if (!e.body_target) errors.push(`${id}/${e.image} 缺 body_target`);
      if (FORBIDDEN_IMAGERY_SET.has(e.image)) errors.push(`${id}/${e.image} 命中全局禁忌意象`);
      if (e.suitable_domains.length === 0) errors.push(`${id}/${e.image} 缺适用领域`);
    }
  }

  if (Object.keys(IMAGERY_DICTIONARY).length !== 10) {
    errors.push(`词典应覆盖 10 个十神，实际 ${Object.keys(IMAGERY_DICTIONARY).length}`);
  }

  return { ok: errors.length === 0, errors };
}
