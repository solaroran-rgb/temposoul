/**
 * SS 神煞组 · 8 条
 * 天乙贵人 / 文昌 / 桃花 / 驿马 / 华盖 / 空亡 / 羊刃 / 灾煞
 *
 * 字段绑定（R3 核验）：
 * - shensha（顶层）/ baziShenSha（八字专用）
 * - kongWang（空亡）
 * - 大运 luckInfo.cycles / 流年 liunian
 */
import type { TermSchema } from '../types';

export const SHENSHA_REGISTRY: Record<string, TermSchema> = {
  TYGR: {
    id: 'TYGR',
    name: '天乙贵人',
    group: 'SS',
    factors: [
      { id: 'TYGR-1', name: '贵人临命', trigger: [{ op: 'contains', args: ['shensha', '天乙贵人'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.44, xinpai: 0.40 } },
      { id: 'TYGR-2', name: '贵人得力', trigger: [{ op: 'contains', args: ['baziShenSha', '天乙贵人'] }], fieldBinding: ['baziShenSha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'TYGR-3', name: '贵人应运', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '天乙贵人'] }], fieldBinding: ['luckInfo.cycles', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.20, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-TYGR-LIN', name: '贵人临命', trigger: [{ op: 'contains', args: ['shensha', '天乙贵人'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TYGR-YING', name: '贵人应运', trigger: [{ op: 'contains', args: ['shensha', '天乙贵人'] }, { op: 'in_luck', args: ['liunian', '天乙贵人'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TYGR-LIN', pro: '天乙贵人临命，贵人得力，遇难解，逢凶化吉', mix: '你命中贵人得力，遇事较易逢凶化吉、有人解围', lay: '你运气不错，关键时刻总有人拉你一把', polarity: '++', modality: 'likely', atomicId: 'ATOM-TYGR-LIN-001' },
      { comboId: 'COMBO-TYGR-YING', pro: '贵人应运，天乙贵人应流年，贵人在特定年份显', mix: '你的贵人在特定年份较显，那年较易得助力', lay: '你某些年份特别顺，容易遇到贵人', polarity: '+', modality: 'tend', atomicId: 'ATOM-TYGR-YING-001' },
    ],
    dimTags: ['DIM_07'],
  },
  WC: {
    id: 'WC',
    name: '文昌',
    group: 'SS',
    factors: [
      { id: 'WC-1', name: '文昌入命', trigger: [{ op: 'contains', args: ['shensha', '文昌'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'WC-2', name: '学业得助', trigger: [{ op: 'contains', args: ['baziShenSha', '文昌'] }], fieldBinding: ['baziShenSha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.30, xinpai: 0.30 } },
      { id: 'WC-3', name: '文采显发', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-WC-RU', name: '文昌入命', trigger: [{ op: 'contains', args: ['shensha', '文昌'] }], priority: 10, mutex: [] },
      { id: 'COMBO-WC-YE', name: '文昌得食', trigger: [{ op: 'contains', args: ['shensha', '文昌'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-WC-RU', pro: '文昌入命，文采得助，学业与思辨显', mix: '你文昌得力，学业与思辨能力较显，理解力强', lay: '你很聪明，学习能力强，脑子转得快', polarity: '+', modality: 'likely', atomicId: 'ATOM-WC-RU-001' },
      { comboId: 'COMBO-WC-YE', pro: '文昌得食，文采显发，表达与创作得才', mix: '你的文昌与食神相配，表达与创作之才较显', lay: '你不仅聪明还善于表达，写东西或做内容有天赋', polarity: '++', modality: 'likely', atomicId: 'ATOM-WC-YE-001' },
    ],
    dimTags: ['DIM_07', 'DIM_08'],
  },
  TH: {
    id: 'TH',
    name: '桃花',
    group: 'SS',
    factors: [
      { id: 'TH-1', name: '桃花入命', trigger: [{ op: 'contains', args: ['shensha', '桃花'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'TH-2', name: '人缘魅力', trigger: [{ op: 'contains', args: ['baziShenSha', '桃花'] }], fieldBinding: ['baziShenSha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.34, xinpai: 0.30 } },
      { id: 'TH-3', name: '异性缘显', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }], fieldBinding: ['pillars.day.zhi', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.30, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-TH-RU', name: '桃花入命', trigger: [{ op: 'contains', args: ['shensha', '桃花'] }], priority: 10, mutex: [] },
      { id: 'COMBO-TH-YC', name: '桃花入垣', trigger: [{ op: 'contains', args: ['shensha', '桃花'] }, { op: 'in_pillar', args: ['day', 'zhi'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-TH-RU', pro: '桃花入命，人缘魅力显，异性缘与社交缘较旺', mix: '你桃花较旺，人缘与魅力显，社交与异性缘都偏旺', lay: '你人缘好，异性缘也旺，走到哪里都比较受欢迎', polarity: '+', modality: 'likely', atomicId: 'ATOM-TH-RU-001' },
      { comboId: 'COMBO-TH-YC', pro: '桃花入垣，桃花入婚姻宫，人缘魅力较集中', mix: '你的桃花较集中于婚恋层面，魅力在人缘中显', lay: '你的桃花多落在感情上，婚恋关系里魅力较集中', polarity: '0', modality: 'tend', atomicId: 'ATOM-TH-YC-001' },
    ],
    dimTags: ['DIM_07', 'DIM_03'],
  },
  YM: {
    id: 'YM',
    name: '驿马',
    group: 'SS',
    factors: [
      { id: 'YM-1', name: '驿马入命', trigger: [{ op: 'contains', args: ['shensha', '驿马'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.36, xinpai: 0.40 } },
      { id: 'YM-2', name: '动迁显发', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '冲'] }], fieldBinding: ['pillarRelations.xingChong', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'YM-3', name: '行运多动', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '驿马'] }], fieldBinding: ['luckInfo.cycles', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.28, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-YM-RU', name: '驿马入命', trigger: [{ op: 'contains', args: ['shensha', '驿马'] }], priority: 10, mutex: [] },
      { id: 'COMBO-YM-DONG', name: '驿马逢冲', trigger: [{ op: 'contains', args: ['shensha', '驿马'] }, { op: 'has', args: ['pillarRelations.xingChong', '冲'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-YM-RU', pro: '驿马入命，动迁显发，行运多走动，奔波较频', mix: '你驿马较旺，人生多走动，奔波与变动较频繁', lay: '你这辈子比较爱动，到处跑，走动多', polarity: '0', modality: 'likely', atomicId: 'ATOM-YM-RU-001' },
      { comboId: 'COMBO-YM-DONG', pro: '驿马逢冲，驿马得冲，动中带变，走动能开新局', mix: '你的驿马逢冲，动中带变，走动能打开新局面', lay: '你走动多，但每次出去都能带来新机会', polarity: '+', modality: 'tend', atomicId: 'ATOM-YM-DONG-001' },
    ],
    dimTags: ['DIM_07'],
  },
  HG: {
    id: 'HG',
    name: '华盖',
    group: 'SS',
    factors: [
      { id: 'HG-1', name: '华盖入命', trigger: [{ op: 'contains', args: ['shensha', '华盖'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.40, xinpai: 0.40 } },
      { id: 'HG-2', name: '清高内秀', trigger: [{ op: 'contains', args: ['baziShenSha', '华盖'] }], fieldBinding: ['baziShenSha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'HG-3', name: '孤高偏冷', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.24, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-HG-RU', name: '华盖入命', trigger: [{ op: 'contains', args: ['shensha', '华盖'] }], priority: 10, mutex: [] },
      { id: 'COMBO-HG-GU', name: '华盖孤高', trigger: [{ op: 'contains', args: ['shensha', '华盖'] }, { op: 'has', args: ['tenGods', '偏印'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-HG-RU', pro: '华盖入命，清高内秀，悟性与精神世界偏深', mix: '你华盖得力，清高内秀，悟性与精神世界较深', lay: '你比较清高，内心世界丰富，爱琢磨精神层面的事', polarity: '0', modality: 'likely', atomicId: 'ATOM-HG-RU-001' },
      { comboId: 'COMBO-HG-GU', pro: '华盖孤高，华盖偏印相配，孤高偏冷，性情偏冷', mix: '你的华盖与偏印相配，孤高偏冷，性情偏冷僻', lay: '你比较孤傲，不太合群，喜欢一个人待着', polarity: '-', modality: 'tend', atomicId: 'ATOM-HG-GU-001' },
    ],
    dimTags: ['DIM_07', 'DIM_08'],
  },
  KW: {
    id: 'KW',
    name: '空亡',
    group: 'SS',
    factors: [
      { id: 'KW-1', name: '空亡临柱', trigger: [{ op: 'has', args: ['kongWang', '干'] }], fieldBinding: ['kongWang'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.44, xinpai: 0.40 } },
      { id: 'KW-2', name: '落空失实', trigger: [{ op: 'in_pillar', args: ['day', 'zhi'] }], fieldBinding: ['pillars.day.zhi', 'kongWang'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'KW-3', name: '行运落空', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '空亡'] }], fieldBinding: ['luckInfo.cycles', 'kongWang'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.20, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-KW-LIN', name: '空亡临柱', trigger: [{ op: 'has', args: ['kongWang', '干'] }], priority: 10, mutex: [] },
      { id: 'COMBO-KW-LUO', name: '行运落空', trigger: [{ op: 'has', args: ['kongWang', '干'] }, { op: 'in_luck', args: ['liunian', '空亡'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-KW-LIN', pro: '空亡临柱，落空失实，所临之宫位偏虚', mix: '你空亡所临的宫位偏虚，对应领域容易落空', lay: '你某个方面容易落空，该得到的东西常常差一口气', polarity: '-', modality: 'tend', atomicId: 'ATOM-KW-LIN-001' },
      { comboId: 'COMBO-KW-LUO', pro: '行运落空，空亡应流年，特定年份易落空', mix: '你的空亡应流年，特定年份容易落空，需留意', lay: '你某些年份特别容易落空，那年做事要留个心眼', polarity: '-', modality: 'tend', atomicId: 'ATOM-KW-LUO-001' },
    ],
    dimTags: ['DIM_07'],
  },
  YR: {
    id: 'YR',
    name: '羊刃',
    group: 'SS',
    factors: [
      { id: 'YR-1', name: '羊刃入命', trigger: [{ op: 'contains', args: ['shensha', '羊刃'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.44, xinpai: 0.40 } },
      { id: 'YR-2', name: '刚烈偏激', trigger: [{ op: 'has', args: ['wuxingStrength.dominantByRule', 'rule'] }], fieldBinding: ['wuxingStrength.dominantByRule', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'YR-3', name: '行运刃显', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '羊刃'] }], fieldBinding: ['luckInfo.cycles', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.20, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-YR-RU', name: '羊刃入命', trigger: [{ op: 'contains', args: ['shensha', '羊刃'] }], priority: 10, mutex: [] },
      { id: 'COMBO-YR-YUN', name: '羊刃行运', trigger: [{ op: 'contains', args: ['shensha', '羊刃'] }, { op: 'in_luck', args: ['liunian', '羊刃'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-YR-RU', pro: '羊刃入命，刚烈偏激，魄力足而性情偏烈', mix: '你羊刃得力，魄力足，但性情偏烈，易冲动', lay: '你很有魄力，但脾气冲，容易冲动', polarity: '0', modality: 'likely', atomicId: 'ATOM-YR-RU-001' },
      { comboId: 'COMBO-YR-YUN', pro: '羊刃行运，羊刃应流年，特定年份易生冲撞', mix: '你的羊刃应流年，特定年份易生冲撞，需防冲动', lay: '你某些年份容易跟人起冲突，那年脾气要收一收', polarity: '-', modality: 'tend', atomicId: 'ATOM-YR-YUN-001' },
    ],
    dimTags: ['DIM_07'],
  },
  ZS: {
    id: 'ZS',
    name: '灾煞',
    group: 'SS',
    factors: [
      { id: 'ZS-1', name: '灾煞入命', trigger: [{ op: 'contains', args: ['shensha', '灾煞'] }], fieldBinding: ['shensha'], defaultWeight: 0.4, schools: { ziping: 0.36, mangpai: 0.44, xinpai: 0.40 } },
      { id: 'ZS-2', name: '意外损耗', trigger: [{ op: 'has', args: ['pillarRelations.xingChong', '冲'] }], fieldBinding: ['pillarRelations.xingChong', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.30, mangpai: 0.36, xinpai: 0.30 } },
      { id: 'ZS-3', name: '行运煞显', trigger: [{ op: 'in_luck', args: ['luckInfo.cycles', '灾煞'] }], fieldBinding: ['luckInfo.cycles', 'shensha'], defaultWeight: 0.3, schools: { ziping: 0.34, mangpai: 0.20, xinpai: 0.30 } },
    ],
    combos: [
      { id: 'COMBO-ZS-RU', name: '灾煞入命', trigger: [{ op: 'contains', args: ['shensha', '灾煞'] }], priority: 10, mutex: [] },
      { id: 'COMBO-ZS-YUN', name: '灾煞行运', trigger: [{ op: 'contains', args: ['shensha', '灾煞'] }, { op: 'in_luck', args: ['liunian', '灾煞'] }], priority: 20, mutex: [] },
    ],
    templates: [
      { comboId: 'COMBO-ZS-RU', pro: '灾煞入命，意外损耗，灾祸易侵，需防意外', mix: '你灾煞较显，意外与损耗偏多，需防突发之祸', lay: '你容易遇到意外状况，平时要留心防范', polarity: '-', modality: 'tend', atomicId: 'ATOM-ZS-RU-001' },
      { comboId: 'COMBO-ZS-YUN', pro: '灾煞行运，灾煞应流年，特定年份易生灾耗', mix: '你的灾煞应流年，特定年份易生灾耗，需格外留意', lay: '你某些年份容易出事，那年要特别小心', polarity: '--', modality: 'tend', atomicId: 'ATOM-ZS-YUN-001' },
    ],
    dimTags: ['DIM_07'],
  },
};
