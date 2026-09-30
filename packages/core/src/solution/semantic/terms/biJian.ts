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
    { id: 'COMBO-BJ-BDC', name: '比劫夺财', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 9, mutex: ['COMBO-BJ-DC'] },
    { id: 'COMBO-BJ-BS', name: '比肩帮身', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }, { op: 'has', args: ['tenGods', '正印'] }], priority: 15, mutex: [] },
    { id: 'COMBO-BJ-BASE', name: '比肩得势', trigger: [{ op: 'has', args: ['tenGods', '比肩'] }], priority: 50, mutex: ['COMBO-BJ-DC', 'COMBO-BJ-ZS', 'COMBO-BJ-BDC', 'COMBO-BJ-BS'] },
  ],
  templates: [
    { comboId: 'COMBO-BJ-DC', pro: '比肩夺财，财星被分，财运易被朋友拖累', mix: '你花钱时容易受朋友影响，合作需谨慎', lay: '你和朋友相处大方，但要注意钱包', polarity: '-', modality: 'likely', atomicId: 'ATOM-BJ-DC-001' },
    { comboId: 'COMBO-BJ-ZS', pro: '比肩助身，日主得助，自立自强', mix: '你独立性强，靠自己也能成事', lay: '你是个独立的人，自己能搞定很多事', polarity: '+', modality: 'assert', atomicId: 'ATOM-BJ-ZS-001' },
    { comboId: 'COMBO-BJ-BDC', pro: '比劫夺财，财星被分，合作易破财，不宜合伙投资', mix: '你身边可能有朋友或同事分走你的机会或资源，合作要谨慎', lay: '最近可能有人分走你的机会，合作做事要留个心眼', polarity: '-', modality: 'likely', atomicId: 'ATOM-BJ-BDC-001' },
    { comboId: 'COMBO-BJ-BS', pro: '比肩帮身，得朋友兄弟助力，遇事有人分担', mix: '你身边有朋友愿意帮你，遇到困难可以找人商量', lay: '最近有人帮你，别一个人扛，找人一起干更轻松', polarity: '+', modality: 'assert', atomicId: 'ATOM-BJ-BS-001' },
    { comboId: 'COMBO-BJ-BASE', pro: '比肩得势，独立自主，朋友多，合作需明确分工', mix: '你性格独立，身边朋友不少，合作时把分工说清楚更顺', lay: '你挺独立的，朋友也多，一起做事最好先把分工定明白', polarity: '+', modality: 'assert', atomicId: 'ATOM-BJ-BASE-001' },
  ],
  dimTags: ['DIM_02', 'DIM_03'],
};
