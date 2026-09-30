/**
 * 伤官（SG）· 十神范式参考实现
 *
 * 六因子：才华表达 / 自由反叛 / 子女下属 / 技术创意 / 规则权威冲突 / 口舌官非
 * 组合：伤官见官 / 伤官配印 / 伤官生财 / 伤官无制
 */
import type { TermSchema } from '../types';

export const shangGuan: TermSchema = {
  id: 'SG',
  name: '伤官',
  group: 'SHEN',
  factors: [
    {
      id: 'SG-1',
      name: '才华表达',
      trigger: [{ op: 'has', args: ['tenGods', '伤官'] }],
      fieldBinding: ['tenGods'],
      defaultWeight: 0.20,
      schools: { ziping: 0.22, mangpai: 0.18, xinpai: 0.20 },
    },
    {
      id: 'SG-2',
      name: '自由反叛',
      trigger: [{ op: 'has', args: ['tenGods', '伤官'] }],
      fieldBinding: ['tenGods'],
      defaultWeight: 0.18,
      schools: { ziping: 0.16, mangpai: 0.20, xinpai: 0.18 },
    },
    {
      id: 'SG-3',
      name: '子女下属',
      trigger: [{ op: 'in_pillar', args: ['hour', '伤官'] }],
      fieldBinding: ['pillars.hour', 'tenGods'],
      defaultWeight: 0.17,
      schools: { ziping: 0.15, mangpai: 0.20, xinpai: 0.16 },
    },
    {
      id: 'SG-4',
      name: '技术创意',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'contains', args: ['wuxingStrength.present', '火'] },
      ],
      fieldBinding: ['tenGods', 'wuxingStrength.present'],
      defaultWeight: 0.16,
      schools: { ziping: 0.16, mangpai: 0.16, xinpai: 0.16 },
    },
    {
      id: 'SG-5',
      name: '规则权威冲突',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'has', args: ['tenGods', '正官'] },
      ],
      fieldBinding: ['tenGods'],
      defaultWeight: 0.15,
      schools: { ziping: 0.16, mangpai: 0.14, xinpai: 0.16 },
    },
    {
      id: 'SG-6',
      name: '口舌官非情绪消耗',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'Not', args: ['has', 'tenGods', '正印'] },
      ],
      fieldBinding: ['tenGods'],
      defaultWeight: 0.14,
      schools: { ziping: 0.15, mangpai: 0.12, xinpai: 0.14 },
    },
  ],
  combos: [
    {
      id: 'COMBO-SG-JG',
      name: '伤官见官',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'has', args: ['tenGods', '正官'] },
      ],
      priority: 10,
      mutex: ['COMBO-SG-PY'],
    },
    {
      id: 'COMBO-SG-PY',
      name: '伤官配印',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'has', args: ['tenGods', '正印'] },
      ],
      priority: 20,
      mutex: ['COMBO-SG-JG'],
    },
    {
      id: 'COMBO-SG-SC',
      name: '伤官生财',
      trigger: [
        { op: 'has', args: ['tenGods', '伤官'] },
        { op: 'has', args: ['tenGods', '正财'] },
      ],
      priority: 30,
      mutex: [],
    },
    {
      id: 'COMBO-SG-BASE',
      name: '伤官旺相',
      trigger: [{ op: 'has', args: ['tenGods', '伤官'] }],
      priority: 50,
      mutex: ['COMBO-SG-JG', 'COMBO-SG-PY', 'COMBO-SG-SC'],
    },
  ],
  templates: [
    {
      comboId: 'COMBO-SG-JG',
      pro: '伤官见官，官星受制，事业宫权威冲突显著',
      mix: '你在规则与表达之间容易产生张力，职场需留意权威冲突',
      lay: '工作中你可能不太喜欢被规则束缚，注意沟通方式',
      polarity: '-',
      modality: 'assert',
      atomicId: 'ATOM-SG-JG-001',
    },
    {
      comboId: 'COMBO-SG-PY',
      pro: '伤官配印，印制伤官，才华得制，学业事业有成',
      mix: '你的创造力能通过学习或贵人引导转化为实际成就',
      lay: '你有才华，而且懂得用合适的方式表达出来',
      polarity: '+',
      modality: 'assert',
      atomicId: 'ATOM-SG-PY-001',
    },
    {
      comboId: 'COMBO-SG-BASE',
      pro: '伤官旺相，才华外露，表达力强，需注意分寸',
      mix: '你很有想法也敢表达，才华外放，但说话做事留点分寸更好',
      lay: '你挺有才的，表达也利落，就是有时候得注意下分寸',
      polarity: '+',
      modality: 'assert',
      atomicId: 'ATOM-SG-BASE-001',
    },
  ],
  dimTags: ['DIM_01', 'DIM_02'],
};
