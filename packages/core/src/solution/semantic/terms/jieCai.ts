/**
 * 劫财（JC）
 * 六因子：争夺抢夺 / 朋友破财 / 冲动冒险 / 合作分利 / 感情竞争 / 精力旺盛
 */
import type { TermSchema } from '../types';

export const jieCai: TermSchema = {
  id: 'JC',
  name: '劫财',
  group: 'SHEN',
  factors: [
    { id: 'JC-1', name: '争夺抢夺', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.20, schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 } },
    { id: 'JC-2', name: '朋友破财', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.18, schools: { ziping: 0.20, mangpai: 0.16, xinpai: 0.18 } },
    { id: 'JC-3', name: '冲动冒险', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }], fieldBinding: ['tenGods', 'wuxingStrength.present'], defaultWeight: 0.17, schools: { ziping: 0.16, mangpai: 0.18, xinpai: 0.17 } },
    { id: 'JC-4', name: '合作分利', trigger: [{ op: 'in_pillar', args: ['month', '劫财'] }], fieldBinding: ['tenGods', 'pillars.month.ganZhi'], defaultWeight: 0.16, schools: { ziping: 0.14, mangpai: 0.18, xinpai: 0.16 } },
    { id: 'JC-5', name: '感情竞争', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['tenGods', '正财'] }], fieldBinding: ['tenGods'], defaultWeight: 0.15, schools: { ziping: 0.14, mangpai: 0.16, xinpai: 0.14 } },
    { id: 'JC-6', name: '精力旺盛', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }], fieldBinding: ['tenGods', 'luckInfo.cycles'], defaultWeight: 0.14, schools: { ziping: 0.14, mangpai: 0.14, xinpai: 0.15 } },
  ],
  combos: [
    { id: 'COMBO-JC-DC', name: '劫财夺财', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 10, mutex: [] },
    { id: 'COMBO-JC-DK', name: '劫财羊刃', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['shensha', '羊刃'] }], priority: 15, mutex: [] },
    { id: 'COMBO-JC-BDC', name: '比劫夺财', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['tenGods', '正财'] }], priority: 9, mutex: ['COMBO-JC-DC'] },
    { id: 'COMBO-JC-ZF', name: '劫财争锋', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }, { op: 'has', args: ['tenGods', '七杀'] }], priority: 15, mutex: [] },
    { id: 'COMBO-JC-BASE', name: '劫财当令', trigger: [{ op: 'has', args: ['tenGods', '劫财'] }], priority: 50, mutex: ['COMBO-JC-DC', 'COMBO-JC-DK', 'COMBO-JC-BDC', 'COMBO-JC-ZF'] },
  ],
  templates: [
    { comboId: 'COMBO-JC-DC', pro: '劫财夺财，财星被劫，财运大起大落', mix: '你花钱比较冲动，投资需谨慎，避免跟风', lay: '你有时候花钱大手大脚，要注意储蓄', polarity: '-', modality: 'likely', atomicId: 'ATOM-JC-DC-001' },
    { comboId: 'COMBO-JC-DK', pro: '劫财羊刃，刚猛好斗，易有冲突', mix: '你性格刚强，做事果断，但要注意控制脾气', lay: '你做事有魄力，但有时太急，容易得罪人', polarity: '0', modality: 'tend', atomicId: 'ATOM-JC-DK-001' },
    { comboId: 'COMBO-JC-BDC', pro: '比劫夺财，财星被分，合作易破财，不宜合伙投资', mix: '你身边可能有朋友或同事分走你的机会或资源，合作要谨慎', lay: '最近可能有人分走你的机会，合作做事要留个心眼', polarity: '-', modality: 'likely', atomicId: 'ATOM-JC-BDC-001' },
    { comboId: 'COMBO-JC-ZF', pro: '劫财见杀，竞争激烈，易有冲突，需以柔克刚', mix: '你可能面临比较激烈的竞争，硬碰硬容易两败俱伤', lay: '最近竞争挺激烈的，别硬碰硬，换个方式更聪明', polarity: '-', modality: 'tend', atomicId: 'ATOM-JC-ZF-001' },
    { comboId: 'COMBO-JC-BASE', pro: '劫财当令，竞争意识强，行动力足，需防冲动', mix: '你竞争心强、说干就干，但冲动前先缓一下', lay: '你行动力很足，竞争意识也强，就是别太冲动', polarity: '-', modality: 'likely', atomicId: 'ATOM-JC-BASE-001' },
  ],
  dimTags: ['DIM_03', 'DIM_06'],
};
