/**
 * 食神（SS）
 * 六因子：口福享受 / 温和才华 / 子女晚辈 / 慵懒安逸 / 创意表达 / 寿星健康
 */
import type { TermSchema } from '../types';

export const shiShen: TermSchema = {
  id: 'SS',
  name: '食神',
  group: 'SHEN',
  factors: [
    { id: 'SS-1', name: '口福享受', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.18, mangpai: 0.22, xinpai: 0.20 } },
    { id: 'SS-2', name: '温和才华', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.18, schools: { ziping: 0.20, mangpai: 0.16, xinpai: 0.18 } },
    { id: 'SS-3', name: '子女晚辈', trigger: [{ op: 'in_pillar', args: ['hour', '食神'] }], fieldBinding: ['pillars.hour', 'tenGods'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.20, xinpai: 0.16 } },
    { id: 'SS-4', name: '慵懒安逸', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.18 } },
    { id: 'SS-5', name: '创意表达', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.14 } },
    { id: 'SS-6', name: '寿星健康', trigger: [{ op: 'has', args: ['tenGods', '食神'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.14, mangpai: 0.14, xinpai: 0.14 } },
  ],
  combos: [
    { id: 'COMBO-SS-QS', name: '食神制杀', trigger: [{ op: 'has', args: ['tenGods', '食神'] }, { op: 'has', args: ['tenGods', '七杀'] }], priority: 10, mutex: [] },
    { id: 'COMBO-SS-SC', name: '食神生财', trigger: [{ op: 'has', args: ['tenGods', '食神'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 20, mutex: [] },
  ],
  templates: [
    { comboId: 'COMBO-SS-QS', pro: '食神制杀，杀星得制，压力化为成就', mix: '你面对压力时能从容应对，用智慧化解挑战', lay: '你遇到困难不慌张，能想到好办法', polarity: '+', modality: 'assert', atomicId: 'ATOM-SS-QS-001' },
    { comboId: 'COMBO-SS-SC', pro: '食神生财，才华变现，财源稳定', mix: '你的才华能转化为收入，生活安逸', lay: '你有本事赚钱，而且日子过得舒服', polarity: '+', modality: 'likely', atomicId: 'ATOM-SS-SC-001' },
  ],
  dimTags: ['DIM_02', 'DIM_04'],
};
