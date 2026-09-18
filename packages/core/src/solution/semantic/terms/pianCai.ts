/**
 * 偏财（PC）
 * 六因子：横财机遇 / 父亲关系 / 经营才干 / 慷慨大方 / 投机冒险 / 人脉异性
 */
import type { TermSchema } from '../types';

export const pianCai: TermSchema = {
  id: 'PC',
  name: '偏财',
  group: 'SHEN',
  factors: [
    { id: 'PC-1', name: '横财机遇', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.18, mangpai: 0.22, xinpai: 0.20 } },
    { id: 'PC-2', name: '父亲关系', trigger: [{ op: 'in_pillar', args: ['month', '偏财'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.17, schools: { ziping: 0.18, mangpai: 0.16, xinpai: 0.16 } },
    { id: 'PC-3', name: '经营才干', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.18 } },
    { id: 'PC-4', name: '慷慨大方', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.16 } },
    { id: 'PC-5', name: '投机冒险', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }], fieldBinding: ['tenGods', 'luckInfo.cycles', 'liunian'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.15 } },
    { id: 'PC-6', name: '人脉异性缘', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.18, xinpai: 0.15 } },
  ],
  combos: [
    { id: 'COMBO-PC-SG', name: '偏财生官', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }, { op: 'has', args: ['tenGods', '正官'] }], priority: 20, mutex: [] },
    { id: 'COMBO-PC-SK', name: '偏财受克', trigger: [{ op: 'has', args: ['tenGods', '偏财'] }, { op: 'has', args: ['tenGods', '比肩'] }], priority: 10, mutex: [] },
  ],
  templates: [
    { comboId: 'COMBO-PC-SG', pro: '偏财生官，财生官旺，事业机遇拓展', mix: '你的人际与经营能力有助于事业发展', lay: '你的人脉或经营可能帮你事业上走得更顺', polarity: '+', modality: 'likely', atomicId: 'ATOM-PC-SG-001' },
    { comboId: 'COMBO-PC-SK', pro: '偏财受克，横财受阻，财运易失', mix: '你的额外收入有时难以留住', lay: '意外之财可能不太容易留住', polarity: '-', modality: 'likely', atomicId: 'ATOM-PC-SK-001' },
  ],
  dimTags: ['DIM_02', 'DIM_04'],
};
