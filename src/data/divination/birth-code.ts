import { EntertainmentEntry } from './types';

export interface BirthCodeEntry extends EntertainmentEntry {
  monthDay: string;
  keywords: string[];
}

const RAW: [number, string, string, string[]][] = [
  [1, '1月1日', '新起点与开创力。', ['开始', '独立', '行动']],
  [2, '2月1日', '合作与感受力。', ['合作', '平衡', '共情']],
  [3, '3月1日', '表达与创意。', ['表达', '创意', '社交']],
  [4, '4月1日', '秩序与根基。', ['稳定', '秩序', '耐心']],
  [5, '5月1日', '变化与自由。', ['自由', '变化', '探索']],
  [6, '6月1日', '关怀与责任。', ['关怀', '责任', '家庭']],
  [7, '7月1日', '内省与探索。', ['内省', '探索', '分析']],
  [8, '8月1日', '成就与资源。', ['成就', '资源', '管理']],
  [9, '9月1日', '博爱与完成。', ['博爱', '完成', '理想']],
  [10, '10月1日', '平衡与选择。', ['平衡', '选择', '协调']],
  [11, '11月1日', '直觉与启发。', ['直觉', '启发', '愿景']],
  [12, '12月1日', '整合与超越。', ['整合', '超越', '疗愈']],
];

export const BIRTH_CODE_ENTRIES: BirthCodeEntry[] = RAW.map(([month, monthDay, body, keywords]) => ({
  id: `birth-code-${month}`,
  title: `${monthDay}生日密码`,
  body,
  monthDay: `${month}-1`,
  keywords,
  source: { text: '生日数字民俗', confidence: 'probable' },
  confidence: 'probable',
  ready: true,
  disclaimer: '生日密码仅供文化娱乐与自我反思参考，不构成人格定论。',
}));
