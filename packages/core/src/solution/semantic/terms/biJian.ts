/**
 * 比肩（BJ）
 * 六因子：自我独立 / 同辈竞争 / 朋友助力 / 破财分利 / 固执己见 / 合作成事
 */
import type { TermSchema } from '../types';

export const biJian: TermSchema = {
  id: 'BJ',
  name: '比肩',
  group: 'SHEN',
  factors: [
    { id: 'BJ-1', name: '自我独立', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 } },
    { id: 'BJ-2', name: '同辈竞争', trigger: [{ op: 'in_pillar', args: ['month', '比肩'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.18, schools: { ziping: 0.18, mangpai: 0.20, xinpai: 0.16 } },
    { id: 'BJ-3', name: '朋友助力', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.20 } },
    { id: 'BJ-4', name: '破财分利', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }, { op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.18 } },
    { id: 'BJ-5', name: '固执己见', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.14 } },
    { id: 'BJ-6', name: '合作成事', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.12, mangpai: 0.18, xinpai: 0.12 } },
  ],
  combos: [
    { id: 'COMBO-BJ-DC', name: '比肩夺财', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 10, mutex: ['COMBO-BJ-ZS'] },
    { id: 'COMBO-BJ-ZS', name: '比肩助身', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }, { op: 'contains', args: ['wuxingStrength.missing', '日主五行'] }], priority: 20, mutex: ['COMBO-BJ-DC'] },
  ],
  templates: [
    { comboId: 'COMBO-BJ-DC', pro: '比肩夺财，财星被分，财运易被朋友拖累', mix: '你花钱时容易受朋友影响，合作需谨慎', lay: '你和朋友相处大方，但要注意钱包', polarity: '-', modality: 'likely', atomicId: 'ATOM-BJ-DC-001' },
    { comboId: 'COMBO-BJ-ZS', pro: '比肩助身，日主得助，自立自强', mix: '你独立性强，靠自己也能成事', lay: '你是个独立的人，自己能搞定很多事', polarity: '+', modality: 'assert', atomicId: 'ATOM-BJ-ZS-001' },
  ],
  dimTags: ['DIM_02', 'DIM_03'],
};
