/**
 * XY 星曜组 · 14 条（紫微斗数十四主星全）
 * 紫微 ZW / 天府 TF / 太阳 TY / 太阴 TYI
 * 武曲 WQ / 天同 TT / 廉贞 LZ / 天机 TJ
 * 贪狼 TL / 巨门 JM / 天相 TX / 天梁 TLI / 七杀 QS / 破军 PJ
 *
 * 字段绑定（R3 核验）：
 * - StarFact.brightness（7 级庙旺落陷）
 * - birth_mutagen / mutagen_map（四化：禄/权/科/忌）
 * - palaces[]（十二宫落位）
 *
 * 说明：
 * - 星曜组只拆庙旺落陷 + 四化引动语义，不展开星曜全量星性论述。
 * - 前 4 条（ZW/TF/TY/TYI）因子权重 0.40/0.30/0.30，组合为「庙旺得助 / 落陷无助」。
 * - 后 10 条（R3-4 补）因子权重 0.5/0.3/0.2，组合为「庙旺逢吉 / 庙旺逢煞」，
 *    schools 三派列各自加总 = 1.00。
 */
import type { TermSchema } from '../types';

export const STAR_REGISTRY: Record<string, TermSchema> = {
  ZW: {
    id: 'ZW',
    name: '紫微',
    group: 'XY',
    factors: [
      { id: 'ZW-1', name: '入庙当旺', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'ZW-2', name: '落陷失辉', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.28 } },
      { id: 'ZW-3', name: '会照得助', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-ZW-MT', name: '庙旺得助', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '星'] }], priority: 10, mutex: [] },
      { id: 'COMBO-ZW-LX', name: '落陷无助', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-ZW-MT', pro: '紫微入庙且得会照，主星辉曜充足，格局厚重', mix: '你命中的主星落在当位又得助力，气场厚实稳重', lay: '你的"主心骨"处在最有力的位置，关键时刻撑得住场', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-ZW-MT-001' },
      { comboId: 'COMBO-ZW-LX', pro: '紫微落陷且无助照，主星失辉，格局浮动', mix: '你的主星落在弱势位又缺助力，气场容易浮动', lay: '你的"主心骨"位置偏弱，大事上容易拿不定、撑不久', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-ZW-LX-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TF: {
    id: 'TF',
    name: '天府',
    group: 'XY',
    factors: [
      { id: 'TF-1', name: '入庙当旺', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'TF-2', name: '落陷失辉', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.28 } },
      { id: 'TF-3', name: '会照得助', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TF-MT', name: '庙旺得助', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '星'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TF-LX', name: '落陷无助', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TF-MT', pro: '天府入庙且得会照，库星当位，主积蓄厚成', mix: '你的财库星落在当位又得助力，积蓄与守成较稳', lay: '你守家底的本事处在最好状态，攒得住、也守得住', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TF-MT-001' },
      { comboId: 'COMBO-TF-LX', pro: '天府落陷且无助照，库星失辉，主积蓄浮动', mix: '你的财库星落在弱势位又缺助力，积蓄容易浮动', lay: '你守家底的本事偏弱，钱袋子容易大进大出', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TF-LX-001' },
    ],
    dimTags: ['DIM_11', 'DIM_06'],
  },
  TY: {
    id: 'TY',
    name: '太阳',
    group: 'XY',
    factors: [
      { id: 'TY-1', name: '入庙当旺', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'TY-2', name: '落陷失辉', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.28 } },
      { id: 'TY-3', name: '会照得助', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TY-MT', name: '庙旺得助', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '星'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TY-LX', name: '落陷无助', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TY-MT', pro: '太阳入庙且得会照，日星当旺，主声名昭著', mix: '你的太阳星落在当位又得助力，表现与声名较亮', lay: '你"被看见"的能力处在最好状态，做事容易出风头、有面子', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TY-MT-001' },
      { comboId: 'COMBO-TY-LX', pro: '太阳落陷且无助照，日星失辉，主声名晦暗', mix: '你的太阳星落在弱势位又缺助力，表现与声名偏晦', lay: '你"被看见"的能力偏弱，努力了也容易埋没，难出头', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TY-LX-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TYI: {
    id: 'TYI',
    name: '太阴',
    group: 'XY',
    factors: [
      { id: 'TYI-1', name: '入庙当旺', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.40, schools: { ziping: 0.38, mangpai: 0.34, xinpai: 0.38 } },
      { id: 'TYI-2', name: '落陷失辉', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.28, mangpai: 0.34, xinpai: 0.28 } },
      { id: 'TYI-3', name: '会照得助', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map', 'palaces'], defaultWeight: 0.30, schools: { ziping: 0.34, mangpai: 0.32, xinpai: 0.34 } },
    ],
    combos: [
      { id: 'COMBO-TYI-MT', name: '庙旺得助', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '星'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TYI-LX', name: '落陷无助', trigger: [{ op: 'has', args: ['StarFact.brightness', '陷'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TYI-MT', pro: '太阴入庙且得会照，月星当旺，主财荫柔厚', mix: '你的太阴星落在当位又得助力，财荫与内蕴较厚', lay: '你"细水长流"的一面处在最好状态，内在积累扎实，暗中有靠山', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TYI-MT-001' },
      { comboId: 'COMBO-TYI-LX', pro: '太阴落陷且无助照，月星失辉，主财荫浮薄', mix: '你的太阴星落在弱势位又缺助力，财荫与内蕴偏薄', lay: '你"细水长流"的一面偏弱，内在积累不稳，暗中助力少', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TYI-LX-001' },
    ],
    dimTags: ['DIM_11', 'DIM_06'],
  },
  WQ: {
    id: 'WQ',
    name: '武曲',
    group: 'XY',
    factors: [
      { id: 'WQ-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'WQ-2', name: '刚毅财性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'WQ-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-WQ-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-WQ-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-WQ-FJ', pro: '武曲入庙逢禄存，财星当位而化吉，主刚毅生财', mix: '你的武曲星落在当位又遇吉化，赚钱靠的是硬本事与闯劲', lay: '你挣钱靠实打实的能力，位置对的时候来钱稳、也守得住', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-WQ-FJ-001' },
      { comboId: 'COMBO-WQ-FS', pro: '武曲守垣而化忌，财星当位受制，主刚折耗财', mix: '你的武曲星虽在当位却遇煞化，赚钱辛苦还容易破耗', lay: '你能挣钱但钱来得费劲，还容易为钱的事跟人硬碰硬', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-WQ-FS-001' },
    ],
    dimTags: ['DIM_11', 'DIM_06'],
  },
  TT: {
    id: 'TT',
    name: '天同',
    group: 'XY',
    factors: [
      { id: 'TT-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'TT-2', name: '温和福性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'TT-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-TT-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TT-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TT-FJ', pro: '天同入庙逢吉化，福星当位，主安逸得福', mix: '你的天同星落在当位又遇吉化，日子顺心、遇事有人帮衬', lay: '你命里带福，位置对的时候日子过得舒坦，困难时总有人拉一把', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TT-FJ-001' },
      { comboId: 'COMBO-TT-FS', pro: '天同守垣而化忌，福星受制，主安逸生惰', mix: '你的天同星虽在当位却遇煞化，容易太安逸而少了拼劲', lay: '你有福但得防着太舒服就不想动，福气要自己接住才管用', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TT-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  LZ: {
    id: 'LZ',
    name: '廉贞',
    group: 'XY',
    factors: [
      { id: 'LZ-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'LZ-2', name: '官禄桃花性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'LZ-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-LZ-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-LZ-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-LZ-FJ', pro: '廉贞入庙逢吉化，官禄主当位，主事业人缘并得', mix: '你的廉贞星落在当位又遇吉化，事业与人际上都拿得起', lay: '你在事业和人际上都吃得开，位置对的时候两头都顺', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-LZ-FJ-001' },
      { comboId: 'COMBO-LZ-FS', pro: '廉贞守垣而化忌，次桃花受制，主人缘生波', mix: '你的廉贞星虽在当位却遇煞化，人际与感情上容易起波折', lay: '你人缘旺但感情上得留心，位置不对时容易被关系的事拖住', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-LZ-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TJ: {
    id: 'TJ',
    name: '天机',
    group: 'XY',
    factors: [
      { id: 'TJ-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'TJ-2', name: '机变智性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'TJ-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-TJ-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TJ-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TJ-FJ', pro: '天机入庙逢吉化，智星当位，主谋事多成', mix: '你的天机星落在当位又遇吉化，脑子转得快、点子能落地', lay: '你脑子活、应变快，位置对的时候想出的办法真能办成事', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TJ-FJ-001' },
      { comboId: 'COMBO-TJ-FS', pro: '天机守垣而化忌，智星受制，主思虑多变', mix: '你的天机星虽在当位却遇煞化，想法多却容易反复拿不定', lay: '你点子多但容易想太多、改来改去，反而把事拖住了', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TJ-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TL: {
    id: 'TL',
    name: '贪狼',
    group: 'XY',
    factors: [
      { id: 'TL-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'TL-2', name: '欲望才艺性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'TL-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-TL-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TL-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TL-FJ', pro: '贪狼入庙逢吉化，桃花当位，主才艺交际并显', mix: '你的贪狼星落在当位又遇吉化，人缘广、才艺也拿得出手', lay: '你交际广、兴趣多，位置对的时候靠人脉和才艺都能成事', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TL-FJ-001' },
      { comboId: 'COMBO-TL-FS', pro: '贪狼守垣而化忌，桃花受制，主欲求生扰', mix: '你的贪狼星虽在当位却遇煞化，想要的太多反而分散了精力', lay: '你想要的太多、兴趣太杂，位置不对时容易贪多嚼不烂', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TL-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  JM: {
    id: 'JM',
    name: '巨门',
    group: 'XY',
    factors: [
      { id: 'JM-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'JM-2', name: '口舌暗曜性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'JM-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-JM-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-JM-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-JM-FJ', pro: '巨门入庙逢吉化，暗曜当位，主口才辨事得力', mix: '你的巨门星落在当位又遇吉化，讲道理、做分析都很在行', lay: '你嘴皮子利索、看问题透，位置对的时候靠说理就能把事办成', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-JM-FJ-001' },
      { comboId: 'COMBO-JM-FS', pro: '巨门守垣而化忌，暗曜受制，主是非疑虑丛生', mix: '你的巨门星虽在当位却遇煞化，容易想多、也容易招口舌', lay: '你爱琢磨但容易钻牛角尖，位置不对时是非和误会会找上门', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-JM-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TX: {
    id: 'TX',
    name: '天相',
    group: 'XY',
    factors: [
      { id: 'TX-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'TX-2', name: '辅佐衣禄性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'TX-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-TX-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TX-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TX-FJ', pro: '天相入庙逢吉化，印星当位，主辅佐得力衣禄丰', mix: '你的天相星落在当位又遇吉化，做事公道、也有人愿意托付', lay: '你办事公道、会替人着想，位置对的时候贵人和饭碗都不缺', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TX-FJ-001' },
      { comboId: 'COMBO-TX-FS', pro: '天相守垣而化忌，印星受制，主依附失据', mix: '你的天相星虽在当位却遇煞化，容易太顾别人而没了主张', lay: '你太在意别人看法，位置不对时容易被人推着走、自己拿不定', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TX-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  TLI: {
    id: 'TLI',
    name: '天梁',
    group: 'XY',
    factors: [
      { id: 'TLI-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'TLI-2', name: '荫庇护佑性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'TLI-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-TLI-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TLI-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TLI-FJ', pro: '天梁入庙逢吉化，荫星当位，主逢凶化吉得长辈助', mix: '你的天梁星落在当位又遇吉化，遇事有人罩，难关过得去', lay: '你命里有"保护伞"，位置对的时候出事也有人帮你扛过去', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-TLI-FJ-001' },
      { comboId: 'COMBO-TLI-FS', pro: '天梁守垣而化忌，荫星受制，主庇护落空而操心', mix: '你的天梁星虽在当位却遇煞化，该有的帮衬容易落空、自己多操心', lay: '你习惯操心别人，但真到自己有事时靠山未必靠得住', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-TLI-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  XQS: {
    id: 'XQS',
    name: '七杀',
    group: 'XY',
    factors: [
      { id: 'XQS-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'XQS-2', name: '威猛开创性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'XQS-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-XQS-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-XQS-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-XQS-FJ', pro: '七杀入庙逢吉化，将星当位，主威权开创有成', mix: '你的七杀星落在当位又遇吉化，敢闯敢决断，能自己打出局面', lay: '你有股狠劲和决断力，位置对的时候靠自己就能闯出名堂', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-XQS-FJ-001' },
      { comboId: 'COMBO-XQS-FS', pro: '七杀守垣而化忌，将星受制，主孤克耗力', mix: '你的七杀星虽在当位却遇煞化，冲得太猛容易孤身硬扛', lay: '你冲劲足但容易一个人扛到底，位置不对时伤自己也伤关系', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-XQS-FS-001' },
    ],
    dimTags: ['DIM_11'],
  },
  PJ: {
    id: 'PJ',
    name: '破军',
    group: 'XY',
    factors: [
      { id: 'PJ-1', name: '庙旺得位', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }], fieldBinding: ['StarFact.brightness', 'palaces'], defaultWeight: 0.5, schools: { ziping: 0.50, mangpai: 0.48, xinpai: 0.50 } },
      { id: 'PJ-2', name: '变革耗散性', trigger: [{ op: 'has', args: ['birth_mutagen', '星'] }], fieldBinding: ['StarFact.brightness', 'birth_mutagen', 'palaces'], defaultWeight: 0.3, schools: { ziping: 0.28, mangpai: 0.32, xinpai: 0.30 } },
      { id: 'PJ-3', name: '四化引动', trigger: [{ op: 'has', args: ['mutagen_map', '星'] }], fieldBinding: ['birth_mutagen', 'mutagen_map'], defaultWeight: 0.2, schools: { ziping: 0.22, mangpai: 0.20, xinpai: 0.20 } },
    ],
    combos: [
      { id: 'COMBO-PJ-FJ', name: '庙旺逢吉', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '禄'] }], priority: 10, mutex: [] },
      { id: 'COMBO-PJ-FS', name: '庙旺逢煞', trigger: [{ op: 'has', args: ['StarFact.brightness', '庙'] }, { op: 'has', args: ['mutagen_map', '忌'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-PJ-FJ', pro: '破军入庙逢吉化，先锋当位，主破旧立新有成', mix: '你的破军星落在当位又遇吉化，敢推倒重来，革新能成事', lay: '你不怕推倒重来，位置对的时候敢变敢闯，反而能闯出新路', polarity: '++', modality: 'assert', atomicId: 'ATOM-XY-PJ-FJ-001' },
      { comboId: 'COMBO-PJ-FS', pro: '破军守垣而化忌，耗星受制，主破耗频仍根基动', mix: '你的破军星虽在当位却遇煞化，变动太多、家底容易耗散', lay: '你变动太多，位置不对时容易折腾一场、攒下的东西守不住', polarity: '-', modality: 'likely', atomicId: 'ATOM-XY-PJ-FS-001' },
    ],
    dimTags: ['DIM_11', 'DIM_06'],
  },
};
