import { EntertainmentEntry } from './types';

export interface PalmEntry extends EntertainmentEntry {
  lineId: string;
  medicalFunction: string;
  folkClaim: string;
}

const LINES: [string, string, string, string][] = [
  ['heart', '感情线', '手掌主要皮纹之一，医学上用于观察皮肤与屈肌状态。', '民俗中常与感情表达关联。'],
  ['head', '智慧线', '手掌主要皮纹之一，医学上无性格判断功能。', '民俗中常与思维方式关联。'],
  ['life', '生命线', '手掌主要皮纹之一，医学上不预测寿命。', '民俗中常与生命力关联。'],
  ['fate', '命运线', '手掌皮纹之一，医学上无命运判断功能。', '民俗中常与事业路径关联。'],
  ['sun', '太阳线', '手掌皮纹之一，医学上无成功判断功能。', '民俗中常与人际声望关联。'],
];

export const PALM_ENTRIES: PalmEntry[] = LINES.map(([lineId, title, medicalFunction, folkClaim]) => ({
  id: `palm-${lineId}`,
  title,
  body: `${title}：医学功能与民俗说法对照。`,
  lineId,
  medicalFunction,
  folkClaim,
  source: { text: '医学皮纹学与民俗手相', confidence: 'probable' },
  confidence: 'probable',
  ready: true,
  disclaimer: '手相内容仅供文化娱乐参考，医学信息请咨询专业医生。',
}));
