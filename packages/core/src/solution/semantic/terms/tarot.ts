/**
 * TR 塔罗组 · 78 条
 * 大阿卡纳 22 + 权杖 14 + 圣杯 14 + 宝剑 14 + 钱币 14
 *
 * 字段绑定（R3 源码核验 · 2026-09-19）：
 * - cards[].{id, name, position, reversed, keywords[], element?, archetype?}
 * - spreadType / spreadName（牌阵类型与名称，源码无独立的 spread 键）
 * - draw.order[].{index, position, cardId, cardName, orientation:'正位'|'逆位'}
 *
 * 核验说明（对照 R3-6 任务卡）：
 * - 任务卡所写 tarotDraw.{cardId, suit, rank, uprightMeaning, reversedMeaning, spread}
 *   在本仓源码中除 cardId（仅存在于 draw.order[]）外**均不存在**，已按真实键名绑定。
 * - 牌名严格对齐 packages/core/src/divination/tarot-data.ts 的 tarotCards[].name：
 *   源码作「塔」（非「高塔」）、「钱币」（非「星币」）、「侍者」（非「侍从」）、「王牌」（非「1」）。
 * - 每张牌 3 因子（牌意核心 0.4 / 正位倾向 0.3 / 逆位倾向 0.3）+ 2 组合（正位 + 逆位变体）+ 2 条三层白话。
 *
 * 传统依据：Rider-Waite-Smith 体系及 A. E. Waite《The Pictorial Key to the Tarot》通行牌义。
 */
import type { TermSchema } from '../types';

export const TAROT_REGISTRY: Record<string, TermSchema> = {
  TR01: {
    id: 'TR01',
    name: '愚者',
    group: 'TR',
    factors: [
      { id: 'TR01-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '愚者'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR01-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '愚者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR01-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '愚者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR01-UP', name: '愚者正位', trigger: [{ op: 'has', args: ['cards.name', '愚者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR01-REV'] },
      { id: 'COMBO-TR01-REV', name: '愚者逆位', trigger: [{ op: 'has', args: ['cards.name', '愚者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR01-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR01-UP', pro: '愚者正位，主新开始与冒险，宜轻装起步、放下包袱', mix: '牌上是愚者正位，关键词是新开始、冒险、纯真，适合轻装上阵去试新事', lay: '你现在站在一条新路的起点，别想太多，先迈出去试试，轻装上阵反而顺', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR01-001' },
      { comboId: 'COMBO-TR01-REV', pro: '愚者逆位，主轻率冒进或裹足不前，起步受阻', mix: '牌上是愚者逆位，方向没错，但要么太冲动要么一直不敢动', lay: '新机会摆在眼前，你要么一头扎进去太莽，要么一直犹豫不动，先想清楚再走', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR01-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR02: {
    id: 'TR02',
    name: '魔术师',
    group: 'TR',
    factors: [
      { id: 'TR02-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '魔术师'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR02-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '魔术师'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR02-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '魔术师'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR02-UP', name: '魔术师正位', trigger: [{ op: 'has', args: ['cards.name', '魔术师'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR02-REV'] },
      { id: 'COMBO-TR02-REV', name: '魔术师逆位', trigger: [{ op: 'has', args: ['cards.name', '魔术师'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR02-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR02-UP', pro: '魔术师正位，主意志力与创造，资源齐备、事在人为', mix: '牌上是魔术师正位，关键词是意志力、创造、技能，该有的条件都在手上', lay: '你要的东西，工具和本事都齐了，主动去做就能成，关键是别光想不动', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR02-001' },
      { comboId: 'COMBO-TR02-REV', pro: '魔术师逆位，主技巧失准或意图不纯，创造力受挫', mix: '牌上是魔术师逆位，本事还在，但要么用偏了要么发挥不出来', lay: '你有能力但没使对地方，或者心里另有小算盘，先把目标摆正再动手', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR02-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR03: {
    id: 'TR03',
    name: '女祭司',
    group: 'TR',
    factors: [
      { id: 'TR03-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '女祭司'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR03-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '女祭司'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR03-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '女祭司'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR03-UP', name: '女祭司正位', trigger: [{ op: 'has', args: ['cards.name', '女祭司'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR03-REV'] },
      { id: 'COMBO-TR03-REV', name: '女祭司逆位', trigger: [{ op: 'has', args: ['cards.name', '女祭司'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR03-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR03-UP', pro: '女祭司正位，主直觉与内在智慧，宜静观其变', mix: '牌上是女祭司正位，关键词是直觉、神秘、内在智慧，适合先听心里的声音', lay: '这事别急着表态，你心里其实有答案，安静下来听一听，比到处问人准', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR03-001' },
      { comboId: 'COMBO-TR03-REV', pro: '女祭司逆位，主直觉被遮蔽、内外不一，判断失真', mix: '牌上是女祭司逆位，直觉失灵，容易被表面信息带偏', lay: '你现在容易自我怀疑或被别人的话带跑，别急着下结论，多等两天再定', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR03-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR04: {
    id: 'TR04',
    name: '女皇',
    group: 'TR',
    factors: [
      { id: 'TR04-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '女皇'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR04-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '女皇'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR04-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '女皇'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR04-UP', name: '女皇正位', trigger: [{ op: 'has', args: ['cards.name', '女皇'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR04-REV'] },
      { id: 'COMBO-TR04-REV', name: '女皇逆位', trigger: [{ op: 'has', args: ['cards.name', '女皇'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR04-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR04-UP', pro: '女皇正位，主丰饶与创造力，孕育有成、收获可期', mix: '牌上是女皇正位，关键词是丰饶、母性、创造力，付出会有实在回报', lay: '这段时间是种下去能长的时候，投入的时间和资源会慢慢结果，耐心养着就好', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR04-001' },
      { comboId: 'COMBO-TR04-REV', pro: '女皇逆位，主丰饶受阻、过度付出而失养', mix: '牌上是女皇逆位，创造力被卡住，或者你付出太多把自己掏空了', lay: '你给出去的太多、收回来的太少，事情也容易停滞，先顾好自己再顾别人', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR04-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR05: {
    id: 'TR05',
    name: '皇帝',
    group: 'TR',
    factors: [
      { id: 'TR05-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '皇帝'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR05-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '皇帝'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR05-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '皇帝'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR05-UP', name: '皇帝正位', trigger: [{ op: 'has', args: ['cards.name', '皇帝'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR05-REV'] },
      { id: 'COMBO-TR05-REV', name: '皇帝逆位', trigger: [{ op: 'has', args: ['cards.name', '皇帝'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR05-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR05-UP', pro: '皇帝正位，主权威与稳定，宜立规则、掌大局', mix: '牌上是皇帝正位，关键词是权威、稳定、父性，适合定规矩、拿主意', lay: '这事需要你站出来拍板定规则，稳住局面就能推进，别怕担责任', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR05-001' },
      { comboId: 'COMBO-TR05-REV', pro: '皇帝逆位，主权威失灵、僵化或失控', mix: '牌上是皇帝逆位，要么管得太死，要么根本没人管得住', lay: '局面有点乱，要么你太强势压得人喘不过气，要么没人拿主意一盘散沙', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR05-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR06: {
    id: 'TR06',
    name: '教皇',
    group: 'TR',
    factors: [
      { id: 'TR06-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '教皇'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR06-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '教皇'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR06-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '教皇'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR06-UP', name: '教皇正位', trigger: [{ op: 'has', args: ['cards.name', '教皇'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR06-REV'] },
      { id: 'COMBO-TR06-REV', name: '教皇逆位', trigger: [{ op: 'has', args: ['cards.name', '教皇'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR06-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR06-UP', pro: '教皇正位，主传统与精神指导，宜请教前辈、循规而行', mix: '牌上是教皇正位，关键词是传统、精神指导、宗教，走成熟路子更稳', lay: '这事照老办法、听有经验的人一句，比自己瞎摸索稳当得多', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR06-001' },
      { comboId: 'COMBO-TR06-REV', pro: '教皇逆位，主教条束缚或背离正道，指导失效', mix: '牌上是教皇逆位，规矩成了枷锁，或者你听错了人', lay: '别死守规矩把自己困住，也别迷信所谓的权威，该走自己的路就走', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR06-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR07: {
    id: 'TR07',
    name: '恋人',
    group: 'TR',
    factors: [
      { id: 'TR07-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '恋人'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR07-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '恋人'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR07-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '恋人'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR07-UP', name: '恋人正位', trigger: [{ op: 'has', args: ['cards.name', '恋人'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR07-REV'] },
      { id: 'COMBO-TR07-REV', name: '恋人逆位', trigger: [{ op: 'has', args: ['cards.name', '恋人'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR07-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR07-UP', pro: '恋人正位，主爱情与选择，宜坦诚相待、结盟同行', mix: '牌上是恋人正位，关键词是爱情、选择、和谐，关系和合作都偏顺', lay: '不管是感情还是合作，现在都适合打开天窗说亮话，选好了就一起走', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR07-001' },
      { comboId: 'COMBO-TR07-REV', pro: '恋人逆位，主选择摇摆、关系失和', mix: '牌上是恋人逆位，选择摇摆不定，关系里也有说不清的别扭', lay: '你现在拿不定主意，或者两人之间有话没说开，先把心里的结解开再谈下一步', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR07-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR08: {
    id: 'TR08',
    name: '战车',
    group: 'TR',
    factors: [
      { id: 'TR08-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '战车'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR08-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '战车'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR08-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '战车'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR08-UP', name: '战车正位', trigger: [{ op: 'has', args: ['cards.name', '战车'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR08-REV'] },
      { id: 'COMBO-TR08-REV', name: '战车逆位', trigger: [{ op: 'has', args: ['cards.name', '战车'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR08-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR08-UP', pro: '战车正位，主胜利与控制，意志坚定则事必成', mix: '牌上是战车正位，关键词是胜利、意志力、控制，稳住方向就能赢', lay: '你只要咬住目标不松劲，这事能成，关键是别同时追两只兔子', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR08-001' },
      { comboId: 'COMBO-TR08-REV', pro: '战车逆位，主方向失控、进退失据', mix: '牌上是战车逆位，劲使散了，方向也不稳', lay: '你有点东一榔头西一棒子，或者硬撑着往前冲却没人跟，先停下来重新定方向', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR08-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR09: {
    id: 'TR09',
    name: '力量',
    group: 'TR',
    factors: [
      { id: 'TR09-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '力量'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR09-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '力量'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR09-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '力量'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR09-UP', name: '力量正位', trigger: [{ op: 'has', args: ['cards.name', '力量'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR09-REV'] },
      { id: 'COMBO-TR09-REV', name: '力量逆位', trigger: [{ op: 'has', args: ['cards.name', '力量'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR09-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR09-UP', pro: '力量正位，主勇气与耐心，以柔克刚、从容有成', mix: '牌上是力量正位，关键词是勇气、耐心、内在力量，靠稳劲不靠蛮力', lay: '这事靠的不是硬碰硬，而是沉住气慢慢磨，你比自己想的更能扛', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR09-001' },
      { comboId: 'COMBO-TR09-REV', pro: '力量逆位，主信心不足或刚愎自用，内在力量失守', mix: '牌上是力量逆位，要么心里发虚，要么脾气上来压不住', lay: '你现在要么怀疑自己扛不住，要么一急就硬来，先把情绪稳下来再说', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR09-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR10: {
    id: 'TR10',
    name: '隐士',
    group: 'TR',
    factors: [
      { id: 'TR10-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '隐士'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR10-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '隐士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR10-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '隐士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR10-UP', name: '隐士正位', trigger: [{ op: 'has', args: ['cards.name', '隐士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR10-REV'] },
      { id: 'COMBO-TR10-REV', name: '隐士逆位', trigger: [{ op: 'has', args: ['cards.name', '隐士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR10-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR10-UP', pro: '隐士正位，主内省与寻找，宜独处沉淀、暂避喧嚣', mix: '牌上是隐士正位，关键词是内省、寻找、智慧，适合先退一步想清楚', lay: '这阵子适合给自己留点独处时间，把事情想透了再动，别急着凑热闹', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR10-001' },
      { comboId: 'COMBO-TR10-REV', pro: '隐士逆位，主闭门不出或迷失方向，内省转为孤僻', mix: '牌上是隐士逆位，退得太久变成躲，想太多反而更乱', lay: '你有点把自己关起来了，越想越钻牛角尖，该找人聊聊就别憋着', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR10-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR11: {
    id: 'TR11',
    name: '命运之轮',
    group: 'TR',
    factors: [
      { id: 'TR11-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '命运之轮'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR11-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '命运之轮'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR11-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '命运之轮'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR11-UP', name: '命运之轮正位', trigger: [{ op: 'has', args: ['cards.name', '命运之轮'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR11-REV'] },
      { id: 'COMBO-TR11-REV', name: '命运之轮逆位', trigger: [{ op: 'has', args: ['cards.name', '命运之轮'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR11-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR11-UP', pro: '命运之轮正位，主变化与循环，转机将至、顺势而为', mix: '牌上是命运之轮正位，关键词是命运、变化、循环，局势正在往好的方向转', lay: '事情正在起变化，而且是往好的方向转，顺着这股劲走别硬顶', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR11-001' },
      { comboId: 'COMBO-TR11-REV', pro: '命运之轮逆位，主运势阻滞、循环卡壳', mix: '牌上是命运之轮逆位，转变来得慢，或者一直在原地打转', lay: '你感觉卡住了，怎么努力都在原地转圈，这时候硬推没用，先等一等时机', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR11-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR12: {
    id: 'TR12',
    name: '正义',
    group: 'TR',
    factors: [
      { id: 'TR12-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '正义'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR12-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '正义'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR12-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '正义'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR12-UP', name: '正义正位', trigger: [{ op: 'has', args: ['cards.name', '正义'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR12-REV'] },
      { id: 'COMBO-TR12-REV', name: '正义逆位', trigger: [{ op: 'has', args: ['cards.name', '正义'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR12-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR12-UP', pro: '正义正位，主公正与平衡，因果分明、宜据理而行', mix: '牌上是正义正位，关键词是公正、平衡、真理，讲道理就能站住脚', lay: '这事讲道理你占得住理，该争的争、该认的认，别感情用事', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR12-001' },
      { comboId: 'COMBO-TR12-REV', pro: '正义逆位，主偏颇失衡、是非不明', mix: '牌上是正义逆位，判断带偏见，或者有理说不清', lay: '这事里有说不清的偏心或不公，你也可能只听了一面之词，先补齐信息再断', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR12-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR13: {
    id: 'TR13',
    name: '倒吊人',
    group: 'TR',
    factors: [
      { id: 'TR13-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '倒吊人'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR13-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '倒吊人'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR13-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '倒吊人'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR13-UP', name: '倒吊人正位', trigger: [{ op: 'has', args: ['cards.name', '倒吊人'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR13-REV'] },
      { id: 'COMBO-TR13-REV', name: '倒吊人逆位', trigger: [{ op: 'has', args: ['cards.name', '倒吊人'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR13-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR13-UP', pro: '倒吊人正位，主牺牲与等待，宜换个角度看、暂缓行事', mix: '牌上是倒吊人正位，关键词是牺牲、等待、新视角，现在适合停一停换个角度', lay: '现在强推没用，不如停下来换个角度看，吃点小亏换后面的大顺', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR13-001' },
      { comboId: 'COMBO-TR13-REV', pro: '倒吊人逆位，主无谓牺牲、等待落空', mix: '牌上是倒吊人逆位，等不到结果，或者一直在做无用的牺牲', lay: '你等的那个结果可能不会来，单方面的付出也该收一收，别耗死在这', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR13-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR14: {
    id: 'TR14',
    name: '死神',
    group: 'TR',
    factors: [
      { id: 'TR14-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '死神'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR14-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '死神'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR14-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '死神'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR14-UP', name: '死神正位', trigger: [{ op: 'has', args: ['cards.name', '死神'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR14-REV'] },
      { id: 'COMBO-TR14-REV', name: '死神逆位', trigger: [{ op: 'has', args: ['cards.name', '死神'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR14-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR14-UP', pro: '死神正位，主结束与重生，旧事终结即新局开启', mix: '牌上是死神正位，关键词是转变、结束、重生，旧的不去新的不来', lay: '有些事该画句号了，结束不是坏事，腾出位置才有新的进来', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR14-001' },
      { comboId: 'COMBO-TR14-REV', pro: '死神逆位，主拖延不放、转变受阻', mix: '牌上是死神逆位，该断的断不掉，人也跟着一直拖着', lay: '你明知道该放手却舍不得，拖着只会更累，越早断越早轻松', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR14-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR15: {
    id: 'TR15',
    name: '节制',
    group: 'TR',
    factors: [
      { id: 'TR15-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '节制'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR15-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '节制'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR15-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '节制'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR15-UP', name: '节制正位', trigger: [{ op: 'has', args: ['cards.name', '节制'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR15-REV'] },
      { id: 'COMBO-TR15-REV', name: '节制逆位', trigger: [{ op: 'has', args: ['cards.name', '节制'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR15-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR15-UP', pro: '节制正位，主平衡与调和，循序渐进、恰到好处', mix: '牌上是节制正位，关键词是平衡、耐心、调和，不快不慢刚刚好', lay: '这事别求快，一点一点调到位最稳，火候到了自然成', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR15-001' },
      { comboId: 'COMBO-TR15-REV', pro: '节制逆位，主失衡过度、调和失当', mix: '牌上是节制逆位，节奏乱了，要么过头要么不够', lay: '你把节奏搞乱了，要么贪多求快，要么拖着不动，回到中间那条线', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR15-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR16: {
    id: 'TR16',
    name: '恶魔',
    group: 'TR',
    factors: [
      { id: 'TR16-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '恶魔'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR16-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '恶魔'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR16-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '恶魔'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR16-UP', name: '恶魔正位', trigger: [{ op: 'has', args: ['cards.name', '恶魔'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR16-REV'] },
      { id: 'COMBO-TR16-REV', name: '恶魔逆位', trigger: [{ op: 'has', args: ['cards.name', '恶魔'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR16-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR16-UP', pro: '恶魔正位，主诱惑与束缚，为欲望或惯性所困', mix: '牌上是恶魔正位，关键词是诱惑、束缚、物质，你被某种东西套住了', lay: '你现在被某样东西绑住了——可能是钱、是习惯、是一段关系，明知不好却走不开', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR16-001' },
      { comboId: 'COMBO-TR16-REV', pro: '恶魔逆位，主挣脱束缚、觉察欲望，脱困在即', mix: '牌上是恶魔逆位，开始看清束缚在哪，有松动的迹象', lay: '你已经意识到问题在哪了，这就是松绑的第一步，趁这个劲头把结解开', polarity: '+', modality: 'likely', atomicId: 'ATOM-TR-TR16-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR17: {
    id: 'TR17',
    name: '塔',
    group: 'TR',
    factors: [
      { id: 'TR17-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '塔'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR17-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '塔'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR17-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '塔'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR17-UP', name: '塔正位', trigger: [{ op: 'has', args: ['cards.name', '塔'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR17-REV'] },
      { id: 'COMBO-TR17-REV', name: '塔逆位', trigger: [{ op: 'has', args: ['cards.name', '塔'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR17-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR17-UP', pro: '塔正位，主突变与破坏，旧结构崩塌、冲击难免', mix: '牌上是塔正位，关键词是突变、破坏、启示，原本稳的东西突然塌了', lay: '可能会有突发的变化打乱你的安排，虽然难受，但塌掉的本来就不牢靠', polarity: '--', modality: 'assert', atomicId: 'ATOM-TR-TR17-001' },
      { comboId: 'COMBO-TR17-REV', pro: '塔逆位，主崩解延后或内损，冲击减弱而余波未平', mix: '牌上是塔逆位，大的崩塌躲过去了，但不稳的地方还在', lay: '最坏的那一一下可能躲过去了，但问题还在，别以为没事了，该修还得修', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR17-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR18: {
    id: 'TR18',
    name: '星星',
    group: 'TR',
    factors: [
      { id: 'TR18-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '星星'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR18-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '星星'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR18-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '星星'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR18-UP', name: '星星正位', trigger: [{ op: 'has', args: ['cards.name', '星星'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR18-REV'] },
      { id: 'COMBO-TR18-REV', name: '星星逆位', trigger: [{ op: 'has', args: ['cards.name', '星星'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR18-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR18-UP', pro: '星星正位，主希望与指引，黑暗之后见微光', mix: '牌上是星星正位，关键词是希望、灵感、指引，最难的阶段正在过去', lay: '最难的时候过去了，现在前方有光，跟着心里的方向走就有出路', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR18-001' },
      { comboId: 'COMBO-TR18-REV', pro: '星星逆位，主信心动摇、希望蒙尘', mix: '牌上是星星逆位，希望变淡，人也容易泄气', lay: '你有点失去信心了，觉得再怎么努力也没用，这时候别做重大决定，先缓一缓', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR18-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR19: {
    id: 'TR19',
    name: '月亮',
    group: 'TR',
    factors: [
      { id: 'TR19-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '月亮'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR19-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '月亮'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR19-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '月亮'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR19-UP', name: '月亮正位', trigger: [{ op: 'has', args: ['cards.name', '月亮'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR19-REV'] },
      { id: 'COMBO-TR19-REV', name: '月亮逆位', trigger: [{ op: 'has', args: ['cards.name', '月亮'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR19-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR19-UP', pro: '月亮正位，主幻象与恐惧，事有隐情、宜察不宜动', mix: '牌上是月亮正位，关键词是幻象、恐惧、潜意识，看到的未必是真的', lay: '现在事情里有看不清的地方，你心里也发慌，别急着做决定，先看清再说', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR19-001' },
      { comboId: 'COMBO-TR19-REV', pro: '月亮逆位，主迷雾渐散、真相浮现', mix: '牌上是月亮逆位，误会和恐惧在退，真相慢慢露出来', lay: '之前想错或怕错的东西开始澄清了，心里的石头能放下大半', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR19-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR20: {
    id: 'TR20',
    name: '太阳',
    group: 'TR',
    factors: [
      { id: 'TR20-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '太阳'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR20-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '太阳'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR20-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '太阳'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR20-UP', name: '太阳正位', trigger: [{ op: 'has', args: ['cards.name', '太阳'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR20-REV'] },
      { id: 'COMBO-TR20-REV', name: '太阳逆位', trigger: [{ op: 'has', args: ['cards.name', '太阳'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR20-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR20-UP', pro: '太阳正位，主成功与喜悦，光明坦荡、诸事顺遂', mix: '牌上是太阳正位，关键词是成功、喜悦、活力，事情敞亮又顺', lay: '这段时间是明摆着的好，做什么都顺，放开手去做，别自己吓自己', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR20-001' },
      { comboId: 'COMBO-TR20-REV', pro: '太阳逆位，主喜悦打折、成功延后', mix: '牌上是太阳逆位，好事还在，但没那么痛快', lay: '方向没错，但没想象中那么顺，可能晚一点或小一点，别因此泄气', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR20-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR21: {
    id: 'TR21',
    name: '审判',
    group: 'TR',
    factors: [
      { id: 'TR21-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '审判'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR21-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '审判'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR21-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '审判'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR21-UP', name: '审判正位', trigger: [{ op: 'has', args: ['cards.name', '审判'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR21-REV'] },
      { id: 'COMBO-TR21-REV', name: '审判逆位', trigger: [{ op: 'has', args: ['cards.name', '审判'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR21-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR21-UP', pro: '审判正位，主重生与觉醒，旧账清算、新局开启', mix: '牌上是审判正位，关键词是重生、觉醒、宽恕，该了结的了结了', lay: '过去的事有了结果，你可以翻篇了，现在是重新出发的好时候', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR21-001' },
      { comboId: 'COMBO-TR21-REV', pro: '审判逆位，主自我审判、了结无期', mix: '牌上是审判逆位，放不下过去，也迟迟给不出结论', lay: '你还在跟自己较劲，过去的事总放不下，先原谅自己才能往前走', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR21-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR22: {
    id: 'TR22',
    name: '世界',
    group: 'TR',
    factors: [
      { id: 'TR22-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '世界'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR22-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '世界'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR22-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '世界'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR22-UP', name: '世界正位', trigger: [{ op: 'has', args: ['cards.name', '世界'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR22-REV'] },
      { id: 'COMBO-TR22-REV', name: '世界逆位', trigger: [{ op: 'has', args: ['cards.name', '世界'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR22-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR22-UP', pro: '世界正位，主完成与圆满，功成事遂、境界开阔', mix: '牌上是世界正位，关键词是完成、成就、圆满，这一段走到头了', lay: '这件事可以画个漂亮的句号了，你走到了一个阶段性的终点，该庆祝一下', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR22-001' },
      { comboId: 'COMBO-TR22-REV', pro: '世界逆位，主收尾未竟、圆满差一步', mix: '牌上是世界逆位，快到终点了但还差最后一步', lay: '就差临门一脚，别在最后松劲，把尾巴收干净才算真的完成', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR22-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR23: {
    id: 'TR23',
    name: '权杖王牌',
    group: 'TR',
    factors: [
      { id: 'TR23-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖王牌'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR23-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR23-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR23-UP', name: '权杖王牌正位', trigger: [{ op: 'has', args: ['cards.name', '权杖王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR23-REV'] },
      { id: 'COMBO-TR23-REV', name: '权杖王牌逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR23-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR23-UP', pro: '权杖王牌正位，主新机会与灵感，火种已燃、宜即起步', mix: '牌上是权杖王牌正位，关键词是新机会、创造力、灵感，起步信号很明确', lay: '一个新的机会刚冒头，劲头十足，趁现在有热情赶紧开干', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR23-001' },
      { comboId: 'COMBO-TR23-REV', pro: '权杖王牌逆位，主灵感迟滞、起步受阻', mix: '牌上是权杖王牌逆位，机会来了但火点不着', lay: '机会摆在眼前但你提不起劲，或者总差一步没发动，先找到让你动心的那个点', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR23-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR24: {
    id: 'TR24',
    name: '权杖二',
    group: 'TR',
    factors: [
      { id: 'TR24-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖二'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR24-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR24-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR24-UP', name: '权杖二正位', trigger: [{ op: 'has', args: ['cards.name', '权杖二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR24-REV'] },
      { id: 'COMBO-TR24-REV', name: '权杖二逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR24-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR24-UP', pro: '权杖二正位，主计划与个人力量，谋定而后动', mix: '牌上是权杖二正位，关键词是计划、未来、个人力量，该做长远打算了', lay: '你现在手上有牌，该想想下一步往哪走了，把计划列出来心里就踏实', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR24-001' },
      { comboId: 'COMBO-TR24-REV', pro: '权杖二逆位，主规划失当、畏首畏尾', mix: '牌上是权杖二逆位，要么计划不切实际，要么不敢拍板', lay: '你想得太多做得太少，或者计划本身就站不住，先做个小决定试试水', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR24-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR25: {
    id: 'TR25',
    name: '权杖三',
    group: 'TR',
    factors: [
      { id: 'TR25-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖三'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR25-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR25-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR25-UP', name: '权杖三正位', trigger: [{ op: 'has', args: ['cards.name', '权杖三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR25-REV'] },
      { id: 'COMBO-TR25-REV', name: '权杖三逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR25-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR25-UP', pro: '权杖三正位，主扩张与远见，格局打开、前景可期', mix: '牌上是权杖三正位，关键词是扩张、远见、领导力，视野打开了', lay: '你的盘子可以再铺大一点，眼光放远些，现在的布局会慢慢见效', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR25-001' },
      { comboId: 'COMBO-TR25-REV', pro: '权杖三逆位，主扩张受阻、远见不足', mix: '牌上是权杖三逆位，扩展不顺，或者只看得到眼前', lay: '想往外走但被卡住了，或者你只盯着眼前的得失，把眼光放长一点', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR25-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR26: {
    id: 'TR26',
    name: '权杖四',
    group: 'TR',
    factors: [
      { id: 'TR26-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖四'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR26-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR26-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR26-UP', name: '权杖四正位', trigger: [{ op: 'has', args: ['cards.name', '权杖四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR26-REV'] },
      { id: 'COMBO-TR26-REV', name: '权杖四逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR26-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR26-UP', pro: '权杖四正位，主庆祝与和谐，阶段告成、宜安顿', mix: '牌上是权杖四正位，关键词是庆祝、和谐、家庭，可以喘口气庆祝一下', lay: '一个阶段稳稳落地了，值得庆祝一下，也该把根基安顿好', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR26-001' },
      { comboId: 'COMBO-TR26-REV', pro: '权杖四逆位，主庆祝延后、根基未稳', mix: '牌上是权杖四逆位，喜事还在但没那么圆满', lay: '好消息有，但底下还不太稳，先加固别急着庆祝', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR26-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR27: {
    id: 'TR27',
    name: '权杖五',
    group: 'TR',
    factors: [
      { id: 'TR27-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖五'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR27-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR27-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR27-UP', name: '权杖五正位', trigger: [{ op: 'has', args: ['cards.name', '权杖五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR27-REV'] },
      { id: 'COMBO-TR27-REV', name: '权杖五逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR27-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR27-UP', pro: '权杖五正位，主冲突与竞争，多方角力、损耗难免', mix: '牌上是权杖五正位，关键词是冲突、竞争、分歧，各方拧着劲', lay: '现在各说各话、互相较劲，硬碰硬谁也赢不了，先想怎么减少内耗', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR27-001' },
      { comboId: 'COMBO-TR27-REV', pro: '权杖五逆位，主冲突降温、内争转缓', mix: '牌上是权杖五逆位，明面上的争执少了，但没真正解决', lay: '吵是少吵了，但问题没解决，只是压下去而已，别假装没事', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR27-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR28: {
    id: 'TR28',
    name: '权杖六',
    group: 'TR',
    factors: [
      { id: 'TR28-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖六'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR28-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR28-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR28-UP', name: '权杖六正位', trigger: [{ op: 'has', args: ['cards.name', '权杖六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR28-REV'] },
      { id: 'COMBO-TR28-REV', name: '权杖六逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR28-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR28-UP', pro: '权杖六正位，主胜利与公众认可，功成在望、众望所归', mix: '牌上是权杖六正位，关键词是胜利、公众认可、进步，努力被看见了', lay: '你做的事被认可了，这是该被看见的时刻，趁势再往前推一把', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR28-001' },
      { comboId: 'COMBO-TR28-REV', pro: '权杖六逆位，主认可落空、胜果打折', mix: '牌上是权杖六逆位，该有的认可没来，或者胜得不服众', lay: '你觉得自己该被认可却没有，或者赢了但不算漂亮，别急，再攒一波实绩', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR28-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR29: {
    id: 'TR29',
    name: '权杖七',
    group: 'TR',
    factors: [
      { id: 'TR29-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖七'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR29-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR29-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR29-UP', name: '权杖七正位', trigger: [{ op: 'has', args: ['cards.name', '权杖七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR29-REV'] },
      { id: 'COMBO-TR29-REV', name: '权杖七逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR29-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR29-UP', pro: '权杖七正位，主挑战与防御，守得住就有胜算', mix: '牌上是权杖七正位，关键词是挑战、坚持、防御，顶住就有机会', lay: '现在有人在挑战你，但你站在有利位置，顶住这波就能守住', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR29-001' },
      { comboId: 'COMBO-TR29-REV', pro: '权杖七逆位，主防线松动、疲于应对', mix: '牌上是权杖七逆位，守得很累，防线有缺口', lay: '你撑得有点吃力了，四面都要顾，该找人分担或者先退一步', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR29-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR30: {
    id: 'TR30',
    name: '权杖八',
    group: 'TR',
    factors: [
      { id: 'TR30-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖八'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR30-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR30-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR30-UP', name: '权杖八正位', trigger: [{ op: 'has', args: ['cards.name', '权杖八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR30-REV'] },
      { id: 'COMBO-TR30-REV', name: '权杖八逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR30-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR30-UP', pro: '权杖八正位，主快速行动与消息，事态提速、宜快不宜拖', mix: '牌上是权杖八正位，关键词是快速行动、急速、消息，节奏突然快起来', lay: '事情会突然提速，消息也来得快，手脚跟上就顺，别拖', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR30-001' },
      { comboId: 'COMBO-TR30-REV', pro: '权杖八逆位，主延误阻滞、节奏打乱', mix: '牌上是权杖八逆位，该快的快不起来，消息也迟迟不来', lay: '事情卡着不动，等的消息也不来，越催越慢，先找出卡在哪', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR30-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR31: {
    id: 'TR31',
    name: '权杖九',
    group: 'TR',
    factors: [
      { id: 'TR31-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖九'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR31-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR31-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR31-UP', name: '权杖九正位', trigger: [{ op: 'has', args: ['cards.name', '权杖九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR31-REV'] },
      { id: 'COMBO-TR31-REV', name: '权杖九逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR31-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR31-UP', pro: '权杖九正位，主坚韧与最后防线，再撑一步即到', mix: '牌上是权杖九正位，关键词是坚韧、毅力、最后防线，快熬出头了', lay: '你已经扛了很久，现在是最后一关，咬牙再撑一步就过去', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR31-001' },
      { comboId: 'COMBO-TR31-REV', pro: '权杖九逆位，主精力透支、防不胜防', mix: '牌上是权杖九逆位，体力心力都见底了', lay: '你太累了，硬撑不是办法，先歇口气再战，别把自己耗干', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR31-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR32: {
    id: 'TR32',
    name: '权杖十',
    group: 'TR',
    factors: [
      { id: 'TR32-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖十'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR32-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR32-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR32-UP', name: '权杖十正位', trigger: [{ op: 'has', args: ['cards.name', '权杖十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR32-REV'] },
      { id: 'COMBO-TR32-REV', name: '权杖十逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR32-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR32-UP', pro: '权杖十正位，主负担与责任，承担过重、宜卸担', mix: '牌上是权杖十正位，关键词是负担、责任、努力，你扛得太多了', lay: '你手上东西太多了，压得喘不过气，该分出去的分出去', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR32-001' },
      { comboId: 'COMBO-TR32-REV', pro: '权杖十逆位，主放下重担、减负在即', mix: '牌上是权杖十逆位，终于开始卸担子了', lay: '你开始学着放手了，这是好事，把不属你的责任还回去', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR32-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR33: {
    id: 'TR33',
    name: '权杖侍者',
    group: 'TR',
    factors: [
      { id: 'TR33-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖侍者'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR33-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR33-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR33-UP', name: '权杖侍者正位', trigger: [{ op: 'has', args: ['cards.name', '权杖侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR33-REV'] },
      { id: 'COMBO-TR33-REV', name: '权杖侍者逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR33-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR33-UP', pro: '权杖侍者正位，主热情与探索，新消息到、宜尝试', mix: '牌上是权杖侍者正位，关键词是热情、探索、信使，有新动向传来', lay: '会有新消息或新机会传来，带着热情去试，别怕不成熟', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR33-001' },
      { comboId: 'COMBO-TR33-REV', pro: '权杖侍者逆位，主消息不实、热情转躁', mix: '牌上是权杖侍者逆位，消息可能靠不住，人也容易三分钟热度', lay: '听到的消息别全信，自己也容易一时兴起就放弃，先核实再动', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR33-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR34: {
    id: 'TR34',
    name: '权杖骑士',
    group: 'TR',
    factors: [
      { id: 'TR34-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖骑士'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR34-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR34-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR34-UP', name: '权杖骑士正位', trigger: [{ op: 'has', args: ['cards.name', '权杖骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR34-REV'] },
      { id: 'COMBO-TR34-REV', name: '权杖骑士逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR34-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR34-UP', pro: '权杖骑士正位，主能量与行动，雷厉风行、宜进不宜守', mix: '牌上是权杖骑士正位，关键词是能量、激情、行动，冲劲很足', lay: '现在适合主动出击，你劲头足、动作快，别在原地磨蹭', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR34-001' },
      { comboId: 'COMBO-TR34-REV', pro: '权杖骑士逆位，主冲动冒进、半途而废', mix: '牌上是权杖骑士逆位，冲得太猛或者半路掉链子', lay: '你容易一上来猛冲然后没下文，或者脾气急坏事，稳住节奏再冲', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR34-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR35: {
    id: 'TR35',
    name: '权杖王后',
    group: 'TR',
    factors: [
      { id: 'TR35-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖王后'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR35-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR35-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR35-UP', name: '权杖王后正位', trigger: [{ op: 'has', args: ['cards.name', '权杖王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR35-REV'] },
      { id: 'COMBO-TR35-REV', name: '权杖王后逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR35-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR35-UP', pro: '权杖王后正位，主自信与魅力，以感染力成事', mix: '牌上是权杖王后正位，关键词是自信、魅力、独立，你气场很足', lay: '你现在很有魅力和主见，靠个人感染力就能带动别人，放心做自己', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR35-001' },
      { comboId: 'COMBO-TR35-REV', pro: '权杖王后逆位，主自信受挫、魅力转躁', mix: '牌上是权杖王后逆位，底气不足，或者强势得让人受压', lay: '你最近有点不自信，或者反过来太要强压着别人，把火气收一收', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR35-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR36: {
    id: 'TR36',
    name: '权杖国王',
    group: 'TR',
    factors: [
      { id: 'TR36-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '权杖国王'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR36-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR36-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '权杖国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR36-UP', name: '权杖国王正位', trigger: [{ op: 'has', args: ['cards.name', '权杖国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR36-REV'] },
      { id: 'COMBO-TR36-REV', name: '权杖国王逆位', trigger: [{ op: 'has', args: ['cards.name', '权杖国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR36-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR36-UP', pro: '权杖国王正位，主领导力与远见，掌舵者当断则断', mix: '牌上是权杖国王正位，关键词是领导力、远见、权威，你该站到主导位', lay: '这事需要你来掌舵做决定，你有这个资格也有这个视野，别推给别人', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR36-001' },
      { comboId: 'COMBO-TR36-REV', pro: '权杖国王逆位，主决策专断、领导力失据', mix: '牌上是权杖国王逆位，要么独断要么没人服', lay: '你做决定时太独或者根本镇不住场，听听别人的意见再拍板', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR36-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR37: {
    id: 'TR37',
    name: '圣杯王牌',
    group: 'TR',
    factors: [
      { id: 'TR37-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯王牌'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR37-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR37-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR37-UP', name: '圣杯王牌正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR37-REV'] },
      { id: 'COMBO-TR37-REV', name: '圣杯王牌逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR37-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR37-UP', pro: '圣杯王牌正位，主新感情与爱，情意初动、宜敞开心', mix: '牌上是圣杯王牌正位，关键词是新感情、爱、创造力，情感有了新开始', lay: '一段新的感情或心意正在冒头，把心打开去接，别把自己关起来', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR37-001' },
      { comboId: 'COMBO-TR37-REV', pro: '圣杯王牌逆位，主情感闭塞、心意落空', mix: '牌上是圣杯王牌逆位，感情的水流不通，心意也没接住', lay: '你有点封闭自己，想给的感情给不出去，想接的也接不住，先松开防备', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR37-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR38: {
    id: 'TR38',
    name: '圣杯二',
    group: 'TR',
    factors: [
      { id: 'TR38-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯二'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR38-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR38-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR38-UP', name: '圣杯二正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR38-REV'] },
      { id: 'COMBO-TR38-REV', name: '圣杯二逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR38-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR38-UP', pro: '圣杯二正位，主结合与伙伴，双向奔赴、宜结盟', mix: '牌上是圣杯二正位，关键词是结合、伙伴、吸引，双方对上眼了', lay: '这是两情相悦、彼此认可的局面，不管是感情还是合作都能谈成', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR38-001' },
      { comboId: 'COMBO-TR38-REV', pro: '圣杯二逆位，主关系失衡、结合有碍', mix: '牌上是圣杯二逆位，两头不对等，或者谈不拢', lay: '双方冷热不均，或者合作谈崩了，先把不对等的地方摊开说', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR38-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR39: {
    id: 'TR39',
    name: '圣杯三',
    group: 'TR',
    factors: [
      { id: 'TR39-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯三'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR39-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR39-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR39-UP', name: '圣杯三正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR39-REV'] },
      { id: 'COMBO-TR39-REV', name: '圣杯三逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR39-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR39-UP', pro: '圣杯三正位，主庆祝与友谊，同袍相助、宜共欢', mix: '牌上是圣杯三正位，关键词是庆祝、友谊、社群，身边有人一起高兴', lay: '有值得庆祝的事，也有朋友陪着你，这种时候别一个人待着', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR39-001' },
      { comboId: 'COMBO-TR39-REV', pro: '圣杯三逆位，主欢宴失和、圈子生隙', mix: '牌上是圣杯三逆位，聚会变味，朋友圈里有了隔阂', lay: '原本热闹的场合变得别扭，朋友圈里可能有小人或多心，别什么都说', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR39-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR40: {
    id: 'TR40',
    name: '圣杯四',
    group: 'TR',
    factors: [
      { id: 'TR40-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯四'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR40-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR40-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR40-UP', name: '圣杯四正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR40-REV'] },
      { id: 'COMBO-TR40-REV', name: '圣杯四逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR40-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR40-UP', pro: '圣杯四正位，主冷漠与重评，宜静思所需', mix: '牌上是圣杯四正位，关键词是冷漠、沉思、重评，你对眼前提不起劲', lay: '你对现在拥有的提不起兴趣，这是该重新想想我到底要什么的时候', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR40-001' },
      { comboId: 'COMBO-TR40-REV', pro: '圣杯四逆位，主倦怠转深、错失眼前', mix: '牌上是圣杯四逆位，不光冷淡，还可能错过眼前的好东西', lay: '你因为提不起劲，差点把手边的好机会放跑了，先看看眼前有什么', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR40-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR41: {
    id: 'TR41',
    name: '圣杯五',
    group: 'TR',
    factors: [
      { id: 'TR41-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯五'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR41-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR41-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR41-UP', name: '圣杯五正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR41-REV'] },
      { id: 'COMBO-TR41-REV', name: '圣杯五逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR41-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR41-UP', pro: '圣杯五正位，主失落与失望，宜正视失去', mix: '牌上是圣杯五正位，关键词是失落、悲伤、失望，你正为失去难过', lay: '你正在为失去的东西难过，这很正常，但别忘了身后还立着两只杯子', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR41-001' },
      { comboId: 'COMBO-TR41-REV', pro: '圣杯五逆位，主哀伤渐愈、开始回头', mix: '牌上是圣杯五逆位，最难受的时候过去了', lay: '你开始从失望里走出来了，虽然还没完全好，但已经在往回看剩下的了', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR41-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR42: {
    id: 'TR42',
    name: '圣杯六',
    group: 'TR',
    factors: [
      { id: 'TR42-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯六'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR42-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR42-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR42-UP', name: '圣杯六正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR42-REV'] },
      { id: 'COMBO-TR42-REV', name: '圣杯六逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR42-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR42-UP', pro: '圣杯六正位，主怀旧与重逢，旧人旧事回访', mix: '牌上是圣杯六正位，关键词是怀旧、童年、重逢，过去的东西回来了', lay: '可能会有旧人联系、旧事重提，回忆很暖，但别一直住在过去', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR42-001' },
      { comboId: 'COMBO-TR42-REV', pro: '圣杯六逆位，主困于过去、重逢生变', mix: '牌上是圣杯六逆位，过去成了包袱，重逢也不如想象', lay: '你太念旧了，或者再见不如初见，该往前看了', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR42-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR43: {
    id: 'TR43',
    name: '圣杯七',
    group: 'TR',
    factors: [
      { id: 'TR43-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯七'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR43-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR43-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR43-UP', name: '圣杯七正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR43-REV'] },
      { id: 'COMBO-TR43-REV', name: '圣杯七逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR43-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR43-UP', pro: '圣杯七正位，主幻想与选择，选项多而难决', mix: '牌上是圣杯七正位，关键词是幻想、选择、白日梦，你面前选项很多', lay: '你想得太多太美，选项一个比一个诱人，但多半不落地，挑一个真去做的', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR43-001' },
      { comboId: 'COMBO-TR43-REV', pro: '圣杯七逆位，主幻想破灭、沉迷不醒', mix: '牌上是圣杯七逆位，要么梦醒了，要么陷得更深', lay: '要么被现实打醒有点失落，要么还在自己编的故事里不愿出来，先回到现实', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR43-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR44: {
    id: 'TR44',
    name: '圣杯八',
    group: 'TR',
    factors: [
      { id: 'TR44-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯八'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR44-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR44-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR44-UP', name: '圣杯八正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR44-REV'] },
      { id: 'COMBO-TR44-REV', name: '圣杯八逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR44-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR44-UP', pro: '圣杯八正位，主放弃与前行，主动离场、另寻出路', mix: '牌上是圣杯八正位，关键词是放弃、前行、寻找，你选择转身离开', lay: '你已经决定走了，虽然舍不得，但留下来只会更空，往前走才有新的', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR44-001' },
      { comboId: 'COMBO-TR44-REV', pro: '圣杯八逆位，主去留两难、徘徊不去', mix: '牌上是圣杯八逆位，想走又走不掉，卡在原地', lay: '你想离开却总有牵绊，一直徘徊反而最耗人，想清楚就别反复了', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR44-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR45: {
    id: 'TR45',
    name: '圣杯九',
    group: 'TR',
    factors: [
      { id: 'TR45-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯九'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR45-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR45-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR45-UP', name: '圣杯九正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR45-REV'] },
      { id: 'COMBO-TR45-REV', name: '圣杯九逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR45-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR45-UP', pro: '圣杯九正位，主满足与愿望成真，所求得偿', mix: '牌上是圣杯九正位，关键词是满足、愿望成真、舒适，愿望基本实现了', lay: '你想要的东西基本到手了，这阵子过得舒坦，别忘了感恩和分享', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR45-001' },
      { comboId: 'COMBO-TR45-REV', pro: '圣杯九逆位，主虚有其表、满足打折', mix: '牌上是圣杯九逆位，表面满足，心里其实还空', lay: '看起来什么都有了，但你心里不踏实，可能是得到了不对的东西', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR45-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR46: {
    id: 'TR46',
    name: '圣杯十',
    group: 'TR',
    factors: [
      { id: 'TR46-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯十'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR46-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR46-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR46-UP', name: '圣杯十正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR46-REV'] },
      { id: 'COMBO-TR46-REV', name: '圣杯十逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR46-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR46-UP', pro: '圣杯十正位，主和谐与幸福，家和事顺、圆满可期', mix: '牌上是圣杯十正位，关键词是和谐、家庭、幸福，归宿感很足', lay: '这段时间是难得的圆满，家里和、心里安，好好珍惜这种踏实', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR46-001' },
      { comboId: 'COMBO-TR46-REV', pro: '圣杯十逆位，主家庭失和、圆满有缺', mix: '牌上是圣杯十逆位，家里或圈子里有了裂痕', lay: '表面圆满底下有裂缝，家里或团队里有没说开的矛盾，早点摊开谈', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR46-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR47: {
    id: 'TR47',
    name: '圣杯侍者',
    group: 'TR',
    factors: [
      { id: 'TR47-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯侍者'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR47-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR47-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR47-UP', name: '圣杯侍者正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR47-REV'] },
      { id: 'COMBO-TR47-REV', name: '圣杯侍者逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR47-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR47-UP', pro: '圣杯侍者正位，主创意与直觉，灵感初萌、宜留意', mix: '牌上是圣杯侍者正位，关键词是创意、直觉、信使，有个柔软的新动静', lay: '会有个温柔的新消息或新灵感，别当小事放过，记下来', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR47-001' },
      { comboId: 'COMBO-TR47-REV', pro: '圣杯侍者逆位，主直觉失灵、创意受阻', mix: '牌上是圣杯侍者逆位，灵感冒不出来，直觉也不准', lay: '你现在脑子有点钝，心里也不踏实，别硬逼灵感，先歇一歇', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR47-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR48: {
    id: 'TR48',
    name: '圣杯骑士',
    group: 'TR',
    factors: [
      { id: 'TR48-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯骑士'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR48-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR48-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR48-UP', name: '圣杯骑士正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR48-REV'] },
      { id: 'COMBO-TR48-REV', name: '圣杯骑士逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR48-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR48-UP', pro: '圣杯骑士正位，主浪漫与魅力，情意主动、宜示好', mix: '牌上是圣杯骑士正位，关键词是浪漫、魅力、想象，有人带着心意来了', lay: '会有浪漫的邀约或带着好意的示好，接住它，别端着', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR48-001' },
      { comboId: 'COMBO-TR48-REV', pro: '圣杯骑士逆位，主虚情假意、浪漫落空', mix: '牌上是圣杯骑士逆位，漂亮话多，真心少', lay: '对方说得很好听但不一定靠谱，别被甜言蜜语冲昏头，看行动', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR48-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR49: {
    id: 'TR49',
    name: '圣杯王后',
    group: 'TR',
    factors: [
      { id: 'TR49-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯王后'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR49-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR49-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR49-UP', name: '圣杯王后正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR49-REV'] },
      { id: 'COMBO-TR49-REV', name: '圣杯王后逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR49-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR49-UP', pro: '圣杯王后正位，主同情与直觉，以柔济人、宜倾听', mix: '牌上是圣杯王后正位，关键词是同情、平静、直觉，你能接住别人的情绪', lay: '你现在很能体谅人，也听得懂话外音，用这份温柔去化解僵局就对了', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR49-001' },
      { comboId: 'COMBO-TR49-REV', pro: '圣杯王后逆位，主情绪失衡、共情过载', mix: '牌上是圣杯王后逆位，自己的情绪都顾不过来', lay: '你太容易被别人的情绪带着走了，先把自己稳住，别当所有人的情绪垃圾桶', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR49-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR50: {
    id: 'TR50',
    name: '圣杯国王',
    group: 'TR',
    factors: [
      { id: 'TR50-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '圣杯国王'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR50-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR50-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '圣杯国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR50-UP', name: '圣杯国王正位', trigger: [{ op: 'has', args: ['cards.name', '圣杯国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR50-REV'] },
      { id: 'COMBO-TR50-REV', name: '圣杯国王逆位', trigger: [{ op: 'has', args: ['cards.name', '圣杯国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR50-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR50-UP', pro: '圣杯国王正位，主情绪成熟与控制，温情而有力', mix: '牌上是圣杯国王正位，关键词是情绪成熟、控制、慈悲，你很能拿捏分寸', lay: '你能既温柔又有分寸地处理事情，别人愿意信你，这种稳重是优势', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR50-001' },
      { comboId: 'COMBO-TR50-REV', pro: '圣杯国王逆位，主情绪操控、压抑失当', mix: '牌上是圣杯国王逆位，情绪要么憋着要么拿来压人', lay: '你可能在压抑情绪，或者用情绪拿捏别人，别玩这种把戏，直说更好', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR50-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR51: {
    id: 'TR51',
    name: '宝剑王牌',
    group: 'TR',
    factors: [
      { id: 'TR51-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑王牌'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR51-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR51-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR51-UP', name: '宝剑王牌正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR51-REV'] },
      { id: 'COMBO-TR51-REV', name: '宝剑王牌逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR51-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR51-UP', pro: '宝剑王牌正位，主清晰与真理，思路洞开、宜决断', mix: '牌上是宝剑王牌正位，关键词是清晰、真理、新想法，脑子一下清楚了', lay: '你突然想通了，思路清清楚楚，这时候做决定最准，别犹豫', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR51-001' },
      { comboId: 'COMBO-TR51-REV', pro: '宝剑王牌逆位，主思路混乱、判断偏误', mix: '牌上是宝剑王牌逆位，想不清楚，容易想岔', lay: '你现在脑子乱，信息也没理顺，别在这种状态下拍板', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR51-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR52: {
    id: 'TR52',
    name: '宝剑二',
    group: 'TR',
    factors: [
      { id: 'TR52-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑二'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR52-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR52-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR52-UP', name: '宝剑二正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR52-REV'] },
      { id: 'COMBO-TR52-REV', name: '宝剑二逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR52-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR52-UP', pro: '宝剑二正位，主僵局与逃避，两难未决、暂不开战', mix: '牌上是宝剑二正位，关键词是僵局、逃避、艰难选择，你蒙着眼不肯看', lay: '你在两难之间闭着眼不动，其实是不想面对，拖着不是办法', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR52-001' },
      { comboId: 'COMBO-TR52-REV', pro: '宝剑二逆位，主僵局打破、开始面对', mix: '牌上是宝剑二逆位，蒙眼的布揭开了，肯面对了', lay: '你终于愿意正视这个选择了，一旦摊开看，答案往往没那么难', polarity: '+', modality: 'likely', atomicId: 'ATOM-TR-TR52-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR53: {
    id: 'TR53',
    name: '宝剑三',
    group: 'TR',
    factors: [
      { id: 'TR53-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑三'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR53-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR53-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR53-UP', name: '宝剑三正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR53-REV'] },
      { id: 'COMBO-TR53-REV', name: '宝剑三逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR53-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR53-UP', pro: '宝剑三正位，主心碎与真相，刺痛难免、宜正视', mix: '牌上是宝剑三正位，关键词是心碎、悲伤、真相，被真相扎到了', lay: '会有扎心的实话或坏消息，很痛，但看清了才能往前走', polarity: '--', modality: 'assert', atomicId: 'ATOM-TR-TR53-001' },
      { comboId: 'COMBO-TR53-REV', pro: '宝剑三逆位，主伤痛渐愈、旧伤未平', mix: '牌上是宝剑三逆位，最痛的时候过了，但伤口还在', lay: '痛在慢慢减轻，但还没好透，别急着说自己没事，慢慢养', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR53-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR54: {
    id: 'TR54',
    name: '宝剑四',
    group: 'TR',
    factors: [
      { id: 'TR54-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑四'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR54-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR54-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR54-UP', name: '宝剑四正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR54-REV'] },
      { id: 'COMBO-TR54-REV', name: '宝剑四逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR54-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR54-UP', pro: '宝剑四正位，主休息与沉思，宜停战蓄力', mix: '牌上是宝剑四正位，关键词是休息、休战、沉思，现在该躺平一会儿', lay: '你现在最需要的不是拼命，而是好好歇一阵，睡够了再战', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR54-001' },
      { comboId: 'COMBO-TR54-REV', pro: '宝剑四逆位，主休息不足、被迫复工', mix: '牌上是宝剑四逆位，想歇歇不了，或者歇过头起不来', lay: '你太累了却停不下来，或者躺太久不想动了，两种情况都得调整', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR54-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR55: {
    id: 'TR55',
    name: '宝剑五',
    group: 'TR',
    factors: [
      { id: 'TR55-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑五'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR55-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR55-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR55-UP', name: '宝剑五正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR55-REV'] },
      { id: 'COMBO-TR55-REV', name: '宝剑五逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR55-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR55-UP', pro: '宝剑五正位，主冲突与失败，赢了面子输了里子', mix: '牌上是宝剑五正位，关键词是冲突、失败、不光彩的胜利，赢了也不光彩', lay: '你可能争赢了一口气，但代价是关系或人心，这种赢不划算', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR55-001' },
      { comboId: 'COMBO-TR55-REV', pro: '宝剑五逆位，主争斗余波、胜负难分', mix: '牌上是宝剑五逆位，争完了但没完，还在互相较劲', lay: '争执的尾巴还在，谁也没真赢，与其继续斗不如各退一步', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR55-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR56: {
    id: 'TR56',
    name: '宝剑六',
    group: 'TR',
    factors: [
      { id: 'TR56-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑六'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR56-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR56-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR56-UP', name: '宝剑六正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR56-REV'] },
      { id: 'COMBO-TR56-REV', name: '宝剑六逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR56-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR56-UP', pro: '宝剑六正位，主过渡与前行，离开风波、渐入平稳', mix: '牌上是宝剑六正位，关键词是过渡、前行、解脱，正在驶离风波', lay: '你正在从一段乱糟糟的状态里往外走，水面会越来越平，别回头', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR56-001' },
      { comboId: 'COMBO-TR56-REV', pro: '宝剑六逆位，主过渡受阻、旧波未平', mix: '牌上是宝剑六逆位，想走没走成，或者又绕回来了', lay: '离开的过程不顺利，老问题又冒出来，别急着一次到位，慢慢挪', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR56-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR57: {
    id: 'TR57',
    name: '宝剑七',
    group: 'TR',
    factors: [
      { id: 'TR57-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑七'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR57-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR57-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR57-UP', name: '宝剑七正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR57-REV'] },
      { id: 'COMBO-TR57-REV', name: '宝剑七逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR57-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR57-UP', pro: '宝剑七正位，主欺骗与策略，宜警觉隐瞒', mix: '牌上是宝剑七正位，关键词是欺骗、策略、不诚实，有人在玩心眼', lay: '这事里有不坦诚的成分，可能是别人藏了话，也可能是你自己想走捷径', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR57-001' },
      { comboId: 'COMBO-TR57-REV', pro: '宝剑七逆位，主真相败露、坦白在即', mix: '牌上是宝剑七逆位，藏不住了，开始说开', lay: '瞒着的事快兜不住了，与其被拆穿不如自己说，坦白比滑头划算', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR57-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR58: {
    id: 'TR58',
    name: '宝剑八',
    group: 'TR',
    factors: [
      { id: 'TR58-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑八'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR58-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR58-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR58-UP', name: '宝剑八正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR58-REV'] },
      { id: 'COMBO-TR58-REV', name: '宝剑八逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR58-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR58-UP', pro: '宝剑八正位，主限制与自我束缚，捆住你的多是自设', mix: '牌上是宝剑八正位，关键词是限制、孤立、自我束缚，其实绑得不紧', lay: '你觉得走投无路，但绳子多半是自己绑的，转个身就能松开', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR58-001' },
      { comboId: 'COMBO-TR58-REV', pro: '宝剑八逆位，主松绑在即、限制解除', mix: '牌上是宝剑八逆位，蒙眼解开，路开始出现了', lay: '困住你的东西在松开，你能看见出口了，趁这个劲头走出来', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR58-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR59: {
    id: 'TR59',
    name: '宝剑九',
    group: 'TR',
    factors: [
      { id: 'TR59-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑九'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR59-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR59-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR59-UP', name: '宝剑九正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR59-REV'] },
      { id: 'COMBO-TR59-REV', name: '宝剑九逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR59-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR59-UP', pro: '宝剑九正位，主焦虑与恐惧，夜半忧思、宜疏解', mix: '牌上是宝剑九正位，关键词是焦虑、噩梦、恐惧，心里压着事', lay: '你最近睡不好、心里发慌，多半是自己吓自己，找人说说会好很多', polarity: '--', modality: 'assert', atomicId: 'ATOM-TR-TR59-001' },
      { comboId: 'COMBO-TR59-REV', pro: '宝剑九逆位，主焦虑渐缓、噩梦初醒', mix: '牌上是宝剑九逆位，最熬人的阶段在退', lay: '心里的石头在一点点放下，虽然还没全好，但已经能睡个囫囵觉了', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR59-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR60: {
    id: 'TR60',
    name: '宝剑十',
    group: 'TR',
    factors: [
      { id: 'TR60-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑十'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR60-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR60-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR60-UP', name: '宝剑十正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR60-REV'] },
      { id: 'COMBO-TR60-REV', name: '宝剑十逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR60-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR60-UP', pro: '宝剑十正位，主终结与谷底，触底之后方能反弹', mix: '牌上是宝剑十正位，关键词是终结、背叛、谷底，已经到底了', lay: '已经是最差的情况了，坏消息是真的很痛，好消息是再差也差不到哪去', polarity: '--', modality: 'assert', atomicId: 'ATOM-TR-TR60-001' },
      { comboId: 'COMBO-TR60-REV', pro: '宝剑十逆位，主触底回升、余痛未消', mix: '牌上是宝剑十逆位，谷底过去了，但还在恢复', lay: '最难的那一关过了，正在慢慢往回爬，别急，一天比一天好就行', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR60-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR61: {
    id: 'TR61',
    name: '宝剑侍者',
    group: 'TR',
    factors: [
      { id: 'TR61-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑侍者'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR61-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR61-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR61-UP', name: '宝剑侍者正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR61-REV'] },
      { id: 'COMBO-TR61-REV', name: '宝剑侍者逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR61-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR61-UP', pro: '宝剑侍者正位，主好奇与警惕，宜多方打探', mix: '牌上是宝剑侍者正位，关键词是好奇、警惕、信使，消息灵通也带刺', lay: '你很想搞清楚真相，也听得进风声，但别捕风捉影，多核实', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR61-001' },
      { comboId: 'COMBO-TR61-REV', pro: '宝剑侍者逆位，主口舌是非、消息失真', mix: '牌上是宝剑侍者逆位，传的话不靠谱，也容易说错话', lay: '最近容易传错话或说错话，开口前先过一遍脑子，别当传声筒', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR61-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR62: {
    id: 'TR62',
    name: '宝剑骑士',
    group: 'TR',
    factors: [
      { id: 'TR62-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑骑士'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR62-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR62-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR62-UP', name: '宝剑骑士正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR62-REV'] },
      { id: 'COMBO-TR62-REV', name: '宝剑骑士逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR62-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR62-UP', pro: '宝剑骑士正位，主野心与仓促，冲得快也险', mix: '牌上是宝剑骑士正位，关键词是野心、仓促、行动，冲劲有余稳劲不足', lay: '你想快点把事情办了，但冲太猛容易顾此失彼，快可以，别漏细节', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR62-001' },
      { comboId: 'COMBO-TR62-REV', pro: '宝剑骑士逆位，主鲁莽失控、半途崩盘', mix: '牌上是宝剑骑士逆位，冲得太乱，甚至已经失控', lay: '你横冲直撞把事情搞乱了，停下来重排一遍，别硬着头皮往下冲', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR62-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR63: {
    id: 'TR63',
    name: '宝剑王后',
    group: 'TR',
    factors: [
      { id: 'TR63-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑王后'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR63-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR63-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR63-UP', name: '宝剑王后正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR63-REV'] },
      { id: 'COMBO-TR63-REV', name: '宝剑王后逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR63-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR63-UP', pro: '宝剑王后正位，主清晰与智慧，明辨是非、言必有中', mix: '牌上是宝剑王后正位，关键词是独立、清晰、智慧，你看得很透', lay: '你现在头脑清楚、说话也到位，能把事情点到位，适合谈判和厘清是非', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR63-001' },
      { comboId: 'COMBO-TR63-REV', pro: '宝剑王后逆位，主刻薄多疑、判断带刺', mix: '牌上是宝剑王后逆位，话虽真但太扎人，也容易多心', lay: '你看得准但说话太锋利，或者疑心太重，真话也可以说得柔和点', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR63-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR64: {
    id: 'TR64',
    name: '宝剑国王',
    group: 'TR',
    factors: [
      { id: 'TR64-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '宝剑国王'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR64-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR64-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '宝剑国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR64-UP', name: '宝剑国王正位', trigger: [{ op: 'has', args: ['cards.name', '宝剑国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR64-REV'] },
      { id: 'COMBO-TR64-REV', name: '宝剑国王逆位', trigger: [{ op: 'has', args: ['cards.name', '宝剑国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR64-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR64-UP', pro: '宝剑国王正位，主权威与真理，以理服人、断事分明', mix: '牌上是宝剑国王正位，关键词是权威、真理、智力，你讲道理能服众', lay: '你在这件事上最有发言权，凭理据和判断力说话，别人会认', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR64-001' },
      { comboId: 'COMBO-TR64-REV', pro: '宝剑国王逆位，主滥用权威、论断失衡', mix: '牌上是宝剑国王逆位，道理成了武器，或者判断有偏', lay: '你可能拿道理压人，或者自以为公正其实有偏，多听反方一句', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR64-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR65: {
    id: 'TR65',
    name: '钱币王牌',
    group: 'TR',
    factors: [
      { id: 'TR65-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币王牌'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR65-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR65-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR65-UP', name: '钱币王牌正位', trigger: [{ op: 'has', args: ['cards.name', '钱币王牌'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR65-REV'] },
      { id: 'COMBO-TR65-REV', name: '钱币王牌逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币王牌'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR65-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR65-UP', pro: '钱币王牌正位，主机会与繁荣，财路初开、宜务实起步', mix: '牌上是钱币王牌正位，关键词是机会、繁荣、新事业，实打实的机会来了', lay: '一个能落到实处的机会来了，可能是钱、工作或新项目，稳稳接住', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR65-001' },
      { comboId: 'COMBO-TR65-REV', pro: '钱币王牌逆位，主机会不稳、财路迟滞', mix: '牌上是钱币王牌逆位，机会看着好但不落地', lay: '看着像机会但多半落不了地，或者钱迟迟不到位，别先投入太多', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR65-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR66: {
    id: 'TR66',
    name: '钱币二',
    group: 'TR',
    factors: [
      { id: 'TR66-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币二'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR66-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR66-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR66-UP', name: '钱币二正位', trigger: [{ op: 'has', args: ['cards.name', '钱币二'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR66-REV'] },
      { id: 'COMBO-TR66-REV', name: '钱币二逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币二'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR66-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR66-UP', pro: '钱币二正位，主平衡与适应，多头兼顾、灵活周转', mix: '牌上是钱币二正位，关键词是平衡、适应、变化，你在几件事间找平衡', lay: '你要同时顾好几头，虽然忙但还周转得开，关键是别把盘子铺太大', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR66-001' },
      { comboId: 'COMBO-TR66-REV', pro: '钱币二逆位，主周转失灵、顾此失彼', mix: '牌上是钱币二逆位，几头都顾不上，节奏乱了', lay: '你手忙脚乱，这边补那边漏，该砍掉一头就砍，别什么都想抓', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR66-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR67: {
    id: 'TR67',
    name: '钱币三',
    group: 'TR',
    factors: [
      { id: 'TR67-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币三'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR67-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR67-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR67-UP', name: '钱币三正位', trigger: [{ op: 'has', args: ['cards.name', '钱币三'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR67-REV'] },
      { id: 'COMBO-TR67-REV', name: '钱币三逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币三'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR67-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR67-UP', pro: '钱币三正位，主团队合作与技艺，配合出活、品质有成', mix: '牌上是钱币三正位，关键词是团队合作、技艺、品质，配合能出好活', lay: '这事靠配合能出好活，你的本事也被认可了，别单干，拉上人一起', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR67-001' },
      { comboId: 'COMBO-TR67-REV', pro: '钱币三逆位，主配合失调、品质打折', mix: '牌上是钱币三逆位，团队不对付，出来的活也糙', lay: '合作方各干各的，成果也差点意思，先把分工和责任说清楚', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR67-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR68: {
    id: 'TR68',
    name: '钱币四',
    group: 'TR',
    factors: [
      { id: 'TR68-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币四'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR68-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR68-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR68-UP', name: '钱币四正位', trigger: [{ op: 'has', args: ['cards.name', '钱币四'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR68-REV'] },
      { id: 'COMBO-TR68-REV', name: '钱币四逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币四'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR68-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR68-UP', pro: '钱币四正位，主占有与稳定，守财固本、宜稳不宜散', mix: '牌上是钱币四正位，关键词是占有、控制、稳定，你把钱看得紧', lay: '你守得很紧，安全感是有了，但别因为怕失去而错过机会', polarity: '0', modality: 'assert', atomicId: 'ATOM-TR-TR68-001' },
      { comboId: 'COMBO-TR68-REV', pro: '钱币四逆位，主守财失衡、松动或失控', mix: '牌上是钱币四逆位，要么松手乱花，要么抓得更死', lay: '钱上要么开始漏，要么你因为怕没钱越发抠门，两头都该调', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR68-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR69: {
    id: 'TR69',
    name: '钱币五',
    group: 'TR',
    factors: [
      { id: 'TR69-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币五'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR69-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR69-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR69-UP', name: '钱币五正位', trigger: [{ op: 'has', args: ['cards.name', '钱币五'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR69-REV'] },
      { id: 'COMBO-TR69-REV', name: '钱币五逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币五'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR69-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR69-UP', pro: '钱币五正位，主贫困与逆境，资源短缺、宜求助', mix: '牌上是钱币五正位，关键词是贫困、逆境、孤立，眼下确实紧', lay: '这段时间是真紧，钱或资源都不够，别硬扛，该求助就开口', polarity: '-', modality: 'assert', atomicId: 'ATOM-TR-TR69-001' },
      { comboId: 'COMBO-TR69-REV', pro: '钱币五逆位，主困境渐解、援助将至', mix: '牌上是钱币五逆位，最难的时候在过，外援也来了', lay: '紧日子在慢慢过去，也有人愿意搭把手，别拒绝帮助', polarity: '0', modality: 'likely', atomicId: 'ATOM-TR-TR69-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR70: {
    id: 'TR70',
    name: '钱币六',
    group: 'TR',
    factors: [
      { id: 'TR70-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币六'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR70-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR70-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR70-UP', name: '钱币六正位', trigger: [{ op: 'has', args: ['cards.name', '钱币六'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR70-REV'] },
      { id: 'COMBO-TR70-REV', name: '钱币六逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币六'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR70-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR70-UP', pro: '钱币六正位，主慷慨与分享，施受有度、资源流动', mix: '牌上是钱币六正位，关键词是慷慨、慈善、分享，有来有往', lay: '现在是你来我往的状态，收到帮助也该回馈别人，别只进不出', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR70-001' },
      { comboId: 'COMBO-TR70-REV', pro: '钱币六逆位，主施受失衡、附带条件', mix: '牌上是钱币六逆位，帮忙带着条件，或者欠了人情', lay: '这回的帮助不纯粹，可能有附加条件或人情债，接之前想清楚', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR70-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR71: {
    id: 'TR71',
    name: '钱币七',
    group: 'TR',
    factors: [
      { id: 'TR71-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币七'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR71-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR71-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR71-UP', name: '钱币七正位', trigger: [{ op: 'has', args: ['cards.name', '钱币七'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR71-REV'] },
      { id: 'COMBO-TR71-REV', name: '钱币七逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币七'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR71-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR71-UP', pro: '钱币七正位，主耐心与投资，长线布局、静待回报', mix: '牌上是钱币七正位，关键词是耐心、投资、回报，投入在慢慢长', lay: '你之前的投入正在长，但还没到收的时候，继续养着别急着拔', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR71-001' },
      { comboId: 'COMBO-TR71-REV', pro: '钱币七逆位，主回报落空、投入打水漂', mix: '牌上是钱币七逆位，投入不见回报，方向可能错了', lay: '钱或精力投进去没响动，该重新算一笔账，别继续往里填', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR71-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR72: {
    id: 'TR72',
    name: '钱币八',
    group: 'TR',
    factors: [
      { id: 'TR72-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币八'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR72-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR72-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR72-UP', name: '钱币八正位', trigger: [{ op: 'has', args: ['cards.name', '钱币八'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR72-REV'] },
      { id: 'COMBO-TR72-REV', name: '钱币八逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币八'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR72-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR72-UP', pro: '钱币八正位，主技能与勤奋，埋头打磨、精益求精', mix: '牌上是钱币八正位，关键词是技能、勤奋、精通，手艺在往上走', lay: '你在踏实练本事，重复虽然枯燥但真能长功夫，坚持住', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR72-001' },
      { comboId: 'COMBO-TR72-REV', pro: '钱币八逆位，主敷衍了事、技艺停滞', mix: '牌上是钱币八逆位，干活不走心，本事也停在原地', lay: '你在应付差事，做出来的东西糙，也学不到新东西，要么认真要么换', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR72-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR73: {
    id: 'TR73',
    name: '钱币九',
    group: 'TR',
    factors: [
      { id: 'TR73-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币九'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR73-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR73-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR73-UP', name: '钱币九正位', trigger: [{ op: 'has', args: ['cards.name', '钱币九'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR73-REV'] },
      { id: 'COMBO-TR73-REV', name: '钱币九逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币九'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR73-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR73-UP', pro: '钱币九正位，主富足与独立，自给自足、享受成果', mix: '牌上是钱币九正位，关键词是富足、独立、享受，你靠自己过得不错', lay: '你自己挣来的这份安稳很实在，该好好享受，也别忘了这是你应得的', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR73-001' },
      { comboId: 'COMBO-TR73-REV', pro: '钱币九逆位，主依赖他人、富足有虚', mix: '牌上是钱币九逆位，独立感打折，可能靠别人撑着', lay: '表面过得去，但多半靠别人支撑，真正的安全感还得自己挣', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR73-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR74: {
    id: 'TR74',
    name: '钱币十',
    group: 'TR',
    factors: [
      { id: 'TR74-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币十'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR74-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR74-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR74-UP', name: '钱币十正位', trigger: [{ op: 'has', args: ['cards.name', '钱币十'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR74-REV'] },
      { id: 'COMBO-TR74-REV', name: '钱币十逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币十'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR74-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR74-UP', pro: '钱币十正位，主财富与传承，家业稳固、长久可期', mix: '牌上是钱币十正位，关键词是财富、传承、家庭，是长久的富足', lay: '这是能传下去的踏实家底，不只眼前有钱，往后也稳，好好经营', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR74-001' },
      { comboId: 'COMBO-TR74-REV', pro: '钱币十逆位，主家业动摇、传承生变', mix: '牌上是钱币十逆位，长久的东西出了变数', lay: '原本稳当的家底或长期安排出了岔子，早点处理别拖', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR74-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR75: {
    id: 'TR75',
    name: '钱币侍者',
    group: 'TR',
    factors: [
      { id: 'TR75-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币侍者'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR75-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR75-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR75-UP', name: '钱币侍者正位', trigger: [{ op: 'has', args: ['cards.name', '钱币侍者'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR75-REV'] },
      { id: 'COMBO-TR75-REV', name: '钱币侍者逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币侍者'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR75-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR75-UP', pro: '钱币侍者正位，主新机会与学习，宜踏实求学', mix: '牌上是钱币侍者正位，关键词是新机会、学习、梦想，有个实在的开始', lay: '有个能学东西的新机会，虽然起点低但真能长本事，踏踏实实去', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR75-001' },
      { comboId: 'COMBO-TR75-REV', pro: '钱币侍者逆位，主学习不进、好高骛远', mix: '牌上是钱币侍者逆位，学不进去，或者只想一步登天', lay: '你想一步到位却不肯下基本功，或者干脆摆烂不学，先定个小目标', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR75-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR76: {
    id: 'TR76',
    name: '钱币骑士',
    group: 'TR',
    factors: [
      { id: 'TR76-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币骑士'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR76-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR76-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR76-UP', name: '钱币骑士正位', trigger: [{ op: 'has', args: ['cards.name', '钱币骑士'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR76-REV'] },
      { id: 'COMBO-TR76-REV', name: '钱币骑士逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币骑士'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR76-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR76-UP', pro: '钱币骑士正位，主勤奋与可靠，按部就班、稳中求进', mix: '牌上是钱币骑士正位，关键词是勤奋、可靠、责任，一步一个脚印', lay: '你不快但很稳，交给你的事能落地，这种靠谱在现在最值钱', polarity: '+', modality: 'assert', atomicId: 'ATOM-TR-TR76-001' },
      { comboId: 'COMBO-TR76-REV', pro: '钱币骑士逆位，主僵化拖沓、责任失守', mix: '牌上是钱币骑士逆位，稳成了死板，事也拖着', lay: '你太按部就班反而拖了进度，或者该负的责没负起来，动起来', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR76-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR77: {
    id: 'TR77',
    name: '钱币王后',
    group: 'TR',
    factors: [
      { id: 'TR77-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币王后'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR77-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR77-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR77-UP', name: '钱币王后正位', trigger: [{ op: 'has', args: ['cards.name', '钱币王后'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR77-REV'] },
      { id: 'COMBO-TR77-REV', name: '钱币王后逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币王后'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR77-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR77-UP', pro: '钱币王后正位，主务实与滋养，兼顾实务与人情', mix: '牌上是钱币王后正位，关键词是务实、母性、滋养，既会过日子也会照顾人', lay: '你既把事办得实在，也把人照顾得周到，这种能力现在很关键', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR77-001' },
      { comboId: 'COMBO-TR77-REV', pro: '钱币王后逆位，主顾此失彼、务实失衡', mix: '牌上是钱币王后逆位，要么只顾事不顾人，要么反过来', lay: '你在把事办好和把人顾好之间失衡了，两头各让一步', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR77-002' },
    ],
    dimTags: ['DIM_14'],
  },
  TR78: {
    id: 'TR78',
    name: '钱币国王',
    group: 'TR',
    factors: [
      { id: 'TR78-1', name: '牌意核心', trigger: [{ op: 'has', args: ['cards.name', '钱币国王'] }], fieldBinding: ['cards.name', 'cards.keywords', 'cards.archetype'], defaultWeight: 0.40, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.36 } },
      { id: 'TR78-2', name: '正位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], fieldBinding: ['cards.reversed', 'cards.position', 'spreadType', 'spreadName'], defaultWeight: 0.30, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TR78-3', name: '逆位倾向', trigger: [{ op: 'has', args: ['cards.name', '钱币国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], fieldBinding: ['cards.reversed', 'draw.order.orientation'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TR78-UP', name: '钱币国王正位', trigger: [{ op: 'has', args: ['cards.name', '钱币国王'] }, { op: 'equals', args: ['cards.reversed', 'false'] }], priority: 10, mutex: ['COMBO-TR78-REV'] },
      { id: 'COMBO-TR78-REV', name: '钱币国王逆位', trigger: [{ op: 'has', args: ['cards.name', '钱币国王'] }, { op: 'equals', args: ['cards.reversed', 'true'] }], priority: 20, mutex: ['COMBO-TR78-UP'] },
    ],
    templates: [
      { comboId: 'COMBO-TR78-UP', pro: '钱币国王正位，主富裕与成功，掌控资源、稳操胜券', mix: '牌上是钱币国王正位，关键词是富裕、成功、安全，你有足够的底牌', lay: '你手里有足够的资源和底气，能拍板也能兜底，大胆做决定', polarity: '++', modality: 'assert', atomicId: 'ATOM-TR-TR78-001' },
      { comboId: 'COMBO-TR78-REV', pro: '钱币国王逆位，主资源失控、成功不稳', mix: '牌上是钱币国王逆位，家底或掌控力出了问题', lay: '你原本稳当的底牌出了变数，别硬撑场面，先把盘子看清楚', polarity: '-', modality: 'likely', atomicId: 'ATOM-TR-TR78-002' },
    ],
    dimTags: ['DIM_14'],
  },
};
