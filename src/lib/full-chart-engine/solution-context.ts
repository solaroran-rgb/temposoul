/**
 * 排盘结果 → 解盘引擎（runSolution）context 适配器
 *
 * 任务包 1 · 解盘引擎接生产页
 * 对齐 runSolution 消费的字段：tenGods / hiddenStems / wuxingStrength / analysis /
 * pillars / luckInfo / liunian / pillarRelations / shensha / baziShenSha / kongWang。
 *
 * 兼容两种输入来源：
 * - ResultPage：calculateFullBaziChart 产出的完整 BaziChartResult
 * - 大运/流年页：/api/v1/bazi/calculate 返回的部分命盘 JSON（十神/四柱/大运/流年等）
 */
import { solution } from '@temposoul/core';

/**
 * 神煞扁平化：引擎用 contains/in_luck 在 string[] 上匹配（如「天乙贵人」「桃花」），
 * 而排盘结果的神煞是 { year: string[]; month: ...; global?: string[] } 分组结构，
 * 这里拍平成去重后的中文名数组。
 */
function flattenNames(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap((v) =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [],
    );
  }
  return [];
}

/** 排盘结果（完整或部分）→ runSolution context */
export function baziToSolutionContext(source: object | null | undefined): Record<string, unknown> {
  const src = (source ?? {}) as Record<string, unknown>;
  return {
    tenGods: src.tenGods ?? {},
    hiddenStems: src.hiddenStems ?? {},
    wuxingStrength: src.wuxingStrength ?? {},
    analysis: src.analysis ?? {},
    pillars: src.pillars ?? {},
    luckInfo: src.luckInfo ?? { cycles: [] },
    liunian: src.liunian ?? [],
    pillarRelations: src.pillarRelations ?? {},
    shensha: flattenNames(src.shensha ?? src.baziShenSha),
    baziShenSha: flattenNames(src.baziShenSha ?? src.shenShaAnalysis),
    kongWang: src.kongWang ?? [],
  };
}

/** 便捷入口：排盘结果 → 三路径白话解盘（L0 结论取 output.pro.sentences） */
export function runSolutionForBazi(
  source: object | null | undefined,
): ReturnType<typeof solution.runSolution> {
  return solution.runSolution({ context: baziToSolutionContext(source) });
}
