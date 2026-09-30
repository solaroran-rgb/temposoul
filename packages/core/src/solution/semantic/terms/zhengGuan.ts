/**
 * 正官（ZG）
 * 六因子：规则秩序 / 责任担当 / 上级权威 / 名声信誉 / 约束自律 / 官贵地位
 */
import type { TermSchema } from '../types';

export const zhengGuan: TermSchema = {
  id: 'ZG',
  name: '正官',
  group: 'SHEN',
  factors: [
    { id: 'ZG-1', name: '规则秩序', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 } },
    { id: 'ZG-2', name: '责任担当', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.18, schools: { ziping: 0.18, mangpai: 0.16, xinpai: 0.20 } },
    { id: 'ZG-3', name: '上级权威', trigger: [{ op: 'in_pillar', args: ['month', '正官'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.18, xinpai: 0.17 } },
    { id: 'ZG-4', name: '名声信誉', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], fieldBinding: ['tenGods'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.15 } },
    { id: 'ZG-5', name: '约束自律', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.14, mangpai: 0.16, xinpai: 0.15 } },
    { id: 'ZG-6', name: '官贵地位', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], fieldBinding: ['tenGods', 'luckInfo.cycles', 'liunian'], defaultWeight: 0.15, schools: { ziping: 0.14, mangpai: 0.18, xinpai: 0.13 } },
  ],
  combos: [
    { id: 'COMBO-ZG-JSG', name: '正官见伤官', trigger: [{ op: 'has', args: ['tenGods', '正官'] }, { op: 'has', args: ['tenGods', '伤官'] }], priority: 10, mutex: ['COMBO-ZG-GY'] },
    { id: 'COMBO-ZG-GY', name: '官印相生', trigger: [{ op: 'has', args: ['tenGods', '正官'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 20, mutex: ['COMBO-ZG-JSG'] },
    { id: 'COMBO-ZG-CG', name: '财官相生', trigger: [{ op: 'has', args: ['tenGods', '正官'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 30, mutex: [] },
    { id: 'COMBO-ZG-GS', name: '官杀混杂', trigger: [{ op: 'has', args: ['tenGods', '正官'] }, { op: 'has', args: ['tenGods', '七杀'] }], priority: 15, mutex: [] },
    { id: 'COMBO-ZG-BASE', name: '正官得位', trigger: [{ op: 'has', args: ['tenGods', '正官'] }], priority: 50, mutex: ['COMBO-ZG-JSG', 'COMBO-ZG-GY', 'COMBO-ZG-CG', 'COMBO-ZG-GS'] },
  ],
  templates: [
    { comboId: 'COMBO-ZG-JSG', pro: '正官见伤官，官星受制，事业宫权威冲突显著', mix: '你在规则与表达之间容易产生张力，职场需留意权威冲突', lay: '工作中你可能不太喜欢被规则束缚，注意沟通方式', polarity: '-', modality: 'assert', atomicId: 'ATOM-ZG-JSG-001' },
    { comboId: 'COMBO-ZG-GY', pro: '官印相生，官星得印护，事业宫职权稳进', mix: '你在职场中较易获得上级认可与支持', lay: '你在工作中可能比较受上级和团队认可', polarity: '+', modality: 'likely', atomicId: 'ATOM-ZG-GY-001' },
    { comboId: 'COMBO-ZG-BASE', pro: '正官得位，行事有规，责任心强，易得上级认可', mix: '你做事讲规矩、有责任心，容易得到上级和同事的认可', lay: '你办事靠谱、有分寸，长辈和领导多半挺认可你', polarity: '+', modality: 'assert', atomicId: 'ATOM-ZG-BASE-001' },
  ],
  dimTags: ['DIM_01', 'DIM_02'],
};
