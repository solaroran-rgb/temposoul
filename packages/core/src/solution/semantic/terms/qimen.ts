/**
 * QM 奇门组 · 3 条
 * 青龙返首 / 飞鸟跌穴 / 白虎猖狂
 *
 * 字段绑定（R3 核验）：
 * - stemRelations[].pattern（命名格局「名：断语」，青龙返首/飞鸟跌穴/白虎猖狂均出自此）
 * - patternCombos[].name（复合格局：青龙返首利主 / 飞鸟跌穴利客 / 白虎助凶）
 * - jiuGongGe[i].renPan.door（九宫人盘门）
 * - jiuGongGe[i].tianPan.star（九宫天盘星）
 *
 * 说明：奇门三奇格局，青龙返首/飞鸟跌穴为吉格，白虎猖狂为凶格。
 */
import type { TermSchema } from '../types';

export const QIMEN_REGISTRY: Record<string, TermSchema> = {
  QLSF: {
    id: 'QLSF',
    name: '青龙返首',
    group: 'QM',
    factors: [
      { id: 'QLSF-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙返首'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'QLSF-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'QLSF-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙返首利主'] }], fieldBinding: ['patternCombos', 'stemRelations'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-QLSF-CHE', name: '青龙得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙返首'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-QLSF-PO', name: '青龙受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙返首'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-QLSF-CHE', pro: '青龙返首得势，吉格成象且门星落位，主事可成、利求财', mix: '你的奇门格局走到青龙返首的吉格，且门星落位，事能成、财得利', lay: '你现在撞上一个"回头再战就能赢"的好时机，行动求财都比较顺', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-QLSF-001' },
      { comboId: 'COMBO-QLSF-PO', pro: '青龙返首受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙返首，但门星受制，吉利打折', lay: '你撞上了好时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-QLSF-002' },
    ],
    dimTags: ['DIM_12'],
  },
  FNDC: {
    id: 'FNDC',
    name: '飞鸟跌穴',
    group: 'QM',
    factors: [
      { id: 'FNDC-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '飞鸟跌穴'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'FNDC-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'FNDC-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟跌穴利客'] }], fieldBinding: ['patternCombos', 'stemRelations'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-FNDC-CHE', name: '跌穴得势', trigger: [{ op: 'has', args: ['stemRelations', '飞鸟跌穴'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-FNDC-PO', name: '跌穴受制', trigger: [{ op: 'has', args: ['stemRelations', '飞鸟跌穴'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-FNDC-CHE', pro: '飞鸟跌穴得势，吉格成象且门星落位，主不费力而得', mix: '你的奇门格局走到飞鸟跌穴的吉格，且门星落位，事不费力而得', lay: '你现在撞上一个"捡着就行"的好时机，付出少回报大', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-FNDC-001' },
      { comboId: 'COMBO-FNDC-PO', pro: '飞鸟跌穴受制，吉格虽成而门星受制，所得打折', mix: '你的奇门格局走到飞鸟跌穴，但门星受制，所得打折', lay: '你撞上"捡着就行"的时机，但被卡了一下，到手会缩水', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-FNDC-002' },
    ],
    dimTags: ['DIM_12'],
  },
  BHCK: {
    id: 'BHCK',
    name: '白虎猖狂',
    group: 'QM',
    factors: [
      { id: 'BHCK-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '白虎猖狂'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'BHCK-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'BHCK-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白虎助凶'] }], fieldBinding: ['patternCombos', 'stemRelations'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-BHCK-XIANG', name: '白虎猖狂', trigger: [{ op: 'has', args: ['stemRelations', '白虎猖狂'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-BHCK-JU', name: '白虎受制', trigger: [{ op: 'has', args: ['stemRelations', '白虎猖狂'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-BHCK-XIANG', pro: '白虎猖狂成象且门星落位，主凶险、病灾、争执', mix: '你的奇门格局走到白虎猖狂的凶格，且门星落位，凶险偏重', lay: '你现在正撞上一个"凶"的时机，容易生是非、病灾、争执，宜静不宜动', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-BHCK-001' },
      { comboId: 'COMBO-BHCK-JU', pro: '白虎受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到白虎猖狂，但门星受制，凶势有缓冲', lay: '你撞上凶时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-BHCK-002' },
    ],
    dimTags: ['DIM_12'],
  },
};

/**
 * QM 奇门格局全量注册表 · 206 条（由源码三组格局清单生成，2026-09-19）
 *
 * 组成（实测，非照抄）：
 *   - SP###  83 条 · 天干组合格局（stem-pair-patterns.ts：80 命名 + 6 五行自动 − 3 已有）
 *   - CL###  48 条 · 经典格局（classic-patterns.ts）
 *   - CB###  75 条 · 复合格局（pattern-combos.ts）
 *   与上方 QIMEN_REGISTRY 3 条（青龙返首/飞鸟跌穴/白虎猖狂）合计 209 条。
 *
 * 字段绑定（R3 核验 · 按格局名实际所在字段分组，非统一挂 patternTags）：
 *   - stemRelations[].pattern      ← SP###（值为「格局名：断语」字符串）
 *   - classicPatterns[].name       ← CL###
 *   - patternCombos[].name         ← CB###
 *   - jiuGongGe[i].renPan.door / tianPan.star（门星落位，三组共用）
 *
 * 独立导出原因：并入 QIMEN_REGISTRY 会经 index.ts:64 的展开把 TOP50_REGISTRY
 * 从 50 条撑到 256 条，影响 solution.ts:50 的全量遍历。是否合并由架构层决定。
 */
export const QIMEN_ALL_PATTERN_REGISTRY: Record<string, TermSchema> = {
  SP001: {
    id: 'SP001',
    name: '比和',
    group: 'QM',
    factors: [
      { id: 'SP001-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '比和'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP001-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP001-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '比和'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP001-A', name: '比和成格', trigger: [{ op: 'has', args: ['stemRelations', '比和'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP001-B', name: '比和受制', trigger: [{ op: 'has', args: ['stemRelations', '比和'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP001-A', pro: '比和成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到比和，且门星落位，按部就班即可', lay: '盘面走到「比和」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP001-001' },
      { comboId: 'COMBO-SP001-B', pro: '比和受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到比和，但门星受制，力量打折', lay: '盘面有「比和」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP001-002' },
      { comboId: 'COMBO-SP001-A', pro: '比和（平格）', mix: '你的奇门格局出现「比和」，双方五行相同，能量协同稳定，无生克矛盾。适合维持现状、稳步推进的事项，不宜冒进或改变。', lay: '简单说：事情进展平稳，内外一致，无明显助力也无明显阻力，按部就班即可。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP001-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP002: {
    id: 'SP002',
    name: '冲',
    group: 'QM',
    factors: [
      { id: 'SP002-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '冲'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP002-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP002-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '冲'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP002-A', name: '冲成象', trigger: [{ op: 'has', args: ['stemRelations', '冲'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP002-B', name: '冲受制', trigger: [{ op: 'has', args: ['stemRelations', '冲'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP002-A', pro: '冲成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到冲的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP002-001' },
      { comboId: 'COMBO-SP002-B', pro: '冲受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到冲，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP002-002' },
      { comboId: 'COMBO-SP002-A', pro: '冲（凶格）', mix: '你的奇门格局出现「冲」，天盘主动克制地盘，代表外部力量强行改变内部结构。行动力强但带有破坏性，虽然有可能快速见效，但易损伤根基。适合需要果断突破的事项，但需注意后续影响。', lay: '简单说：做事雷厉风行但容易得罪人；主动出击可能短期内取胜，但长期可能有后遗症；宜把握好度，不可过度强势。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP002-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP003: {
    id: 'SP003',
    name: '受阻',
    group: 'QM',
    factors: [
      { id: 'SP003-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '受阻'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP003-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP003-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '受阻'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP003-A', name: '受阻成象', trigger: [{ op: 'has', args: ['stemRelations', '受阻'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP003-B', name: '受阻受制', trigger: [{ op: 'has', args: ['stemRelations', '受阻'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP003-A', pro: '受阻成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到受阻的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP003-001' },
      { comboId: 'COMBO-SP003-B', pro: '受阻受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到受阻，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP003-002' },
      { comboId: 'COMBO-SP003-A', pro: '受阻（凶格）', mix: '你的奇门格局出现「受阻」，地盘反克天盘，代表基础或内部因素制约外部行动。事情阻力主要来自内部环境、既有制度或下级配合，不易通过外部突破解决。宜先巩固内部再图进取，不可硬闯。', lay: '简单说：想做却做不了，受到环境、制度或人际关系的限制；如审批卡住、预算被砍、下级不配合；宜静不宜动，先理顺内部。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP003-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP004: {
    id: 'SP004',
    name: '泄',
    group: 'QM',
    factors: [
      { id: 'SP004-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '泄'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP004-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP004-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '泄'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP004-A', name: '泄成象', trigger: [{ op: 'has', args: ['stemRelations', '泄'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP004-B', name: '泄受制', trigger: [{ op: 'has', args: ['stemRelations', '泄'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP004-A', pro: '泄成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到泄的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP004-001' },
      { comboId: 'COMBO-SP004-B', pro: '泄受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到泄，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP004-002' },
      { comboId: 'COMBO-SP004-A', pro: '泄（凶格）', mix: '你的奇门格局出现「泄」，天盘主动生助地盘，代表外部能量流向内部，对天盘而言是消耗。付出多于回报，虽然未必全坏，但需要衡量投入产出比。适合公益、培养、投资等需要前期投入的事项。', lay: '简单说：付出较多而对方受益；短期来看自己吃亏，长期可能积累福报；需注意不要过度消耗自己，量力而行。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP004-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP005: {
    id: 'SP005',
    name: '生',
    group: 'QM',
    factors: [
      { id: 'SP005-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '生'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP005-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP005-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '生'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP005-A', name: '生得势', trigger: [{ op: 'has', args: ['stemRelations', '生'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP005-B', name: '生受制', trigger: [{ op: 'has', args: ['stemRelations', '生'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP005-A', pro: '生得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到生的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP005-001' },
      { comboId: 'COMBO-SP005-B', pro: '生受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到生，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP005-002' },
      { comboId: 'COMBO-SP005-A', pro: '生（吉格）', mix: '你的奇门格局出现「生」，地盘生助天盘，代表基础或内部因素滋养外部行动。做事有靠山、有资源支持，能够得到他人或环境的帮助。适合主动推进、大胆进取的事项。', lay: '简单说：有靠山或资源支持，做事顺遂；如上级支持、资金充足、团队配合好；宜乘势进取。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP005-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP006: {
    id: 'SP006',
    name: '平',
    group: 'QM',
    factors: [
      { id: 'SP006-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '平'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP006-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP006-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '平'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP006-A', name: '平成格', trigger: [{ op: 'has', args: ['stemRelations', '平'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP006-B', name: '平受制', trigger: [{ op: 'has', args: ['stemRelations', '平'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP006-A', pro: '平成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到平，且门星落位，按部就班即可', lay: '盘面走到「平」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP006-001' },
      { comboId: 'COMBO-SP006-B', pro: '平受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到平，但门星受制，力量打折', lay: '盘面有「平」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP006-002' },
      { comboId: 'COMBO-SP006-A', pro: '平（平格）', mix: '你的奇门格局出现「平」，暂无明确生克判断。', lay: '简单说：需结合其他宫位信息综合判断。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP006-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP007: {
    id: 'SP007',
    name: '青龙出地',
    group: 'QM',
    factors: [
      { id: 'SP007-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙出地'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP007-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP007-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙出地'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP007-A', name: '青龙出地得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙出地'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP007-B', name: '青龙出地受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙出地'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP007-A', pro: '青龙出地得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到青龙出地的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP007-001' },
      { comboId: 'COMBO-SP007-B', pro: '青龙出地受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙出地，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP007-002' },
      { comboId: 'COMBO-SP007-A', pro: '青龙出地（吉格）：六甲加甲为青龙出地；排盘时以甲子戊代甲，故戊加地盘戊按此格论，主喜信财至。', mix: '你的奇门格局出现「青龙出地」，青龙出地取甲木青龙从本位显现之象。甲在奇门中遁藏于六仪，甲子遁于戊，所以实际排盘遇到戊加戊时，按六甲加甲的传统克应处理。此格利消息、财物、贵人和旧资源重新出现；门星配合则喜信更实，门塞星凶则容易有名无实或消息迟滞。', lay: '简单说：好消息、财务线索或贵人资源浮现；如拖延的回复到来、款项有着落、旧项目重新启动，或原本埋着的机会开始露头。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP007-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP008: {
    id: 'SP008',
    name: '青龙入云',
    group: 'QM',
    factors: [
      { id: 'SP008-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙入云'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP008-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP008-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙入云'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP008-A', name: '青龙入云得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙入云'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP008-B', name: '青龙入云受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙入云'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP008-A', pro: '青龙入云得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到青龙入云的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP008-001' },
      { comboId: 'COMBO-SP008-B', pro: '青龙入云受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙入云，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP008-002' },
      { comboId: 'COMBO-SP008-A', pro: '青龙入云（吉格）：六甲加乙为青龙入云，三奇门交则名誉、文书、后继之喜可成。', mix: '你的奇门格局出现「青龙入云」，青龙入云取甲子戊青龙得乙日奇承接而上升之象。甲主生发、财喜和贵人，乙主文书、才名、协商和柔性资源。此格利名誉、申请、推荐、学习、孕育和后继安排；若星干不利，则容易只得虚名，实际落地不足。', lay: '简单说：名声、文书或后续机会向上打开；如申请被引荐、资质评价改善、学习成果被看见，或团队、子女、继任安排出现好苗头。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP008-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP009: {
    id: 'SP009',
    name: '青龙耀明',
    group: 'QM',
    factors: [
      { id: 'SP009-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙耀明'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP009-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP009-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙耀明'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP009-A', name: '青龙耀明得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙耀明'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP009-B', name: '青龙耀明受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙耀明'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP009-A', pro: '青龙耀明得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到青龙耀明的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP009-001' },
      { comboId: 'COMBO-SP009-B', pro: '青龙耀明受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙耀明，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP009-002' },
      { comboId: 'COMBO-SP009-A', pro: '青龙耀明（吉格）：六甲加丁为青龙耀明，三门合吉，宜谒贵人、改官迁职，主名声显达。', mix: '你的奇门格局出现「青龙耀明」，青龙耀明取丁星奇照临甲子戊青龙之象。戊代表甲子所遁的青龙根基，丁主文书、消息、灵光和细节照明。此格利求见贵人、职位调整、申报材料、名誉展示和以专业能力换取机会；若符使、门星失配，则文书差役、诉讼处分之象会转重。', lay: '简单说：贵人、职位或名誉事项被照亮；如得到面见机会、岗位调整、重要材料带来认可，或原本暗处的能力被看见。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP009-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP010: {
    id: 'SP010',
    name: '青龙合灵',
    group: 'QM',
    factors: [
      { id: 'SP010-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙合灵'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP010-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP010-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙合灵'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP010-A', name: '青龙合灵得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙合灵'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP010-B', name: '青龙合灵受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙合灵'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP010-A', pro: '青龙合灵得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到青龙合灵的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP010-001' },
      { comboId: 'COMBO-SP010-B', pro: '青龙合灵受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙合灵，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP010-002' },
      { comboId: 'COMBO-SP010-A', pro: '青龙合灵（吉格）：六甲加己为青龙合灵，吉星主财，吉门事成，星门不合则徒费精神。', mix: '你的奇门格局出现「青龙合灵」，青龙合灵取甲子戊青龙与己土地户相合之象。戊为甲子青龙、财喜和根基，己主内部、土地、责任和隐性资源。此格若同宫门星配合，适合求财、办事、修复内部资源和推进落地事项；若星门不合，则多为反复消耗、劳而少功。', lay: '简单说：资源与执行条件有机会合拢；如资金、场地、内部支持到位，项目可以落地，或旧资源经整理后重新可用。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP010-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP011: {
    id: 'SP011',
    name: '月奇浮云',
    group: 'QM',
    factors: [
      { id: 'SP011-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '月奇浮云'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP011-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP011-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇浮云'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP011-A', name: '月奇浮云得势', trigger: [{ op: 'has', args: ['stemRelations', '月奇浮云'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP011-B', name: '月奇浮云受制', trigger: [{ op: 'has', args: ['stemRelations', '月奇浮云'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP011-A', pro: '月奇浮云得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到月奇浮云的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP011-001' },
      { comboId: 'COMBO-SP011-B', pro: '月奇浮云受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到月奇浮云，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP011-002' },
      { comboId: 'COMBO-SP011-A', pro: '月奇浮云（吉格）：丙加地盘乙为月奇浮云，主印信可陈，公私利亨，百事称心。', mix: '你的奇门格局出现「月奇浮云」，月奇浮云取丙月奇得乙日奇柔木承载之象，光明可以借文书、印信、介绍和柔性资源铺开。此格利陈情、申报、递材料、请托、协调公私事务。但“浮云”也提示成事仍要看门、星、神是否配合，不宜只凭名义虚张。', lay: '简单说：材料、印信、介绍或申请更容易铺开；如报告得到呈递、审批有人引介、公私两端沟通顺畅，或原本不便明说的事项有了转圜空间。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP011-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP012: {
    id: 'SP012',
    name: '月精合佑',
    group: 'QM',
    factors: [
      { id: 'SP012-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '月精合佑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP012-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP012-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月精合佑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP012-A', name: '月精合佑得势', trigger: [{ op: 'has', args: ['stemRelations', '月精合佑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP012-B', name: '月精合佑受制', trigger: [{ op: 'has', args: ['stemRelations', '月精合佑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP012-A', pro: '月精合佑得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到月精合佑的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP012-001' },
      { comboId: 'COMBO-SP012-B', pro: '月精合佑受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到月精合佑，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP012-002' },
      { comboId: 'COMBO-SP012-A', pro: '月精合佑（吉格）：丙加地盘辛为月精合佑，主久病得救，文状入官亦能成就。', mix: '你的奇门格局出现「月精合佑」，月精合佑取丙辛相合而有救应之象。丙为月奇、光明与行动，辛为天庭、规则、文状和医药刀针之象。此格不按普通相合泛化为纯吉，而偏重“有救、有成”，利求医、补救、递交文状和把已受阻事项转入正式流程。', lay: '简单说：病事、文书或官面流程有补救机会；如找到合适医生、材料被正式受理、申诉进入流程，或原本难办的文件仍能办成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP012-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP013: {
    id: 'SP013',
    name: '为人遁',
    group: 'QM',
    factors: [
      { id: 'SP013-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '为人遁'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP013-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP013-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '为人遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP013-A', name: '为人遁得势', trigger: [{ op: 'has', args: ['stemRelations', '为人遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP013-B', name: '为人遁受制', trigger: [{ op: 'has', args: ['stemRelations', '为人遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP013-A', pro: '为人遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到为人遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP013-001' },
      { comboId: 'COMBO-SP013-B', pro: '为人遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到为人遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP013-002' },
      { comboId: 'COMBO-SP013-A', pro: '为人遁（吉格）：丁加地盘乙为为人遁，主喜庆非常，荐论改禄受权。', mix: '你的奇门格局出现「为人遁」，为人遁取丁星奇与乙日奇相合之象，文书、荐举、贵人言路和职位机会互相成就。丁主文书、消息、灵感和隐微助力，乙主日奇、才名和柔性资源。此格利求荐、求名、升迁、申请、请托，也利以文书材料换取更高位置或权限。', lay: '简单说：容易有人推荐或文书成事；如被引荐、申请通过、职位权限调整、名誉评价改善，或需要靠材料说话的事情得到支持。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP013-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP014: {
    id: 'SP014',
    name: '奇入太阴',
    group: 'QM',
    factors: [
      { id: 'SP014-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '奇入太阴'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP014-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP014-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '奇入太阴'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP014-A', name: '奇入太阴得势', trigger: [{ op: 'has', args: ['stemRelations', '奇入太阴'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP014-B', name: '奇入太阴受制', trigger: [{ op: 'has', args: ['stemRelations', '奇入太阴'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP014-A', pro: '奇入太阴得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到奇入太阴的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP014-001' },
      { comboId: 'COMBO-SP014-B', pro: '奇入太阴受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到奇入太阴，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP014-002' },
      { comboId: 'COMBO-SP014-A', pro: '奇入太阴（吉格）：丁加地盘丁为奇入太阴，主文书可至，两重文意，凡百遂心。', mix: '你的奇门格局出现「奇入太阴」，奇入太阴取丁星奇重临而文意深藏之象。丁主文书、消息、灵感和细节，丁丁重逢时文书线索更集中，适合等待回信、整理材料、深挖证据、处理需要细腻表达的事务。若近用同气过重，也有伏吟迟缓之象，需看同宫门星。', lay: '简单说：文书、消息或细节材料更容易到位；如回信送达、文件补齐、隐藏线索被看见，或复杂事项通过细节整理而转顺。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP014-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP015: {
    id: 'SP015',
    name: '青龙得光',
    group: 'QM',
    factors: [
      { id: 'SP015-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙得光'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP015-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP015-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙得光'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP015-A', name: '青龙得光得势', trigger: [{ op: 'has', args: ['stemRelations', '青龙得光'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP015-B', name: '青龙得光受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙得光'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP015-A', pro: '青龙得光得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到青龙得光的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP015-001' },
      { comboId: 'COMBO-SP015-B', pro: '青龙得光受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到青龙得光，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP015-002' },
      { comboId: 'COMBO-SP015-A', pro: '青龙得光（吉格）：丁加地盘戊为青龙得光，主贵人迁职，常人得良，喜美非常。', mix: '你的奇门格局出现「青龙得光」，青龙得光取丁星奇照临甲子戊青龙之象。丁主文书、消息与灵光，戊主天乙、根基、财物和贵人。此格利职位、财物、贵人照拂与喜庆事项，尤其适合以文书、消息或专业能力激活原有资源。', lay: '简单说：贵人、财物或职位资源被点亮；如得到上级关注、岗位调整有利、重要材料带来好消息，或原本沉睡的资源重新可用。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP015-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP016: {
    id: 'SP016',
    name: '丁壬化木',
    group: 'QM',
    factors: [
      { id: 'SP016-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '丁壬化木'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP016-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP016-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '丁壬化木'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP016-A', name: '丁壬化木得势', trigger: [{ op: 'has', args: ['stemRelations', '丁壬化木'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP016-B', name: '丁壬化木受制', trigger: [{ op: 'has', args: ['stemRelations', '丁壬化木'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP016-A', pro: '丁壬化木得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到丁壬化木的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP016-001' },
      { comboId: 'COMBO-SP016-B', pro: '丁壬化木受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到丁壬化木，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP016-002' },
      { comboId: 'COMBO-SP016-A', pro: '丁壬化木（吉格）：丁加地盘壬为丁壬化木，主财利得多，贵人赐禄，文状平和。', mix: '你的奇门格局出现「丁壬化木」，丁壬化木取丁壬相合化生之象，火水不作冲突死局，而转为文书、财利和名禄的生发。丁主文书、消息、灵感，壬主流动、智慧和资源。此格利求财禄、贵人赐助、协调文状和合作修复；若同宫伤门、杜门等闭塞之象较重，仍需降级判断。', lay: '简单说：财利、职位或文书沟通趋于和顺；如奖金机会到位、贵人给资源、诉求被平和处理，或原本僵硬的沟通重新流动。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP016-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP017: {
    id: 'SP017',
    name: '日奇伏刑',
    group: 'QM',
    factors: [
      { id: 'SP017-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '日奇伏刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP017-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP017-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇伏刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP017-A', name: '日奇伏刑成象', trigger: [{ op: 'has', args: ['stemRelations', '日奇伏刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP017-B', name: '日奇伏刑受制', trigger: [{ op: 'has', args: ['stemRelations', '日奇伏刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP017-A', pro: '日奇伏刑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日奇伏刑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP017-001' },
      { comboId: 'COMBO-SP017-B', pro: '日奇伏刑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日奇伏刑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP017-002' },
      { comboId: 'COMBO-SP017-A', pro: '日奇伏刑（凶格）：乙为日奇，乙乙重逢为日奇伏刑格，主才名受困、求名不利。', mix: '你的奇门格局出现「日奇伏刑」，日奇伏刑主能力和名声被压住，想靠才华、资历或名义直接打开局面会比较吃力。古籍说“不利求名，门合稍吉，门逆主凶”，所以仍需结合门、星、神判断轻重。适合先收敛锋芒、修正文书和计划，不宜急着争名位。', lay: '简单说：求名、考试、申请、展示才华类事项受阻；如材料被卡、成果不被看见、名誉评价不如预期，需要先修正细节再推进。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP017-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP018: {
    id: 'SP018',
    name: '朱雀入江',
    group: 'QM',
    factors: [
      { id: 'SP018-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入江'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP018-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP018-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '朱雀入江'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP018-A', name: '朱雀入江成象', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入江'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP018-B', name: '朱雀入江受制', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入江'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP018-A', pro: '朱雀入江成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到朱雀入江的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP018-001' },
      { comboId: 'COMBO-SP018-B', pro: '朱雀入江受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到朱雀入江，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP018-002' },
      { comboId: 'COMBO-SP018-A', pro: '朱雀入江（凶格）：乙加地盘丁为朱雀入江格，主文书迟滞、消息受阻，得吉星可减轻。', mix: '你的奇门格局出现「朱雀入江」，朱雀入江代表文书、消息和表达事务被水势拖住。乙为日奇，丁为朱雀星奇，两奇相逢本有文采和助力，但入此格容易出现受墓迟滞、反馈变慢、手续卡顿。若同宫门星神配合得吉，凶性可以减轻。宜先补齐材料、确认流程，再等待推进。', lay: '简单说：申请、合同、证件、考试、投稿或沟通回复变慢；如材料反复补交、文件审批延后、重要消息迟迟不到，但有吉门吉星时仍可缓解。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP018-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP019: {
    id: 'SP019',
    name: '阴中返阳',
    group: 'QM',
    factors: [
      { id: 'SP019-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '阴中返阳'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP019-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP019-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '阴中返阳'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP019-A', name: '阴中返阳成象', trigger: [{ op: 'has', args: ['stemRelations', '阴中返阳'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP019-B', name: '阴中返阳受制', trigger: [{ op: 'has', args: ['stemRelations', '阴中返阳'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP019-A', pro: '阴中返阳成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到阴中返阳的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP019-001' },
      { comboId: 'COMBO-SP019-B', pro: '阴中返阳受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到阴中返阳，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP019-002' },
      { comboId: 'COMBO-SP019-A', pro: '阴中返阳（凶格）：乙加地盘甲为阴中返阳；排盘时以甲子戊代甲，故乙加地盘戊按此格论。', mix: '你的奇门格局出现「阴中返阳」，阴中返阳取乙日奇临甲子戊青龙之象。甲在奇门中遁藏于六仪，甲子遁于戊，所以实际排盘遇到乙加戊时，按六乙加甲的传统克应处理。此格不是普通乙木克戊土，重点在阴柔之事转向明面，若凶星同临，容易破财、人口损伤或关系惊慌；阴柔、内部、协商类事务较能相合，阳刚强推则易失措。', lay: '简单说：暗处事项被迫转到明面；如财务问题暴露、家庭或团队成员受牵连、内部协商尚可缓和，但公开强推容易引发慌乱和损耗。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP019-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP020: {
    id: 'SP020',
    name: '日奇受刑',
    group: 'QM',
    factors: [
      { id: 'SP020-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '日奇受刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP020-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP020-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇受刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP020-A', name: '日奇受刑成象', trigger: [{ op: 'has', args: ['stemRelations', '日奇受刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP020-B', name: '日奇受刑受制', trigger: [{ op: 'has', args: ['stemRelations', '日奇受刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP020-A', pro: '日奇受刑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日奇受刑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP020-001' },
      { comboId: 'COMBO-SP020-B', pro: '日奇受刑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日奇受刑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP020-002' },
      { comboId: 'COMBO-SP020-A', pro: '日奇受刑（凶格）：乙加地盘庚为日奇受刑，主争财成讼，财事、合约和权益争夺易起纠纷。', mix: '你的奇门格局出现「日奇受刑」，日奇受刑代表柔顺的计划、文书和财物权益被庚金刑制。乙为日奇，主才华、文书、财物线索和柔性推进；庚为太白，主阻隔、刑伤和争夺。此格不宜只按五合论合作，更要防争财、合同争议、利益分配不均而升级为诉讼或规则处分。', lay: '简单说：钱款、分成、合同、报销或产权问题容易扯皮；如合作分账争执、借贷追讨、合同违约、财务纠纷进入投诉或诉讼流程。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP020-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP021: {
    id: 'SP021',
    name: '青龙逃走',
    group: 'QM',
    factors: [
      { id: 'SP021-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙逃走'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP021-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP021-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙逃走'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP021-A', name: '青龙逃走成象', trigger: [{ op: 'has', args: ['stemRelations', '青龙逃走'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP021-B', name: '青龙逃走受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙逃走'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP021-A', pro: '青龙逃走成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到青龙逃走的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP021-001' },
      { comboId: 'COMBO-SP021-B', pro: '青龙逃走受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到青龙逃走，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP021-002' },
      { comboId: 'COMBO-SP021-A', pro: '青龙逃走（凶格）：乙为青龙日奇，辛为白虎，金克木，青龙受制而逃，主破败损失。', mix: '你的奇门格局出现「青龙逃走」，青龙逃走是大凶之格。乙为日奇青龙，代表人才、财物、计划；辛为白虎凶神属金，金克木，青龙被迫逃走。主计划失败、人才流失、财物散失、合作破裂。百事不利，宜静不宜动。', lay: '简单说：计划好的事情突然生变，合作方退出或反悔；如签约失败、人才离职、投资亏损、财物被盗、合作伙伴跑路。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP021-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP022: {
    id: 'SP022',
    name: '万事皆屯',
    group: 'QM',
    factors: [
      { id: 'SP022-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '万事皆屯'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP022-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP022-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '万事皆屯'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP022-A', name: '万事皆屯成象', trigger: [{ op: 'has', args: ['stemRelations', '万事皆屯'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP022-B', name: '万事皆屯受制', trigger: [{ op: 'has', args: ['stemRelations', '万事皆屯'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP022-A', pro: '万事皆屯成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到万事皆屯的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP022-001' },
      { comboId: 'COMBO-SP022-B', pro: '万事皆屯受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到万事皆屯，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP022-002' },
      { comboId: 'COMBO-SP022-A', pro: '万事皆屯（凶格）：乙加地盘壬为万事皆屯，主事务停滞不前，阳人失财，阴人有病。', mix: '你的奇门格局出现「万事皆屯」，万事皆屯表示事情像屯卦初难一样卡住。乙为日奇，壬为大水，日奇入水势之中，计划、财物和身体状态都容易被拖住。古籍分男女象，阳人多应财务损失，阴人多应病痛不适；实际判断时可泛化为财务和健康两类风险。', lay: '简单说：推进多阻滞，钱款回收慢，身体也容易被拖累；如项目反复延期、尾款迟迟不到、临时支出增加，或出现疲惫、旧病反复。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP022-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP023: {
    id: 'SP023',
    name: '日入天网',
    group: 'QM',
    factors: [
      { id: 'SP023-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '日入天网'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP023-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP023-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日入天网'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP023-A', name: '日入天网成象', trigger: [{ op: 'has', args: ['stemRelations', '日入天网'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP023-B', name: '日入天网受制', trigger: [{ op: 'has', args: ['stemRelations', '日入天网'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP023-A', pro: '日入天网成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日入天网的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP023-001' },
      { comboId: 'COMBO-SP023-B', pro: '日入天网受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日入天网，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP023-002' },
      { comboId: 'COMBO-SP023-A', pro: '日入天网（凶格）：乙加地盘癸为日入天网，主官事破财，万事破伤。', mix: '你的奇门格局出现「日入天网」，日入天网代表日奇被癸水天网困住，明面计划进入规则、手续或纠纷网罗。乙主文书、希望和柔性资源，癸主天网、隐忧和困厄。此格对官非、审批、合规、借贷和风险事务不利，宜先止损、补证据、避开强行推进。', lay: '简单说：容易因规则、手续或争议而破财受伤；如审批被卡、罚款赔付、证据不足导致败诉，或事情推进中出现损耗和意外。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP023-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP024: {
    id: 'SP024',
    name: '龙困遭伤',
    group: 'QM',
    factors: [
      { id: 'SP024-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '龙困遭伤'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP024-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP024-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '龙困遭伤'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP024-A', name: '龙困遭伤成象', trigger: [{ op: 'has', args: ['stemRelations', '龙困遭伤'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP024-B', name: '龙困遭伤受制', trigger: [{ op: 'has', args: ['stemRelations', '龙困遭伤'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP024-A', pro: '龙困遭伤成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到龙困遭伤的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP024-001' },
      { comboId: 'COMBO-SP024-B', pro: '龙困遭伤受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到龙困遭伤，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP024-002' },
      { comboId: 'COMBO-SP024-A', pro: '龙困遭伤（凶格）：辛加地盘甲为龙困遭伤；排盘时以甲子戊代甲，故辛加地盘戊按此格论。', mix: '你的奇门格局出现「龙困遭伤」，龙困遭伤取辛白虎临甲青龙之象。甲为青龙、财源与生发，辛为阴金白虎，金克木而青龙受困，主财事、官事或人情关系中有牵制损伤。门星顺合时尚可缓解，不合则阳主动用者更易受灾。', lay: '简单说：求财、争产、申请、合作容易被规则或对手卡住；如财款被扣、合同争议、官面流程牵扯，或本想推进反被追责。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP024-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP025: {
    id: 'SP025',
    name: '干合荧惑',
    group: 'QM',
    factors: [
      { id: 'SP025-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '干合荧惑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP025-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP025-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '干合荧惑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP025-A', name: '干合荧惑成象', trigger: [{ op: 'has', args: ['stemRelations', '干合荧惑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP025-B', name: '干合荧惑受制', trigger: [{ op: 'has', args: ['stemRelations', '干合荧惑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP025-A', pro: '干合荧惑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到干合荧惑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP025-001' },
      { comboId: 'COMBO-SP025-B', pro: '干合荧惑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到干合荧惑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP025-002' },
      { comboId: 'COMBO-SP025-A', pro: '干合荧惑（凶格）：辛加地盘丙为干合荧惑，主文状虚词、竞争财物，门星不合则暗昧屈厄。', mix: '你的奇门格局出现「干合荧惑」，干合荧惑取辛金合丙火而被火势扰动之象。辛主白虎、刑责和细密，丙为荧惑、明火与争端，合而不清，容易出现虚言、文书争议、财物竞争或公开场合的误解。门星不合时，事情会从表面沟通转成暗中受屈。', lay: '简单说：合同、申诉、对账、竞标或说明材料容易反复；如说法前后不一、竞争对手借题发挥，或财物归属被含糊处理。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP025-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP026: {
    id: 'SP026',
    name: '狱神入奇',
    group: 'QM',
    factors: [
      { id: 'SP026-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '狱神入奇'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP026-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP026-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '狱神入奇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP026-A', name: '狱神入奇成格', trigger: [{ op: 'has', args: ['stemRelations', '狱神入奇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP026-B', name: '狱神入奇受制', trigger: [{ op: 'has', args: ['stemRelations', '狱神入奇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP026-A', pro: '狱神入奇成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到狱神入奇，且门星落位，按部就班即可', lay: '盘面走到「狱神入奇」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP026-001' },
      { comboId: 'COMBO-SP026-B', pro: '狱神入奇受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到狱神入奇，但门星受制，力量打折', lay: '盘面有「狱神入奇」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP026-002' },
      { comboId: 'COMBO-SP026-A', pro: '狱神入奇（平格）：辛加地盘丁为狱神入奇，主远行经商利倍得迟，门星不吉则夫妇分离。', mix: '你的奇门格局出现「狱神入奇」，狱神入奇取辛白虎临丁星奇之象。丁主文书、消息和细微机会，辛主刑狱、规则与迟滞，两者相遇并非全凶，但多有先阻后得、先难后利之象。若门星不吉，则文书迟滞、人际隔阂或伴侣分离的负面更重。', lay: '简单说：外出、经商、签约可能有利但来得慢；如款项延迟、审批拖长、异地奔波后才见结果，或因事务牵扯造成伴侣分隔。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP026-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP027: {
    id: 'SP027',
    name: '刑狱之格',
    group: 'QM',
    factors: [
      { id: 'SP027-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '刑狱之格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP027-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP027-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '刑狱之格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP027-A', name: '刑狱之格成象', trigger: [{ op: 'has', args: ['stemRelations', '刑狱之格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP027-B', name: '刑狱之格受制', trigger: [{ op: 'has', args: ['stemRelations', '刑狱之格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP027-A', pro: '刑狱之格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到刑狱之格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP027-001' },
      { comboId: 'COMBO-SP027-B', pro: '刑狱之格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到刑狱之格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP027-002' },
      { comboId: 'COMBO-SP027-A', pro: '刑狱之格（凶格）：辛加地盘己为刑狱之格，主奴婢欺主、先自刑克，门吉星强方可虚成。', mix: '你的奇门格局出现「刑狱之格」，刑狱之格取辛白虎临己地户之象。己主阴私、遮蔽与内部牵连，辛主刑伤与规则压力，二者相并，多主内部人事、下属执行、合同责任或暗处问题反过来伤主。若门星有力，事情可勉强成就，但仍有拖累。', lay: '简单说：容易被下属、代理人、合作方或隐藏流程拖累；如内部失误、背锅追责、材料暗病暴露，或项目虽成却留下责任尾巴。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP027-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP028: {
    id: 'SP028',
    name: '白虎伤格',
    group: 'QM',
    factors: [
      { id: 'SP028-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '白虎伤格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP028-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP028-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白虎伤格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP028-A', name: '白虎伤格成象', trigger: [{ op: 'has', args: ['stemRelations', '白虎伤格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP028-B', name: '白虎伤格受制', trigger: [{ op: 'has', args: ['stemRelations', '白虎伤格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP028-A', pro: '白虎伤格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到白虎伤格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP028-001' },
      { comboId: 'COMBO-SP028-B', pro: '白虎伤格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到白虎伤格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP028-002' },
      { comboId: 'COMBO-SP028-A', pro: '白虎伤格（凶格）：辛加地盘庚为白虎伤格，主争夺、酒色是非，星合门凶则丑声难塞。', mix: '你的奇门格局出现「白虎伤格」，白虎伤格取辛庚两金相争之象。辛为白虎，庚为太白，金气过重则刑伤、争夺和声名损害并见。古籍以“两女争男”取象，现代可泛指关系、资源、名分和利益的竞争。', lay: '简单说：感情、合作或资源分配容易出现争夺和名誉风险；如三角关系、酒局失言、利益冲突公开化，或私事变成外界议论。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP028-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP029: {
    id: 'SP029',
    name: '狱入自刑',
    group: 'QM',
    factors: [
      { id: 'SP029-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '狱入自刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP029-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP029-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '狱入自刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP029-A', name: '狱入自刑成象', trigger: [{ op: 'has', args: ['stemRelations', '狱入自刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP029-B', name: '狱入自刑受制', trigger: [{ op: 'has', args: ['stemRelations', '狱入自刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP029-A', pro: '狱入自刑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到狱入自刑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP029-001' },
      { comboId: 'COMBO-SP029-B', pro: '狱入自刑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到狱入自刑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP029-002' },
      { comboId: 'COMBO-SP029-A', pro: '狱入自刑（凶格）：辛加地盘辛为狱入自刑，主自我牵制，阴人求财可喜，阳主动用多有灾害。', mix: '你的奇门格局出现「狱入自刑」，狱入自刑取两辛重逢之象。辛为白虎、刑狱、精细规则，两辛并临则压力内转，多主自己困住自己、手续反复、细节互相掣肘。若题目偏阴柔、财务或幕后操作，尚可借合处求利；强行外显推进则易招损。', lay: '简单说：容易因自己的决定、文件、承诺或细节漏洞受困；如反复补材料、自相矛盾、内部审查卡住，或为了求财不得不承担额外风险。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP029-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP030: {
    id: 'SP030',
    name: '蛇入狱刑',
    group: 'QM',
    factors: [
      { id: 'SP030-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '蛇入狱刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP030-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP030-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '蛇入狱刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP030-A', name: '蛇入狱刑成象', trigger: [{ op: 'has', args: ['stemRelations', '蛇入狱刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP030-B', name: '蛇入狱刑受制', trigger: [{ op: 'has', args: ['stemRelations', '蛇入狱刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP030-A', pro: '蛇入狱刑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到蛇入狱刑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP030-001' },
      { comboId: 'COMBO-SP030-B', pro: '蛇入狱刑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到蛇入狱刑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP030-002' },
      { comboId: 'COMBO-SP030-A', pro: '蛇入狱刑（凶格）：辛加地盘壬为蛇入狱刑，主两男争女、讼逼难停，门符合吉亦有刑责余波。', mix: '你的奇门格局出现「蛇入狱刑」，蛇入狱刑取辛白虎临壬螣蛇之象。壬主隐伏、流动和疑惑，辛主刑责与约束，两者相遇，隐情被规则困住，容易引发关系争夺、诉讼逼迫或持续纠缠。即使门符相合，也宜先止争、留证、降风险。', lay: '简单说：感情、合作、债务或隐私纠纷容易拖入法务流程；如争夺关系、催告不断、诉讼调解拉扯，或因旧事翻出产生处罚。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP030-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP031: {
    id: 'SP031',
    name: '直格华盖',
    group: 'QM',
    factors: [
      { id: 'SP031-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '直格华盖'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP031-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP031-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '直格华盖'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP031-A', name: '直格华盖得势', trigger: [{ op: 'has', args: ['stemRelations', '直格华盖'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP031-B', name: '直格华盖受制', trigger: [{ op: 'has', args: ['stemRelations', '直格华盖'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP031-A', pro: '直格华盖得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到直格华盖的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP031-001' },
      { comboId: 'COMBO-SP031-B', pro: '直格华盖受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到直格华盖，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP031-002' },
      { comboId: 'COMBO-SP031-A', pro: '直格华盖（吉格）：辛加地盘癸为直格华盖，阴人用之无灾无害，吉门吉星则阳人得财有喜。', mix: '你的奇门格局出现「直格华盖」，直格华盖取辛白虎临癸华盖天网之象。辛有规则和收束之力，癸有隐伏、文书和网罗之象，若门星得吉，可把原本复杂的手续、财务或人情收束成可用资源。此格宜谨慎守正，不宜张扬。', lay: '简单说：隐性资源、文书审核、财务结算可能有好结果；如款项到账、宴饮喜庆、幕后帮助，或低调处理反而避开麻烦。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP031-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP032: {
    id: 'SP032',
    name: '朱雀投江',
    group: 'QM',
    factors: [
      { id: 'SP032-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '朱雀投江'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP032-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP032-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '朱雀投江'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP032-A', name: '朱雀投江成象', trigger: [{ op: 'has', args: ['stemRelations', '朱雀投江'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP032-B', name: '朱雀投江受制', trigger: [{ op: 'has', args: ['stemRelations', '朱雀投江'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP032-A', pro: '朱雀投江成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到朱雀投江的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP032-001' },
      { comboId: 'COMBO-SP032-B', pro: '朱雀投江受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到朱雀投江，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP032-002' },
      { comboId: 'COMBO-SP032-A', pro: '朱雀投江（凶格）：丁为朱雀星奇，癸为江河之水，水克火，朱雀入水而灭，主文书消息断绝。', mix: '你的奇门格局出现「朱雀投江」，朱雀投江为凶格。丁为文书、消息、才华、希望，癸为阴水江河，水克火而丁火熄灭。主音信不通、文书失效、才华被埋没、计划搁浅。', lay: '简单说：发出的消息石沉大海，提交的申请被驳回或没有下文；如投稿被退、考试落榜、重要信件丢失、面试后无回音。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP032-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP033: {
    id: 'SP033',
    name: '螣蛇夭矫',
    group: 'QM',
    factors: [
      { id: 'SP033-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇夭矫'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP033-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP033-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇夭矫'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP033-A', name: '螣蛇夭矫成象', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇夭矫'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP033-B', name: '螣蛇夭矫受制', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇夭矫'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP033-A', pro: '螣蛇夭矫成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到螣蛇夭矫的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP033-001' },
      { comboId: 'COMBO-SP033-B', pro: '螣蛇夭矫受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到螣蛇夭矫，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP033-002' },
      { comboId: 'COMBO-SP033-A', pro: '螣蛇夭矫（凶格）：癸为螣蛇阴水，丁为星奇之火，水克火，蛇遇火而夭矫不安，主虚惊怪异。', mix: '你的奇门格局出现「螣蛇夭矫」，螣蛇夭矫主虚惊怪异、反复无常。癸水螣蛇为阴暗之事，丁为火为文明，水克火而产生不安定的能量。多主意外之事、虚惊一场、计划反复被打断。', lay: '简单说：莫名出现干扰和波折，事情一而再再而三地反复；如电脑故障、交通延误、约定临时取消、谣言困扰。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP033-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP034: {
    id: 'SP034',
    name: '荧入太白',
    group: 'QM',
    factors: [
      { id: 'SP034-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '荧入太白'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP034-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP034-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '荧入太白'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP034-A', name: '荧入太白成象', trigger: [{ op: 'has', args: ['stemRelations', '荧入太白'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP034-B', name: '荧入太白受制', trigger: [{ op: 'has', args: ['stemRelations', '荧入太白'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP034-A', pro: '荧入太白成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到荧入太白的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP034-001' },
      { comboId: 'COMBO-SP034-B', pro: '荧入太白受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到荧入太白，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP034-002' },
      { comboId: 'COMBO-SP034-A', pro: '荧入太白（凶格）：丙为荧惑（火星），庚为太白（金星），火克金，荧入太白，主贼盗破财。', mix: '你的奇门格局出现「荧入太白」，荧入太白（全称"荧惑入太白"）是奇门凶格之一。丙为月奇、为希望、为权威，庚为阻碍、为变革，火克金本是正常，但在奇门中代表好事被破坏、到手的成果被夺取。主盗窃、破财、诉讼、争执。', lay: '简单说：即将成功的事情被破坏，到手的利益被人抢走；如中标被抢、合同被毁约、财物被盗、功劳被抢。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP034-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP035: {
    id: 'SP035',
    name: '太白入荧',
    group: 'QM',
    factors: [
      { id: 'SP035-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '太白入荧'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP035-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP035-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太白入荧'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP035-A', name: '太白入荧成象', trigger: [{ op: 'has', args: ['stemRelations', '太白入荧'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP035-B', name: '太白入荧受制', trigger: [{ op: 'has', args: ['stemRelations', '太白入荧'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP035-A', pro: '太白入荧成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到太白入荧的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP035-001' },
      { comboId: 'COMBO-SP035-B', pro: '太白入荧受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到太白入荧，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP035-002' },
      { comboId: 'COMBO-SP035-A', pro: '太白入荧（凶格）：庚为太白（金星），丙为荧惑（火星），火克金，太白受制于荧惑，主客来欺主。', mix: '你的奇门格局出现「太白入荧」，太白入荧（全称"太白入荧惑"）与荧入太白相对，同为大凶之格。庚为敌方、竞争者、外来力量，丙为我方、希望、权威。代表外来力量主动挑战或侵犯我方利益，客来欺主之象。', lay: '简单说：受到竞争对手或外部的直接挑战；如商业竞争中被对手抢占市场、被人主动挑衅、外来者喧宾夺主。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP035-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP036: {
    id: 'SP036',
    name: '日合六格',
    group: 'QM',
    factors: [
      { id: 'SP036-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '日合六格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP036-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP036-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日合六格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP036-A', name: '日合六格成格', trigger: [{ op: 'has', args: ['stemRelations', '日合六格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP036-B', name: '日合六格受制', trigger: [{ op: 'has', args: ['stemRelations', '日合六格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP036-A', pro: '日合六格成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到日合六格，且门星落位，按部就班即可', lay: '盘面走到「日合六格」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP036-001' },
      { comboId: 'COMBO-SP036-B', pro: '日合六格受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到日合六格，但门星受制，力量打折', lay: '盘面有「日合六格」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP036-002' },
      { comboId: 'COMBO-SP036-A', pro: '日合六格（平格）：庚加地盘乙为日合六格，主百事安然，但须缄默谨慎，门星乘凶则官事刑迫。', mix: '你的奇门格局出现「日合六格」，日合六格取庚金临乙日奇之象。乙为日奇、柔顺与文书，庚为太白、刑杀与阻隔，二者相遇虽有合意安然的一面，但庚气仍重，不宜张扬争胜。若门星不合或凶象并见，容易从沟通文书转成官非刑责。', lay: '简单说：事情表面可平稳推进，但需要低调守密；如合作谈判宜少说多做，文书合约宜谨慎核对，遇到投诉、诉讼、审查时更要避免激化。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP036-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP037: {
    id: 'SP037',
    name: '亭亭',
    group: 'QM',
    factors: [
      { id: 'SP037-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '亭亭'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP037-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP037-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '亭亭'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP037-A', name: '亭亭成象', trigger: [{ op: 'has', args: ['stemRelations', '亭亭'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP037-B', name: '亭亭受制', trigger: [{ op: 'has', args: ['stemRelations', '亭亭'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP037-A', pro: '亭亭成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到亭亭的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP037-001' },
      { comboId: 'COMBO-SP037-B', pro: '亭亭受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到亭亭，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP037-002' },
      { comboId: 'COMBO-SP037-A', pro: '亭亭（凶格）：庚加地盘丁名为亭亭，主文状争论、私匿之情，门符逆背则词讼难成。', mix: '你的奇门格局出现「亭亭」，亭亭取庚太白临丁星奇之象。丁主文书、消息和隐情，庚主刑杀、争执与阻隔，两者相逢，多主因文书、证据、言辞或隐秘关系引发争论。若门星不顺，申诉、谈判、诉讼容易僵持，难以按预期收束。', lay: '简单说：容易围绕材料、合同、聊天记录、承诺或隐情起争执；如投诉反复、法律文书来回补正、谈判卡在证据细节，或私下关系被翻出影响正事。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP037-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP038: {
    id: 'SP038',
    name: '大格',
    group: 'QM',
    factors: [
      { id: 'SP038-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '大格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP038-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP038-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '大格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP038-A', name: '大格成象', trigger: [{ op: 'has', args: ['stemRelations', '大格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP038-B', name: '大格受制', trigger: [{ op: 'has', args: ['stemRelations', '大格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP038-A', pro: '大格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到大格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP038-001' },
      { comboId: 'COMBO-SP038-B', pro: '大格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到大格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP038-002' },
      { comboId: 'COMBO-SP038-A', pro: '大格（凶格）：庚为太白阻隔之神，癸为螣蛇天网，金入水乡，主大凶、出行阻隔。', mix: '你的奇门格局出现「大格」，大格是奇门中最凶的出行格局之一。庚为阻碍、为道路断绝，癸为天网、为困厄，庚金生癸水为天盘泄气而地盘网罗。主道路不通、出行遇险、官司缠身、父子分离、重要事项被卡。', lay: '简单说：出行严重受阻、信息不通；如签证被拒、航班取消或延误、官司败诉、重要审批被卡住、离家之人久不归。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP038-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP039: {
    id: 'SP039',
    name: '小格',
    group: 'QM',
    factors: [
      { id: 'SP039-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '小格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP039-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP039-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '小格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP039-A', name: '小格成象', trigger: [{ op: 'has', args: ['stemRelations', '小格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP039-B', name: '小格受制', trigger: [{ op: 'has', args: ['stemRelations', '小格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP039-A', pro: '小格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到小格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP039-001' },
      { comboId: 'COMBO-SP039-B', pro: '小格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到小格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP039-002' },
      { comboId: 'COMBO-SP039-A', pro: '小格（凶格）：庚为太白阻隔之神，壬为玄武水势，庚临壬为小格，主阻隔迁延。', mix: '你的奇门格局出现「小格」，小格为奇门凶格之一，古籍取庚加壬或庚临壬。庚主阻隔、刀兵、道路不通，壬主流动与隐伏，二者相逢主事情受阻、迁延反复。出行、追赶、推进项目均宜谨慎。', lay: '简单说：事情推进迟缓，总有阻隔反复；如出行受阻、追赶无果、审批拖延、计划临门一脚又被迫停下。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP039-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP040: {
    id: 'SP040',
    name: '刑格',
    group: 'QM',
    factors: [
      { id: 'SP040-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '刑格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP040-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP040-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '刑格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP040-A', name: '刑格成象', trigger: [{ op: 'has', args: ['stemRelations', '刑格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP040-B', name: '刑格受制', trigger: [{ op: 'has', args: ['stemRelations', '刑格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP040-A', pro: '刑格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到刑格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP040-001' },
      { comboId: 'COMBO-SP040-B', pro: '刑格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到刑格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP040-002' },
      { comboId: 'COMBO-SP040-A', pro: '刑格（凶格）：庚为太白刑杀之神，己为地户阴私，金土相遇，主刑罚官非、身体伤害。', mix: '你的奇门格局出现「刑格」，刑格是奇门凶格中最为凶险的格局之一。庚为刀兵刑杀，己为地户阴暗，土生金为暗中藏刀。主官非刑罚、身体伤害、意外事故。百事需格外谨慎，尤其要防法律纠纷和健康损害。', lay: '简单说：触犯法律或规章制度的风险极高；如卷入诉讼、被行政处罚、发生意外伤害、病情加重、手术不顺。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP040-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP041: {
    id: 'SP041',
    name: '太白',
    group: 'QM',
    factors: [
      { id: 'SP041-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '太白'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP041-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP041-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太白'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP041-A', name: '太白成象', trigger: [{ op: 'has', args: ['stemRelations', '太白'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP041-B', name: '太白受制', trigger: [{ op: 'has', args: ['stemRelations', '太白'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP041-A', pro: '太白成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到太白的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP041-001' },
      { comboId: 'COMBO-SP041-B', pro: '太白受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到太白，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP041-002' },
      { comboId: 'COMBO-SP041-A', pro: '太白（凶格）：庚加地盘庚为太白，主官事并发、狱禁牵连，凶期百日而后或有舒情。', mix: '你的奇门格局出现「太白」，太白取两庚重逢之象。庚为刑杀、阻隔、刀兵与制度压力，两庚并临则阻力加重，多主官非、检查、处罚、拘束或强硬对抗。古籍虽有“却有舒情”之语，说明后续仍可能缓解，但初期压力明显，不宜硬冲。', lay: '简单说：容易遇到监管、处罚、纠纷升级或强硬阻拦；如项目被审查、合同被追责、争执进入法律流程，或短期被规则、机构、对手压住。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP041-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP042: {
    id: 'SP042',
    name: '干格白虎',
    group: 'QM',
    factors: [
      { id: 'SP042-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '干格白虎'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP042-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP042-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '干格白虎'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP042-A', name: '干格白虎成象', trigger: [{ op: 'has', args: ['stemRelations', '干格白虎'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP042-B', name: '干格白虎受制', trigger: [{ op: 'has', args: ['stemRelations', '干格白虎'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP042-A', pro: '干格白虎成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到干格白虎的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP042-001' },
      { comboId: 'COMBO-SP042-B', pro: '干格白虎受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到干格白虎，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP042-002' },
      { comboId: 'COMBO-SP042-A', pro: '干格白虎（凶格）：庚加地盘辛为干格白虎，主道路伤亡、失伴难休，客主之势多有争执。', mix: '你的奇门格局出现「干格白虎」，干格白虎取庚辛两金相并之象。庚为太白刑杀，辛为白虎肃杀，金气过重而无调和，主道路、出行、伙伴、合同关系中出现损伤和分离。此格不利强行推进，尤其忌带着争执赶路、签约或处理对抗事务。', lay: '简单说：出行和协作风险升高；如路途受伤、同行人失联或分道，合作伙伴翻脸，争议拖延不休，或客方与主方互相牵制。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP042-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP043: {
    id: 'SP043',
    name: '天网四张',
    group: 'QM',
    factors: [
      { id: 'SP043-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '天网四张'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP043-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP043-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天网四张'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP043-A', name: '天网四张成象', trigger: [{ op: 'has', args: ['stemRelations', '天网四张'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP043-B', name: '天网四张受制', trigger: [{ op: 'has', args: ['stemRelations', '天网四张'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP043-A', pro: '天网四张成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到天网四张的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP043-001' },
      { comboId: 'COMBO-SP043-B', pro: '天网四张受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到天网四张，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP043-002' },
      { comboId: 'COMBO-SP043-A', pro: '天网四张（凶格）：癸为天网，双癸重逢如天网四张，主困厄至极、大凶。', mix: '你的奇门格局出现「天网四张」，天网四张是奇门中最凶的格局，没有之一。双癸重叠，天网重重，代表无处可逃、处处碰壁、走投无路。百事不利，宜静守待变，绝不可有任何主动行动。此时任何举措都可能使情况更糟。', lay: '简单说：事情全面受阻，进退两难；如被多方围困、求救无门、资源枯竭、健康严重恶化、遭遇重大挫折。应静待转机，切勿妄动。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP043-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP044: {
    id: 'SP044',
    name: '罗网青龙',
    group: 'QM',
    factors: [
      { id: 'SP044-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '罗网青龙'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP044-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP044-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '罗网青龙'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP044-A', name: '罗网青龙成格', trigger: [{ op: 'has', args: ['stemRelations', '罗网青龙'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP044-B', name: '罗网青龙受制', trigger: [{ op: 'has', args: ['stemRelations', '罗网青龙'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP044-A', pro: '罗网青龙成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到罗网青龙，且门星落位，按部就班即可', lay: '盘面走到「罗网青龙」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP044-001' },
      { comboId: 'COMBO-SP044-B', pro: '罗网青龙受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到罗网青龙，但门星受制，力量打折', lay: '盘面有「罗网青龙」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP044-002' },
      { comboId: 'COMBO-SP044-A', pro: '罗网青龙（平格）：癸加地盘甲为罗网青龙；排盘时以甲子戊代甲，故癸加地盘戊按此格论。', mix: '你的奇门格局出现「罗网青龙」，罗网青龙取癸天网临甲青龙之象。甲主财喜、姻亲和生发，癸主罗网、隐忧与规则，财喜虽有来源，但需经由约束、手续或贵人牵线才能落地。星门不合时，阳主动用容易转入口舌讼刑。', lay: '简单说：财务、婚恋、亲友资源可能有机会，但要经过规则和人情筛选；如介绍合作、亲友牵线、款项审核，或好事伴随手续压力。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP044-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP045: {
    id: 'SP045',
    name: '华盖逢星',
    group: 'QM',
    factors: [
      { id: 'SP045-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '华盖逢星'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP045-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP045-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '华盖逢星'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP045-A', name: '华盖逢星成格', trigger: [{ op: 'has', args: ['stemRelations', '华盖逢星'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP045-B', name: '华盖逢星受制', trigger: [{ op: 'has', args: ['stemRelations', '华盖逢星'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP045-A', pro: '华盖逢星成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到华盖逢星，且门星落位，按部就班即可', lay: '盘面走到「华盖逢星」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP045-001' },
      { comboId: 'COMBO-SP045-B', pro: '华盖逢星受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到华盖逢星，但门星受制，力量打折', lay: '盘面有「华盖逢星」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP045-002' },
      { comboId: 'COMBO-SP045-A', pro: '华盖逢星（平格）：癸加地盘乙为华盖逢星，贵人主宠禄权位，常人主怪异口舌。', mix: '你的奇门格局出现「华盖逢星」，华盖逢星取癸华盖临乙日奇之象。乙为文书、贵人和柔性资源，癸为华盖、隐伏与网罗，贵人占问可得职位、照拂或名义加持；普通事务则容易显得孤高、怪异，并引出口舌误会。', lay: '简单说：有机会得到上级、资质、头衔或文书支持；但普通合作中，也可能表现为沟通绕、想法怪、被议论或解释成本上升。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP045-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP046: {
    id: 'SP046',
    name: '盖遇孛师',
    group: 'QM',
    factors: [
      { id: 'SP046-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '盖遇孛师'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP046-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP046-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '盖遇孛师'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP046-A', name: '盖遇孛师成格', trigger: [{ op: 'has', args: ['stemRelations', '盖遇孛师'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP046-B', name: '盖遇孛师受制', trigger: [{ op: 'has', args: ['stemRelations', '盖遇孛师'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP046-A', pro: '盖遇孛师成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到盖遇孛师，且门星落位，按部就班即可', lay: '盘面走到「盖遇孛师」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP046-001' },
      { comboId: 'COMBO-SP046-B', pro: '盖遇孛师受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到盖遇孛师，但门星受制，力量打折', lay: '盘面有「盖遇孛师」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP046-002' },
      { comboId: 'COMBO-SP046-A', pro: '盖遇孛师（平格）：癸加地盘丙为盖遇孛师，贵人受官，小人得依，占文状可得门眉。', mix: '你的奇门格局出现「盖遇孛师」，盖遇孛师取癸华盖临丙月奇之象。丙主公开、文书和名位，癸主隐伏、规则和华盖，此格利于把暗处问题带到明处处理。贵人可因官面流程得助，普通人也可能找到依托，但仍要防文书词讼牵连。', lay: '简单说：申报、投诉、说明、考试或公文流程可能找到突破口；如有人背书、材料被受理、规则给出依据，但过程仍有口舌和审查。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP046-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP047: {
    id: 'SP047',
    name: '华盖地户',
    group: 'QM',
    factors: [
      { id: 'SP047-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '华盖地户'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP047-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP047-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '华盖地户'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP047-A', name: '华盖地户成格', trigger: [{ op: 'has', args: ['stemRelations', '华盖地户'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP047-B', name: '华盖地户受制', trigger: [{ op: 'has', args: ['stemRelations', '华盖地户'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP047-A', pro: '华盖地户成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到华盖地户，且门星落位，按部就班即可', lay: '盘面走到「华盖地户」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP047-001' },
      { comboId: 'COMBO-SP047-B', pro: '华盖地户受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到华盖地户，但门星受制，力量打折', lay: '盘面有「华盖地户」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP047-002' },
      { comboId: 'COMBO-SP047-A', pro: '华盖地户（平格）：癸加地盘己为华盖地户，主阴人问夫、求至居住，门顺入室，门逆夫殆。', mix: '你的奇门格局出现「华盖地户」，华盖地户取癸华盖临己地户之象。癸主隐伏与网罗，己主家宅、内情和遮蔽，多应在家庭、居住、伴侣、内部安排或私密事务上。门顺则有归处，门逆则关系和安居不稳。', lay: '简单说：适合谨慎处理居住、婚恋、家庭和内部协调；如搬住、同居、家务安排、伴侣沟通，但门星不利时容易变成冷战、分居或健康担忧。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP047-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP048: {
    id: 'SP048',
    name: '大格飞名',
    group: 'QM',
    factors: [
      { id: 'SP048-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '大格飞名'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP048-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP048-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '大格飞名'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP048-A', name: '大格飞名成格', trigger: [{ op: 'has', args: ['stemRelations', '大格飞名'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP048-B', name: '大格飞名受制', trigger: [{ op: 'has', args: ['stemRelations', '大格飞名'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP048-A', pro: '大格飞名成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到大格飞名，且门星落位，按部就班即可', lay: '盘面走到「大格飞名」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP048-001' },
      { comboId: 'COMBO-SP048-B', pro: '大格飞名受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到大格飞名，但门星受制，力量打折', lay: '盘面有「大格飞名」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP048-002' },
      { comboId: 'COMBO-SP048-A', pro: '大格飞名（平格）：癸加地盘庚为大格飞名，只宜上官握柄，公事得迟，钱财则有争。', mix: '你的奇门格局出现「大格飞名」，大格飞名取癸天网临庚太白之象。癸主罗网，庚主权柄、阻隔和刑杀，此格适合处理权责明确、官面规则强的事务，但不利急求财。公事能成也多迟缓，钱财往来容易争执。', lay: '简单说：适合走正规流程、申请权责、处理任命或制度事项；但求款、分账、商业谈判会慢且容易争，宜把证据和边界写清。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP048-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP049: {
    id: 'SP049',
    name: '狱入天牢',
    group: 'QM',
    factors: [
      { id: 'SP049-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '狱入天牢'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP049-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP049-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '狱入天牢'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP049-A', name: '狱入天牢成象', trigger: [{ op: 'has', args: ['stemRelations', '狱入天牢'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP049-B', name: '狱入天牢受制', trigger: [{ op: 'has', args: ['stemRelations', '狱入天牢'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP049-A', pro: '狱入天牢成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到狱入天牢的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP049-001' },
      { comboId: 'COMBO-SP049-B', pro: '狱入天牢受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到狱入天牢，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP049-002' },
      { comboId: 'COMBO-SP049-A', pro: '狱入天牢（凶格）：癸加地盘辛为狱入天牢，主军吏遭系、罪恐难逃，门吉星吉则虚禁无劳。', mix: '你的奇门格局出现「狱入天牢」，狱入天牢取癸天网临辛白虎之象。癸为网，辛为刑狱，网罗与刑责相叠，多主被规则、审查、处罚或合同责任困住。若门星俱吉，可能只是虚惊或短暂限制；否则不宜冒险。', lay: '简单说：容易遇到审查、冻结、限制、处罚或法律风险；如账号受限、款项冻结、合同违约追责，或流程被强制停下等待核验。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP049-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP050: {
    id: 'SP050',
    name: '复见螣蛇',
    group: 'QM',
    factors: [
      { id: 'SP050-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '复见螣蛇'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP050-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP050-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '复见螣蛇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP050-A', name: '复见螣蛇成象', trigger: [{ op: 'has', args: ['stemRelations', '复见螣蛇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP050-B', name: '复见螣蛇受制', trigger: [{ op: 'has', args: ['stemRelations', '复见螣蛇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP050-A', pro: '复见螣蛇成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到复见螣蛇的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP050-001' },
      { comboId: 'COMBO-SP050-B', pro: '复见螣蛇受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到复见螣蛇，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP050-002' },
      { comboId: 'COMBO-SP050-A', pro: '复见螣蛇（凶格）：癸加地盘壬为复见螣蛇，主家不和、离散与私情牵连，星门俱吉则信息可通。', mix: '你的奇门格局出现「复见螣蛇」，复见螣蛇取癸壬两水相并之象。壬癸皆主隐伏、疑惑和流动，叠见则虚惊、猜疑、家宅不和或私密关系牵连更重。若星门俱吉，信息沟通尚可打开；不吉则易反复离散。', lay: '简单说：家庭、感情、合作关系容易出现猜疑和反复；如隐情曝光、信息暧昧、分合不定，或沟通虽有但难以稳定落实。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP050-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP051: {
    id: 'SP051',
    name: '地网四张',
    group: 'QM',
    factors: [
      { id: 'SP051-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '地网四张'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP051-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP051-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地网四张'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP051-A', name: '地网四张成象', trigger: [{ op: 'has', args: ['stemRelations', '地网四张'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP051-B', name: '地网四张受制', trigger: [{ op: 'has', args: ['stemRelations', '地网四张'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP051-A', pro: '地网四张成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到地网四张的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP051-001' },
      { comboId: 'COMBO-SP051-B', pro: '地网四张受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到地网四张，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP051-002' },
      { comboId: 'COMBO-SP051-A', pro: '地网四张（凶格）：壬为地网，双壬重逢如地网四张，主沉沦停滞、陷入僵局。', mix: '你的奇门格局出现「地网四张」，地网四张与天网四张类似，主被困于僵局之中。双壬为水，泛滥不可收拾。与天网四张不同的是，地网四张更偏重内在的困顿——如思维僵化、缺乏突破口。宜冷静观察、等待外部转机。', lay: '简单说：陷入僵局无法突破，事情像陷入泥潭；如项目停滞、资金链断裂、被套牢无法脱身、思维陷入死胡同。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP051-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP052: {
    id: 'SP052',
    name: '蛇化为龙',
    group: 'QM',
    factors: [
      { id: 'SP052-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '蛇化为龙'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP052-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP052-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '蛇化为龙'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP052-A', name: '蛇化为龙得势', trigger: [{ op: 'has', args: ['stemRelations', '蛇化为龙'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP052-B', name: '蛇化为龙受制', trigger: [{ op: 'has', args: ['stemRelations', '蛇化为龙'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP052-A', pro: '蛇化为龙得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到蛇化为龙的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP052-001' },
      { comboId: 'COMBO-SP052-B', pro: '蛇化为龙受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到蛇化为龙，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-SP052-002' },
      { comboId: 'COMBO-SP052-A', pro: '蛇化为龙（吉格）：壬加地盘甲为蛇化为龙；排盘时以甲子戊代甲，故壬加地盘戊按此格论。', mix: '你的奇门格局出现「蛇化为龙」，蛇化为龙取壬螣蛇临甲青龙之象。壬主隐伏、流动和机变，甲主青龙、生发和财喜，阴柔、幕后、女性或隐性资源用事较有喜庆。阳主动求则容易有始无终，需要把机会落到明确步骤上。', lay: '简单说：暗中筹备、资源转换、贵人引荐可能转好；如幕后协调成事、隐藏机会浮现，但主动扩张时要防开头热、后面散。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-SP052-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP053: {
    id: 'SP053',
    name: '小蛇',
    group: 'QM',
    factors: [
      { id: 'SP053-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '小蛇'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP053-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP053-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '小蛇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP053-A', name: '小蛇成格', trigger: [{ op: 'has', args: ['stemRelations', '小蛇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP053-B', name: '小蛇受制', trigger: [{ op: 'has', args: ['stemRelations', '小蛇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP053-A', pro: '小蛇成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到小蛇，且门星落位，按部就班即可', lay: '盘面走到「小蛇」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP053-001' },
      { comboId: 'COMBO-SP053-B', pro: '小蛇受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到小蛇，但门星受制，力量打折', lay: '盘面有「小蛇」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP053-002' },
      { comboId: 'COMBO-SP053-A', pro: '小蛇（平格）：壬加地盘乙格名小蛇，阴人伏灾，阳人伤嗟，孕生贵子，禄马光华。', mix: '你的奇门格局出现「小蛇」，小蛇取壬水临乙日奇之象。壬为螣蛇、隐伏与流动，乙为柔木、文书和生机，此格吉凶随所问而变：生育、文书、禄马有可用之处，但阴私和隐藏风险也同时存在。', lay: '简单说：有利于孕育、学习、文书和流动机会；但也可能有暗病、隐忧、情绪低落或事情表面顺、内里藏麻烦。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP053-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP054: {
    id: 'SP054',
    name: '蛇入冶炉',
    group: 'QM',
    factors: [
      { id: 'SP054-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '蛇入冶炉'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP054-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP054-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '蛇入冶炉'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP054-A', name: '蛇入冶炉成象', trigger: [{ op: 'has', args: ['stemRelations', '蛇入冶炉'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP054-B', name: '蛇入冶炉受制', trigger: [{ op: 'has', args: ['stemRelations', '蛇入冶炉'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP054-A', pro: '蛇入冶炉成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到蛇入冶炉的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP054-001' },
      { comboId: 'COMBO-SP054-B', pro: '蛇入冶炉受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到蛇入冶炉，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP054-002' },
      { comboId: 'COMBO-SP054-A', pro: '蛇入冶炉（凶格）：壬加地盘丙为蛇入冶炉，主词讼争端、空事无图，遇刑禁则出而招徒。', mix: '你的奇门格局出现「蛇入冶炉」，蛇入冶炉取壬水螣蛇临丙火冶炉之象。水火相激，隐情遇明火，容易把争议、词讼、空耗和情绪推到台面。若又遇刑禁，脱身或出面处理反而招来更多牵连。', lay: '简单说：容易因投诉、争辩、公开说明、网络舆论或法律流程起冲突；如越解释越乱、越出面越被追问，或投入很多却没有实质成果。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP054-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP055: {
    id: 'SP055',
    name: '干合蛇刑',
    group: 'QM',
    factors: [
      { id: 'SP055-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '干合蛇刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP055-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP055-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '干合蛇刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP055-A', name: '干合蛇刑成格', trigger: [{ op: 'has', args: ['stemRelations', '干合蛇刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP055-B', name: '干合蛇刑受制', trigger: [{ op: 'has', args: ['stemRelations', '干合蛇刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP055-A', pro: '干合蛇刑成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到干合蛇刑，且门星落位，按部就班即可', lay: '盘面走到「干合蛇刑」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP055-001' },
      { comboId: 'COMBO-SP055-B', pro: '干合蛇刑受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到干合蛇刑，但门星受制，力量打折', lay: '盘面有「干合蛇刑」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP055-002' },
      { comboId: 'COMBO-SP055-A', pro: '干合蛇刑（平格）：壬加地盘丁为干合蛇刑，主文书财喜，宜阴人，贵人官禄，常人平平。', mix: '你的奇门格局出现「干合蛇刑」，干合蛇刑取壬丁相合而带螣蛇刑象。丁主文书、消息和细节，壬主隐伏、流动和机变，合处可见文书、财喜或官禄线索，但因带蛇刑，过程仍有曲折、疑虑和反复。', lay: '简单说：文书审批、财务消息、职位名义可能有进展；如通知到来、款项有眉目、贵人给机会，但普通事务多只是平稳，不宜过度期待。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP055-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP056: {
    id: 'SP056',
    name: '蛇凶入狱',
    group: 'QM',
    factors: [
      { id: 'SP056-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '蛇凶入狱'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP056-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP056-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '蛇凶入狱'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP056-A', name: '蛇凶入狱成象', trigger: [{ op: 'has', args: ['stemRelations', '蛇凶入狱'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP056-B', name: '蛇凶入狱受制', trigger: [{ op: 'has', args: ['stemRelations', '蛇凶入狱'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP056-A', pro: '蛇凶入狱成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到蛇凶入狱的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP056-001' },
      { comboId: 'COMBO-SP056-B', pro: '蛇凶入狱受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到蛇凶入狱，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP056-002' },
      { comboId: 'COMBO-SP056-A', pro: '蛇凶入狱（凶格）：壬加地盘己为蛇凶入狱，主大祸将成、夫妻不睦，若有刑象则罪责牵连。', mix: '你的奇门格局出现「蛇凶入狱」，蛇凶入狱取壬螣蛇临己地户之象。壬主隐情与流动，己主阴私、家宅和滞碍，二者相遇，隐藏问题容易被困在内部，发展成关系不和、责任纠缠或刑名风险。', lay: '简单说：家庭、伴侣、内部团队或隐秘事务易出问题；如夫妻争执、内部责任说不清、旧账翻出，或私下操作被追责。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP056-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP057: {
    id: 'SP057',
    name: '太白骑蛇',
    group: 'QM',
    factors: [
      { id: 'SP057-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '太白骑蛇'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP057-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP057-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太白骑蛇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP057-A', name: '太白骑蛇成象', trigger: [{ op: 'has', args: ['stemRelations', '太白骑蛇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP057-B', name: '太白骑蛇受制', trigger: [{ op: 'has', args: ['stemRelations', '太白骑蛇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP057-A', pro: '太白骑蛇成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到太白骑蛇的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP057-001' },
      { comboId: 'COMBO-SP057-B', pro: '太白骑蛇受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到太白骑蛇，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP057-002' },
      { comboId: 'COMBO-SP057-A', pro: '太白骑蛇（凶格）：壬加地盘庚为太白骑蛇，刑狱公明，好分正邪，如逢伤死则刑戮无差。', mix: '你的奇门格局出现「太白骑蛇」，太白骑蛇取壬螣蛇临庚太白之象。庚主刑杀、规则和决断，壬主疑惑、隐情和流动，此格有分辨正邪、查清责任的一面，但若凶门凶星同临，刑责和冲突会明显加重。', lay: '简单说：适合查证、审计、厘清责任，但不利带病硬冲；如调查取证、制度裁决、纠纷分责，也可能转成严厉处罚。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP057-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP058: {
    id: 'SP058',
    name: '螣蛇格干',
    group: 'QM',
    factors: [
      { id: 'SP058-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇格干'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP058-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP058-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇格干'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP058-A', name: '螣蛇格干成象', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇格干'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP058-B', name: '螣蛇格干受制', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇格干'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP058-A', pro: '螣蛇格干成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到螣蛇格干的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP058-001' },
      { comboId: 'COMBO-SP058-B', pro: '螣蛇格干受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到螣蛇格干，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP058-002' },
      { comboId: 'COMBO-SP058-A', pro: '螣蛇格干（凶格）：壬加地盘辛为螣蛇格干，符门虽吉亦不可安，谋事内生欺瞒。', mix: '你的奇门格局出现「螣蛇格干」，螣蛇格干取壬螣蛇临辛白虎之象。壬主隐伏，辛主细密、刑责和白虎，即使门符表面有利，内部仍容易有欺瞒、遗漏、虚实不明或责任暗伤。', lay: '简单说：计划表面顺，内部却可能有人隐瞒事实；如数据不实、合同暗坑、合伙人藏信息，或审查后才发现细节问题。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP058-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP059: {
    id: 'SP059',
    name: '螣蛇飞空',
    group: 'QM',
    factors: [
      { id: 'SP059-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇飞空'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP059-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP059-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇飞空'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP059-A', name: '螣蛇飞空成象', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇飞空'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP059-B', name: '螣蛇飞空受制', trigger: [{ op: 'has', args: ['stemRelations', '螣蛇飞空'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP059-A', pro: '螣蛇飞空成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到螣蛇飞空的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP059-001' },
      { comboId: 'COMBO-SP059-B', pro: '螣蛇飞空受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到螣蛇飞空，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP059-002' },
      { comboId: 'COMBO-SP059-A', pro: '螣蛇飞空（凶格）：壬加地盘癸为螣蛇飞空，主家不和睦、私情牵连，星门俱吉则信息可通。', mix: '你的奇门格局出现「螣蛇飞空」，螣蛇飞空取壬癸两水相并而壬临癸网之象。事情容易虚浮、飘忽、难落地，并牵出家宅不和、私密关系或消息真假问题。若星门俱吉，可先以沟通和信息确认化解。', lay: '简单说：消息很多但落地少，关系里猜疑增多；如家事不和、私情传闻、合作口头承诺多但执行空，或信息真假需要反复核对。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP059-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP060: {
    id: 'SP060',
    name: '华盖孛师',
    group: 'QM',
    factors: [
      { id: 'SP060-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '华盖孛师'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP060-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP060-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '华盖孛师'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP060-A', name: '华盖孛师成象', trigger: [{ op: 'has', args: ['stemRelations', '华盖孛师'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP060-B', name: '华盖孛师受制', trigger: [{ op: 'has', args: ['stemRelations', '华盖孛师'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP060-A', pro: '华盖孛师成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到华盖孛师的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP060-001' },
      { comboId: 'COMBO-SP060-B', pro: '华盖孛师受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到华盖孛师，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP060-002' },
      { comboId: 'COMBO-SP060-A', pro: '华盖孛师（凶格）：丙加地盘癸为华盖孛师，主词讼灾祸相随，后势仍有转圜。', mix: '你的奇门格局出现「华盖孛师」，华盖孛师代表明处行动被阴水词讼牵入暗处。丙为月奇、文采与公开行动，癸为天网、隐忧和规则纠缠。此格多主口舌、申诉、官面流程或阴私牵连，不宜逞强推进；但古籍有“后必无亏”之语，说明若证据齐备、流程合规，后势仍可缓解。', lay: '简单说：容易被词讼、规则或隐情拖住；如投诉申诉、合同争议、手续追补，或女性、隐私、人情关系牵出麻烦，但处理得当仍可能最终无大损。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP060-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP061: {
    id: 'SP061',
    name: '月奇勃格',
    group: 'QM',
    factors: [
      { id: 'SP061-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '月奇勃格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP061-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP061-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP061-A', name: '月奇勃格成象', trigger: [{ op: 'has', args: ['stemRelations', '月奇勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP061-B', name: '月奇勃格受制', trigger: [{ op: 'has', args: ['stemRelations', '月奇勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP061-A', pro: '月奇勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月奇勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP061-001' },
      { comboId: 'COMBO-SP061-B', pro: '月奇勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月奇勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP061-002' },
      { comboId: 'COMBO-SP061-A', pro: '月奇勃格（凶格）：丙加地盘丙为月奇勃格，主两重文书皆遭障格，门逆财亡，门顺虚迫。', mix: '你的奇门格局出现「月奇勃格」，月奇勃格取丙月奇重临而火势过盛之象。丙主光明、名位、文书和行动，两丙相并未必更吉，反而容易文书重复、流程互相抵触、名义过盛而实际受阻。门逆时损财更重，门顺时也多虚张、催迫、空忙。', lay: '简单说：文件、计划或承诺出现重复冲突；如两套材料互相打架、审批被驳回、财务事项被拖损，或表面声势很大但实际推进虚浮。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP061-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP062: {
    id: 'SP062',
    name: '青龙符格',
    group: 'QM',
    factors: [
      { id: 'SP062-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙符格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP062-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP062-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙符格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP062-A', name: '青龙符格成象', trigger: [{ op: 'has', args: ['stemRelations', '青龙符格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP062-B', name: '青龙符格受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙符格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP062-A', pro: '青龙符格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到青龙符格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP062-001' },
      { comboId: 'COMBO-SP062-B', pro: '青龙符格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到青龙符格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP062-002' },
      { comboId: 'COMBO-SP062-A', pro: '青龙符格（凶格）：六甲加庚为青龙符格，起咎成凶，即使星吉门顺亦宜静默。', mix: '你的奇门格局出现「青龙符格」，青龙符格取甲子戊青龙遇庚太白刑冲之象。甲主生发、财喜和贵人，庚主刑冲、阻隔和变动，二者相遇多主小过失牵出较大麻烦。即使门星顺吉，也偏宜静守、降速处理，不宜强行发动。', lay: '简单说：事项容易从瑕疵发展成冲突；如规则审查、合同违约、口舌投诉、财务争议或岗位变动带来压力，宜先稳住局面再处理。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP062-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP063: {
    id: 'SP063',
    name: '青龙网罗',
    group: 'QM',
    factors: [
      { id: 'SP063-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙网罗'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP063-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP063-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙网罗'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP063-A', name: '青龙网罗成象', trigger: [{ op: 'has', args: ['stemRelations', '青龙网罗'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP063-B', name: '青龙网罗受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙网罗'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP063-A', pro: '青龙网罗成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到青龙网罗的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP063-001' },
      { comboId: 'COMBO-SP063-B', pro: '青龙网罗受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到青龙网罗，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP063-002' },
      { comboId: 'COMBO-SP063-A', pro: '青龙网罗（凶格）：六甲加壬为青龙网罗，阴私事多灾祸，阳动求事也主诡谲不和。', mix: '你的奇门格局出现「青龙网罗」，青龙网罗取甲子戊青龙入壬水罗网之象。戊为甲子青龙、财喜和生发，壬主流动、隐伏、网罗和机变。此格容易让资源、财务、合作或人情关系陷入复杂牵连，越是暗中操作越容易加重风险；公开推进也多反复不和。', lay: '简单说：合作、钱款或人情被关系网拖住；如账款流转不清、多人协调失控、暗中承诺反噬，或事项因隐情而难以直线推进。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP063-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP064: {
    id: 'SP064',
    name: '刑青龙格',
    group: 'QM',
    factors: [
      { id: 'SP064-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '刑青龙格'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP064-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP064-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '刑青龙格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP064-A', name: '刑青龙格成格', trigger: [{ op: 'has', args: ['stemRelations', '刑青龙格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP064-B', name: '刑青龙格受制', trigger: [{ op: 'has', args: ['stemRelations', '刑青龙格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP064-A', pro: '刑青龙格成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到刑青龙格，且门星落位，按部就班即可', lay: '盘面走到「刑青龙格」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP064-001' },
      { comboId: 'COMBO-SP064-B', pro: '刑青龙格受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到刑青龙格，但门星受制，力量打折', lay: '盘面有「刑青龙格」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP064-002' },
      { comboId: 'COMBO-SP064-A', pro: '刑青龙格（平格）：庚加地盘甲为刑青龙格；排盘时以甲子戊代甲，故庚加地盘戊按此格论。', mix: '你的奇门格局出现「刑青龙格」，刑青龙格取庚太白临甲青龙之象。甲在奇门中遁藏于六仪，甲子遁于戊，所以实际排盘遇到庚加戊时，按庚加甲的传统克应处理。古籍言其“财利多荣”，但庚有刑克之气，须看门星是否相合；合则可免厄，不合则吉中藏凶。', lay: '简单说：财务、资源、职位或项目可能有收获，但过程伴随压力和规则约束；如资金到位但审核严格，机会出现但条件苛刻，合作有利却必须先化解冲突。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP064-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP065: {
    id: 'SP065',
    name: '日奇入雾',
    group: 'QM',
    factors: [
      { id: 'SP065-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '日奇入雾'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP065-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP065-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇入雾'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP065-A', name: '日奇入雾成象', trigger: [{ op: 'has', args: ['stemRelations', '日奇入雾'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP065-B', name: '日奇入雾受制', trigger: [{ op: 'has', args: ['stemRelations', '日奇入雾'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP065-A', pro: '日奇入雾成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日奇入雾的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP065-001' },
      { comboId: 'COMBO-SP065-B', pro: '日奇入雾受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日奇入雾，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP065-002' },
      { comboId: 'COMBO-SP065-A', pro: '日奇入雾（凶格）：乙为日奇（太阳），己为地户土雾，日入雾中，主被遮蔽、才能难伸。', mix: '你的奇门格局出现「日奇入雾」，日奇入雾代表才能被埋没、计划被拖延。乙为日奇（太阳、才华、希望），被己土（雾霾、阴私）遮蔽。主怀才不遇、好的想法得不到重视、计划被搁置。宜耐心等待云开雾散。', lay: '简单说：有能力却无发挥空间，好的方案被搁置不议；如求职被压价、提案被上级搁置、晋升被各种理由拖延。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP065-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP066: {
    id: 'SP066',
    name: '火孛入刑',
    group: 'QM',
    factors: [
      { id: 'SP066-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '火孛入刑'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP066-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP066-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '火孛入刑'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP066-A', name: '火孛入刑成象', trigger: [{ op: 'has', args: ['stemRelations', '火孛入刑'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP066-B', name: '火孛入刑受制', trigger: [{ op: 'has', args: ['stemRelations', '火孛入刑'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP066-A', pro: '火孛入刑成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到火孛入刑的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP066-001' },
      { comboId: 'COMBO-SP066-B', pro: '火孛入刑受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到火孛入刑，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP066-002' },
      { comboId: 'COMBO-SP066-A', pro: '火孛入刑（凶格）：丙加地盘己为火孛入刑，主文书不来，刑名官非受阻。', mix: '你的奇门格局出现「火孛入刑」，火孛入刑代表丙月奇落入己土地户刑滞之中。丙主文书、光明和公开行动，己主滞碍、阴私和责任牵连。此格不利诉讼、处罚、审批、合同、投诉等刑名规则事项，若门星同逆，容易从手续迟滞发展为处分或刑责。', lay: '简单说：文书迟迟不到、审批卡顿、官非牵连或责任说不清；如材料被退回、投诉处罚升级、合同责任纠缠，或因流程瑕疵被追责。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP066-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP067: {
    id: 'SP067',
    name: '孛乱来临',
    group: 'QM',
    factors: [
      { id: 'SP067-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '孛乱来临'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP067-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP067-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '孛乱来临'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP067-A', name: '孛乱来临成象', trigger: [{ op: 'has', args: ['stemRelations', '孛乱来临'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP067-B', name: '孛乱来临受制', trigger: [{ op: 'has', args: ['stemRelations', '孛乱来临'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP067-A', pro: '孛乱来临成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到孛乱来临的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP067-001' },
      { comboId: 'COMBO-SP067-B', pro: '孛乱来临受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到孛乱来临，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP067-002' },
      { comboId: 'COMBO-SP067-A', pro: '孛乱来临（凶格）：丙加地盘壬为孛乱来临，主文讼公庭，庶人流离，贵人失名。', mix: '你的奇门格局出现「孛乱来临」，孛乱来临代表丙火公开之事被壬水流荡搅乱。丙主名位、文书和行动，壬主流动、隐伏和失序。此格多应文书诉讼、公开争议、名誉受损、关系牵连，尤其忌因私情、人事暧昧或口舌不清而引发官面纠纷。', lay: '简单说：事务被争议和流言搅乱；如诉讼上庭、投诉曝光、名誉受损、合作方离散，或因人情私事牵出公开麻烦。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP067-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP068: {
    id: 'SP068',
    name: '朱雀入狱',
    group: 'QM',
    factors: [
      { id: 'SP068-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入狱'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP068-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP068-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '朱雀入狱'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP068-A', name: '朱雀入狱成象', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入狱'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP068-B', name: '朱雀入狱受制', trigger: [{ op: 'has', args: ['stemRelations', '朱雀入狱'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP068-A', pro: '朱雀入狱成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到朱雀入狱的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP068-001' },
      { comboId: 'COMBO-SP068-B', pro: '朱雀入狱受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到朱雀入狱，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP068-002' },
      { comboId: 'COMBO-SP068-A', pro: '朱雀入狱（凶格）：丁加地盘辛为朱雀入狱，主官人刑囚剥落，常人枷锁受制。', mix: '你的奇门格局出现「朱雀入狱」，朱雀入狱代表丁火文书消息被辛金刑狱约束。丁主文书、言语、消息和才华，辛主白虎、刑伤、审查和严厉规则。此格不宜只按普通相克看待，更要防文书成案、言语成责、职位被剥、流程受制。', lay: '简单说：文书、言语或职位受制度压住；如被问责、流程审查加严、合同争议升级、项目被监管卡住，普通事项则容易遇到处罚、投诉或强约束。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP068-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP069: {
    id: 'SP069',
    name: '火入勾神',
    group: 'QM',
    factors: [
      { id: 'SP069-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '火入勾神'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP069-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP069-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '火入勾神'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP069-A', name: '火入勾神成象', trigger: [{ op: 'has', args: ['stemRelations', '火入勾神'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP069-B', name: '火入勾神受制', trigger: [{ op: 'has', args: ['stemRelations', '火入勾神'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP069-A', pro: '火入勾神成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到火入勾神的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP069-001' },
      { comboId: 'COMBO-SP069-B', pro: '火入勾神受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到火入勾神，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP069-002' },
      { comboId: 'COMBO-SP069-A', pro: '火入勾神（凶格）：丁加地盘己为火入勾神，主文状词凶，私中有私，往则刑名。', mix: '你的奇门格局出现「火入勾神」，火入勾神代表丁火文书落入己土勾陈纠缠。丁主文状、消息、言语和细节，己主私隐、滞碍和责任牵连。此格比普通信息迟滞更重，重点在文书词讼、私情暗事、责任归属和官非刑名，不宜贸然递状或把私事公开化。', lay: '简单说：文书、口舌或私事容易变成纠纷；如投诉材料反伤自己、私下承诺被追责、合同细节牵出责任，或因隐情暴露引发处罚。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP069-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP070: {
    id: 'SP070',
    name: '织女寻牛',
    group: 'QM',
    factors: [
      { id: 'SP070-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '织女寻牛'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP070-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP070-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '织女寻牛'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP070-A', name: '织女寻牛成象', trigger: [{ op: 'has', args: ['stemRelations', '织女寻牛'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP070-B', name: '织女寻牛受制', trigger: [{ op: 'has', args: ['stemRelations', '织女寻牛'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP070-A', pro: '织女寻牛成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到织女寻牛的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP070-001' },
      { comboId: 'COMBO-SP070-B', pro: '织女寻牛受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到织女寻牛，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP070-002' },
      { comboId: 'COMBO-SP070-A', pro: '织女寻牛（凶格）：丁加地盘庚为织女寻牛，主私情冤仇，阴人无理，刑禁官囚。', mix: '你的奇门格局出现「织女寻牛」，织女寻牛取丁火文书情意遇庚金阻隔刑杀之象。丁主消息、情意、文书与细节，庚主太白、冲突、阻隔和刑伤。此格常把私情、人事牵连、旧怨和规则冲突拉到台面，感情、人际、诉讼、合规事项都不宜轻率推进。', lay: '简单说：私情或旧怨引发争执；如感情纠纷升级、合作方翻旧账、投诉诉讼牵连，或因不合规的人情操作带来处罚风险。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP070-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP071: {
    id: 'SP071',
    name: '墓入不明',
    group: 'QM',
    factors: [
      { id: 'SP071-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '墓入不明'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP071-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP071-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '墓入不明'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP071-A', name: '墓入不明成象', trigger: [{ op: 'has', args: ['stemRelations', '墓入不明'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP071-B', name: '墓入不明受制', trigger: [{ op: 'has', args: ['stemRelations', '墓入不明'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP071-A', pro: '墓入不明成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到墓入不明的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP071-001' },
      { comboId: 'COMBO-SP071-B', pro: '墓入不明受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到墓入不明，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP071-002' },
      { comboId: 'COMBO-SP071-A', pro: '墓入不明（凶格）：己加地盘乙为墓入不明，星门合吉尚可平稳，不合则事难成。', mix: '你的奇门格局出现「墓入不明」，墓入不明代表己土地户遮住乙日奇。己主阴私、滞碍、责任和旧事，乙主文书、协商、希望和柔性资源。此格不宜只按普通相克处理，重点在信息不明、责任不清、协商被旧问题拖住；若门星同宫得吉，仍可平平推进。', lay: '简单说：事情不够透明、材料或责任边界含糊；如审批理由不明、合作条件反复、旧账牵扯新事，或协商表面能走但难有明确成果。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP071-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP072: {
    id: 'SP072',
    name: '奇入墓',
    group: 'QM',
    factors: [
      { id: 'SP072-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '奇入墓'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP072-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP072-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '奇入墓'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP072-A', name: '奇入墓成象', trigger: [{ op: 'has', args: ['stemRelations', '奇入墓'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP072-B', name: '奇入墓受制', trigger: [{ op: 'has', args: ['stemRelations', '奇入墓'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP072-A', pro: '奇入墓成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到奇入墓的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP072-001' },
      { comboId: 'COMBO-SP072-B', pro: '奇入墓受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到奇入墓，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP072-002' },
      { comboId: 'COMBO-SP072-A', pro: '奇入墓（凶格）：己加地盘丁为奇入墓，主文书诉讼先有理、后受惩。', mix: '你的奇门格局出现「奇入墓」，奇入墓代表丁星奇文书落入己土地户墓滞。丁主文状、消息、细节和灵感，己主私隐、责任、滞碍和旧案。此格常见前期看似有理，后续却因证据、流程、责任归属或暗中细节而转为受制，不宜贸然递状或公开争辩。', lay: '简单说：文书、投诉、申诉或合同事项先顺后阻；如初审看似有利，复核被追责，材料细节被翻出问题，或因旧事牵连而受到处分。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP072-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP073: {
    id: 'SP073',
    name: '地户逢鬼',
    group: 'QM',
    factors: [
      { id: 'SP073-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '地户逢鬼'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP073-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP073-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地户逢鬼'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP073-A', name: '地户逢鬼成象', trigger: [{ op: 'has', args: ['stemRelations', '地户逢鬼'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP073-B', name: '地户逢鬼受制', trigger: [{ op: 'has', args: ['stemRelations', '地户逢鬼'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP073-A', pro: '地户逢鬼成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到地户逢鬼的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP073-001' },
      { comboId: 'COMBO-SP073-B', pro: '地户逢鬼受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到地户逢鬼，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP073-002' },
      { comboId: 'COMBO-SP073-A', pro: '地户逢鬼（凶格）：己加地盘己为地户逢鬼，主阴信难明，远近消息真假难委。', mix: '你的奇门格局出现「地户逢鬼」，地户逢鬼取双己重叠，阴私、滞碍和疑虑加重。己为地户，重见则事在暗处盘绕，消息、承诺、等待和内部协调容易真假难辨。若门符配合，消息仍可能来到，但判断时必须降低确定性，先核实再行动。', lay: '简单说：消息难辨、承诺不稳、内部牵扯多；如对方回复含糊、传闻真假不清、等待的人或文件迟迟不能确认，或暗中有人反复传话。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP073-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP074: {
    id: 'SP074',
    name: '魂神入墓',
    group: 'QM',
    factors: [
      { id: 'SP074-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '魂神入墓'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP074-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP074-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '魂神入墓'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP074-A', name: '魂神入墓成象', trigger: [{ op: 'has', args: ['stemRelations', '魂神入墓'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP074-B', name: '魂神入墓受制', trigger: [{ op: 'has', args: ['stemRelations', '魂神入墓'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP074-A', pro: '魂神入墓成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到魂神入墓的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP074-001' },
      { comboId: 'COMBO-SP074-B', pro: '魂神入墓受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到魂神入墓，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP074-002' },
      { comboId: 'COMBO-SP074-A', pro: '魂神入墓（凶格）：己加地盘辛为魂神入墓，主家中阴事、惊忧入户，小口灾遇。', mix: '你的奇门格局出现「魂神入墓」，魂神入墓代表己土地户与辛金白虎刑狱相缠。己主宅内、隐情和旧滞，辛主审查、病伤、惊惧和严厉规则。此格容易应在家宅、亲属、小孩、健康或内部人员问题上，不宜只按土生金看作资源落地。', lay: '简单说：家宅、亲属或内部小事引发惊忧；如孩子或下属出状况、家中旧患复发、内部审查带来压力，或小问题被规则放大。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP074-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP075: {
    id: 'SP075',
    name: '刑网高张',
    group: 'QM',
    factors: [
      { id: 'SP075-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '刑网高张'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP075-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP075-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '刑网高张'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP075-A', name: '刑网高张成象', trigger: [{ op: 'has', args: ['stemRelations', '刑网高张'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP075-B', name: '刑网高张受制', trigger: [{ op: 'has', args: ['stemRelations', '刑网高张'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP075-A', pro: '刑网高张成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到刑网高张的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP075-001' },
      { comboId: 'COMBO-SP075-B', pro: '刑网高张受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到刑网高张，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP075-002' },
      { comboId: 'COMBO-SP075-A', pro: '刑网高张（凶格）：己加地盘壬为刑网高张，主阴人奸恶、阳人遭伤，门迫星凶则两伤。', mix: '你的奇门格局出现「刑网高张」，刑网高张代表己土地户把壬水罗网拉高，暗处纠缠转为显性约束。己主私隐、责任和旧事，壬主流动、罗网、险阻和欺瞒。此格不宜只按土克水看主动可控，实际更要防被关系网、流程网、舆论网或隐情拖住。', lay: '简单说：纠纷范围扩大、关系牵连变多；如合同链条扯出多人责任、舆论扩散、账目资金被卡，或私下问题变成双方受损的公开麻烦。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP075-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP076: {
    id: 'SP076',
    name: '地刑玄武',
    group: 'QM',
    factors: [
      { id: 'SP076-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '地刑玄武'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP076-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP076-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地刑玄武'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP076-A', name: '地刑玄武成象', trigger: [{ op: 'has', args: ['stemRelations', '地刑玄武'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP076-B', name: '地刑玄武受制', trigger: [{ op: 'has', args: ['stemRelations', '地刑玄武'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP076-A', pro: '地刑玄武成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到地刑玄武的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP076-001' },
      { comboId: 'COMBO-SP076-B', pro: '地刑玄武受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到地刑玄武，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-SP076-002' },
      { comboId: 'COMBO-SP076-A', pro: '地刑玄武（凶格）：己加地盘癸为地刑玄武，主灾病沉吟，星门虽扶亦多疾苦。', mix: '你的奇门格局出现「地刑玄武」，地刑玄武代表己土地户压住癸水玄武，暗处病忧、隐情和责任负担加重。己主滞碍、旧事和责任，癸主天网、隐忧、病气和暗流。此格对健康、秘密、欠款、审批和长期拖延事项不利，宜先止损核查，不宜硬推。', lay: '简单说：病痛、隐情或拖欠问题反复；如旧病拖延、暗账难清、审批被隐性原因卡住，或表面有人帮忙但实际仍很消耗。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-SP076-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP077: {
    id: 'SP077',
    name: '青龙失惊',
    group: 'QM',
    factors: [
      { id: 'SP077-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙失惊'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP077-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP077-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙失惊'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP077-A', name: '青龙失惊成格', trigger: [{ op: 'has', args: ['stemRelations', '青龙失惊'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP077-B', name: '青龙失惊受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙失惊'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP077-A', pro: '青龙失惊成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到青龙失惊，且门星落位，按部就班即可', lay: '盘面走到「青龙失惊」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP077-001' },
      { comboId: 'COMBO-SP077-B', pro: '青龙失惊受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到青龙失惊，但门星受制，力量打折', lay: '盘面有「青龙失惊」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP077-002' },
      { comboId: 'COMBO-SP077-A', pro: '青龙失惊（平格）：六甲加辛为青龙失惊，门中一合可顺心，凶星上立则财利亡倾。', mix: '你的奇门格局出现「青龙失惊」，青龙失惊取甲子戊青龙遇辛金白虎惊惧之象。戊主财喜、贵人和根基，辛主审查、细密、病伤和惊忧。此格成败很依赖同宫门星：门星相合时，事情可以按心意推进；凶星压住时，则容易因审查、伤损或细节问题导致财利倾失。', lay: '简单说：机会中带惊扰；如资金、合同、健康或细节审查突然紧张，但若流程配合得当，仍可把事情稳住并继续推进。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP077-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP078: {
    id: 'SP078',
    name: '青龙华盖',
    group: 'QM',
    factors: [
      { id: 'SP078-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '青龙华盖'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP078-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP078-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙华盖'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP078-A', name: '青龙华盖成格', trigger: [{ op: 'has', args: ['stemRelations', '青龙华盖'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP078-B', name: '青龙华盖受制', trigger: [{ op: 'has', args: ['stemRelations', '青龙华盖'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP078-A', pro: '青龙华盖成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到青龙华盖，且门星落位，按部就班即可', lay: '盘面走到「青龙华盖」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP078-001' },
      { comboId: 'COMBO-SP078-B', pro: '青龙华盖受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到青龙华盖，但门星受制，力量打折', lay: '盘面有「青龙华盖」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP078-002' },
      { comboId: 'COMBO-SP078-A', pro: '青龙华盖（平格）：六甲加癸为青龙华盖，门合吉星则无灾，逢伤死门则阴私牵连。', mix: '你的奇门格局出现「青龙华盖」，青龙华盖取甲子戊青龙覆于癸水华盖天网之下。戊主财喜、生发和贵人，癸主华盖、隐伏、规则和网罗。此格有护持和遮蔽两面：门星吉顺时，能把风险罩住、让事项平稳过关；若逢伤门、死门或凶象重，则容易牵出阴私、感情或规则问题。', lay: '简单说：事项可被保护，也可能被隐情罩住；如手续在贵人帮助下平稳通过、低调处理反而无事，或因隐私、暧昧、人情和规则问题被拖累。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP078-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP079: {
    id: 'SP079',
    name: '伏格青龙',
    group: 'QM',
    factors: [
      { id: 'SP079-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '伏格青龙'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP079-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP079-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '伏格青龙'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP079-A', name: '伏格青龙成格', trigger: [{ op: 'has', args: ['stemRelations', '伏格青龙'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP079-B', name: '伏格青龙受制', trigger: [{ op: 'has', args: ['stemRelations', '伏格青龙'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP079-A', pro: '伏格青龙成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到伏格青龙，且门星落位，按部就班即可', lay: '盘面走到「伏格青龙」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP079-001' },
      { comboId: 'COMBO-SP079-B', pro: '伏格青龙受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到伏格青龙，但门星受制，力量打折', lay: '盘面有「伏格青龙」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP079-002' },
      { comboId: 'COMBO-SP079-A', pro: '伏格青龙（平格）：己加地盘甲（甲遁戊）为伏格青龙，门合吉星则财利隆，门逆凶星则所干成空。', mix: '你的奇门格局出现「伏格青龙」，伏格青龙对应六己加甲，奇门中甲遁于戊，故以己加地盘戊输出。此格带有青龙财利之机，但被己土地户伏住，成败很依赖同宫门星神：配合得吉可见财利和资源，配合不佳则计划落空。', lay: '简单说：财利或资源有机会但藏在暗处；如有人暗中帮忙、资金线索出现、旧资源可重新启用，但若环境不配合则容易空忙一场。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP079-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP080: {
    id: 'SP080',
    name: '孛师',
    group: 'QM',
    factors: [
      { id: 'SP080-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '孛师'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP080-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP080-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '孛师'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP080-A', name: '孛师成格', trigger: [{ op: 'has', args: ['stemRelations', '孛师'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP080-B', name: '孛师受制', trigger: [{ op: 'has', args: ['stemRelations', '孛师'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP080-A', pro: '孛师成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到孛师，且门星落位，按部就班即可', lay: '盘面走到「孛师」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP080-001' },
      { comboId: 'COMBO-SP080-B', pro: '孛师受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到孛师，但门星受制，力量打折', lay: '盘面有「孛师」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP080-002' },
      { comboId: 'COMBO-SP080-A', pro: '孛师（平格）：己加地盘丙为孛师，阳人可得宣赐爵禄，阴人则忌奸乱乘违。', mix: '你的奇门格局出现「孛师」，孛师代表己土地户遇丙月奇，暗处问题被光明照见。对职位、官面、奖赏、公开流程类事项，可能因被看见而得到机会；但在人事、私情、阴私事项中，也容易因被照破而引发混乱，所以不宜一概作吉。', lay: '简单说：公开流程带来机会，也可能暴露隐情；如获得任命、表彰、资源倾斜，或私下关系、违规细节被公开后引起麻烦。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP080-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP081: {
    id: 'SP081',
    name: '加中复奇',
    group: 'QM',
    factors: [
      { id: 'SP081-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '加中复奇'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP081-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP081-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '加中复奇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP081-A', name: '加中复奇成格', trigger: [{ op: 'has', args: ['stemRelations', '加中复奇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP081-B', name: '加中复奇受制', trigger: [{ op: 'has', args: ['stemRelations', '加中复奇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP081-A', pro: '加中复奇成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到加中复奇，且门星落位，按部就班即可', lay: '盘面走到「加中复奇」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP081-001' },
      { comboId: 'COMBO-SP081-B', pro: '加中复奇受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到加中复奇，但门星受制，力量打折', lay: '盘面有「加中复奇」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP081-002' },
      { comboId: 'COMBO-SP081-A', pro: '加中复奇（平格）：丁加地盘丙为加中复奇，主口舌跷蹊，贵招官禄，常人防刑。', mix: '你的奇门格局出现「加中复奇」，加中复奇取丁星奇加临丙月奇之象，文书、消息、名位和行动互相照见。此格不宜简单作吉：对有职位、资源、名望的人，可能带来官禄机会；对普通事项，则容易多生口舌、事有跷蹊，甚至因表达和流程失当而受责。', lay: '简单说：事情有异常亮点也有争议；如突然被关注、机会来得意外、材料反复解释，或因口舌、流程细节导致责任压力。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP081-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP082: {
    id: 'SP082',
    name: '奇仪得顺',
    group: 'QM',
    factors: [
      { id: 'SP082-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '奇仪得顺'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP082-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP082-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '奇仪得顺'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP082-A', name: '奇仪得顺成格', trigger: [{ op: 'has', args: ['stemRelations', '奇仪得顺'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP082-B', name: '奇仪得顺受制', trigger: [{ op: 'has', args: ['stemRelations', '奇仪得顺'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP082-A', pro: '奇仪得顺成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到奇仪得顺，且门星落位，按部就班即可', lay: '盘面走到「奇仪得顺」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP082-001' },
      { comboId: 'COMBO-SP082-B', pro: '奇仪得顺受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到奇仪得顺，但门星受制，力量打折', lay: '盘面有「奇仪得顺」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP082-002' },
      { comboId: 'COMBO-SP082-A', pro: '奇仪得顺（平格）：乙加地盘丙为奇仪得顺格，逢吉星有迁官之兆，但问夫妻事主离别之忧。', mix: '你的奇门格局出现「奇仪得顺」，奇仪得顺代表日奇得丙火明照，计划和文书顺势展开。乙为日奇，丙为月奇之光，两者相临多利展示、上行、名位和流程推进；但古籍同时提示夫妻占问有离别之忧，所以不宜一概作纯吉，应结合门、星、神和所问事项判断。', lay: '简单说：工作、申请、升迁、文书推进更容易见到回应；但感情或家庭题中，可能表现为异地、分开处理事务，或因各自方向不同而短暂疏离。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP082-003' },
    ],
    dimTags: ['DIM_12'],
  },
  SP083: {
    id: 'SP083',
    name: '奇入朱雀',
    group: 'QM',
    factors: [
      { id: 'SP083-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['stemRelations', '奇入朱雀'] }], fieldBinding: ['stemRelations', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'SP083-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'SP083-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '奇入朱雀'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-SP083-A', name: '奇入朱雀成格', trigger: [{ op: 'has', args: ['stemRelations', '奇入朱雀'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SP083-B', name: '奇入朱雀受制', trigger: [{ op: 'has', args: ['stemRelations', '奇入朱雀'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-SP083-A', pro: '奇入朱雀成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到奇入朱雀，且门星落位，按部就班即可', lay: '盘面走到「奇入朱雀」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP083-001' },
      { comboId: 'COMBO-SP083-B', pro: '奇入朱雀受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到奇入朱雀，但门星受制，力量打折', lay: '盘面有「奇入朱雀」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-SP083-002' },
      { comboId: 'COMBO-SP083-A', pro: '奇入朱雀（平格）：丙加地盘丁为奇入朱雀，主文书亨通，贵占权握，常人衣禄退剥。', mix: '你的奇门格局出现「奇入朱雀」，奇入朱雀取丙月奇入丁星奇文书之象。丙主公开行动、名位与光明，丁主朱雀、文书、消息和表达。此格利文书、申报、权责表达，贵人占问可握权，但普通事项容易因过度显露、承诺过满或文书牵连而损耗衣禄。', lay: '简单说：文书沟通更容易打开，但也伴随责任成本；如申请得以推进、权责写明、公开声明引来关注，或普通人因文书、承诺和表达而有损耗。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-SP083-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL001: {
    id: 'CL001',
    name: '日奇入墓',
    group: 'QM',
    factors: [
      { id: 'CL001-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '日奇入墓'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL001-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL001-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇入墓'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL001-A', name: '日奇入墓成象', trigger: [{ op: 'has', args: ['classicPatterns', '日奇入墓'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL001-B', name: '日奇入墓受制', trigger: [{ op: 'has', args: ['classicPatterns', '日奇入墓'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL001-A', pro: '日奇入墓成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日奇入墓的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL001-001' },
      { comboId: 'COMBO-CL001-B', pro: '日奇入墓受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日奇入墓，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL001-002' },
      { comboId: 'COMBO-CL001-A', pro: '日奇入墓（凶格）', mix: '你的奇门格局出现「日奇入墓」，柔和的事今天发挥不出来，遇到顺势就走，别强求。', lay: '简单说：协商和文书发挥不出来、柔和方式效果弱', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL001-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL002: {
    id: 'CL002',
    name: '月奇入墓',
    group: 'QM',
    factors: [
      { id: 'CL002-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '月奇入墓'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL002-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL002-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇入墓'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL002-A', name: '月奇入墓成象', trigger: [{ op: 'has', args: ['classicPatterns', '月奇入墓'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL002-B', name: '月奇入墓受制', trigger: [{ op: 'has', args: ['classicPatterns', '月奇入墓'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL002-A', pro: '月奇入墓成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月奇入墓的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL002-001' },
      { comboId: 'COMBO-CL002-B', pro: '月奇入墓受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月奇入墓，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL002-002' },
      { comboId: 'COMBO-CL002-A', pro: '月奇入墓（凶格）', mix: '你的奇门格局出现「月奇入墓」，今天对外推广、表达类的事难显效，先做内部准备。', lay: '简单说：展示和表达类事难显效、对内准备更好', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL002-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL003: {
    id: 'CL003',
    name: '星奇入墓',
    group: 'QM',
    factors: [
      { id: 'CL003-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '星奇入墓'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL003-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL003-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '星奇入墓'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL003-A', name: '星奇入墓成象', trigger: [{ op: 'has', args: ['classicPatterns', '星奇入墓'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL003-B', name: '星奇入墓受制', trigger: [{ op: 'has', args: ['classicPatterns', '星奇入墓'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL003-A', pro: '星奇入墓成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到星奇入墓的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL003-001' },
      { comboId: 'COMBO-CL003-B', pro: '星奇入墓受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到星奇入墓，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL003-002' },
      { comboId: 'COMBO-CL003-A', pro: '星奇入墓（凶格）', mix: '你的奇门格局出现「星奇入墓」，今天精细工作和暗中协调发挥不出来，劲使在能落地的事上。', lay: '简单说：精细工作发挥不出来、暗中协调效果弱', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL003-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL004: {
    id: 'CL004',
    name: '日奇受制',
    group: 'QM',
    factors: [
      { id: 'CL004-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '日奇受制'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL004-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL004-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇受制'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL004-A', name: '日奇受制成象', trigger: [{ op: 'has', args: ['classicPatterns', '日奇受制'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL004-B', name: '日奇受制受制', trigger: [{ op: 'has', args: ['classicPatterns', '日奇受制'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL004-A', pro: '日奇受制成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日奇受制的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL004-001' },
      { comboId: 'COMBO-CL004-B', pro: '日奇受制受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日奇受制，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL004-002' },
      { comboId: 'COMBO-CL004-A', pro: '日奇受制（凶格）', mix: '你的奇门格局出现「日奇受制」，今天柔性沟通、文书推进容易被规则或强势对象压住，先避开硬碰硬。', lay: '简单说：协商受压、文书被卡、柔性办法难展开', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL004-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL005: {
    id: 'CL005',
    name: '月奇受制',
    group: 'QM',
    factors: [
      { id: 'CL005-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '月奇受制'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL005-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL005-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇受制'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL005-A', name: '月奇受制成象', trigger: [{ op: 'has', args: ['classicPatterns', '月奇受制'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL005-B', name: '月奇受制受制', trigger: [{ op: 'has', args: ['classicPatterns', '月奇受制'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL005-A', pro: '月奇受制成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月奇受制的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL005-001' },
      { comboId: 'COMBO-CL005-B', pro: '月奇受制受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月奇受制，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL005-002' },
      { comboId: 'COMBO-CL005-A', pro: '月奇受制（凶格）', mix: '你的奇门格局出现「月奇受制」，今天公开表达、曝光和推进容易被冷处理或阻断，先收束火力。', lay: '简单说：展示受阻、表达被冷处理、推进遇阻', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL005-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL006: {
    id: 'CL006',
    name: '星奇受制',
    group: 'QM',
    factors: [
      { id: 'CL006-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '星奇受制'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL006-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL006-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '星奇受制'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL006-A', name: '星奇受制成象', trigger: [{ op: 'has', args: ['classicPatterns', '星奇受制'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL006-B', name: '星奇受制受制', trigger: [{ op: 'has', args: ['classicPatterns', '星奇受制'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL006-A', pro: '星奇受制成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到星奇受制的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL006-001' },
      { comboId: 'COMBO-CL006-B', pro: '星奇受制受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到星奇受制，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL006-002' },
      { comboId: 'COMBO-CL006-A', pro: '星奇受制（凶格）', mix: '你的奇门格局出现「星奇受制」，今天精细沟通、内部协调和暗线帮助容易发挥不出来，适合先保存证据。', lay: '简单说：内部协调受阻、细节难发挥、暗助不显', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL006-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL007: {
    id: 'CL007',
    name: '日奇得使',
    group: 'QM',
    factors: [
      { id: 'CL007-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '日奇得使'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL007-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL007-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日奇得使'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL007-A', name: '日奇得使成格', trigger: [{ op: 'has', args: ['classicPatterns', '日奇得使'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL007-B', name: '日奇得使受制', trigger: [{ op: 'has', args: ['classicPatterns', '日奇得使'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL007-A', pro: '日奇得使成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到日奇得使，且门星落位，按部就班即可', lay: '盘面走到「日奇得使」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL007-001' },
      { comboId: 'COMBO-CL007-B', pro: '日奇得使受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到日奇得使，但门星受制，力量打折', lay: '盘面有「日奇得使」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CL007-002' },
      { comboId: 'COMBO-CL007-A', pro: '日奇得使（平格）', mix: '你的奇门格局出现「日奇得使」，协商、文书、柔性沟通的事特别顺，关键人物愿意配合；乙奇得使可大胆推进需要共识的事。', lay: '简单说：协商成功、文书签成、对方配合度高', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL007-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL008: {
    id: 'CL008',
    name: '月奇得使',
    group: 'QM',
    factors: [
      { id: 'CL008-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '月奇得使'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL008-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL008-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇得使'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL008-A', name: '月奇得使成格', trigger: [{ op: 'has', args: ['classicPatterns', '月奇得使'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL008-B', name: '月奇得使受制', trigger: [{ op: 'has', args: ['classicPatterns', '月奇得使'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL008-A', pro: '月奇得使成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到月奇得使，且门星落位，按部就班即可', lay: '盘面走到「月奇得使」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL008-001' },
      { comboId: 'COMBO-CL008-B', pro: '月奇得使受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到月奇得使，但门星受制，力量打折', lay: '盘面有「月奇得使」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CL008-002' },
      { comboId: 'COMBO-CL008-A', pro: '月奇得使（平格）', mix: '你的奇门格局出现「月奇得使」，展示、表达、对外发声有特别效果，能被关键的人看到；月奇得使可以放心做需要曝光的事。', lay: '简单说：展示获好评、表达被听见、关键曝光', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL008-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL009: {
    id: 'CL009',
    name: '星奇得使',
    group: 'QM',
    factors: [
      { id: 'CL009-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '星奇得使'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL009-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL009-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '星奇得使'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL009-A', name: '星奇得使成格', trigger: [{ op: 'has', args: ['classicPatterns', '星奇得使'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL009-B', name: '星奇得使受制', trigger: [{ op: 'has', args: ['classicPatterns', '星奇得使'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL009-A', pro: '星奇得使成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到星奇得使，且门星落位，按部就班即可', lay: '盘面走到「星奇得使」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL009-001' },
      { comboId: 'COMBO-CL009-B', pro: '星奇得使受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到星奇得使，但门星受制，力量打折', lay: '盘面有「星奇得使」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CL009-002' },
      { comboId: 'COMBO-CL009-A', pro: '星奇得使（平格）', mix: '你的奇门格局出现「星奇得使」，精细工作、暗中协调、内部沟通效果特别好；星奇得使适合做需要精修和幕后推动的事。', lay: '简单说：内部协调顺利、精修见效、暗助到位', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CL009-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL010: {
    id: 'CL010',
    name: '真诈',
    group: 'QM',
    factors: [
      { id: 'CL010-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '真诈'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL010-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL010-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '真诈'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL010-A', name: '真诈得势', trigger: [{ op: 'has', args: ['classicPatterns', '真诈'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL010-B', name: '真诈受制', trigger: [{ op: 'has', args: ['classicPatterns', '真诈'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL010-A', pro: '真诈得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到真诈的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL010-001' },
      { comboId: 'COMBO-CL010-B', pro: '真诈受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到真诈，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL010-002' },
      { comboId: 'COMBO-CL010-A', pro: '真诈（吉格）：三奇、吉门、太阴同宫，乃真诈之格，主隐蔽得助、柔性成事。', mix: '你的奇门格局出现「真诈」，适合用低调、柔和、私下沟通的方式推进，越是不张扬越容易成。', lay: '简单说：私下沟通顺利、暗中有人配合、柔性推进见效', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL010-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL011: {
    id: 'CL011',
    name: '重诈',
    group: 'QM',
    factors: [
      { id: 'CL011-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '重诈'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL011-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL011-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '重诈'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL011-A', name: '重诈得势', trigger: [{ op: 'has', args: ['classicPatterns', '重诈'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL011-B', name: '重诈受制', trigger: [{ op: 'has', args: ['classicPatterns', '重诈'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL011-A', pro: '重诈得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到重诈的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL011-001' },
      { comboId: 'COMBO-CL011-B', pro: '重诈受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到重诈，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL011-002' },
      { comboId: 'COMBO-CL011-A', pro: '重诈（吉格）：三奇、吉门、九地同宫，乃重诈之格，主伏藏蓄势、稳中取利。', mix: '你的奇门格局出现「重诈」，适合先藏住底牌、稳扎稳打地争取资源，不宜急着公开摊牌。', lay: '简单说：资源暗中积累、稳步取利、伏藏后发', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL011-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL012: {
    id: 'CL012',
    name: '休诈',
    group: 'QM',
    factors: [
      { id: 'CL012-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '休诈'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL012-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL012-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '休诈'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL012-A', name: '休诈得势', trigger: [{ op: 'has', args: ['classicPatterns', '休诈'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL012-B', name: '休诈受制', trigger: [{ op: 'has', args: ['classicPatterns', '休诈'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL012-A', pro: '休诈得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到休诈的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL012-001' },
      { comboId: 'COMBO-CL012-B', pro: '休诈受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到休诈，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL012-002' },
      { comboId: 'COMBO-CL012-A', pro: '休诈（吉格）：三奇、吉门、六合同宫，乃休诈之格，主和合调停、协作成事。', mix: '你的奇门格局出现「休诈」，适合谈合作、做协调、修复关系，借助中间人或团队配合更顺。', lay: '简单说：合作达成、关系缓和、调停有效', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL012-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL013: {
    id: 'CL013',
    name: '天遁',
    group: 'QM',
    factors: [
      { id: 'CL013-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '天遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL013-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL013-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL013-A', name: '天遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '天遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL013-B', name: '天遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '天遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL013-A', pro: '天遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到天遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL013-001' },
      { comboId: 'COMBO-CL013-B', pro: '天遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到天遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL013-002' },
      { comboId: 'COMBO-CL013-A', pro: '天遁（吉格）', mix: '你的奇门格局出现「天遁」，特别难得的机会窗口，主动出击都顺，关键沟通和签约都有利。但出手要果断，拖久了就凉了。', lay: '简单说：关键沟通顺利、签约成功、对方主动抛出好条件', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL013-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL014: {
    id: 'CL014',
    name: '地遁',
    group: 'QM',
    factors: [
      { id: 'CL014-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '地遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL014-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL014-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL014-A', name: '地遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '地遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL014-B', name: '地遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '地遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL014-A', pro: '地遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到地遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL014-001' },
      { comboId: 'COMBO-CL014-B', pro: '地遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到地遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL014-002' },
      { comboId: 'COMBO-CL014-A', pro: '地遁（吉格）：开门、乙奇、地盘己同宫，乃地遁之格，主稳健长远、地利相助。', mix: '你的奇门格局出现「地遁」，适合做需要稳扎稳打的事，比如基础准备、长期布局。', lay: '简单说：基础扎实、长期项目推进顺利', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL014-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL015: {
    id: 'CL015',
    name: '人遁',
    group: 'QM',
    factors: [
      { id: 'CL015-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '人遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL015-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL015-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '人遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL015-A', name: '人遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '人遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL015-B', name: '人遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '人遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL015-A', pro: '人遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到人遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL015-001' },
      { comboId: 'COMBO-CL015-B', pro: '人遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到人遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL015-002' },
      { comboId: 'COMBO-CL015-A', pro: '人遁（吉格）：休门、太阴、丁奇同宫，乃人遁之格，主低调得人和、暗中得助。', mix: '你的奇门格局出现「人遁」，今天靠人脉、私下沟通会比公开推进更有效，关键人物愿意帮你。', lay: '简单说：关键人主动伸手、私下消息利好', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL015-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL016: {
    id: 'CL016',
    name: '神遁',
    group: 'QM',
    factors: [
      { id: 'CL016-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '神遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL016-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL016-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '神遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL016-A', name: '神遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '神遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL016-B', name: '神遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '神遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL016-A', pro: '神遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到神遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL016-001' },
      { comboId: 'COMBO-CL016-B', pro: '神遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到神遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL016-002' },
      { comboId: 'COMBO-CL016-A', pro: '神遁（吉格）：生门、丙奇、九天同宫，乃神遁之格，主神助、机缘自显、谋为成功。', mix: '你的奇门格局出现「神遁」，今天关键事会有意外的助力出现，对外推进比预期顺，可以大胆推进重要的事。', lay: '简单说：关键事情顺利、助力出现、好消息传来', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL016-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL017: {
    id: 'CL017',
    name: '鬼遁',
    group: 'QM',
    factors: [
      { id: 'CL017-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '鬼遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL017-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL017-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '鬼遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL017-A', name: '鬼遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '鬼遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL017-B', name: '鬼遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '鬼遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL017-A', pro: '鬼遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到鬼遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL017-001' },
      { comboId: 'COMBO-CL017-B', pro: '鬼遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到鬼遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL017-002' },
      { comboId: 'COMBO-CL017-A', pro: '鬼遁（吉格）：乙/丁、九地与杜门/开门同宫，乃鬼遁之格，主暗中操作、私下成事。', mix: '你的奇门格局出现「鬼遁」，今天用私下沟通、内部协调的方式更容易成事，别公开摊牌。', lay: '简单说：暗中成事、私下沟通有效', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL017-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL018: {
    id: 'CL018',
    name: '龙遁',
    group: 'QM',
    factors: [
      { id: 'CL018-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '龙遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL018-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL018-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '龙遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL018-A', name: '龙遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '龙遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL018-B', name: '龙遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '龙遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL018-A', pro: '龙遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到龙遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL018-001' },
      { comboId: 'COMBO-CL018-B', pro: '龙遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到龙遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL018-002' },
      { comboId: 'COMBO-CL018-A', pro: '龙遁（吉格）', mix: '你的奇门格局出现「龙遁」，今天适合做需要隐忍、需要靠潜在资源的事，明面慢但底牌强。', lay: '简单说：深层资源被调动、暗中有人帮忙', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL018-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL019: {
    id: 'CL019',
    name: '虎遁',
    group: 'QM',
    factors: [
      { id: 'CL019-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '虎遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL019-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL019-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '虎遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL019-A', name: '虎遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '虎遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL019-B', name: '虎遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '虎遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL019-A', pro: '虎遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到虎遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL019-001' },
      { comboId: 'COMBO-CL019-B', pro: '虎遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到虎遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL019-002' },
      { comboId: 'COMBO-CL019-A', pro: '虎遁（吉格）', mix: '你的奇门格局出现「虎遁」，今天适合做需要稳扎稳打、积累资源的事，越是低调越能成。', lay: '简单说：积累见成效、资源稳步回归', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL019-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL020: {
    id: 'CL020',
    name: '风遁',
    group: 'QM',
    factors: [
      { id: 'CL020-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '风遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL020-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL020-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '风遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL020-A', name: '风遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '风遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL020-B', name: '风遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '风遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL020-A', pro: '风遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到风遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL020-001' },
      { comboId: 'COMBO-CL020-B', pro: '风遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到风遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL020-002' },
      { comboId: 'COMBO-CL020-A', pro: '风遁（吉格）：乙奇、杜门落巽四宫，乃风遁之格，主消息流通、文书传递。', mix: '你的奇门格局出现「风遁」，今天适合发文、传话、撮合，沟通的事会比平时顺很多。', lay: '简单说：消息传得快、文书和沟通特别顺', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL020-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL021: {
    id: 'CL021',
    name: '云遁',
    group: 'QM',
    factors: [
      { id: 'CL021-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '云遁'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL021-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL021-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '云遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL021-A', name: '云遁得势', trigger: [{ op: 'has', args: ['classicPatterns', '云遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL021-B', name: '云遁受制', trigger: [{ op: 'has', args: ['classicPatterns', '云遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL021-A', pro: '云遁得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到云遁的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL021-001' },
      { comboId: 'COMBO-CL021-B', pro: '云遁受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到云遁，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL021-002' },
      { comboId: 'COMBO-CL021-A', pro: '云遁（吉格）：开门、乙奇加天盘辛，乃云遁之格，主升迁、求职、上行通达。', mix: '你的奇门格局出现「云遁」，今天适合求贵人、跑升职、谈进阶，向上的事会有回应。', lay: '简单说：机会向上升、贵人从远方来', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL021-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL022: {
    id: 'CL022',
    name: '宝鉴三奇得使',
    group: 'QM',
    factors: [
      { id: 'CL022-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '宝鉴三奇得使'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL022-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL022-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '宝鉴三奇得使'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL022-A', name: '宝鉴三奇得使得势', trigger: [{ op: 'has', args: ['classicPatterns', '宝鉴三奇得使'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL022-B', name: '宝鉴三奇得使受制', trigger: [{ op: 'has', args: ['classicPatterns', '宝鉴三奇得使'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL022-A', pro: '宝鉴三奇得使得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到宝鉴三奇得使的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL022-001' },
      { comboId: 'COMBO-CL022-B', pro: '宝鉴三奇得使受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到宝鉴三奇得使，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL022-002' },
      { comboId: 'COMBO-CL022-A', pro: '宝鉴三奇得使（吉格）', mix: '你的奇门格局出现「宝鉴三奇得使」，', lay: '简单说：关键入口得奇、谋事尤利、资源与行动窗口重合', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL022-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL023: {
    id: 'CL023',
    name: '三奇游六仪',
    group: 'QM',
    factors: [
      { id: 'CL023-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '三奇游六仪'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL023-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL023-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '三奇游六仪'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL023-A', name: '三奇游六仪得势', trigger: [{ op: 'has', args: ['classicPatterns', '三奇游六仪'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL023-B', name: '三奇游六仪受制', trigger: [{ op: 'has', args: ['classicPatterns', '三奇游六仪'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL023-A', pro: '三奇游六仪得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到三奇游六仪的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL023-001' },
      { comboId: 'COMBO-CL023-B', pro: '三奇游六仪受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到三奇游六仪，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL023-002' },
      { comboId: 'COMBO-CL023-A', pro: '三奇游六仪（吉格）', mix: '你的奇门格局出现「三奇游六仪」，今天关键资源能借势转换，适合请托、宴会、协商和争取机会；若同宫得吉门，推进更顺。', lay: '简单说：关键资源转换成助力、请托协商顺利、人情往来得便', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL023-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL024: {
    id: 'CL024',
    name: '三奇会甲',
    group: 'QM',
    factors: [
      { id: 'CL024-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '三奇会甲'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL024-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL024-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '三奇会甲'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL024-A', name: '三奇会甲得势', trigger: [{ op: 'has', args: ['classicPatterns', '三奇会甲'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL024-B', name: '三奇会甲受制', trigger: [{ op: 'has', args: ['classicPatterns', '三奇会甲'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL024-A', pro: '三奇会甲得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到三奇会甲的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL024-001' },
      { comboId: 'COMBO-CL024-B', pro: '三奇会甲受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到三奇会甲，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL024-002' },
      { comboId: 'COMBO-CL024-A', pro: '三奇会甲（吉格）：甲（己）日三奇乙丙丁齐显，主贵人助力、机会汇聚。', mix: '你的奇门格局出现「三奇会甲」，今天三奇都在盘上，主线很容易找到帮忙的人和机会，重要的事可以出手。', lay: '简单说：贵人助力汇聚、主线方向有人支持', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL024-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL025: {
    id: 'CL025',
    name: '符使同宫',
    group: 'QM',
    factors: [
      { id: 'CL025-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '符使同宫'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL025-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL025-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '符使同宫'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL025-A', name: '符使同宫得势', trigger: [{ op: 'has', args: ['classicPatterns', '符使同宫'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL025-B', name: '符使同宫受制', trigger: [{ op: 'has', args: ['classicPatterns', '符使同宫'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL025-A', pro: '符使同宫得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到符使同宫的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL025-001' },
      { comboId: 'COMBO-CL025-B', pro: '符使同宫受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到符使同宫，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL025-002' },
      { comboId: 'COMBO-CL025-A', pro: '符使同宫（吉格）', mix: '你的奇门格局出现「符使同宫」，今天想做一件具体的事，力量非常集中，容易出结果。但也要注意过于偏执。', lay: '简单说：专注的事情容易出成果', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL025-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL026: {
    id: 'CL026',
    name: '相佐',
    group: 'QM',
    factors: [
      { id: 'CL026-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '相佐'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL026-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL026-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '相佐'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL026-A', name: '相佐得势', trigger: [{ op: 'has', args: ['classicPatterns', '相佐'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL026-B', name: '相佐受制', trigger: [{ op: 'has', args: ['classicPatterns', '相佐'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL026-A', pro: '相佐得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到相佐的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL026-001' },
      { comboId: 'COMBO-CL026-B', pro: '相佐受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到相佐，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL026-002' },
      { comboId: 'COMBO-CL026-A', pro: '相佐（吉格）', mix: '你的奇门格局出现「相佐」，今天关键人或关键资源有辅助作用，适合借力推进，但仍要结合门星吉凶判断力度。', lay: '简单说：贵人助力、关键资源配合、推进有人相帮', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL026-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL027: {
    id: 'CL027',
    name: '守户',
    group: 'QM',
    factors: [
      { id: 'CL027-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '守户'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL027-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL027-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '守户'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL027-A', name: '守户得势', trigger: [{ op: 'has', args: ['classicPatterns', '守户'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL027-B', name: '守户受制', trigger: [{ op: 'has', args: ['classicPatterns', '守户'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL027-A', pro: '守户得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到守户的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL027-001' },
      { comboId: 'COMBO-CL027-B', pro: '守户受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到守户，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL027-002' },
      { comboId: 'COMBO-CL027-A', pro: '守户（吉格）', mix: '你的奇门格局出现「守户」，今天行动入口、沟通窗口或办事通道有保护与缓冲，适合稳住关键环节后再推进。', lay: '简单说：入口得护、手续有缓冲、关键通道较稳', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL027-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL028: {
    id: 'CL028',
    name: '天乙飞宫格',
    group: 'QM',
    factors: [
      { id: 'CL028-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '天乙飞宫格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL028-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL028-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天乙飞宫格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL028-A', name: '天乙飞宫格成象', trigger: [{ op: 'has', args: ['classicPatterns', '天乙飞宫格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL028-B', name: '天乙飞宫格受制', trigger: [{ op: 'has', args: ['classicPatterns', '天乙飞宫格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL028-A', pro: '天乙飞宫格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到天乙飞宫格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL028-001' },
      { comboId: 'COMBO-CL028-B', pro: '天乙飞宫格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到天乙飞宫格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL028-002' },
      { comboId: 'COMBO-CL028-A', pro: '天乙飞宫格（凶格）', mix: '你的奇门格局出现「天乙飞宫格」，今天贵人运受阻，想帮你的人也不好出手，关键事先靠自己。', lay: '简单说：贵人使不上力、求援被拒', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL028-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL029: {
    id: 'CL029',
    name: '天乙伏宫格',
    group: 'QM',
    factors: [
      { id: 'CL029-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '天乙伏宫格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL029-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL029-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天乙伏宫格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL029-A', name: '天乙伏宫格成象', trigger: [{ op: 'has', args: ['classicPatterns', '天乙伏宫格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL029-B', name: '天乙伏宫格受制', trigger: [{ op: 'has', args: ['classicPatterns', '天乙伏宫格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL029-A', pro: '天乙伏宫格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到天乙伏宫格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL029-001' },
      { comboId: 'COMBO-CL029-B', pro: '天乙伏宫格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到天乙伏宫格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL029-002' },
      { comboId: 'COMBO-CL029-A', pro: '天乙伏宫格（凶格）', mix: '你的奇门格局出现「天乙伏宫格」，今天想帮你的人自己也有事缠身，重大支持的渠道先确认再依赖。', lay: '简单说：贵人自顾不暇、支持渠道不畅', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL029-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL030: {
    id: 'CL030',
    name: '勃格',
    group: 'QM',
    factors: [
      { id: 'CL030-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '勃格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL030-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL030-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL030-A', name: '勃格成象', trigger: [{ op: 'has', args: ['classicPatterns', '勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL030-B', name: '勃格受制', trigger: [{ op: 'has', args: ['classicPatterns', '勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL030-A', pro: '勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL030-001' },
      { comboId: 'COMBO-CL030-B', pro: '勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL030-002' },
      { comboId: 'COMBO-CL030-A', pro: '勃格（凶格）', mix: '你的奇门格局出现「勃格」，今天关键推动力容易与规则压力正面相冲，贸然推进会把局面搅乱，先稳住秩序更合适。', lay: '简单说：纲纪紊乱、推进失序、事多反覆', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL030-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL031: {
    id: 'CL031',
    name: '格勃',
    group: 'QM',
    factors: [
      { id: 'CL031-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '格勃'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL031-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL031-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '格勃'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL031-A', name: '格勃成象', trigger: [{ op: 'has', args: ['classicPatterns', '格勃'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL031-B', name: '格勃受制', trigger: [{ op: 'has', args: ['classicPatterns', '格勃'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL031-A', pro: '格勃成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到格勃的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL031-001' },
      { comboId: 'COMBO-CL031-B', pro: '格勃受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到格勃，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL031-002' },
      { comboId: 'COMBO-CL031-A', pro: '格勃（凶格）', mix: '你的奇门格局出现「格勃」，今天关键主事力量被冲动和阻隔牵制，不宜硬推或主动开战，先守住局面再等转机。', lay: '简单说：主事受阻、强推易生冲突、原本可动之事转为宜守', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL031-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL032: {
    id: 'CL032',
    name: '伏干格',
    group: 'QM',
    factors: [
      { id: 'CL032-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '伏干格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL032-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL032-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '伏干格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL032-A', name: '伏干格成象', trigger: [{ op: 'has', args: ['classicPatterns', '伏干格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL032-B', name: '伏干格受制', trigger: [{ op: 'has', args: ['classicPatterns', '伏干格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL032-A', pro: '伏干格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到伏干格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL032-001' },
      { comboId: 'COMBO-CL032-B', pro: '伏干格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到伏干格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL032-002' },
      { comboId: 'COMBO-CL032-A', pro: '伏干格（凶格）', mix: '你的奇门格局出现「伏干格」，今天与自身、当日主事相关的事项容易被规则、冲突或外部阻力压住，不宜硬闯。', lay: '简单说：当日主事受阻、求见不顺、对抗压力增加', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL032-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL033: {
    id: 'CL033',
    name: '飞干格',
    group: 'QM',
    factors: [
      { id: 'CL033-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '飞干格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL033-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL033-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '飞干格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL033-A', name: '飞干格成象', trigger: [{ op: 'has', args: ['classicPatterns', '飞干格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL033-B', name: '飞干格受制', trigger: [{ op: 'has', args: ['classicPatterns', '飞干格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL033-A', pro: '飞干格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到飞干格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL033-001' },
      { comboId: 'COMBO-CL033-B', pro: '飞干格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到飞干格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL033-002' },
      { comboId: 'COMBO-CL033-A', pro: '飞干格（凶格）', mix: '你的奇门格局出现「飞干格」，今天主动推进时容易撞上阻隔和争执，先确认规则边界与对方态度，再行动更稳。', lay: '简单说：主动推进受阻、主客两伤、争执反复', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL033-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL034: {
    id: 'CL034',
    name: '岁格',
    group: 'QM',
    factors: [
      { id: 'CL034-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '岁格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL034-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL034-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '岁格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL034-A', name: '岁格成象', trigger: [{ op: 'has', args: ['classicPatterns', '岁格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL034-B', name: '岁格受制', trigger: [{ op: 'has', args: ['classicPatterns', '岁格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL034-A', pro: '岁格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到岁格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL034-001' },
      { comboId: 'COMBO-CL034-B', pro: '岁格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到岁格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL034-002' },
      { comboId: 'COMBO-CL034-A', pro: '岁格（凶格）', mix: '你的奇门格局出现「岁格」，今天的大环境或上级规则容易形成阻隔，重大事项宜先确认外部限制。', lay: '简单说：年度背景受阻、上层规则牵制、长期事项难推', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL034-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL035: {
    id: 'CL035',
    name: '月格',
    group: 'QM',
    factors: [
      { id: 'CL035-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '月格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL035-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL035-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL035-A', name: '月格成象', trigger: [{ op: 'has', args: ['classicPatterns', '月格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL035-B', name: '月格受制', trigger: [{ op: 'has', args: ['classicPatterns', '月格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL035-A', pro: '月格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL035-001' },
      { comboId: 'COMBO-CL035-B', pro: '月格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL035-002' },
      { comboId: 'COMBO-CL035-A', pro: '月格（凶格）', mix: '你的奇门格局出现「月格」，今天阶段性计划、团队协作或月内安排容易卡住，适合先补流程和资源。', lay: '简单说：阶段计划受阻、协作卡顿、月内事项不顺', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL035-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL036: {
    id: 'CL036',
    name: '时格',
    group: 'QM',
    factors: [
      { id: 'CL036-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '时格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL036-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL036-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '时格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL036-A', name: '时格成象', trigger: [{ op: 'has', args: ['classicPatterns', '时格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL036-B', name: '时格受制', trigger: [{ op: 'has', args: ['classicPatterns', '时格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL036-A', pro: '时格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到时格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL036-001' },
      { comboId: 'COMBO-CL036-B', pro: '时格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到时格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL036-002' },
      { comboId: 'COMBO-CL036-A', pro: '时格（凶格）', mix: '你的奇门格局出现「时格」，当前时点阻力较重，临时行动不宜硬推，先守住局面再择机推进。', lay: '简单说：当下行动受阻、临时冲突增加、宜守不宜攻', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL036-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL037: {
    id: 'CL037',
    name: '岁干勃格',
    group: 'QM',
    factors: [
      { id: 'CL037-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '岁干勃格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL037-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL037-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '岁干勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL037-A', name: '岁干勃格成象', trigger: [{ op: 'has', args: ['classicPatterns', '岁干勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL037-B', name: '岁干勃格受制', trigger: [{ op: 'has', args: ['classicPatterns', '岁干勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL037-A', pro: '岁干勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到岁干勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL037-001' },
      { comboId: 'COMBO-CL037-B', pro: '岁干勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到岁干勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL037-002' },
      { comboId: 'COMBO-CL037-A', pro: '岁干勃格（凶格）', mix: '你的奇门格局出现「岁干勃格」，今天的大环境容易出现临时扰动或规则反复，重大事项先稳住节奏。', lay: '简单说：年度背景扰动、上层规则反复、长期事项易乱', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL037-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL038: {
    id: 'CL038',
    name: '月干勃格',
    group: 'QM',
    factors: [
      { id: 'CL038-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '月干勃格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL038-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL038-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月干勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL038-A', name: '月干勃格成象', trigger: [{ op: 'has', args: ['classicPatterns', '月干勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL038-B', name: '月干勃格受制', trigger: [{ op: 'has', args: ['classicPatterns', '月干勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL038-A', pro: '月干勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月干勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL038-001' },
      { comboId: 'COMBO-CL038-B', pro: '月干勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月干勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL038-002' },
      { comboId: 'COMBO-CL038-A', pro: '月干勃格（凶格）', mix: '你的奇门格局出现「月干勃格」，阶段性计划容易被突发沟通、文书或流程打乱，适合先理顺材料。', lay: '简单说：阶段计划扰动、文书流程反复、协作易乱', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL038-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL039: {
    id: 'CL039',
    name: '日干勃格',
    group: 'QM',
    factors: [
      { id: 'CL039-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '日干勃格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL039-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL039-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日干勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL039-A', name: '日干勃格成象', trigger: [{ op: 'has', args: ['classicPatterns', '日干勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL039-B', name: '日干勃格受制', trigger: [{ op: 'has', args: ['classicPatterns', '日干勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL039-A', pro: '日干勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到日干勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL039-001' },
      { comboId: 'COMBO-CL039-B', pro: '日干勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到日干勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL039-002' },
      { comboId: 'COMBO-CL039-A', pro: '日干勃格（凶格）', mix: '你的奇门格局出现「日干勃格」，当天主事容易被突发变动牵动，不宜靠临场冲劲硬推。', lay: '简单说：当日主事紊乱、临场变动增多、执行反复', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL039-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL040: {
    id: 'CL040',
    name: '时干勃格',
    group: 'QM',
    factors: [
      { id: 'CL040-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '时干勃格'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL040-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL040-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '时干勃格'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL040-A', name: '时干勃格成象', trigger: [{ op: 'has', args: ['classicPatterns', '时干勃格'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL040-B', name: '时干勃格受制', trigger: [{ op: 'has', args: ['classicPatterns', '时干勃格'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL040-A', pro: '时干勃格成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到时干勃格的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL040-001' },
      { comboId: 'COMBO-CL040-B', pro: '时干勃格受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到时干勃格，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL040-002' },
      { comboId: 'COMBO-CL040-A', pro: '时干勃格（凶格）', mix: '你的奇门格局出现「时干勃格」，当前时点容易出现节奏失控或临时反复，先控风险再行动。', lay: '简单说：当下行动紊乱、临时反复增加、宜先稳后动', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL040-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL041: {
    id: 'CL041',
    name: '地罗遮蔽',
    group: 'QM',
    factors: [
      { id: 'CL041-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '地罗遮蔽'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL041-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL041-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地罗遮蔽'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL041-A', name: '地罗遮蔽成象', trigger: [{ op: 'has', args: ['classicPatterns', '地罗遮蔽'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL041-B', name: '地罗遮蔽受制', trigger: [{ op: 'has', args: ['classicPatterns', '地罗遮蔽'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL041-A', pro: '地罗遮蔽成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到地罗遮蔽的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL041-001' },
      { comboId: 'COMBO-CL041-B', pro: '地罗遮蔽受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到地罗遮蔽，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL041-002' },
      { comboId: 'COMBO-CL041-A', pro: '地罗遮蔽（凶格）', mix: '你的奇门格局出现「地罗遮蔽」，当前时点容易被隐性阻碍、拖延或环境不明卡住，出行和推进先查清路线与条件。', lay: '简单说：前路遮障、信息不明、行动受困、推进迟滞', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL041-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL042: {
    id: 'CL042',
    name: '天辅时',
    group: 'QM',
    factors: [
      { id: 'CL042-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL042-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL042-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天辅时'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL042-A', name: '天辅时得势', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL042-B', name: '天辅时受制', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL042-A', pro: '天辅时得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到天辅时的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL042-001' },
      { comboId: 'COMBO-CL042-B', pro: '天辅时受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到天辅时，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL042-002' },
      { comboId: 'COMBO-CL042-A', pro: '天辅时（吉格）', mix: '你的奇门格局出现「天辅时」，今天有解围和推进的机会，适合处理解释、协调、申诉、化解类事务。', lay: '简单说：解厄助成、贵人护持', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL042-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL043: {
    id: 'CL043',
    name: '天辅时（别传）',
    group: 'QM',
    factors: [
      { id: 'CL043-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时（别传）'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL043-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL043-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天辅时（别传）'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL043-A', name: '天辅时（别传）得势', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时（别传）'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL043-B', name: '天辅时（别传）受制', trigger: [{ op: 'has', args: ['classicPatterns', '天辅时（别传）'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL043-A', pro: '天辅时（别传）得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到天辅时（别传）的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL043-001' },
      { comboId: 'COMBO-CL043-B', pro: '天辅时（别传）受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到天辅时（别传），但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL043-002' },
      { comboId: 'COMBO-CL043-A', pro: '天辅时（别传）（吉格）', mix: '你的奇门格局出现「天辅时（别传）」，今天可借助协调和缓冲来推进事情，但仍要结合门星格局判断，不宜只凭此格定吉。', lay: '简单说：别传吉时、解厄助成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL043-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL044: {
    id: 'CL044',
    name: '五合时',
    group: 'QM',
    factors: [
      { id: 'CL044-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '五合时'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL044-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL044-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '五合时'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL044-A', name: '五合时得势', trigger: [{ op: 'has', args: ['classicPatterns', '五合时'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL044-B', name: '五合时受制', trigger: [{ op: 'has', args: ['classicPatterns', '五合时'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL044-A', pro: '五合时得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到五合时的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL044-001' },
      { comboId: 'COMBO-CL044-B', pro: '五合时受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到五合时，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL044-002' },
      { comboId: 'COMBO-CL044-A', pro: '五合时（吉格）', mix: '你的奇门格局出现「五合时」，今天适合谈合作、修复关系、暗中协调和处理需要保密推进的事情，但不宜只凭此格处理申诉辩白类事务。', lay: '简单说：和合隐秘、吉神用事', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL044-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL045: {
    id: 'CL045',
    name: '玉女守门',
    group: 'QM',
    factors: [
      { id: 'CL045-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '玉女守门'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL045-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL045-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '玉女守门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL045-A', name: '玉女守门得势', trigger: [{ op: 'has', args: ['classicPatterns', '玉女守门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL045-B', name: '玉女守门受制', trigger: [{ op: 'has', args: ['classicPatterns', '玉女守门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL045-A', pro: '玉女守门得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到玉女守门的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL045-001' },
      { comboId: 'COMBO-CL045-B', pro: '玉女守门受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到玉女守门，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL045-002' },
      { comboId: 'COMBO-CL045-A', pro: '玉女守门（吉格）', mix: '你的奇门格局出现「玉女守门」，', lay: '简单说：盘面走到「玉女守门」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL045-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL046: {
    id: 'CL046',
    name: '门迫',
    group: 'QM',
    factors: [
      { id: 'CL046-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '门迫'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL046-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL046-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '门迫'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL046-A', name: '门迫成象', trigger: [{ op: 'has', args: ['classicPatterns', '门迫'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL046-B', name: '门迫受制', trigger: [{ op: 'has', args: ['classicPatterns', '门迫'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL046-A', pro: '门迫成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到门迫的凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL046-001' },
      { comboId: 'COMBO-CL046-B', pro: '门迫受制，凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到门迫，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CL046-002' },
      { comboId: 'COMBO-CL046-A', pro: '门迫（凶格）', mix: '你的奇门格局出现「门迫」，', lay: '简单说：行动受阻、推进困难', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CL046-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL047: {
    id: 'CL047',
    name: '宫生门',
    group: 'QM',
    factors: [
      { id: 'CL047-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '宫生门'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL047-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL047-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '宫生门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL047-A', name: '宫生门得势', trigger: [{ op: 'has', args: ['classicPatterns', '宫生门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL047-B', name: '宫生门受制', trigger: [{ op: 'has', args: ['classicPatterns', '宫生门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL047-A', pro: '宫生门得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到宫生门的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL047-001' },
      { comboId: 'COMBO-CL047-B', pro: '宫生门受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到宫生门，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL047-002' },
      { comboId: 'COMBO-CL047-A', pro: '宫生门（吉格）', mix: '你的奇门格局出现「宫生门」，', lay: '简单说：环境支持、阻力小', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL047-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CL048: {
    id: 'CL048',
    name: '门生宫',
    group: 'QM',
    factors: [
      { id: 'CL048-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['classicPatterns', '门生宫'] }], fieldBinding: ['classicPatterns', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CL048-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CL048-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '门生宫'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CL048-A', name: '门生宫得势', trigger: [{ op: 'has', args: ['classicPatterns', '门生宫'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CL048-B', name: '门生宫受制', trigger: [{ op: 'has', args: ['classicPatterns', '门生宫'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CL048-A', pro: '门生宫得势，吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到门生宫的吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL048-001' },
      { comboId: 'COMBO-CL048-B', pro: '门生宫受制，吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到门生宫，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CL048-002' },
      { comboId: 'COMBO-CL048-A', pro: '门生宫（吉格）', mix: '你的奇门格局出现「门生宫」，', lay: '简单说：做事顺畅、有助力', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CL048-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB001: {
    id: 'CB001',
    name: '太冲',
    group: 'QM',
    factors: [
      { id: 'CB001-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '太冲'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB001-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB001-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太冲'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB001-A', name: '太冲成格', trigger: [{ op: 'has', args: ['patternCombos', '太冲'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB001-B', name: '太冲受制', trigger: [{ op: 'has', args: ['patternCombos', '太冲'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB001-A', pro: '太冲成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到太冲，且门星落位，按部就班即可', lay: '盘面走到「太冲」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB001-001' },
      { comboId: 'COMBO-CB001-B', pro: '太冲受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到太冲，但门星受制，力量打折', lay: '盘面有「太冲」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB001-002' },
      { comboId: 'COMBO-CB001-A', pro: '太冲（平格）', mix: '你的奇门格局出现「太冲」，', lay: '简单说：盘面走到「太冲」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB001-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB002: {
    id: 'CB002',
    name: '小吉',
    group: 'QM',
    factors: [
      { id: 'CB002-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '小吉'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB002-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB002-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '小吉'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB002-A', name: '小吉成格', trigger: [{ op: 'has', args: ['patternCombos', '小吉'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB002-B', name: '小吉受制', trigger: [{ op: 'has', args: ['patternCombos', '小吉'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB002-A', pro: '小吉成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到小吉，且门星落位，按部就班即可', lay: '盘面走到「小吉」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB002-001' },
      { comboId: 'COMBO-CB002-B', pro: '小吉受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到小吉，但门星受制，力量打折', lay: '盘面有「小吉」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB002-002' },
      { comboId: 'COMBO-CB002-A', pro: '小吉（平格）', mix: '你的奇门格局出现「小吉」，', lay: '简单说：盘面走到「小吉」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB002-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB003: {
    id: 'CB003',
    name: '从魁',
    group: 'QM',
    factors: [
      { id: 'CB003-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '从魁'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB003-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB003-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '从魁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB003-A', name: '从魁成格', trigger: [{ op: 'has', args: ['patternCombos', '从魁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB003-B', name: '从魁受制', trigger: [{ op: 'has', args: ['patternCombos', '从魁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB003-A', pro: '从魁成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到从魁，且门星落位，按部就班即可', lay: '盘面走到「从魁」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB003-001' },
      { comboId: 'COMBO-CB003-B', pro: '从魁受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到从魁，但门星受制，力量打折', lay: '盘面有「从魁」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB003-002' },
      { comboId: 'COMBO-CB003-A', pro: '从魁（平格）', mix: '你的奇门格局出现「从魁」，', lay: '简单说：盘面走到「从魁」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB003-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB004: {
    id: 'CB004',
    name: '太冲天马',
    group: 'QM',
    factors: [
      { id: 'CB004-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '太冲天马'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB004-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB004-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太冲天马'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB004-A', name: '太冲天马成格', trigger: [{ op: 'has', args: ['patternCombos', '太冲天马'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB004-B', name: '太冲天马受制', trigger: [{ op: 'has', args: ['patternCombos', '太冲天马'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB004-A', pro: '太冲天马成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到太冲天马，且门星落位，按部就班即可', lay: '盘面走到「太冲天马」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB004-001' },
      { comboId: 'COMBO-CB004-B', pro: '太冲天马受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到太冲天马，但门星受制，力量打折', lay: '盘面有「太冲天马」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB004-002' },
      { comboId: 'COMBO-CB004-A', pro: '太冲天马（平格）', mix: '你的奇门格局出现「太冲天马」，', lay: '简单说：盘面走到「太冲天马」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB004-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB005: {
    id: 'CB005',
    name: '斗星天罡',
    group: 'QM',
    factors: [
      { id: 'CB005-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '斗星天罡'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB005-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB005-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '斗星天罡'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB005-A', name: '斗星天罡成格', trigger: [{ op: 'has', args: ['patternCombos', '斗星天罡'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB005-B', name: '斗星天罡受制', trigger: [{ op: 'has', args: ['patternCombos', '斗星天罡'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB005-A', pro: '斗星天罡成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到斗星天罡，且门星落位，按部就班即可', lay: '盘面走到「斗星天罡」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB005-001' },
      { comboId: 'COMBO-CB005-B', pro: '斗星天罡受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到斗星天罡，但门星受制，力量打折', lay: '盘面有「斗星天罡」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB005-002' },
      { comboId: 'COMBO-CB005-A', pro: '斗星天罡（平格）', mix: '你的奇门格局出现「斗星天罡」，', lay: '简单说：盘面走到「斗星天罡」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB005-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB006: {
    id: 'CB006',
    name: '亭亭（神后）',
    group: 'QM',
    factors: [
      { id: 'CB006-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '亭亭（神后）'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB006-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB006-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '亭亭（神后）'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB006-A', name: '亭亭（神后）成格', trigger: [{ op: 'has', args: ['patternCombos', '亭亭（神后）'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB006-B', name: '亭亭（神后）受制', trigger: [{ op: 'has', args: ['patternCombos', '亭亭（神后）'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB006-A', pro: '亭亭（神后）成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到亭亭（神后），且门星落位，按部就班即可', lay: '盘面走到「亭亭（神后）」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB006-001' },
      { comboId: 'COMBO-CB006-B', pro: '亭亭（神后）受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到亭亭（神后），但门星受制，力量打折', lay: '盘面有「亭亭（神后）」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB006-002' },
      { comboId: 'COMBO-CB006-A', pro: '亭亭（神后）（平格）', mix: '你的奇门格局出现「亭亭（神后）」，', lay: '简单说：盘面走到「亭亭（神后）」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB006-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB007: {
    id: 'CB007',
    name: '白奸功曹',
    group: 'QM',
    factors: [
      { id: 'CB007-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白奸功曹'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB007-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB007-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白奸功曹'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB007-A', name: '白奸功曹成格', trigger: [{ op: 'has', args: ['patternCombos', '白奸功曹'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB007-B', name: '白奸功曹受制', trigger: [{ op: 'has', args: ['patternCombos', '白奸功曹'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB007-A', pro: '白奸功曹成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到白奸功曹，且门星落位，按部就班即可', lay: '盘面走到「白奸功曹」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB007-001' },
      { comboId: 'COMBO-CB007-B', pro: '白奸功曹受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到白奸功曹，但门星受制，力量打折', lay: '盘面有「白奸功曹」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB007-002' },
      { comboId: 'COMBO-CB007-A', pro: '白奸功曹（平格）', mix: '你的奇门格局出现「白奸功曹」，', lay: '简单说：盘面走到「白奸功曹」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB007-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB008: {
    id: 'CB008',
    name: '白奸胜光',
    group: 'QM',
    factors: [
      { id: 'CB008-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白奸胜光'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB008-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB008-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白奸胜光'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB008-A', name: '白奸胜光成格', trigger: [{ op: 'has', args: ['patternCombos', '白奸胜光'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB008-B', name: '白奸胜光受制', trigger: [{ op: 'has', args: ['patternCombos', '白奸胜光'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB008-A', pro: '白奸胜光成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到白奸胜光，且门星落位，按部就班即可', lay: '盘面走到「白奸胜光」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB008-001' },
      { comboId: 'COMBO-CB008-B', pro: '白奸胜光受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到白奸胜光，但门星受制，力量打折', lay: '盘面有「白奸胜光」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB008-002' },
      { comboId: 'COMBO-CB008-A', pro: '白奸胜光（平格）', mix: '你的奇门格局出现「白奸胜光」，', lay: '简单说：盘面走到「白奸胜光」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB008-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB009: {
    id: 'CB009',
    name: '白奸天罡',
    group: 'QM',
    factors: [
      { id: 'CB009-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白奸天罡'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB009-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB009-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白奸天罡'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB009-A', name: '白奸天罡成格', trigger: [{ op: 'has', args: ['patternCombos', '白奸天罡'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB009-B', name: '白奸天罡受制', trigger: [{ op: 'has', args: ['patternCombos', '白奸天罡'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB009-A', pro: '白奸天罡成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到白奸天罡，且门星落位，按部就班即可', lay: '盘面走到「白奸天罡」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB009-001' },
      { comboId: 'COMBO-CB009-B', pro: '白奸天罡受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到白奸天罡，但门星受制，力量打折', lay: '盘面有「白奸天罡」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB009-002' },
      { comboId: 'COMBO-CB009-A', pro: '白奸天罡（平格）', mix: '你的奇门格局出现「白奸天罡」，', lay: '简单说：盘面走到「白奸天罡」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB009-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB010: {
    id: 'CB010',
    name: '除',
    group: 'QM',
    factors: [
      { id: 'CB010-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '除'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB010-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB010-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '除'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB010-A', name: '除成格', trigger: [{ op: 'has', args: ['patternCombos', '除'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB010-B', name: '除受制', trigger: [{ op: 'has', args: ['patternCombos', '除'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB010-A', pro: '除成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到除，且门星落位，按部就班即可', lay: '盘面走到「除」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB010-001' },
      { comboId: 'COMBO-CB010-B', pro: '除受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到除，但门星受制，力量打折', lay: '盘面有「除」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB010-002' },
      { comboId: 'COMBO-CB010-A', pro: '除（平格）', mix: '你的奇门格局出现「除」，', lay: '简单说：盘面走到「除」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB010-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB011: {
    id: 'CB011',
    name: '定',
    group: 'QM',
    factors: [
      { id: 'CB011-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '定'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB011-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB011-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '定'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB011-A', name: '定成格', trigger: [{ op: 'has', args: ['patternCombos', '定'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB011-B', name: '定受制', trigger: [{ op: 'has', args: ['patternCombos', '定'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB011-A', pro: '定成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到定，且门星落位，按部就班即可', lay: '盘面走到「定」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB011-001' },
      { comboId: 'COMBO-CB011-B', pro: '定受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到定，但门星受制，力量打折', lay: '盘面有「定」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB011-002' },
      { comboId: 'COMBO-CB011-A', pro: '定（平格）', mix: '你的奇门格局出现「定」，', lay: '简单说：盘面走到「定」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB011-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB012: {
    id: 'CB012',
    name: '危',
    group: 'QM',
    factors: [
      { id: 'CB012-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '危'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB012-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB012-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '危'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB012-A', name: '危成格', trigger: [{ op: 'has', args: ['patternCombos', '危'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB012-B', name: '危受制', trigger: [{ op: 'has', args: ['patternCombos', '危'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB012-A', pro: '危成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到危，且门星落位，按部就班即可', lay: '盘面走到「危」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB012-001' },
      { comboId: 'COMBO-CB012-B', pro: '危受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到危，但门星受制，力量打折', lay: '盘面有「危」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB012-002' },
      { comboId: 'COMBO-CB012-A', pro: '危（平格）', mix: '你的奇门格局出现「危」，', lay: '简单说：盘面走到「危」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB012-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB013: {
    id: 'CB013',
    name: '开',
    group: 'QM',
    factors: [
      { id: 'CB013-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '开'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB013-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB013-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '开'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB013-A', name: '开得势', trigger: [{ op: 'has', args: ['patternCombos', '开'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB013-B', name: '开受制', trigger: [{ op: 'has', args: ['patternCombos', '开'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB013-A', pro: '开得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到开的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB013-001' },
      { comboId: 'COMBO-CB013-B', pro: '开受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到开，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB013-002' },
      { comboId: 'COMBO-CB013-A', pro: '开（大吉格）', mix: '你的奇门格局出现「开」，', lay: '简单说：盘面走到「开」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB013-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB014: {
    id: 'CB014',
    name: '三奇齐升',
    group: 'QM',
    factors: [
      { id: 'CB014-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐升'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB014-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB014-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐升'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB014-A', name: '三奇齐升得势', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐升'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB014-B', name: '三奇齐升受制', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐升'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB014-A', pro: '三奇齐升得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到三奇齐升的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB014-001' },
      { comboId: 'COMBO-CB014-B', pro: '三奇齐升受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到三奇齐升，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB014-002' },
      { comboId: 'COMBO-CB014-A', pro: '三奇齐升（大吉格）：乙、丙、丁三奇同时升殿得位，三奇之气齐显。', mix: '你的奇门格局出现「三奇齐升」，乙、丙、丁三奇同时升殿得位，三奇之气齐显。', lay: '简单说：盘面走到「三奇齐升」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB014-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB015: {
    id: 'CB015',
    name: '三奇齐困',
    group: 'QM',
    factors: [
      { id: 'CB015-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐困'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB015-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB015-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐困'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB015-A', name: '三奇齐困成象', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐困'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB015-B', name: '三奇齐困受制', trigger: [{ op: 'has', args: ['patternCombos', '三奇齐困'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB015-A', pro: '三奇齐困成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到三奇齐困的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB015-001' },
      { comboId: 'COMBO-CB015-B', pro: '三奇齐困受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到三奇齐困，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB015-002' },
      { comboId: 'COMBO-CB015-A', pro: '三奇齐困（大凶格）：乙、丙、丁三奇同时受困，三奇之力闭塞。', mix: '你的奇门格局出现「三奇齐困」，乙、丙、丁三奇同时受困，三奇之力闭塞。', lay: '简单说：盘面走到「三奇齐困」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB015-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB016: {
    id: 'CB016',
    name: '遁格返首叠加',
    group: 'QM',
    factors: [
      { id: 'CB016-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '遁格返首叠加'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB016-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB016-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '遁格返首叠加'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB016-A', name: '遁格返首叠加得势', trigger: [{ op: 'has', args: ['patternCombos', '遁格返首叠加'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB016-B', name: '遁格返首叠加受制', trigger: [{ op: 'has', args: ['patternCombos', '遁格返首叠加'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB016-A', pro: '遁格返首叠加得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到遁格返首叠加的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB016-001' },
      { comboId: 'COMBO-CB016-B', pro: '遁格返首叠加受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到遁格返首叠加，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB016-002' },
      { comboId: 'COMBO-CB016-A', pro: '遁格返首叠加（大吉格）：遁格与青龙返首或飞鸟跌穴同盘，吉格叠加。', mix: '你的奇门格局出现「遁格返首叠加」，遁格与青龙返首或飞鸟跌穴同盘，吉格叠加。', lay: '简单说：盘面走到「遁格返首叠加」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB016-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB017: {
    id: 'CB017',
    name: '白虎助凶',
    group: 'QM',
    factors: [
      { id: 'CB017-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白虎助凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB017-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB017-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白虎助凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB017-A', name: '白虎助凶成象', trigger: [{ op: 'has', args: ['patternCombos', '白虎助凶'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB017-B', name: '白虎助凶受制', trigger: [{ op: 'has', args: ['patternCombos', '白虎助凶'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB017-A', pro: '白虎助凶成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到白虎助凶的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB017-001' },
      { comboId: 'COMBO-CB017-B', pro: '白虎助凶受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到白虎助凶，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB017-002' },
      { comboId: 'COMBO-CB017-A', pro: '白虎助凶（大凶格）', mix: '你的奇门格局出现「白虎助凶」，', lay: '简单说：盘面走到「白虎助凶」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB017-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB018: {
    id: 'CB018',
    name: '白虎会开惊',
    group: 'QM',
    factors: [
      { id: 'CB018-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白虎会开惊'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB018-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB018-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白虎会开惊'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB018-A', name: '白虎会开惊成格', trigger: [{ op: 'has', args: ['patternCombos', '白虎会开惊'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB018-B', name: '白虎会开惊受制', trigger: [{ op: 'has', args: ['patternCombos', '白虎会开惊'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB018-A', pro: '白虎会开惊成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到白虎会开惊，且门星落位，按部就班即可', lay: '盘面走到「白虎会开惊」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB018-001' },
      { comboId: 'COMBO-CB018-B', pro: '白虎会开惊受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到白虎会开惊，但门星受制，力量打折', lay: '盘面有「白虎会开惊」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB018-002' },
      { comboId: 'COMBO-CB018-A', pro: '白虎会开惊（吉凶掺杂格）', mix: '你的奇门格局出现「白虎会开惊」，', lay: '简单说：盘面走到「白虎会开惊」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB018-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB019: {
    id: 'CB019',
    name: '白虎逢休门',
    group: 'QM',
    factors: [
      { id: 'CB019-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '白虎逢休门'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB019-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB019-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '白虎逢休门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB019-A', name: '白虎逢休门成格', trigger: [{ op: 'has', args: ['patternCombos', '白虎逢休门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB019-B', name: '白虎逢休门受制', trigger: [{ op: 'has', args: ['patternCombos', '白虎逢休门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB019-A', pro: '白虎逢休门成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到白虎逢休门，且门星落位，按部就班即可', lay: '盘面走到「白虎逢休门」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB019-001' },
      { comboId: 'COMBO-CB019-B', pro: '白虎逢休门受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到白虎逢休门，但门星受制，力量打折', lay: '盘面有「白虎逢休门」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB019-002' },
      { comboId: 'COMBO-CB019-A', pro: '白虎逢休门（吉凶掺杂格）', mix: '你的奇门格局出现「白虎逢休门」，', lay: '简单说：盘面走到「白虎逢休门」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB019-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB020: {
    id: 'CB020',
    name: '月奇双困',
    group: 'QM',
    factors: [
      { id: 'CB020-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '月奇双困'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB020-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB020-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月奇双困'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB020-A', name: '月奇双困成象', trigger: [{ op: 'has', args: ['patternCombos', '月奇双困'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB020-B', name: '月奇双困受制', trigger: [{ op: 'has', args: ['patternCombos', '月奇双困'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB020-A', pro: '月奇双困成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到月奇双困的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB020-001' },
      { comboId: 'COMBO-CB020-B', pro: '月奇双困受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到月奇双困，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB020-002' },
      { comboId: 'COMBO-CB020-A', pro: '月奇双困（大凶格）：丙奇既悖师又入墓，公开表达与外显之力受困。', mix: '你的奇门格局出现「月奇双困」，丙奇既悖师又入墓，公开表达与外显之力受困。', lay: '简单说：盘面走到「月奇双困」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB020-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB021: {
    id: 'CB021',
    name: '主客互攻',
    group: 'QM',
    factors: [
      { id: 'CB021-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '主客互攻'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB021-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB021-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '主客互攻'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB021-A', name: '主客互攻成象', trigger: [{ op: 'has', args: ['patternCombos', '主客互攻'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB021-B', name: '主客互攻受制', trigger: [{ op: 'has', args: ['patternCombos', '主客互攻'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB021-A', pro: '主客互攻成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到主客互攻的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB021-001' },
      { comboId: 'COMBO-CB021-B', pro: '主客互攻受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到主客互攻，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB021-002' },
      { comboId: 'COMBO-CB021-A', pro: '主客互攻（大凶格）：太白入荧与荧入太白同盘，主客互克互攻。', mix: '你的奇门格局出现「主客互攻」，太白入荧与荧入太白同盘，主客互克互攻。', lay: '简单说：盘面走到「主客互攻」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB021-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB022: {
    id: 'CB022',
    name: '丁壬逢伤杜',
    group: 'QM',
    factors: [
      { id: 'CB022-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '丁壬逢伤杜'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB022-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB022-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '丁壬逢伤杜'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB022-A', name: '丁壬逢伤杜成格', trigger: [{ op: 'has', args: ['patternCombos', '丁壬逢伤杜'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB022-B', name: '丁壬逢伤杜受制', trigger: [{ op: 'has', args: ['patternCombos', '丁壬逢伤杜'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB022-A', pro: '丁壬逢伤杜成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到丁壬逢伤杜，且门星落位，按部就班即可', lay: '盘面走到「丁壬逢伤杜」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB022-001' },
      { comboId: 'COMBO-CB022-B', pro: '丁壬逢伤杜受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到丁壬逢伤杜，但门星受制，力量打折', lay: '盘面有「丁壬逢伤杜」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB022-002' },
      { comboId: 'COMBO-CB022-A', pro: '丁壬逢伤杜（吉凶掺杂格）', mix: '你的奇门格局出现「丁壬逢伤杜」，', lay: '简单说：盘面走到「丁壬逢伤杜」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB022-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB023: {
    id: 'CB023',
    name: '丁壬生门利遁',
    group: 'QM',
    factors: [
      { id: 'CB023-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '丁壬生门利遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB023-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB023-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '丁壬生门利遁'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB023-A', name: '丁壬生门利遁成格', trigger: [{ op: 'has', args: ['patternCombos', '丁壬生门利遁'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB023-B', name: '丁壬生门利遁受制', trigger: [{ op: 'has', args: ['patternCombos', '丁壬生门利遁'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB023-A', pro: '丁壬生门利遁成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到丁壬生门利遁，且门星落位，按部就班即可', lay: '盘面走到「丁壬生门利遁」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB023-001' },
      { comboId: 'COMBO-CB023-B', pro: '丁壬生门利遁受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到丁壬生门利遁，但门星受制，力量打折', lay: '盘面有「丁壬生门利遁」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB023-002' },
      { comboId: 'COMBO-CB023-A', pro: '丁壬生门利遁（吉凶掺杂格）', mix: '你的奇门格局出现「丁壬生门利遁」，', lay: '简单说：盘面走到「丁壬生门利遁」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB023-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB024: {
    id: 'CB024',
    name: '阴德相扶',
    group: 'QM',
    factors: [
      { id: 'CB024-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '阴德相扶'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB024-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB024-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '阴德相扶'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB024-A', name: '阴德相扶得势', trigger: [{ op: 'has', args: ['patternCombos', '阴德相扶'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB024-B', name: '阴德相扶受制', trigger: [{ op: 'has', args: ['patternCombos', '阴德相扶'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB024-A', pro: '阴德相扶得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到阴德相扶的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB024-001' },
      { comboId: 'COMBO-CB024-B', pro: '阴德相扶受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到阴德相扶，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB024-002' },
      { comboId: 'COMBO-CB024-A', pro: '阴德相扶（大吉格）：玉女守门遇人遁或地遁，柔顺与暗助之象叠加。', mix: '你的奇门格局出现「阴德相扶」，玉女守门遇人遁或地遁，柔顺与暗助之象叠加。', lay: '简单说：盘面走到「阴德相扶」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB024-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB025: {
    id: 'CB025',
    name: '伏吟带凶',
    group: 'QM',
    factors: [
      { id: 'CB025-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '伏吟带凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB025-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB025-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '伏吟带凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB025-A', name: '伏吟带凶成象', trigger: [{ op: 'has', args: ['patternCombos', '伏吟带凶'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB025-B', name: '伏吟带凶受制', trigger: [{ op: 'has', args: ['patternCombos', '伏吟带凶'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB025-A', pro: '伏吟带凶成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到伏吟带凶的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB025-001' },
      { comboId: 'COMBO-CB025-B', pro: '伏吟带凶受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到伏吟带凶，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB025-002' },
      { comboId: 'COMBO-CB025-A', pro: '伏吟带凶（大凶格）：伏吟主迟滞，又见明确凶格，阻滞与凶象并见。', mix: '你的奇门格局出现「伏吟带凶」，伏吟主迟滞，又见明确凶格，阻滞与凶象并见。', lay: '简单说：盘面走到「伏吟带凶」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB025-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB026: {
    id: 'CB026',
    name: '反吟翻覆',
    group: 'QM',
    factors: [
      { id: 'CB026-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '反吟翻覆'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB026-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB026-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '反吟翻覆'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB026-A', name: '反吟翻覆成象', trigger: [{ op: 'has', args: ['patternCombos', '反吟翻覆'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB026-B', name: '反吟翻覆受制', trigger: [{ op: 'has', args: ['patternCombos', '反吟翻覆'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB026-A', pro: '反吟翻覆成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到反吟翻覆的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB026-001' },
      { comboId: 'COMBO-CB026-B', pro: '反吟翻覆受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到反吟翻覆，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB026-002' },
      { comboId: 'COMBO-CB026-A', pro: '反吟翻覆（大凶格）：反吟主反复变动，又见明确凶格，翻覆与凶象并见。', mix: '你的奇门格局出现「反吟翻覆」，反吟主反复变动，又见明确凶格，翻覆与凶象并见。', lay: '简单说：盘面走到「反吟翻覆」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB026-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB027: {
    id: 'CB027',
    name: '迫上加凶',
    group: 'QM',
    factors: [
      { id: 'CB027-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '迫上加凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB027-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB027-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '迫上加凶'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB027-A', name: '迫上加凶成象', trigger: [{ op: 'has', args: ['patternCombos', '迫上加凶'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB027-B', name: '迫上加凶受制', trigger: [{ op: 'has', args: ['patternCombos', '迫上加凶'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB027-A', pro: '迫上加凶成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到迫上加凶的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB027-001' },
      { comboId: 'COMBO-CB027-B', pro: '迫上加凶受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到迫上加凶，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB027-002' },
      { comboId: 'COMBO-CB027-A', pro: '迫上加凶（大凶格）', mix: '你的奇门格局出现「迫上加凶」，', lay: '简单说：盘面走到「迫上加凶」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB027-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB028: {
    id: 'CB028',
    name: '吉门三奇',
    group: 'QM',
    factors: [
      { id: 'CB028-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '吉门三奇'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB028-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB028-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '吉门三奇'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB028-A', name: '吉门三奇得势', trigger: [{ op: 'has', args: ['patternCombos', '吉门三奇'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB028-B', name: '吉门三奇受制', trigger: [{ op: 'has', args: ['patternCombos', '吉门三奇'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB028-A', pro: '吉门三奇得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到吉门三奇的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB028-001' },
      { comboId: 'COMBO-CB028-B', pro: '吉门三奇受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到吉门三奇，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB028-002' },
      { comboId: 'COMBO-CB028-A', pro: '吉门三奇（大吉格）', mix: '你的奇门格局出现「吉门三奇」，', lay: '简单说：盘面走到「吉门三奇」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB028-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB029: {
    id: 'CB029',
    name: '静中藏动',
    group: 'QM',
    factors: [
      { id: 'CB029-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '静中藏动'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB029-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB029-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '静中藏动'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB029-A', name: '静中藏动成格', trigger: [{ op: 'has', args: ['patternCombos', '静中藏动'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB029-B', name: '静中藏动受制', trigger: [{ op: 'has', args: ['patternCombos', '静中藏动'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB029-A', pro: '静中藏动成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到静中藏动，且门星落位，按部就班即可', lay: '盘面走到「静中藏动」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB029-001' },
      { comboId: 'COMBO-CB029-B', pro: '静中藏动受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到静中藏动，但门星受制，力量打折', lay: '盘面有「静中藏动」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB029-002' },
      { comboId: 'COMBO-CB029-A', pro: '静中藏动（吉凶掺杂格）：伏吟主静，驿马主动，表面停滞而内有变化。', mix: '你的奇门格局出现「静中藏动」，伏吟主静，驿马主动，表面停滞而内有变化。', lay: '简单说：盘面走到「静中藏动」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB029-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB030: {
    id: 'CB030',
    name: '动荡翻滚',
    group: 'QM',
    factors: [
      { id: 'CB030-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '动荡翻滚'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB030-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB030-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '动荡翻滚'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB030-A', name: '动荡翻滚成象', trigger: [{ op: 'has', args: ['patternCombos', '动荡翻滚'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB030-B', name: '动荡翻滚受制', trigger: [{ op: 'has', args: ['patternCombos', '动荡翻滚'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB030-A', pro: '动荡翻滚成象且门星落位，主阻力、波折、宜守', mix: '你的奇门格局走到动荡翻滚的大凶格，且门星落位，阻力偏重', lay: '你现在撞上一个「阻力重」的时机，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB030-001' },
      { comboId: 'COMBO-CB030-B', pro: '动荡翻滚受制，大凶格虽成而门星受制，凶势有缓冲', mix: '你的奇门格局走到动荡翻滚，但门星受制，凶势有缓冲', lay: '你撞上阻力时机，但有缓冲，不至于太糟，宜守不宜攻', polarity: '-', modality: 'likely', atomicId: 'ATOM-QM-CB030-002' },
      { comboId: 'COMBO-CB030-A', pro: '动荡翻滚（大凶格）：反吟叠驿马，变动与反复之象并见。', mix: '你的奇门格局出现「动荡翻滚」，反吟叠驿马，变动与反复之象并见。', lay: '简单说：盘面走到「动荡翻滚」，这是一个偏阻力的信号，宜守不宜攻，硬推容易吃亏。', polarity: '--', modality: 'assert', atomicId: 'ATOM-QM-CB030-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB031: {
    id: 'CB031',
    name: '青龙返首利主',
    group: 'QM',
    factors: [
      { id: 'CB031-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '青龙返首利主'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB031-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB031-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '青龙返首利主'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB031-A', name: '青龙返首利主成格', trigger: [{ op: 'has', args: ['patternCombos', '青龙返首利主'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB031-B', name: '青龙返首利主受制', trigger: [{ op: 'has', args: ['patternCombos', '青龙返首利主'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB031-A', pro: '青龙返首利主成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到青龙返首利主，且门星落位，按部就班即可', lay: '盘面走到「青龙返首利主」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB031-001' },
      { comboId: 'COMBO-CB031-B', pro: '青龙返首利主受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到青龙返首利主，但门星受制，力量打折', lay: '盘面有「青龙返首利主」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB031-002' },
      { comboId: 'COMBO-CB031-A', pro: '青龙返首利主（吉凶掺杂格）', mix: '你的奇门格局出现「青龙返首利主」，', lay: '简单说：盘面走到「青龙返首利主」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB031-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB032: {
    id: 'CB032',
    name: '飞鸟跌穴利客',
    group: 'QM',
    factors: [
      { id: 'CB032-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟跌穴利客'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB032-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB032-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟跌穴利客'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB032-A', name: '飞鸟跌穴利客成格', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟跌穴利客'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB032-B', name: '飞鸟跌穴利客受制', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟跌穴利客'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB032-A', pro: '飞鸟跌穴利客成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到飞鸟跌穴利客，且门星落位，按部就班即可', lay: '盘面走到「飞鸟跌穴利客」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB032-001' },
      { comboId: 'COMBO-CB032-B', pro: '飞鸟跌穴利客受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到飞鸟跌穴利客，但门星受制，力量打折', lay: '盘面有「飞鸟跌穴利客」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB032-002' },
      { comboId: 'COMBO-CB032-A', pro: '飞鸟跌穴利客（吉凶掺杂格）', mix: '你的奇门格局出现「飞鸟跌穴利客」，', lay: '简单说：盘面走到「飞鸟跌穴利客」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB032-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB033: {
    id: 'CB033',
    name: '飞鸟会生门',
    group: 'QM',
    factors: [
      { id: 'CB033-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟会生门'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB033-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB033-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟会生门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB033-A', name: '飞鸟会生门成格', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟会生门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB033-B', name: '飞鸟会生门受制', trigger: [{ op: 'has', args: ['patternCombos', '飞鸟会生门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB033-A', pro: '飞鸟会生门成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到飞鸟会生门，且门星落位，按部就班即可', lay: '盘面走到「飞鸟会生门」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB033-001' },
      { comboId: 'COMBO-CB033-B', pro: '飞鸟会生门受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到飞鸟会生门，但门星受制，力量打折', lay: '盘面有「飞鸟会生门」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB033-002' },
      { comboId: 'COMBO-CB033-A', pro: '飞鸟会生门（吉凶掺杂格）', mix: '你的奇门格局出现「飞鸟会生门」，', lay: '简单说：盘面走到「飞鸟会生门」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB033-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB034: {
    id: 'CB034',
    name: '朱雀投江利主',
    group: 'QM',
    factors: [
      { id: 'CB034-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '朱雀投江利主'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB034-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB034-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '朱雀投江利主'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB034-A', name: '朱雀投江利主成格', trigger: [{ op: 'has', args: ['patternCombos', '朱雀投江利主'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB034-B', name: '朱雀投江利主受制', trigger: [{ op: 'has', args: ['patternCombos', '朱雀投江利主'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB034-A', pro: '朱雀投江利主成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到朱雀投江利主，且门星落位，按部就班即可', lay: '盘面走到「朱雀投江利主」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB034-001' },
      { comboId: 'COMBO-CB034-B', pro: '朱雀投江利主受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到朱雀投江利主，但门星受制，力量打折', lay: '盘面有「朱雀投江利主」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB034-002' },
      { comboId: 'COMBO-CB034-A', pro: '朱雀投江利主（吉凶掺杂格）', mix: '你的奇门格局出现「朱雀投江利主」，', lay: '简单说：盘面走到「朱雀投江利主」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB034-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB035: {
    id: 'CB035',
    name: '螣蛇夭矫宜守',
    group: 'QM',
    factors: [
      { id: 'CB035-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇夭矫宜守'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB035-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB035-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇夭矫宜守'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB035-A', name: '螣蛇夭矫宜守成格', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇夭矫宜守'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB035-B', name: '螣蛇夭矫宜守受制', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇夭矫宜守'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB035-A', pro: '螣蛇夭矫宜守成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到螣蛇夭矫宜守，且门星落位，按部就班即可', lay: '盘面走到「螣蛇夭矫宜守」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB035-001' },
      { comboId: 'COMBO-CB035-B', pro: '螣蛇夭矫宜守受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到螣蛇夭矫宜守，但门星受制，力量打折', lay: '盘面有「螣蛇夭矫宜守」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB035-002' },
      { comboId: 'COMBO-CB035-A', pro: '螣蛇夭矫宜守（吉凶掺杂格）', mix: '你的奇门格局出现「螣蛇夭矫宜守」，', lay: '简单说：盘面走到「螣蛇夭矫宜守」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB035-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB036: {
    id: 'CB036',
    name: '螣蛇迁戊己',
    group: 'QM',
    factors: [
      { id: 'CB036-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇迁戊己'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB036-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB036-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇迁戊己'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB036-A', name: '螣蛇迁戊己成格', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇迁戊己'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB036-B', name: '螣蛇迁戊己受制', trigger: [{ op: 'has', args: ['patternCombos', '螣蛇迁戊己'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB036-A', pro: '螣蛇迁戊己成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到螣蛇迁戊己，且门星落位，按部就班即可', lay: '盘面走到「螣蛇迁戊己」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB036-001' },
      { comboId: 'COMBO-CB036-B', pro: '螣蛇迁戊己受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到螣蛇迁戊己，但门星受制，力量打折', lay: '盘面有「螣蛇迁戊己」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB036-002' },
      { comboId: 'COMBO-CB036-A', pro: '螣蛇迁戊己（吉凶掺杂格）', mix: '你的奇门格局出现「螣蛇迁戊己」，', lay: '简单说：盘面走到「螣蛇迁戊己」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB036-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB037: {
    id: 'CB037',
    name: '刑德开阖',
    group: 'QM',
    factors: [
      { id: 'CB037-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '刑德开阖'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB037-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB037-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '刑德开阖'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB037-A', name: '刑德开阖成格', trigger: [{ op: 'has', args: ['patternCombos', '刑德开阖'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB037-B', name: '刑德开阖受制', trigger: [{ op: 'has', args: ['patternCombos', '刑德开阖'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB037-A', pro: '刑德开阖成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到刑德开阖，且门星落位，按部就班即可', lay: '盘面走到「刑德开阖」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB037-001' },
      { comboId: 'COMBO-CB037-B', pro: '刑德开阖受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到刑德开阖，但门星受制，力量打折', lay: '盘面有「刑德开阖」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB037-002' },
      { comboId: 'COMBO-CB037-A', pro: '刑德开阖（吉凶掺杂格）', mix: '你的奇门格局出现「刑德开阖」，', lay: '简单说：盘面走到「刑德开阖」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB037-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB038: {
    id: 'CB038',
    name: '星宫主客',
    group: 'QM',
    factors: [
      { id: 'CB038-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '星宫主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB038-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB038-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '星宫主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB038-A', name: '星宫主客成格', trigger: [{ op: 'has', args: ['patternCombos', '星宫主客'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB038-B', name: '星宫主客受制', trigger: [{ op: 'has', args: ['patternCombos', '星宫主客'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB038-A', pro: '星宫主客成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到星宫主客，且门星落位，按部就班即可', lay: '盘面走到「星宫主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB038-001' },
      { comboId: 'COMBO-CB038-B', pro: '星宫主客受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到星宫主客，但门星受制，力量打折', lay: '盘面有「星宫主客」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB038-002' },
      { comboId: 'COMBO-CB038-A', pro: '星宫主客（吉凶掺杂格）', mix: '你的奇门格局出现「星宫主客」，', lay: '简单说：盘面走到「星宫主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB038-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB039: {
    id: 'CB039',
    name: '门宫主客',
    group: 'QM',
    factors: [
      { id: 'CB039-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '门宫主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB039-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB039-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '门宫主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB039-A', name: '门宫主客成格', trigger: [{ op: 'has', args: ['patternCombos', '门宫主客'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB039-B', name: '门宫主客受制', trigger: [{ op: 'has', args: ['patternCombos', '门宫主客'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB039-A', pro: '门宫主客成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到门宫主客，且门星落位，按部就班即可', lay: '盘面走到「门宫主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB039-001' },
      { comboId: 'COMBO-CB039-B', pro: '门宫主客受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到门宫主客，但门星受制，力量打折', lay: '盘面有「门宫主客」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB039-002' },
      { comboId: 'COMBO-CB039-A', pro: '门宫主客（吉凶掺杂格）', mix: '你的奇门格局出现「门宫主客」，', lay: '简单说：盘面走到「门宫主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB039-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB040: {
    id: 'CB040',
    name: '星门主客互伤',
    group: 'QM',
    factors: [
      { id: 'CB040-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '星门主客互伤'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB040-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB040-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '星门主客互伤'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB040-A', name: '星门主客互伤成格', trigger: [{ op: 'has', args: ['patternCombos', '星门主客互伤'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB040-B', name: '星门主客互伤受制', trigger: [{ op: 'has', args: ['patternCombos', '星门主客互伤'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB040-A', pro: '星门主客互伤成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到星门主客互伤，且门星落位，按部就班即可', lay: '盘面走到「星门主客互伤」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB040-001' },
      { comboId: 'COMBO-CB040-B', pro: '星门主客互伤受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到星门主客互伤，但门星受制，力量打折', lay: '盘面有「星门主客互伤」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB040-002' },
      { comboId: 'COMBO-CB040-A', pro: '星门主客互伤（吉凶掺杂格）', mix: '你的奇门格局出现「星门主客互伤」，', lay: '简单说：盘面走到「星门主客互伤」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB040-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB041: {
    id: 'CB041',
    name: '八门余气',
    group: 'QM',
    factors: [
      { id: 'CB041-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '八门余气'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB041-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB041-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '八门余气'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB041-A', name: '八门余气成格', trigger: [{ op: 'has', args: ['patternCombos', '八门余气'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB041-B', name: '八门余气受制', trigger: [{ op: 'has', args: ['patternCombos', '八门余气'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB041-A', pro: '八门余气成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到八门余气，且门星落位，按部就班即可', lay: '盘面走到「八门余气」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB041-001' },
      { comboId: 'COMBO-CB041-B', pro: '八门余气受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到八门余气，但门星受制，力量打折', lay: '盘面有「八门余气」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB041-002' },
      { comboId: 'COMBO-CB041-A', pro: '八门余气（吉凶掺杂格）', mix: '你的奇门格局出现「八门余气」，', lay: '简单说：盘面走到「八门余气」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB041-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB042: {
    id: 'CB042',
    name: '射覆物象克应',
    group: 'QM',
    factors: [
      { id: 'CB042-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '射覆物象克应'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB042-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB042-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '射覆物象克应'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB042-A', name: '射覆物象克应成格', trigger: [{ op: 'has', args: ['patternCombos', '射覆物象克应'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB042-B', name: '射覆物象克应受制', trigger: [{ op: 'has', args: ['patternCombos', '射覆物象克应'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB042-A', pro: '射覆物象克应成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到射覆物象克应，且门星落位，按部就班即可', lay: '盘面走到「射覆物象克应」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB042-001' },
      { comboId: 'COMBO-CB042-B', pro: '射覆物象克应受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到射覆物象克应，但门星受制，力量打折', lay: '盘面有「射覆物象克应」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB042-002' },
      { comboId: 'COMBO-CB042-A', pro: '射覆物象克应（吉凶掺杂格）', mix: '你的奇门格局出现「射覆物象克应」，', lay: '简单说：盘面走到「射覆物象克应」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB042-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB043: {
    id: 'CB043',
    name: '十干迫制',
    group: 'QM',
    factors: [
      { id: 'CB043-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '十干迫制'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB043-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB043-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '十干迫制'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB043-A', name: '十干迫制成格', trigger: [{ op: 'has', args: ['patternCombos', '十干迫制'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB043-B', name: '十干迫制受制', trigger: [{ op: 'has', args: ['patternCombos', '十干迫制'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB043-A', pro: '十干迫制成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到十干迫制，且门星落位，按部就班即可', lay: '盘面走到「十干迫制」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB043-001' },
      { comboId: 'COMBO-CB043-B', pro: '十干迫制受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到十干迫制，但门星受制，力量打折', lay: '盘面有「十干迫制」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB043-002' },
      { comboId: 'COMBO-CB043-A', pro: '十干迫制（吉凶掺杂格）', mix: '你的奇门格局出现「十干迫制」，', lay: '简单说：盘面走到「十干迫制」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB043-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB044: {
    id: 'CB044',
    name: '开通',
    group: 'QM',
    factors: [
      { id: 'CB044-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '开通'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB044-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB044-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '开通'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB044-A', name: '开通成格', trigger: [{ op: 'has', args: ['patternCombos', '开通'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB044-B', name: '开通受制', trigger: [{ op: 'has', args: ['patternCombos', '开通'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB044-A', pro: '开通成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到开通，且门星落位，按部就班即可', lay: '盘面走到「开通」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB044-001' },
      { comboId: 'COMBO-CB044-B', pro: '开通受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到开通，但门星受制，力量打折', lay: '盘面有「开通」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB044-002' },
      { comboId: 'COMBO-CB044-A', pro: '开通（平格）', mix: '你的奇门格局出现「开通」，', lay: '简单说：盘面走到「开通」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB044-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB045: {
    id: 'CB045',
    name: '闭塞',
    group: 'QM',
    factors: [
      { id: 'CB045-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '闭塞'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB045-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB045-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '闭塞'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB045-A', name: '闭塞成格', trigger: [{ op: 'has', args: ['patternCombos', '闭塞'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB045-B', name: '闭塞受制', trigger: [{ op: 'has', args: ['patternCombos', '闭塞'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB045-A', pro: '闭塞成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到闭塞，且门星落位，按部就班即可', lay: '盘面走到「闭塞」，这是一个中性的信号，平顺推进即可，不必过度解读', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB045-001' },
      { comboId: 'COMBO-CB045-B', pro: '闭塞受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到闭塞，但门星受制，力量打折', lay: '盘面有「闭塞」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB045-002' },
      { comboId: 'COMBO-CB045-A', pro: '闭塞（平格）', mix: '你的奇门格局出现「闭塞」，', lay: '简单说：盘面走到「闭塞」，这是一个中性的信号，平顺推进即可，不必过度解读。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB045-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB046: {
    id: 'CB046',
    name: '值符开通闭塞',
    group: 'QM',
    factors: [
      { id: 'CB046-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '值符开通闭塞'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB046-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB046-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '值符开通闭塞'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB046-A', name: '值符开通闭塞成格', trigger: [{ op: 'has', args: ['patternCombos', '值符开通闭塞'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB046-B', name: '值符开通闭塞受制', trigger: [{ op: 'has', args: ['patternCombos', '值符开通闭塞'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB046-A', pro: '值符开通闭塞成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到值符开通闭塞，且门星落位，按部就班即可', lay: '盘面走到「值符开通闭塞」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB046-001' },
      { comboId: 'COMBO-CB046-B', pro: '值符开通闭塞受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到值符开通闭塞，但门星受制，力量打折', lay: '盘面有「值符开通闭塞」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB046-002' },
      { comboId: 'COMBO-CB046-A', pro: '值符开通闭塞（吉凶掺杂格）', mix: '你的奇门格局出现「值符开通闭塞」，', lay: '简单说：盘面走到「值符开通闭塞」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB046-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB047: {
    id: 'CB047',
    name: '三胜地',
    group: 'QM',
    factors: [
      { id: 'CB047-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '三胜地'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB047-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB047-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '三胜地'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB047-A', name: '三胜地得势', trigger: [{ op: 'has', args: ['patternCombos', '三胜地'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB047-B', name: '三胜地受制', trigger: [{ op: 'has', args: ['patternCombos', '三胜地'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB047-A', pro: '三胜地得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到三胜地的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB047-001' },
      { comboId: 'COMBO-CB047-B', pro: '三胜地受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到三胜地，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB047-002' },
      { comboId: 'COMBO-CB047-A', pro: '三胜地（大吉格）', mix: '你的奇门格局出现「三胜地」，', lay: '简单说：盘面走到「三胜地」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB047-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB048: {
    id: 'CB048',
    name: '天乙击冲',
    group: 'QM',
    factors: [
      { id: 'CB048-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天乙击冲'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB048-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB048-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天乙击冲'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB048-A', name: '天乙击冲成格', trigger: [{ op: 'has', args: ['patternCombos', '天乙击冲'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB048-B', name: '天乙击冲受制', trigger: [{ op: 'has', args: ['patternCombos', '天乙击冲'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB048-A', pro: '天乙击冲成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天乙击冲，且门星落位，按部就班即可', lay: '盘面走到「天乙击冲」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB048-001' },
      { comboId: 'COMBO-CB048-B', pro: '天乙击冲受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天乙击冲，但门星受制，力量打折', lay: '盘面有「天乙击冲」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB048-002' },
      { comboId: 'COMBO-CB048-A', pro: '天乙击冲（吉凶掺杂格）', mix: '你的奇门格局出现「天乙击冲」，', lay: '简单说：盘面走到「天乙击冲」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB048-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB049: {
    id: 'CB049',
    name: '五不击',
    group: 'QM',
    factors: [
      { id: 'CB049-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '五不击'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB049-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB049-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '五不击'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB049-A', name: '五不击成格', trigger: [{ op: 'has', args: ['patternCombos', '五不击'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB049-B', name: '五不击受制', trigger: [{ op: 'has', args: ['patternCombos', '五不击'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB049-A', pro: '五不击成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到五不击，且门星落位，按部就班即可', lay: '盘面走到「五不击」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB049-001' },
      { comboId: 'COMBO-CB049-B', pro: '五不击受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到五不击，但门星受制，力量打折', lay: '盘面有「五不击」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB049-002' },
      { comboId: 'COMBO-CB049-A', pro: '五不击（吉凶掺杂格）：值符星、九天、生门、九地和值使所在宫为五不击，偏兵事攻守禁忌；宜据守借势，不宜把这些方位作为攻击对象。', mix: '你的奇门格局出现「五不击」，值符星、九天、生门、九地和值使所在宫为五不击，偏兵事攻守禁忌；宜据守借势，不宜把这些方位作为攻击对象。', lay: '简单说：盘面走到「五不击」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB049-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB050: {
    id: 'CB050',
    name: '趋三',
    group: 'QM',
    factors: [
      { id: 'CB050-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '趋三'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB050-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB050-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '趋三'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB050-A', name: '趋三得势', trigger: [{ op: 'has', args: ['patternCombos', '趋三'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB050-B', name: '趋三受制', trigger: [{ op: 'has', args: ['patternCombos', '趋三'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB050-A', pro: '趋三得势，大吉格成象且门星落位，主顺势可成', mix: '你的奇门格局走到趋三的大吉格，且门星落位，事能成', lay: '你撞上一个「顺势就能赢」的时机，这是一个偏正面的信号，推进顺势的事更容易成', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB050-001' },
      { comboId: 'COMBO-CB050-B', pro: '趋三受制，大吉格虽成而门星受制，利势打折', mix: '你的奇门格局走到趋三，但门星受制，吉利打折', lay: '你撞上好的时机，但被卡了一下，成事要打折扣', polarity: '+', modality: 'likely', atomicId: 'ATOM-QM-CB050-002' },
      { comboId: 'COMBO-CB050-A', pro: '趋三（大吉格）', mix: '你的奇门格局出现「趋三」，', lay: '简单说：盘面走到「趋三」，这是一个偏正面的信号，推进顺势的事更容易成。', polarity: '++', modality: 'assert', atomicId: 'ATOM-QM-CB050-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB051: {
    id: 'CB051',
    name: '避五',
    group: 'QM',
    factors: [
      { id: 'CB051-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '避五'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB051-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB051-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '避五'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB051-A', name: '避五成格', trigger: [{ op: 'has', args: ['patternCombos', '避五'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB051-B', name: '避五受制', trigger: [{ op: 'has', args: ['patternCombos', '避五'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB051-A', pro: '避五成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到避五，且门星落位，按部就班即可', lay: '盘面走到「避五」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB051-001' },
      { comboId: 'COMBO-CB051-B', pro: '避五受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到避五，但门星受制，力量打折', lay: '盘面有「避五」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB051-002' },
      { comboId: 'COMBO-CB051-A', pro: '避五（吉凶掺杂格）', mix: '你的奇门格局出现「避五」，', lay: '简单说：盘面走到「避五」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB051-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB052: {
    id: 'CB052',
    name: '八将会门',
    group: 'QM',
    factors: [
      { id: 'CB052-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '八将会门'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB052-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB052-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '八将会门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB052-A', name: '八将会门成格', trigger: [{ op: 'has', args: ['patternCombos', '八将会门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB052-B', name: '八将会门受制', trigger: [{ op: 'has', args: ['patternCombos', '八将会门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB052-A', pro: '八将会门成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到八将会门，且门星落位，按部就班即可', lay: '盘面走到「八将会门」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB052-001' },
      { comboId: 'COMBO-CB052-B', pro: '八将会门受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到八将会门，但门星受制，力量打折', lay: '盘面有「八将会门」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB052-002' },
      { comboId: 'COMBO-CB052-A', pro: '八将会门（吉凶掺杂格）', mix: '你的奇门格局出现「八将会门」，', lay: '简单说：盘面走到「八将会门」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB052-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB053: {
    id: 'CB053',
    name: '游都鲁都',
    group: 'QM',
    factors: [
      { id: 'CB053-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '游都鲁都'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB053-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB053-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '游都鲁都'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB053-A', name: '游都鲁都成格', trigger: [{ op: 'has', args: ['patternCombos', '游都鲁都'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB053-B', name: '游都鲁都受制', trigger: [{ op: 'has', args: ['patternCombos', '游都鲁都'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB053-A', pro: '游都鲁都成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到游都鲁都，且门星落位，按部就班即可', lay: '盘面走到「游都鲁都」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB053-001' },
      { comboId: 'COMBO-CB053-B', pro: '游都鲁都受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到游都鲁都，但门星受制，力量打折', lay: '盘面有「游都鲁都」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB053-002' },
      { comboId: 'COMBO-CB053-A', pro: '游都鲁都（吉凶掺杂格）', mix: '你的奇门格局出现「游都鲁都」，', lay: '简单说：盘面走到「游都鲁都」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB053-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB054: {
    id: 'CB054',
    name: '天目地耳',
    group: 'QM',
    factors: [
      { id: 'CB054-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天目地耳'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB054-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB054-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天目地耳'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB054-A', name: '天目地耳成格', trigger: [{ op: 'has', args: ['patternCombos', '天目地耳'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB054-B', name: '天目地耳受制', trigger: [{ op: 'has', args: ['patternCombos', '天目地耳'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB054-A', pro: '天目地耳成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天目地耳，且门星落位，按部就班即可', lay: '盘面走到「天目地耳」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB054-001' },
      { comboId: 'COMBO-CB054-B', pro: '天目地耳受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天目地耳，但门星受制，力量打折', lay: '盘面有「天目地耳」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB054-002' },
      { comboId: 'COMBO-CB054-A', pro: '天目地耳（吉凶掺杂格）', mix: '你的奇门格局出现「天目地耳」，', lay: '简单说：盘面走到「天目地耳」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB054-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB055: {
    id: 'CB055',
    name: '孤虚',
    group: 'QM',
    factors: [
      { id: 'CB055-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '孤虚'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB055-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB055-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '孤虚'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB055-A', name: '孤虚成格', trigger: [{ op: 'has', args: ['patternCombos', '孤虚'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB055-B', name: '孤虚受制', trigger: [{ op: 'has', args: ['patternCombos', '孤虚'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB055-A', pro: '孤虚成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到孤虚，且门星落位，按部就班即可', lay: '盘面走到「孤虚」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB055-001' },
      { comboId: 'COMBO-CB055-B', pro: '孤虚受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到孤虚，但门星受制，力量打折', lay: '盘面有「孤虚」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB055-002' },
      { comboId: 'COMBO-CB055-A', pro: '孤虚（吉凶掺杂格）', mix: '你的奇门格局出现「孤虚」，', lay: '简单说：盘面走到「孤虚」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB055-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB056: {
    id: 'CB056',
    name: '天马方',
    group: 'QM',
    factors: [
      { id: 'CB056-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天马方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB056-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB056-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天马方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB056-A', name: '天马方成格', trigger: [{ op: 'has', args: ['patternCombos', '天马方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB056-B', name: '天马方受制', trigger: [{ op: 'has', args: ['patternCombos', '天马方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB056-A', pro: '天马方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天马方，且门星落位，按部就班即可', lay: '盘面走到「天马方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB056-001' },
      { comboId: 'COMBO-CB056-B', pro: '天马方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天马方，但门星受制，力量打折', lay: '盘面有「天马方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB056-002' },
      { comboId: 'COMBO-CB056-A', pro: '天马方（吉凶掺杂格）', mix: '你的奇门格局出现「天马方」，', lay: '简单说：盘面走到「天马方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB056-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB057: {
    id: 'CB057',
    name: '天罡时',
    group: 'QM',
    factors: [
      { id: 'CB057-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天罡时'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB057-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB057-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天罡时'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB057-A', name: '天罡时成格', trigger: [{ op: 'has', args: ['patternCombos', '天罡时'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB057-B', name: '天罡时受制', trigger: [{ op: 'has', args: ['patternCombos', '天罡时'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB057-A', pro: '天罡时成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天罡时，且门星落位，按部就班即可', lay: '盘面走到「天罡时」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB057-001' },
      { comboId: 'COMBO-CB057-B', pro: '天罡时受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天罡时，但门星受制，力量打折', lay: '盘面有「天罡时」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB057-002' },
      { comboId: 'COMBO-CB057-A', pro: '天罡时（吉凶掺杂格）', mix: '你的奇门格局出现「天罡时」，', lay: '简单说：盘面走到「天罡时」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB057-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB058: {
    id: 'CB058',
    name: '迷路法',
    group: 'QM',
    factors: [
      { id: 'CB058-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '迷路法'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB058-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB058-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '迷路法'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB058-A', name: '迷路法成格', trigger: [{ op: 'has', args: ['patternCombos', '迷路法'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB058-B', name: '迷路法受制', trigger: [{ op: 'has', args: ['patternCombos', '迷路法'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB058-A', pro: '迷路法成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到迷路法，且门星落位，按部就班即可', lay: '盘面走到「迷路法」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB058-001' },
      { comboId: 'COMBO-CB058-B', pro: '迷路法受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到迷路法，但门星受制，力量打折', lay: '盘面有「迷路法」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB058-002' },
      { comboId: 'COMBO-CB058-A', pro: '迷路法（吉凶掺杂格）', mix: '你的奇门格局出现「迷路法」，', lay: '简单说：盘面走到「迷路法」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB058-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB059: {
    id: 'CB059',
    name: '天三门地四户',
    group: 'QM',
    factors: [
      { id: 'CB059-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天三门地四户'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB059-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB059-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天三门地四户'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB059-A', name: '天三门地四户成格', trigger: [{ op: 'has', args: ['patternCombos', '天三门地四户'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB059-B', name: '天三门地四户受制', trigger: [{ op: 'has', args: ['patternCombos', '天三门地四户'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB059-A', pro: '天三门地四户成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天三门地四户，且门星落位，按部就班即可', lay: '盘面走到「天三门地四户」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB059-001' },
      { comboId: 'COMBO-CB059-B', pro: '天三门地四户受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天三门地四户，但门星受制，力量打折', lay: '盘面有「天三门地四户」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB059-002' },
      { comboId: 'COMBO-CB059-A', pro: '天三门地四户（吉凶掺杂格）', mix: '你的奇门格局出现「天三门地四户」，', lay: '简单说：盘面走到「天三门地四户」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB059-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB060: {
    id: 'CB060',
    name: '地私门',
    group: 'QM',
    factors: [
      { id: 'CB060-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '地私门'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB060-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB060-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '地私门'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB060-A', name: '地私门成格', trigger: [{ op: 'has', args: ['patternCombos', '地私门'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB060-B', name: '地私门受制', trigger: [{ op: 'has', args: ['patternCombos', '地私门'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB060-A', pro: '地私门成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到地私门，且门星落位，按部就班即可', lay: '盘面走到「地私门」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB060-001' },
      { comboId: 'COMBO-CB060-B', pro: '地私门受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到地私门，但门星受制，力量打折', lay: '盘面有「地私门」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB060-002' },
      { comboId: 'COMBO-CB060-A', pro: '地私门（吉凶掺杂格）', mix: '你的奇门格局出现「地私门」，', lay: '简单说：盘面走到「地私门」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB060-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB061: {
    id: 'CB061',
    name: '亭亭白奸',
    group: 'QM',
    factors: [
      { id: 'CB061-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '亭亭白奸'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB061-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB061-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '亭亭白奸'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB061-A', name: '亭亭白奸成格', trigger: [{ op: 'has', args: ['patternCombos', '亭亭白奸'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB061-B', name: '亭亭白奸受制', trigger: [{ op: 'has', args: ['patternCombos', '亭亭白奸'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB061-A', pro: '亭亭白奸成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到亭亭白奸，且门星落位，按部就班即可', lay: '盘面走到「亭亭白奸」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB061-001' },
      { comboId: 'COMBO-CB061-B', pro: '亭亭白奸受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到亭亭白奸，但门星受制，力量打折', lay: '盘面有「亭亭白奸」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB061-002' },
      { comboId: 'COMBO-CB061-A', pro: '亭亭白奸（吉凶掺杂格）', mix: '你的奇门格局出现「亭亭白奸」，', lay: '简单说：盘面走到「亭亭白奸」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB061-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB062: {
    id: 'CB062',
    name: '天门地户太阴青龙',
    group: 'QM',
    factors: [
      { id: 'CB062-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '天门地户太阴青龙'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB062-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB062-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '天门地户太阴青龙'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB062-A', name: '天门地户太阴青龙成格', trigger: [{ op: 'has', args: ['patternCombos', '天门地户太阴青龙'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB062-B', name: '天门地户太阴青龙受制', trigger: [{ op: 'has', args: ['patternCombos', '天门地户太阴青龙'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB062-A', pro: '天门地户太阴青龙成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到天门地户太阴青龙，且门星落位，按部就班即可', lay: '盘面走到「天门地户太阴青龙」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB062-001' },
      { comboId: 'COMBO-CB062-B', pro: '天门地户太阴青龙受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到天门地户太阴青龙，但门星受制，力量打折', lay: '盘面有「天门地户太阴青龙」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB062-002' },
      { comboId: 'COMBO-CB062-A', pro: '天门地户太阴青龙（吉凶掺杂格）', mix: '你的奇门格局出现「天门地户太阴青龙」，', lay: '简单说：盘面走到「天门地户太阴青龙」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB062-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB063: {
    id: 'CB063',
    name: '下营法',
    group: 'QM',
    factors: [
      { id: 'CB063-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '下营法'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB063-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB063-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '下营法'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB063-A', name: '下营法成格', trigger: [{ op: 'has', args: ['patternCombos', '下营法'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB063-B', name: '下营法受制', trigger: [{ op: 'has', args: ['patternCombos', '下营法'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB063-A', pro: '下营法成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到下营法，且门星落位，按部就班即可', lay: '盘面走到「下营法」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB063-001' },
      { comboId: 'COMBO-CB063-B', pro: '下营法受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到下营法，但门星受制，力量打折', lay: '盘面有「下营法」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB063-002' },
      { comboId: 'COMBO-CB063-A', pro: '下营法（吉凶掺杂格）', mix: '你的奇门格局出现「下营法」，', lay: '简单说：盘面走到「下营法」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB063-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB064: {
    id: 'CB064',
    name: '五阳五阴主客',
    group: 'QM',
    factors: [
      { id: 'CB064-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '五阳五阴主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB064-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB064-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '五阳五阴主客'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB064-A', name: '五阳五阴主客成格', trigger: [{ op: 'has', args: ['patternCombos', '五阳五阴主客'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB064-B', name: '五阳五阴主客受制', trigger: [{ op: 'has', args: ['patternCombos', '五阳五阴主客'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB064-A', pro: '五阳五阴主客成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到五阳五阴主客，且门星落位，按部就班即可', lay: '盘面走到「五阳五阴主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB064-001' },
      { comboId: 'COMBO-CB064-B', pro: '五阳五阴主客受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到五阳五阴主客，但门星受制，力量打折', lay: '盘面有「五阳五阴主客」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB064-002' },
      { comboId: 'COMBO-CB064-A', pro: '五阳五阴主客（吉凶掺杂格）', mix: '你的奇门格局出现「五阳五阴主客」，', lay: '简单说：盘面走到「五阳五阴主客」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB064-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB065: {
    id: 'CB065',
    name: '旬中地丙日',
    group: 'QM',
    factors: [
      { id: 'CB065-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '旬中地丙日'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB065-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB065-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '旬中地丙日'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB065-A', name: '旬中地丙日成格', trigger: [{ op: 'has', args: ['patternCombos', '旬中地丙日'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB065-B', name: '旬中地丙日受制', trigger: [{ op: 'has', args: ['patternCombos', '旬中地丙日'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB065-A', pro: '旬中地丙日成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到旬中地丙日，且门星落位，按部就班即可', lay: '盘面走到「旬中地丙日」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB065-001' },
      { comboId: 'COMBO-CB065-B', pro: '旬中地丙日受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到旬中地丙日，但门星受制，力量打折', lay: '盘面有「旬中地丙日」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB065-002' },
      { comboId: 'COMBO-CB065-A', pro: '旬中地丙日（吉凶掺杂格）', mix: '你的奇门格局出现「旬中地丙日」，', lay: '简单说：盘面走到「旬中地丙日」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB065-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB066: {
    id: 'CB066',
    name: '大将军方',
    group: 'QM',
    factors: [
      { id: 'CB066-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '大将军方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB066-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB066-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '大将军方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB066-A', name: '大将军方成格', trigger: [{ op: 'has', args: ['patternCombos', '大将军方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB066-B', name: '大将军方受制', trigger: [{ op: 'has', args: ['patternCombos', '大将军方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB066-A', pro: '大将军方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到大将军方，且门星落位，按部就班即可', lay: '盘面走到「大将军方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB066-001' },
      { comboId: 'COMBO-CB066-B', pro: '大将军方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到大将军方，但门星受制，力量打折', lay: '盘面有「大将军方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB066-002' },
      { comboId: 'COMBO-CB066-A', pro: '大将军方（吉凶掺杂格）', mix: '你的奇门格局出现「大将军方」，', lay: '简单说：盘面走到「大将军方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB066-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB067: {
    id: 'CB067',
    name: '太岁方',
    group: 'QM',
    factors: [
      { id: 'CB067-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '太岁方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB067-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB067-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太岁方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB067-A', name: '太岁方成格', trigger: [{ op: 'has', args: ['patternCombos', '太岁方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB067-B', name: '太岁方受制', trigger: [{ op: 'has', args: ['patternCombos', '太岁方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB067-A', pro: '太岁方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到太岁方，且门星落位，按部就班即可', lay: '盘面走到「太岁方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB067-001' },
      { comboId: 'COMBO-CB067-B', pro: '太岁方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到太岁方，但门星受制，力量打折', lay: '盘面有「太岁方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB067-002' },
      { comboId: 'COMBO-CB067-A', pro: '太岁方（吉凶掺杂格）', mix: '你的奇门格局出现「太岁方」，', lay: '简单说：盘面走到「太岁方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB067-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB068: {
    id: 'CB068',
    name: '月建方',
    group: 'QM',
    factors: [
      { id: 'CB068-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '月建方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB068-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB068-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '月建方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB068-A', name: '月建方成格', trigger: [{ op: 'has', args: ['patternCombos', '月建方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB068-B', name: '月建方受制', trigger: [{ op: 'has', args: ['patternCombos', '月建方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB068-A', pro: '月建方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到月建方，且门星落位，按部就班即可', lay: '盘面走到「月建方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB068-001' },
      { comboId: 'COMBO-CB068-B', pro: '月建方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到月建方，但门星受制，力量打折', lay: '盘面有「月建方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB068-002' },
      { comboId: 'COMBO-CB068-A', pro: '月建方（吉凶掺杂格）', mix: '你的奇门格局出现「月建方」，', lay: '简单说：盘面走到「月建方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB068-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB069: {
    id: 'CB069',
    name: '太阴方',
    group: 'QM',
    factors: [
      { id: 'CB069-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '太阴方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB069-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB069-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '太阴方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB069-A', name: '太阴方成格', trigger: [{ op: 'has', args: ['patternCombos', '太阴方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB069-B', name: '太阴方受制', trigger: [{ op: 'has', args: ['patternCombos', '太阴方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB069-A', pro: '太阴方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到太阴方，且门星落位，按部就班即可', lay: '盘面走到「太阴方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB069-001' },
      { comboId: 'COMBO-CB069-B', pro: '太阴方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到太阴方，但门星受制，力量打折', lay: '盘面有「太阴方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB069-002' },
      { comboId: 'COMBO-CB069-A', pro: '太阴方（吉凶掺杂格）', mix: '你的奇门格局出现「太阴方」，', lay: '简单说：盘面走到「太阴方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB069-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB070: {
    id: 'CB070',
    name: '四神用方',
    group: 'QM',
    factors: [
      { id: 'CB070-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '四神用方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB070-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB070-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '四神用方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB070-A', name: '四神用方成格', trigger: [{ op: 'has', args: ['patternCombos', '四神用方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB070-B', name: '四神用方受制', trigger: [{ op: 'has', args: ['patternCombos', '四神用方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB070-A', pro: '四神用方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到四神用方，且门星落位，按部就班即可', lay: '盘面走到「四神用方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB070-001' },
      { comboId: 'COMBO-CB070-B', pro: '四神用方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到四神用方，但门星受制，力量打折', lay: '盘面有「四神用方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB070-002' },
      { comboId: 'COMBO-CB070-A', pro: '四神用方（吉凶掺杂格）', mix: '你的奇门格局出现「四神用方」，', lay: '简单说：盘面走到「四神用方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB070-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB071: {
    id: 'CB071',
    name: '河魁方',
    group: 'QM',
    factors: [
      { id: 'CB071-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '河魁方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB071-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB071-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '河魁方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB071-A', name: '河魁方成格', trigger: [{ op: 'has', args: ['patternCombos', '河魁方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB071-B', name: '河魁方受制', trigger: [{ op: 'has', args: ['patternCombos', '河魁方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB071-A', pro: '河魁方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到河魁方，且门星落位，按部就班即可', lay: '盘面走到「河魁方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB071-001' },
      { comboId: 'COMBO-CB071-B', pro: '河魁方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到河魁方，但门星受制，力量打折', lay: '盘面有「河魁方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB071-002' },
      { comboId: 'COMBO-CB071-A', pro: '河魁方（吉凶掺杂格）', mix: '你的奇门格局出现「河魁方」，', lay: '简单说：盘面走到「河魁方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB071-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB072: {
    id: 'CB072',
    name: '五将方',
    group: 'QM',
    factors: [
      { id: 'CB072-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '五将方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB072-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB072-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '五将方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB072-A', name: '五将方成格', trigger: [{ op: 'has', args: ['patternCombos', '五将方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB072-B', name: '五将方受制', trigger: [{ op: 'has', args: ['patternCombos', '五将方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB072-A', pro: '五将方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到五将方，且门星落位，按部就班即可', lay: '盘面走到「五将方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB072-001' },
      { comboId: 'COMBO-CB072-B', pro: '五将方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到五将方，但门星受制，力量打折', lay: '盘面有「五将方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB072-002' },
      { comboId: 'COMBO-CB072-A', pro: '五将方（吉凶掺杂格）', mix: '你的奇门格局出现「五将方」，', lay: '简单说：盘面走到「五将方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB072-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB073: {
    id: 'CB073',
    name: '时中将星',
    group: 'QM',
    factors: [
      { id: 'CB073-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '时中将星'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB073-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB073-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '时中将星'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB073-A', name: '时中将星成格', trigger: [{ op: 'has', args: ['patternCombos', '时中将星'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB073-B', name: '时中将星受制', trigger: [{ op: 'has', args: ['patternCombos', '时中将星'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB073-A', pro: '时中将星成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到时中将星，且门星落位，按部就班即可', lay: '盘面走到「时中将星」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB073-001' },
      { comboId: 'COMBO-CB073-B', pro: '时中将星受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到时中将星，但门星受制，力量打折', lay: '盘面有「时中将星」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB073-002' },
      { comboId: 'COMBO-CB073-A', pro: '时中将星（吉凶掺杂格）', mix: '你的奇门格局出现「时中将星」，', lay: '简单说：盘面走到「时中将星」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB073-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB074: {
    id: 'CB074',
    name: '雄雌方',
    group: 'QM',
    factors: [
      { id: 'CB074-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '雄雌方'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB074-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB074-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '雄雌方'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB074-A', name: '雄雌方成格', trigger: [{ op: 'has', args: ['patternCombos', '雄雌方'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB074-B', name: '雄雌方受制', trigger: [{ op: 'has', args: ['patternCombos', '雄雌方'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB074-A', pro: '雄雌方成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到雄雌方，且门星落位，按部就班即可', lay: '盘面走到「雄雌方」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB074-001' },
      { comboId: 'COMBO-CB074-B', pro: '雄雌方受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到雄雌方，但门星受制，力量打折', lay: '盘面有「雄雌方」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB074-002' },
      { comboId: 'COMBO-CB074-A', pro: '雄雌方（吉凶掺杂格）', mix: '你的奇门格局出现「雄雌方」，', lay: '简单说：盘面走到「雄雌方」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB074-003' },
    ],
    dimTags: ['DIM_12'],
  },
  CB075: {
    id: 'CB075',
    name: '日干攻方避忌',
    group: 'QM',
    factors: [
      { id: 'CB075-1', name: '格局标签命中', trigger: [{ op: 'has', args: ['patternCombos', '日干攻方避忌'] }], fieldBinding: ['patternCombos', 'jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'CB075-2', name: '门星落位', trigger: [{ op: 'has', args: ['jiuGongGe', 'renPan.door'] }], fieldBinding: ['jiuGongGe', 'renPan.door', 'tianPan.star'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'CB075-3', name: '格局组合', trigger: [{ op: 'has', args: ['patternCombos', '日干攻方避忌'] }], fieldBinding: ['patternCombos', 'jiuGongGe'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-CB075-A', name: '日干攻方避忌成格', trigger: [{ op: 'has', args: ['patternCombos', '日干攻方避忌'] }, { op: 'has', args: ['jiuGongGe', 'renPan.door'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CB075-B', name: '日干攻方避忌受制', trigger: [{ op: 'has', args: ['patternCombos', '日干攻方避忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CB075-A', pro: '日干攻方避忌成格且门星落位，主平顺推进、无明显助力阻力', mix: '你的奇门格局走到日干攻方避忌，且门星落位，按部就班即可', lay: '盘面走到「日干攻方避忌」，这是吉凶掺杂的信号，成不成主要看你怎么应对', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB075-001' },
      { comboId: 'COMBO-CB075-B', pro: '日干攻方避忌受制，格局虽成而门星受制，力量打折', mix: '你的奇门格局走到日干攻方避忌，但门星受制，力量打折', lay: '盘面有「日干攻方避忌」，但被卡了一下，力量打折', polarity: '0', modality: 'likely', atomicId: 'ATOM-QM-CB075-002' },
      { comboId: 'COMBO-CB075-A', pro: '日干攻方避忌（吉凶掺杂格）', mix: '你的奇门格局出现「日干攻方避忌」，', lay: '简单说：盘面走到「日干攻方避忌」，这是吉凶掺杂的信号，成不成主要看你怎么应对。', polarity: '0', modality: 'assert', atomicId: 'ATOM-QM-CB075-003' },
    ],
    dimTags: ['DIM_12'],
  },
};
