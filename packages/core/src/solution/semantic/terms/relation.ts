/**
 * GX 关系组 · 7 条
 * 生 / 克 / 冲 / 合 / 刑 / 害 / 破
 *
 * 字段绑定（R3 核验）：
 * - pillarRelations.{fuxin, fanyin, xingChong}（合/冲/刑/害/破/六合/三合/三会）
 * - wuxingStrength.{present, dominantByRule}
 */
import type { TermSchema } from '../types';

export const RELATION_REGISTRY: Record<string, TermSchema> = {
  SHENG: {
    id: 'SHENG',
    name: '生',
    group: 'GX',
    factors: [
      { id: 'SH-1', name: '相生滋养', trigger: [{ op: 'contains', args: ['wuxingStrength.present', '干'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.4, schools: { ziping: 0.40, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'SH-2', name: '印星生扶', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
      { id: 'SH-3', name: '生而不乱', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], fieldBinding: ['pillarRelations.fuxin'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.26, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-SH-SH', name: '相生有情', trigger: [{ op: 'has', args: ['tenGods', '正印'] }, { op: 'contains', args: ['wuxingStrength.present', '干'] }], priority: 10, mutex: [] },
      { id: 'COMBO-SH-WU', name: '生而无用', trigger: [{ op: 'has', args: ['tenGods', '正印'] }, { op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 20, mutex: ['COMBO-SH-SH'] },
    ],
    templates: [
      { comboId: 'COMBO-SH-SH', pro: '相生有情，印星得生，滋养有力，格局得养', mix: '你较易得到实质性的滋养与支持，贵人助力明显', lay: '你身边愿意帮你的人多，你能得到实在的支持', polarity: '+', modality: 'likely', atomicId: 'ATOM-SH-SH-001' },
      { comboId: 'COMBO-SH-WU', pro: '生而无用，印星被冲，滋养难落地', mix: '你虽有心助力，但容易落空，支持难以真正兑现', lay: '别人想帮你，但总有变数，支持容易打折扣', polarity: '-', modality: 'tend', atomicId: 'ATOM-SH-WU-001' },
    ],
    dimTags: ['DIM_05'],
  },
  KE: {
    id: 'KE',
    name: '克',
    group: 'GX',
    factors: [
      { id: 'KE-1', name: '克制约束', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], fieldBinding: ['tenGods'], defaultWeight: 0.4, schools: { ziping: 0.40, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'KE-2', name: '克而有制', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
      { id: 'KE-3', name: '克战失衡', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', 'rule'] }], fieldBinding: ['wuxingStrength.dominantByRule'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.26, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-KE-ZHI', name: '克而有制', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 10, mutex: [] },
      { id: 'COMBO-KE-WU', name: '克战无制', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], priority: 20, mutex: ['COMBO-KE-ZHI'] },
    ],
    templates: [
      { comboId: 'COMBO-KE-ZHI', pro: '克而有制，杀被制化，压力转动力，格局得用', mix: '你的压力能被驾驭，反而能转化为推动力', lay: '你扛得住压力，压力对你来说是动力', polarity: '+', modality: 'likely', atomicId: 'ATOM-KE-ZHI-001' },
      { comboId: 'COMBO-KE-WU', pro: '克战无制，杀星无制，压力过盛而易伤', mix: '你的压力偏大且缺乏缓冲，长期易身心受损', lay: '你压力很大，又没什么出口，容易把自己搞垮', polarity: '--', modality: 'tend', atomicId: 'ATOM-KE-WU-001' },
    ],
    dimTags: ['DIM_05'],
  },
  CHONG: {
    id: 'CHONG',
    name: '冲',
    group: 'GX',
    factors: [
      { id: 'CH-1', name: '冲动变迁', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '冲'] }], fieldBinding: ['pillarRelations.xingChong'], defaultWeight: 0.4, schools: { ziping: 0.38, mangpai: 0.42, xinpai: 0.40 } },
      { id: 'CH-2', name: '冲开格局', trigger: [{ op: 'has', args: ['wuxingStrength.present', '干'] }], fieldBinding: ['wuxingStrength.present'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'CH-3', name: '冲中见动', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '冲'] }], fieldBinding: ['luckInfo.cycles', 'pillarRelations.xingChong'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.24, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-CH-DONG', name: '冲动变迁', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 10, mutex: [] },
      { id: 'COMBO-CH-KAI', name: '冲开格局', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '冲'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-CH-DONG', pro: '冲动变迁，驿动明显，居所或环境多变动', mix: '你人生中变动较多，居所、环境或岗位容易变化', lay: '你这辈子比较折腾，搬家换环境的次数不少', polarity: '0', modality: 'assert', atomicId: 'ATOM-CH-DONG-001' },
      { comboId: 'COMBO-CH-KAI', pro: '冲开格局，冲而能泄，压力有出口，反得生机', mix: '你的变动虽多，但每次都能打开新局面，反有生机', lay: '你虽然爱折腾，但每次变动都帮你打开了新门路', polarity: '+', modality: 'tend', atomicId: 'ATOM-CH-KAI-001' },
    ],
    dimTags: ['DIM_05'],
  },
  HE: {
    id: 'HE',
    name: '合',
    group: 'GX',
    factors: [
      { id: 'HE-1', name: '合和凝聚', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], fieldBinding: ['pillarRelations.fuxin'], defaultWeight: 0.4, schools: { ziping: 0.40, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'HE-2', name: '合而有情', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '六合'] }], fieldBinding: ['pillarRelations.fuxin'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
      { id: 'HE-3', name: '合多羁绊', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], fieldBinding: ['pillarRelations.fuxin', 'wuxingStrength.present'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.26, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-HE-QING', name: '合而有情', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 10, mutex: [] },
      { id: 'COMBO-HE-JI', name: '合多羁绊', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-HE-QING', pro: '合而有情，印星得合，凝聚有情，助力稳固', mix: '你的关系凝聚力强，助力稳固，人情较厚', lay: '你人缘好，关系稳定，身边人愿意长期陪你', polarity: '+', modality: 'likely', atomicId: 'ATOM-HE-QING-001' },
      { comboId: 'COMBO-HE-JI', pro: '合多羁绊，合而受制，关系黏着，行动易困', mix: '你的人际关系偏黏着，容易被关系牵绊，行动易受阻', lay: '你容易被关系绑住，事情拖着拖不清', polarity: '-', modality: 'tend', atomicId: 'ATOM-HE-JI-001' },
    ],
    dimTags: ['DIM_05'],
  },
  XING: {
    id: 'XING',
    name: '刑',
    group: 'GX',
    factors: [
      { id: 'XING-1', name: '刑伤折磨', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '刑'] }], fieldBinding: ['pillarRelations.xingChong'], defaultWeight: 0.4, schools: { ziping: 0.40, mangpai: 0.38, xinpai: 0.40 } },
      { id: 'XING-2', name: '刑而能化', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.35, schools: { ziping: 0.34, mangpai: 0.38, xinpai: 0.35 } },
      { id: 'XING-3', name: '刑中见断', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '刑'] }], fieldBinding: ['pillarRelations.xingChong', 'luckInfo.cycles'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.24, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-XING-CE', name: '刑伤折磨', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '刑'] }], priority: 10, mutex: [] },
      { id: 'COMBO-XING-HUA', name: '刑而能化', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '刑'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-XING-CE', pro: '刑伤折磨，刑星作祟，身心内耗偏重', mix: '你内心消耗偏重，容易自我纠结，身心易受伤', lay: '你容易自己跟自己过不去，内耗比较重', polarity: '-', modality: 'tend', atomicId: 'ATOM-XING-CE-001' },
      { comboId: 'COMBO-XING-HUA', pro: '刑而能化，刑被印化，内耗转定力，反得清明', mix: '你的内耗能被化解，反而能转化为定力与清明', lay: '你虽容易纠结，但最终能想开，转成一股定力', polarity: '+', modality: 'tend', atomicId: 'ATOM-XING-HUA-001' },
    ],
    dimTags: ['DIM_05'],
  },
  HAI: {
    id: 'HAI',
    name: '害',
    group: 'GX',
    factors: [
      { id: 'HAI-1', name: '暗害损耗', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '害'] }], fieldBinding: ['pillarRelations.xingChong'], defaultWeight: 0.4, schools: { ziping: 0.38, mangpai: 0.42, xinpai: 0.40 } },
      { id: 'HAI-2', name: '害中有情', trigger: [{ op: 'has', args: ['pillarRelations.fuxin', '合'] }], fieldBinding: ['pillarRelations.fuxin'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'HAI-3', name: '暗耗积微', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '害'] }], fieldBinding: ['luckInfo.cycles'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.24, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-HAI-SUN', name: '暗害损耗', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '害'] }], priority: 10, mutex: [] },
      { id: 'COMBO-HAI-QING', name: '害中有情', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '害'] }, { op: 'has', args: ['pillarRelations.fuxin', '合'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-HAI-SUN', pro: '暗害损耗，害星作祟，暗中损耗偏多', mix: '你的损耗多发生在暗处，不易察觉，需留心', lay: '你的损失往往不起眼，不知不觉就亏了', polarity: '-', modality: 'tend', atomicId: 'ATOM-HAI-SUN-001' },
      { comboId: 'COMBO-HAI-QING', pro: '害中有情，害得合解，损耗有缓冲，关系不失', mix: '你的损耗能被关系缓冲，虽有小亏但大局不失', lay: '你虽偶尔吃亏，但身边有人兜着，问题不大', polarity: '0', modality: 'tend', atomicId: 'ATOM-HAI-QING-001' },
    ],
    dimTags: ['DIM_05'],
  },
  PO: {
    id: 'PO',
    name: '破',
    group: 'GX',
    factors: [
      { id: 'PO-1', name: '破败损耗', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '破'] }], fieldBinding: ['pillarRelations.xingChong'], defaultWeight: 0.4, schools: { ziping: 0.38, mangpai: 0.42, xinpai: 0.40 } },
      { id: 'PO-2', name: '破旧立新', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods'], defaultWeight: 0.35, schools: { ziping: 0.36, mangpai: 0.34, xinpai: 0.35 } },
      { id: 'PO-3', name: '破中见动', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '破'] }], fieldBinding: ['luckInfo.cycles'], defaultWeight: 0.25, schools: { ziping: 0.26, mangpai: 0.24, xinpai: 0.25 } },
    ],
    combos: [
      { id: 'COMBO-PO-BAI', name: '破败损耗', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '破'] }], priority: 10, mutex: [] },
      { id: 'COMBO-PO-XIN', name: '破旧立新', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '破'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-PO-BAI', pro: '破败损耗，破星作祟，成局易破，损耗偏多', mix: '你的事业与计划容易中途受挫，损耗偏多', lay: '你做事容易虎头蛇尾，中途容易打水漂', polarity: '-', modality: 'tend', atomicId: 'ATOM-PO-BAI-001' },
      { comboId: 'COMBO-PO-XIN', pro: '破旧立新，破而有泄，成局能破，反开新局', mix: '你的破局反而能打开新局面，破旧立新，反有生机', lay: '你虽然常推翻重来，但每次都能开出新门路', polarity: '+', modality: 'tend', atomicId: 'ATOM-PO-XIN-001' },
    ],
    dimTags: ['DIM_05'],
  },
};
