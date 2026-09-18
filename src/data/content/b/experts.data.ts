/**
 * B-6 大师专家团队页：3 类身份模板 + 资质枚举
 * 来源：专家 B R3 回收稿 §B-6
 * 路由：/experts[/:expert_id]
 */
import type { BDomainRecord } from './types';
import { createExpertRecord } from './_runtime';

const expertsRaw = [
  {
    expert_id: 'exp_wang',
    identity: 'scholar' as const,
    name_zh: '王学者',
    certifications: [{ type: 'ACSS' as const, id: 'ACSS-2023-8892', issuer: '中国社会学会' }],
    audit_status: 'verified' as const,
    strike_count: 0,
  },
  {
    expert_id: 'exp_lin',
    identity: 'strategist' as const,
    name_zh: '林顾问',
    certifications: [
      { type: 'PMP' as const, id: 'PMP-2024-88392', issuer: 'PMI' },
      { type: 'GCDF' as const, id: 'GCDF-2022-1102', issuer: 'CCE' },
    ],
    audit_status: 'verified' as const,
    strike_count: 0,
  },
  {
    expert_id: 'exp_chen',
    identity: 'listener' as const,
    name_zh: '陈倾听师',
    certifications: [{ type: 'CPS' as const, id: 'CPS-2023-4491', issuer: '中国心理学会' }],
    audit_status: 'verified' as const,
    strike_count: 0,
  },
];

const identityLabel: Record<string, string> = {
  scholar: '民俗文化学者',
  strategist: '人生规划顾问',
  listener: '心理倾听师',
};

export const expertProfiles: BDomainRecord[] = expertsRaw.map((e) =>
  createExpertRecord(
    e.expert_id,
    {
      title: e.name_zh,
      listPath: '/experts',
      detailPath: `/experts/${e.expert_id}`,
      summary: `${identityLabel[e.identity]} · 审核状态：${e.audit_status}`,
      tags: ['专家', '咨询'],
    },
    e,
  ),
);
