/**
 * 七杀（QS = 偏官）
 * 六因子：压力竞争 / 权威压迫 / 开创魄力 / 冒险决断 / 健康消耗 / 冲突对抗
 */
import type { TermSchema } from '../types';

export const qiSha: TermSchema = {
  id: 'QS',
  name: '七杀',
  group: 'SHEN',
  factors: [
    { id: 'QS-1', name: '压力竞争', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.20, mangpai: 0.22, xinpai: 0.18 } },
    { id: 'QS-2', name: '权威压迫', trigger: [{ op: 'in_pillar', args: ['month', '七杀'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.18, schools: { ziping: 0.18, mangpai: 0.20, xinpai: 0.16 } },
    { id: 'QS-3', name: '开创魄力', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.20 } },
    { id: 'QS-4', name: '冒险决断', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.18 } },
    { id: 'QS-5', name: '健康消耗', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }], fieldBinding: ['tenGods', 'luckInfo.cycles', 'liunian'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.14 } },
    { id: 'QS-6', name: '冲突对抗', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }, { op: 'has', args: ['tenGods', '伤官'] }], fieldBinding: ['tenGods'], defaultWeight: 0.14, schools: { ziping: 0.14, mangpai: 0.14, xinpai: 0.14 } },
  ],
  combos: [
    { id: 'COMBO-QS-SZ', name: '食神制杀', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 10, mutex: ['COMBO-QS-PY'] },
    { id: 'COMBO-QS-PY', name: '杀印相生', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 20, mutex: ['COMBO-QS-SZ'] },
    { id: 'COMBO-QS-GS', name: '官杀混杂', trigger: [{ op: 'has', args: ['tenGods', '七杀'] }, { op: 'has', args: ['tenGods', '正官'] }], priority: 15, mutex: [] },
  ],
  templates: [
    { comboId: 'COMBO-QS-SZ', pro: '食神制杀，杀星得制，权威化为魄力', mix: '你面对压力时能找到方法化解，将挑战转化为动力', lay: '你遇到压力不会退缩，反而能激发潜力', polarity: '+', modality: 'assert', atomicId: 'ATOM-QS-SZ-001' },
    { comboId: 'COMBO-QS-PY', pro: '杀印相生，杀星得印化，压力化为权柄', mix: '你面对的压力能通过学习或贵人引导转化为地位', lay: '你遇到困难时有人帮忙，能把压力变成机会', polarity: '+', modality: 'likely', atomicId: 'ATOM-QS-PY-001' },
  ],
  dimTags: ['DIM_01', 'DIM_03'],
};
