/**
 * 正印（ZY）
 * 六因子：庇护学业 / 母亲贵人 / 保守稳重 / 精神修养 / 文书印信 / 依赖迟滞
 */
import type { TermSchema } from '../types';

export const zhengYin: TermSchema = {
  id: 'ZY',
  name: '正印',
  group: 'SHEN',
  factors: [
    { id: 'ZY-1', name: '庇护学业', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 } },
    { id: 'ZY-2', name: '母亲贵人', trigger: [{ op: 'in_pillar', args: ['month', '正印'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.18, schools: { ziping: 0.18, mangpai: 0.20, xinpai: 0.16 } },
    { id: 'ZY-3', name: '保守稳重', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods', 'wuxingStrength.dominantByRule'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.20 } },
    { id: 'ZY-4', name: '精神修养', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.18 } },
    { id: 'ZY-5', name: '文书印信', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.14 } },
    { id: 'ZY-6', name: '依赖迟滞', trigger: [{ op: 'has', args: ['tenGods', '正印'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.12, mangpai: 0.18, xinpai: 0.12 } },
  ],
  combos: [
    { id: 'COMBO-ZY-GY', name: '官印相生', trigger: [{ op: 'has', args: ['tenGods', '正印'] }, { op: 'has', args: ['tenGods', '正官'] }], priority: 20, mutex: [] },
    { id: 'COMBO-ZY-PY', name: '正偏印混杂', trigger: [{ op: 'has', args: ['tenGods', '正印'] }, { op: 'has', args: ['tenGods', '偏印'] }], priority: 15, mutex: [] },
  ],
  templates: [
    { comboId: 'COMBO-ZY-GY', pro: '官印相生，官生印护，学业事业双收', mix: '你既有规则意识又有学习能力，事业学业并进', lay: '你做事稳妥，学习能力强，容易得到认可', polarity: '+', modality: 'assert', atomicId: 'ATOM-ZY-GY-001' },
    { comboId: 'COMBO-ZY-PY', pro: '正偏印混杂，学业方向多变，精神世界丰富', mix: '你兴趣广泛但不够专注，需要找到核心方向', lay: '你对很多领域都感兴趣，但可能学的太杂', polarity: '0', modality: 'tend', atomicId: 'ATOM-ZY-PY-001' },
  ],
  dimTags: ['DIM_02', 'DIM_04'],
};
