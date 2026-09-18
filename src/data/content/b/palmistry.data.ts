/**
 * B-2 手相：3 主线 × 3 形态（全量）
 * 来源：专家 B R3 回收稿 §B-2
 * 路由：/tools/palmistry
 */
import type { BDomainRecord } from './types';
import { createPalmRecord } from './_runtime';

const palmRaw = [
  {
    line_id: 'life' as const,
    name_zh: '生命线',
    palm_roi: { start: [0.4, 0.2] as const, end: [0.5, 0.8] as const },
    shape_templates: [
      {
        shape: 'deep_long',
        interpretation: '倾向于映射生命活力充沛，精力分配较为稳定，常被联想为抗压能力较强。',
      },
      {
        shape: 'broken',
        interpretation: '可能反映近期生活节奏多变或精力消耗较大，建议关注作息规律与压力管理。',
      },
      {
        shape: 'forked',
        interpretation: '倾向于映射探索欲强，生活轨迹可能呈现多元化发展，适合跨界尝试。',
      },
    ],
  },
  {
    line_id: 'head' as const,
    name_zh: '智慧线',
    palm_roi: { start: [0.4, 0.25] as const, end: [0.8, 0.4] as const },
    shape_templates: [
      {
        shape: 'straight',
        interpretation: '倾向于映射信息处理偏向逻辑务实，注重现实结果，适合结构化思考。',
      },
      {
        shape: 'curved',
        interpretation: '常被联想为直觉敏锐，思维具创造力与发散性，在艺术领域易有共鸣。',
      },
      {
        shape: 'deep_long',
        interpretation: '倾向于映射独立思考意识较早，行事具决断力，不依赖他人评价。',
      },
    ],
  },
  {
    line_id: 'heart' as const,
    name_zh: '感情线',
    palm_roi: { start: [0.8, 0.3] as const, end: [0.4, 0.15] as const },
    shape_templates: [
      {
        shape: 'deep_long',
        interpretation: '倾向于映射情感表达稳定，注重精神契合与长期承诺，边界感清晰。',
      },
      {
        shape: 'chained',
        interpretation: '常被联想为心思细腻，共情力强，但需注意建立情绪防火墙，避免过载。',
      },
      {
        shape: 'forked',
        interpretation: '倾向于映射情感需求多元，在关系中注重个人空间与自由度，拒绝窒息感。',
      },
    ],
  },
];

export const palmistryLines: BDomainRecord[] = palmRaw.map((p) =>
  createPalmRecord(
    `palm_${p.line_id}`,
    {
      title: p.name_zh,
      listPath: '/tools/palmistry',
      detailPath: `/tools/palmistry/${p.line_id}`,
      summary: `${p.name_zh}的三种常见形态与心理视角释义`,
      tags: ['手相', '心理'],
    },
    p,
  ),
);
