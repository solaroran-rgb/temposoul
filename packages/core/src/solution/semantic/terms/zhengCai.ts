/**
 * 正财（ZC）
 * 六因子：稳定收入 / 节俭务实 / 妻子家庭 / 勤劳肯干 / 物质现实 / 保守储蓄
 */
import type { TermSchema } from '../types';

export const zhengCai: TermSchema = {
  id: 'ZC',
  name: '正财',
  group: 'SHEN',
  factors: [
    { id: 'ZC-1', name: '稳定收入', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 } },
    { id: 'ZC-2', name: '节俭务实', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.18, schools: { ziping: 0.20, mangpai: 0.16, xinpai: 0.18 } },
    { id: 'ZC-3', name: '妻子家庭', trigger: [{ op: 'in_pillar', args: ['day', '正财'] }], fieldBinding: ['pillars.day', 'tenGods'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.20, xinpai: 0.16 } },
    { id: 'ZC-4', name: '勤劳肯干', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.18 } },
    { id: 'ZC-5', name: '物质现实', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.14 } },
    { id: 'ZC-6', name: '保守储蓄', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.10, mangpai: 0.18, xinpai: 0.14 } },
  ],
  combos: [
    { id: 'COMBO-ZC-SC', name: '食神生财', trigger: [{ op: 'has', args: ['tenGods', '正财'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 20, mutex: [] },
    { id: 'COMBO-ZC-BJ', name: '比劫夺财', trigger: [{ op: 'has', args: ['tenGods', '正财'] }, { op: 'has', args: ['tenGods', '比肩'] }], priority: 10, mutex: [] },
    { id: 'COMBO-ZC-BASE', name: '正财得地', trigger: [{ op: 'has', args: ['tenGods', '正财'] }], priority: 50, mutex: ['COMBO-ZC-SC', 'COMBO-ZC-BJ'] },
  ],
  templates: [
    { comboId: 'COMBO-ZC-SC', pro: '食神生财，财源稳定，生活安逸', mix: '你靠本事赚钱，收入稳定，日子过得不错', lay: '你工作稳定，收入不错，生活踏实', polarity: '+', modality: 'assert', atomicId: 'ATOM-ZC-SC-001' },
    { comboId: 'COMBO-ZC-BJ', pro: '比劫夺财，财星被分，支出增多', mix: '你花钱时容易受朋友影响，理财需谨慎', lay: '你有时候为朋友花钱，要注意预算', polarity: '-', modality: 'likely', atomicId: 'ATOM-ZC-BJ-001' },
    { comboId: 'COMBO-ZC-BASE', pro: '正财得地，财源稳定，踏实累积，不宜投机', mix: '你赚钱靠踏实积累，稳扎稳打比投机更靠谱', lay: '你财运挺稳的，老老实实攒比瞎折腾强', polarity: '+', modality: 'assert', atomicId: 'ATOM-ZC-BASE-001' },
  ],
  dimTags: ['DIM_02', 'DIM_04'],
};
