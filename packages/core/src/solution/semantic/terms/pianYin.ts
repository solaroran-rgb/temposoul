/**
 * 偏印（PY = 枭神）
 * 六因子：偏门学问 / 孤独内省 / 创意灵感 / 宗教玄学 / 继母长辈 / 非传统
 */
import type { TermSchema } from '../types';

export const pianYin: TermSchema = {
  id: 'PY',
  name: '偏印',
  group: 'SHEN',
  factors: [
    { id: 'PY-1', name: '偏门学问', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.18, mangpai: 0.22, xinpai: 0.20 } },
    { id: 'PY-2', name: '孤独内省', trigger: [{ op: 'in_pillar', args: ['month', '偏印'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.18, schools: { ziping: 0.16, mangpai: 0.20, xinpai: 0.18 } },
    { id: 'PY-3', name: '创意灵感', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods', 'wuxingStrength.present'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.20 } },
    { id: 'PY-4', name: '宗教玄学', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods'], defaultWeight: 0.16, schools: { ziping: 0.14, mangpai: 0.20, xinpai: 0.14 } },
    { id: 'PY-5', name: '继母长辈', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods', 'hiddenStems.month'], defaultWeight: 0.15, schools: { ziping: 0.14, mangpai: 0.16, xinpai: 0.14 } },
    { id: 'PY-6', name: '非传统思维', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.12, mangpai: 0.16, xinpai: 0.14 } },
  ],
  combos: [
    { id: 'COMBO-PY-SD', name: '枭神夺食', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }, { op: 'has', args: ['tenGods', '食神'] }], priority: 10, mutex: [] },
    { id: 'COMBO-PY-SG', name: '偏印配伤官', trigger: [{ op: 'has', args: ['tenGods', '偏印'] }, { op: 'has', args: ['tenGods', '伤官'] }], priority: 20, mutex: [] },
  ],
  templates: [
    { comboId: 'COMBO-PY-SD', pro: '枭神夺食，食神受制，才华难展，健康注意', mix: '你的创意有时会被自己的疑虑或环境压制，需找到出口', lay: '你有时候想法很多但不敢表达，要多给自己机会', polarity: '-', modality: 'likely', atomicId: 'ATOM-PY-SD-001' },
    { comboId: 'COMBO-PY-SG', pro: '偏印配伤官，偏门才华得展，独特见解', mix: '你在非传统领域有独特天赋，能提出与众不同的观点', lay: '你有自己独特的想法，适合做有创意的事情', polarity: '+', modality: 'likely', atomicId: 'ATOM-PY-SG-001' },
  ],
  dimTags: ['DIM_04', 'DIM_05'],
};
