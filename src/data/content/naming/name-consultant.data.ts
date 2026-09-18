/**
 * D-4 顾问测名（完整解读报告 + 咨询状态机）
 * 来源：专家 D R3（143217.md D 段）+ R5 就绪表「1 完整报告 + 状态机」
 * 口径：1 份示范解读报告（去宿命化）+ 顾问咨询流程状态机
 */
import type { LightFunContentEnvelope } from './types';

export interface ConsultantReport {
  report_id: string;
  sample_name: string;
  dimensions: Array<{
    dimension: string;
    reading: string;
    note: string;
  }>;
  summary: string;
  disclaimer: string;
}

export interface ConsultStateMachine {
  states: string[];
  transitions: Array<{ from: string; to: string; trigger: string; action: string }>;
}

export interface NameConsultantPayload {
  sample_report: ConsultantReport;
  state_machine: ConsultStateMachine;
  service_principles: string[];
}

const REPORT: ConsultantReport = {
  report_id: 'report_sample_001',
  sample_name: '林溪远（化名示范）',
  dimensions: [
    {
      dimension: '字义意象',
      reading: '「溪」取山间清流之象，「远」取辽远开阔之意，两字组合偏向舒展、从容的气质联想。',
      note: '字义解读属于文学意象参考，不构成对个人性格的判定。',
    },
    {
      dimension: '音律节奏',
      reading: 'lín xī yuǎn 为阳平—阴平—上声，前两字轻扬、末字收束，读起来有错落感。',
      note: '音律仅作听觉舒适度参考。',
    },
    {
      dimension: '字形结构',
      reading: '林（左右）、溪（左右）、远（半包围），结构上有左右与包围的变化，书写不单调。',
      note: '字形仅供视觉与书写角度参考。',
    },
    {
      dimension: '社交记忆',
      reading: '两字名辨识度中等，「溪远」组合在口语中较少重名，自我介绍时便于复述。',
      note: '重名感受仅为泛化经验，非数据结论。',
    },
  ],
  summary:
    '示范报告从字义、音律、字形、社交记忆四个维度提供文化与审美层面的参考，帮助用户从多个角度审视一个名字的感受。',
  disclaimer:
    '本报告为文化审美与自我观察维度的参考，不预测命运、不判断吉凶、不作为任何重大决策依据。',
};

const STATE_MACHINE: ConsultStateMachine = {
  states: ['intake', 'analysis', 'draft', 'review', 'delivered'],
  transitions: [
    { from: 'intake', to: 'analysis', trigger: '用户提交基础信息', action: '建立咨询工单' },
    { from: 'analysis', to: 'draft', trigger: '顾问完成多维度分析', action: '生成解读草稿' },
    { from: 'draft', to: 'review', trigger: '内部合规复核', action: '校验是否含宿命化表述' },
    { from: 'review', to: 'delivered', trigger: '复核通过', action: '交付用户并附免责声明' },
    { from: 'review', to: 'draft', trigger: '复核退回', action: '修订后再次复核' },
  ],
};

export function buildConsultantDataset(): NameConsultantPayload {
  return {
    sample_report: REPORT,
    state_machine: STATE_MACHINE,
    service_principles: [
      '只提供文化、审美、音律维度的参考，不做吉凶断言',
      '不使用「改命」「转运」等绝对化或迷信话术',
      '每份报告均附免责声明，明确不构成决策依据',
      '用户可随时退出咨询，数据按隐私政策处理',
    ],
  };
}

export const nameConsultantData: LightFunContentEnvelope<NameConsultantPayload> = {
  id: 'senior-name-consultant',
  kind: 'lightfun',
  seo: {
    title: '资深顾问测名：多维度解读与咨询流程',
    description: '示范解读报告 + 咨询状态机，了解测名服务的边界与方法。',
    keywords: ['测名', '起名顾问', '姓名解读'],
  },
  payload: buildConsultantDataset(),
  metadata: {
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-09-18T00:00:00Z',
    version: '1.0.0',
    tags: ['naming', 'consultant'],
  },
};
